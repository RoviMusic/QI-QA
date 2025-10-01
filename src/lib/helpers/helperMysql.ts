import { rmPool } from "../mysqldb";

export async function queryRM<T = any>(sql: string, params: any[] = []) {
  const [rows] = await rmPool.query(sql, params);
  return rows as T[];
}

// Wrapper para ejecutar consultas SQL que devuelven una sola linea
export async function queryOneRM<T = any>(sql: string, params: any[] = []) {
  const rows = await queryRM<T>(sql, params);
  return (rows as any[])[0] ?? null;
}
