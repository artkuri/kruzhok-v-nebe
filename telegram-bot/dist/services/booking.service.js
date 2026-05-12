"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const constants_1 = require("../config/constants");
const date_1 = require("../lib/date");
const db_1 = require("../lib/db");
class BookingService {
    bookingRepository;
    childRepository;
    lessonRepository;
    subscriptionRepository;
    constructor(bookingRepository, childRepository, lessonRepository, subscriptionRepository) {
        this.bookingRepository = bookingRepository;
        this.childRepository = childRepository;
        this.lessonRepository = lessonRepository;
        this.subscriptionRepository = subscriptionRepository;
    }
    async getActiveByFamilyId(familyId) {
        const rows = await this.bookingRepository.findActiveByFamilyId(familyId);
        return rows.map((row) => ({
            id: row.id,
            childId: row.childId,
            childName: row.childName,
            lessonId: row.lessonId,
            lessonTitle: row.lessonTitle,
            startsAt: row.startsAt,
            status: row.status,
            hasSubscriptionUsage: Boolean(row.subscriptionId),
        }));
    }
    async getBookingById(bookingId) {
        const row = await this.bookingRepository.findById(bookingId);
        if (!row || (row.status !== "PENDING" && row.status !== "CONFIRMED")) {
            return null;
        }
        return {
            id: row.id,
            childId: row.childId,
            childName: row.childName,
            lessonId: row.lessonId,
            lessonTitle: row.lessonTitle,
            startsAt: row.startsAt,
            status: row.status,
            familyId: row.familyId,
            hasSubscriptionUsage: Boolean(row.subscriptionId),
        };
    }
    async getBookingOptions(input) {
        const [child, lessons, subscription] = await Promise.all([
            this.childRepository.findById(input.childId),
            this.lessonRepository.findUpcomingWithinDays(7),
            this.subscriptionRepository.findActiveByFamilyId(input.familyId),
        ]);
        if (!child || child.familyId !== input.familyId) {
            throw new Error("Ребенок не найден в вашей семье.");
        }
        const lesson = lessons.find((item) => item.id === input.lessonId);
        if (!lesson) {
            throw new Error("Занятие не найдено или уже недоступно.");
        }
        const remainingSeats = Math.max(lesson.maxStudents - Number(lesson.bookedCount), 0);
        if (remainingSeats <= 0) {
            throw new Error("Свободных мест нет.");
        }
        return {
            child,
            lesson,
            remainingSeats,
            hasSubscription: Boolean(subscription && subscription.usedClasses < subscription.totalClasses),
        };
    }
    async createBooking(input) {
        const client = await db_1.pool.connect();
        try {
            await client.query("BEGIN");
            const child = await this.childRepository.findById(input.childId);
            if (!child || child.familyId !== input.familyId) {
                throw new Error("Ребенок не найден.");
            }
            const lesson = await this.lessonRepository.findByIdForUpdate(input.lessonId, client);
            if (!lesson) {
                throw new Error("Занятие недоступно.");
            }
            const existing = await this.bookingRepository.findByChildAndLessonForUpdate({
                childId: input.childId,
                lessonId: input.lessonId,
                client,
            });
            if (existing && existing.status !== "CANCELLED") {
                throw new Error("Ребенок уже записан на это занятие.");
            }
            const remainingSeats = Math.max(lesson.maxStudents - Number(lesson.bookedCount), 0);
            if (remainingSeats <= 0) {
                throw new Error("На занятие больше нет мест.");
            }
            let subscriptionId = null;
            if (input.paymentMode === "SUBSCRIPTION") {
                const subscription = await client.query(`
            SELECT
              id,
              "totalClasses" AS "totalClasses",
              "usedClasses" AS "usedClasses"
            FROM "Subscription"
            WHERE "familyId" = $1
              AND "isActive" = true
              AND "validUntil" >= NOW()
            ORDER BY "validUntil" DESC, "createdAt" DESC
            LIMIT 1
            FOR UPDATE
          `, [input.familyId]);
                const activeSubscription = subscription.rows[0];
                if (!activeSubscription || activeSubscription.usedClasses >= activeSubscription.totalClasses) {
                    throw new Error("Нет активного абонемента с доступными занятиями.");
                }
                subscriptionId = activeSubscription.id;
                await client.query(`
            UPDATE "Subscription"
            SET "usedClasses" = "usedClasses" + 1
            WHERE id = $1
          `, [activeSubscription.id]);
            }
            const booking = await this.bookingRepository.createOrRestore({
                childId: input.childId,
                lessonId: input.lessonId,
                useSubscription: input.paymentMode === "SUBSCRIPTION",
                createdByAdmin: false,
                existingBookingId: existing?.id,
                client,
            });
            if (subscriptionId) {
                await client.query(`
            INSERT INTO "SubscriptionUsage" ("subscriptionId", "bookingId")
            VALUES ($1, $2)
            ON CONFLICT ("bookingId")
            DO UPDATE SET "subscriptionId" = EXCLUDED."subscriptionId"
          `, [subscriptionId, booking.id]);
            }
            const full = await client.query(`
          SELECT
            b.id,
            c.id AS "childId",
            c.name AS "childName",
            cs.id AS "lessonId",
            d.name AS "lessonTitle",
            cs."startTime" AS "startsAt",
            b.status,
            su."subscriptionId" AS "subscriptionId"
          FROM "Booking" b
          INNER JOIN "Child" c ON c.id = b."childId"
          INNER JOIN "ClassSession" cs ON cs.id = b."classSessionId"
          INNER JOIN "Direction" d ON d.id = cs."directionId"
          LEFT JOIN "SubscriptionUsage" su ON su."bookingId" = b.id
          WHERE b.id = $1
        `, [booking.id]);
            await client.query("COMMIT");
            const row = full.rows[0];
            return {
                id: row.id,
                childId: row.childId,
                childName: row.childName,
                lessonId: row.lessonId,
                lessonTitle: row.lessonTitle,
                startsAt: row.startsAt,
                status: row.status,
                hasSubscriptionUsage: Boolean(row.subscriptionId),
            };
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
    async cancelBooking(input) {
        const client = await db_1.pool.connect();
        try {
            await client.query("BEGIN");
            const booking = await client.query(`
          SELECT
            b.id,
            c."familyId" AS "familyId",
            cs."startTime" AS "startsAt",
            su."subscriptionId" AS "subscriptionId"
          FROM "Booking" b
          INNER JOIN "Child" c ON c.id = b."childId"
          INNER JOIN "ClassSession" cs ON cs.id = b."classSessionId"
          LEFT JOIN "SubscriptionUsage" su ON su."bookingId" = b.id
          WHERE b.id = $1
            AND b.status IN ('PENDING', 'CONFIRMED')
          FOR UPDATE
        `, [input.bookingId]);
            const row = booking.rows[0];
            if (!row) {
                throw new Error("Запись не найдена.");
            }
            if (row.familyId !== input.familyId) {
                throw new Error("Нельзя отменить чужую запись.");
            }
            const refunded = (0, date_1.canCancelBooking)(row.startsAt);
            await client.query(`
          UPDATE "Booking"
          SET status = 'CANCELLED',
              "cancelledAt" = NOW(),
              "cancellationReason" = $2
          WHERE id = $1
        `, [input.bookingId, "Отменено через Telegram-бот"]);
            if (row.subscriptionId && refunded) {
                await client.query(`DELETE FROM "SubscriptionUsage" WHERE "bookingId" = $1`, [input.bookingId]);
                await client.query(`
            UPDATE "Subscription"
            SET "usedClasses" = GREATEST("usedClasses" - 1, 0)
            WHERE id = $1
          `, [row.subscriptionId]);
            }
            await client.query("COMMIT");
            return {
                refunded,
                burnsLesson: Boolean(row.subscriptionId) && !refunded,
                deadlineHours: constants_1.CANCELLATION_DEADLINE_HOURS,
            };
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
}
exports.BookingService = BookingService;
