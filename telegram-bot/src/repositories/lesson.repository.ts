import { addDays } from "../lib/date";
import { query } from "../lib/db";

type LessonRow = {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  maxStudents: number;
  bookedCount: string;
};

export class LessonRepository {
  async findUpcomingWithinDays(days: number): Promise<LessonRow[]> {
    const now = new Date();
    const until = addDays(now, days);

    const result = await query<LessonRow>(
      `
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
      `,
      [now, until],
    );

    return result.rows;
  }

  async findByIdForUpdate(id: string, client: { query: typeof query }): Promise<LessonRow | null> {
    const result = await client.query<LessonRow>(
      `
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
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }
}
