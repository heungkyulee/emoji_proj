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
  const { roomId } = req.query; // URL에서 roomId 쿼리 파라미터 추출

  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }
  if (req.method === "GET") {
    try {
      const results = await pool.query(
        `
        SELECT 
          Message.*, 
          User.Username, 
          User.ProfileImageURL 
        FROM Message 
        JOIN User ON Message.SenderID = User.UserID 
        WHERE Message.ChatRoomID = ? 
        ORDER BY Message.Timestamp ASC
      `,
        [roomId]
      );
      console.log(results);
      res.status(200).json({
        success: true,
        message: "Got Messages successfully",
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
