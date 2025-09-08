import { dolibarrPool } from "@/lib/mysqldb";

// Wrapper para ejecutar consultas SQL que devuelven multiples filas
export async function query<T = any>(sql: string, params: any[] = []) {
  const [rows] = await dolibarrPool.query(sql, params);
  return rows as T[];
}

// Wrapper para ejecutar consultas SQL que devuelven una sola linea
export async function queryOne<T = any>(sql: string, params: any[] = []) {
  const rows = await query<T>(sql, params);
  return (rows as any[])[0] ?? null;
}
