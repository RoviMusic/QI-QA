import mysql from "mysql2/promise";

// Claves para conectase a DEV -- dolibarr
export const dolibarrPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: "dolibarr_dev",
  waitForConnections: true,
  connectionLimit: 25, // 25 conexiones, por default son 10 conexiones
  queueLimit: 0,
  connectTimeout: 30000, //30 segundos, por default son 10 segundos
});

// Claves para conectase a DEV -- QI
export const rmPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: "RM_Qi_DB",
  waitForConnections: true,
  connectionLimit: 25, // 25 conexiones, por default son 10 conexiones
  queueLimit: 0,
  connectTimeout: 30000, //30 segundos, por default son 10 segundos
});
