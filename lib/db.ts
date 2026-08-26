import postgres from "postgres";

/**
 * Conexão Postgres do site (banco qubit_site).
 * - Produção (Cloud Run): socket unix do Cloud SQL via INSTANCE_CONNECTION_NAME.
 * - Dev: DATABASE_URL (Postgres local ou proxy em 127.0.0.1).
 * Cache em globalThis para o hot-reload do Next não abrir um pool por import.
 */
const globalForDb = globalThis as unknown as { __qubitSql?: ReturnType<typeof postgres> };

function createSql() {
  const instanceConn = process.env.INSTANCE_CONNECTION_NAME?.trim();
  if (instanceConn) {
    return postgres({
      host: `/cloudsql/${instanceConn}`,
      database: process.env.DB_NAME ?? "qubit_site",
      username: process.env.DB_USER ?? "qubit_site_app",
      password: process.env.DB_PASSWORD ?? "",
      max: 5,
      prepare: false,
    });
  }
  return postgres(
    process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/qubit_site",
    { max: 5, prepare: false },
  );
}

const sql = globalForDb.__qubitSql ?? createSql();
if (process.env.NODE_ENV !== "production") globalForDb.__qubitSql = sql;

export default sql;
