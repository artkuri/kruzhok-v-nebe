"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonRepository = void 0;
const date_1 = require("../lib/date");
const db_1 = require("../lib/db");
class LessonRepository {
    async findUpcomingWithinDays(days) {
        const now = new Date();
        const until = (0, date_1.addDays)(now, days);
        const result = await (0, db_1.query)(`
        SELECT
          cs.id,
          d.name AS title,
          cs."startTime" AS "startsAt",
          cs."endTime" AS "endsAt",
          cs."maxStudents" AS "maxStudents",
          COUNT(b.id)::text AS "bookedCount"
        FROM "ClassSession" cs
        INNER JOIN "Direction" d ON d.id = cs."directionId"
        LEFT JOIN "Booking" b
          ON b."classSessionId" = cs.id
         AND b.status IN ('PENDING', 'CONFIRMED')
        WHERE cs.status = 'SCHEDULED'
          AND cs."startTime" >= $1
          AND cs."startTime" <= $2
        GROUP BY cs.id, d.name
        ORDER BY cs."startTime" ASC
      `, [now, until]);
        return result.rows;
    }
    async findByIdForUpdate(id, client) {
        const result = await client.query(`
        SELECT
          cs.id,
          d.name AS title,
          cs."startTime" AS "startsAt",
          cs."endTime" AS "endsAt",
          cs."maxStudents" AS "maxStudents",
          (
            SELECT COUNT(*)
            FROM "Booking" b
            WHERE b."classSessionId" = cs.id
              AND b.status IN ('PENDING', 'CONFIRMED')
          )::text AS "bookedCount"
        FROM "ClassSession" cs
        INNER JOIN "Direction" d ON d.id = cs."directionId"
        WHERE cs.id = $1
          AND cs.status = 'SCHEDULED'
        FOR UPDATE
      `, [id]);
        return result.rows[0] ?? null;
    }
}
exports.LessonRepository = LessonRepository;
