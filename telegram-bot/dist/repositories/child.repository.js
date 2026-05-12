"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildRepository = void 0;
const db_1 = require("../lib/db");
class ChildRepository {
    async findByFamilyId(familyId) {
        const result = await (0, db_1.query)(`
        SELECT
          id,
          name,
          "birthDate" AS "birthDate"
        FROM "Child"
        WHERE "familyId" = $1
        ORDER BY name ASC
      `, [familyId]);
        return result.rows;
    }
    async findById(id) {
        const result = await (0, db_1.query)(`
        SELECT
          id,
          name,
          "birthDate" AS "birthDate",
          "familyId" AS "familyId"
        FROM "Child"
        WHERE id = $1
        LIMIT 1
      `, [id]);
        return result.rows[0] ?? null;
    }
    async create(input) {
        const result = await (0, db_1.query)(`
        INSERT INTO "Child" ("name", "birthDate", "familyId")
        VALUES ($1, $2, $3)
        RETURNING
          id,
          name,
          "birthDate" AS "birthDate"
      `, [input.name, input.birthDate, input.familyId]);
        return result.rows[0];
    }
}
exports.ChildRepository = ChildRepository;
