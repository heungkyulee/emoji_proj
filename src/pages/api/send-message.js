import mysql from "mysql";
import { promisify } from "util";

// ISO 8601 형식의 타임스탬프를 MySQL DATETIME 형식으로 변환
const convertToMySQLDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

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
  if (req.method === "POST") {
    const { ChatRoomID, SenderID, MessageContent, Timestamp } = req.body;
    const mysqlTimestamp = convertToMySQLDateTime(Timestamp);

    console.log(
      ChatRoomID,
      SenderID,
      MessageContent,
      Timestamp,
      mysqlTimestamp
    );

    try {
      const results = await pool.query(
        "INSERT INTO Message (ChatRoomID, SenderID, MessageContent, Timestamp) VALUES (?, ?, ?, ?)",
        [ChatRoomID, SenderID, MessageContent, mysqlTimestamp]
      );
      res.status(200).json({
        success: true,
        message: "Message Sent successfully",
        results: results,
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
