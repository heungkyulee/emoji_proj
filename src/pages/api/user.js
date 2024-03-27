// src/pages/api/user.js
import mysql from "mysql";
import { promisify } from "util";

const pool = mysql.createPool({
  connectionLimit: 10, // 연결 풀에 최대 연결 수
  host: process.env.CLOUD_MYSQL_HOST,
  port: process.env.CLOUD_MYSQL_PORT,
  user: process.env.CLOUD_MYSQL_USER,
  password: process.env.CLOUD_MYSQL_PASSWORD,
  database: process.env.CLOUD_MYSQL_DATABASE,
});

pool.query = promisify(pool.query); // query 메서드를 Promise로 래핑

export default async function handler(req, res) {
  console.log(
    "hhhhh",
    process.env.CLOUD_MYSQL_HOST,
    process.env.CLOUD_MYSQL_PORT,
    process.env.CLOUD_MYSQL_USER,
    process.env.CLOUD_MYSQL_PASSWORD,
    process.env.CLOUD_MYSQL_DATABASE
  );
  try {
    const results = pool.query("SELECT * FROM User");
    console.log(results);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
