import { PoolClient } from "pg";

import { query } from "../lib/db";

type BookingRow = {
  id: string;
  childId: string;
  childName: string;
  lessonId: string;
  lessonTitle: string;
  startsAt: Date;
  status: "PENDING" | "CONFIRMED";
  subscriptionId: string | null;
};

export class BookingRepository {
  async findActiveByFamilyId(familyId: string): Promise<BookingRow[]> {
    const result = await query<BookingRow>(
      `
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
        WHERE c."familyId" = $1
          AND b.status IN ('PENDING', 'CONFIRMED')
          AND cs."startTime" >= NOW()
        ORDER BY cs."startTime" ASC
      `,
      [familyId],
    );

    return result.rows;
  }

  async findById(bookingId: string): Promise<BookingRow & { familyId: string } | null> {
    const result = await query<BookingRow & { familyId: string }>(
      `
        SELECT
          b.id,
          c.id AS "childId",
          c.name AS "childName",
          c."familyId" AS "familyId",
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
        LIMIT 1
      `,
      [bookingId],
    );

    return result.rows[0] ?? null;
  }

  async findByChildAndLessonForUpdate(input: {
    childId: string;
    lessonId: string;
    client: PoolClient;
  }) {
    const result = await input.client.query<{
      id: string;
      status: string;
    }>(
      `
        SELECT id, status
        FROM "Booking"
        WHERE "childId" = $1 AND "classSessionId" = $2
        FOR UPDATE
      `,
      [input.childId, input.lessonId],
    );

    return result.rows[0] ?? null;
  }

  async createOrRestore(input: {
    childId: string;
    lessonId: string;
    useSubscription: boolean;
    createdByAdmin: boolean;
    existingBookingId?: string;
    client: PoolClient;
  }): Promise<{ id: string }> {
    if (input.existingBookingId) {
      const result = await input.client.query<{ id: string }>(
        `
          UPDATE "Booking"
          SET status = $2,
              "cancelledAt" = NULL,
              "cancellationReason" = NULL
          WHERE id = $1
          RETURNING id
        `,
        [input.existingBookingId, input.useSubscription ? "CONFIRMED" : "PENDING"],
      );

      return result.rows[0];
    }

    const result = await input.client.query<{ id: string }>(
      `
        INSERT INTO "Booking" ("classSessionId", "childId", status, "createdByAdmin")
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
      [input.lessonId, input.childId, input.useSubscription ? "CONFIRMED" : "PENDING", input.createdByAdmin],
    );

    return result.rows[0];
  }
}
