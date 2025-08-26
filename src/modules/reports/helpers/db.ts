import { dolibarrPool } from "@/lib/mysqldb";


export async function query<T = any>(sql: string, params: any[] = []) {
  const [rows] = await dolibarrPool.execute(sql);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []) {
  const rows = await query<T>(sql, params);
  return (rows as any[])[0] ?? null;
}