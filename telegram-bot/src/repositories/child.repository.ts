import { query } from "../lib/db";

type ChildRow = {
  id: string;
  name: string;
  birthDate: Date | null;
};

export class ChildRepository {
  async findByFamilyId(familyId: string): Promise<ChildRow[]> {
    const result = await query<ChildRow>(
      `
        SELECT
          id,
          name,
          "birthDate" AS "birthDate"
        FROM "Child"
        WHERE "familyId" = $1
        ORDER BY name ASC
      `,
      [familyId],
    );

    return result.rows;
  }

  async findById(id: string): Promise<(ChildRow & { familyId: string }) | null> {
    const result = await query<ChildRow & { familyId: string }>(
      `
        SELECT
          id,
          name,
          "birthDate" AS "birthDate",
          "familyId" AS "familyId"
        FROM "Child"
        WHERE id = $1
        LIMIT 1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async create(input: { familyId: string; name: string; birthDate: Date | null }) {
    const result = await query<ChildRow>(
      `
        INSERT INTO "Child" ("name", "birthDate", "familyId")
        VALUES ($1, $2, $3)
        RETURNING
          id,
          name,
          "birthDate" AS "birthDate"
      `,
      [input.name, input.birthDate, input.familyId],
    );

    return result.rows[0];
  }
}
