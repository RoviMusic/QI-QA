// app/api/_dbcheck/route.ts
"use server"
// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
        const conn = await mysql.createConnection({
      host: "187.189.243.250",
      port: 33306,
      user: 'rmdm',
      password: 'R0vi4dmin$',
      database: "dolirovimusic",
      debug: true,
      
    });
    const [rows] = await conn.query("SELECT 1 AS ok");
    await conn.end();
    return NextResponse.json(rows);
  } catch (e:any) {
    console.error(JSON.stringify(e))
    return NextResponse.json({error: e.message, code: e.code, stack: e.stack}, { status: 500 });
  }
}
