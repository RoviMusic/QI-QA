import mysql from "mysql2/promise";

// Claves para conectase a DEV
export const dolibarrPool = mysql.createPool({
  host: "187.189.243.250",
  port: 33306,
  user: "rmdm",
  password: "R0vi4dmin$",
  database: "dolibarr_dev",
  waitForConnections: true,
  //connectionLimit: 5,
  queueLimit: 0,
});
