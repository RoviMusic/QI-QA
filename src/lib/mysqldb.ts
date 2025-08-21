import mysql from "mysql2/promise";

export const dolibarrPool = mysql.createPool({
  host: process.env.MYSQL_HOST!,
  port: Number(process.env.MYSQL_PORT!),
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASS!,
  database: "dolirovimusic",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});
