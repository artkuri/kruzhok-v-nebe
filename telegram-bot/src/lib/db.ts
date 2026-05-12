import { Pool, QueryResult, QueryResultRow } from "pg";

import { env } from "../config/env";

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export async function query<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, values);
}
