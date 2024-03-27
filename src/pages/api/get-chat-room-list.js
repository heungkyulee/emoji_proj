import mysql from "mysql";
import { promisify } from "util";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.CLOUD_MYSQL_HOST,
  port: process.env.CLOUD_MYSQL_PORT,
  user: process.env.CLOUD_MYSQL_USER,
  password: process.env.CLOUD_MYSQL_PASSWORD,
  database: process.env.CLOUD_MYSQL_DATABASE,
});

pool.query = promisify(pool.query);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const results = await pool.query("SELECT * FROM `ChatRoom`");
      res.status(200).json({
        success: true,
        message: "Got chat room list successfully",
        results: results,
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
