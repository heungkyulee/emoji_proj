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
  if (req.method === "POST") {
    const { messageID, frameChange } = req.body;

    try {
      const currentFrameResults = await pool.query(
        "SELECT Frame FROM `Message` WHERE MessageID = ?",
        [messageID]
      );

      if (currentFrameResults.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Message not found" });
      }

      let newFrame = currentFrameResults[0].Frame + frameChange;
      // Frame 값이 4보다 작은 경우에만 증가, 0보다 크거나 같은 경우에만 감소를 허용합니다.
      if (frameChange > 0 && newFrame > 4) {
        newFrame = 4; // Frame이 4를 초과하는 경우 4로 제한
      } else if (frameChange < 0 && newFrame < 0) {
        newFrame = 0; // Frame이 0 미만인 경우 0으로 제한
      }

      await pool.query("UPDATE `Message` SET Frame = ? WHERE MessageID = ?", [
        newFrame,
        messageID,
      ]);

      res.status(200).json({
        success: true,
        message: "Frame updated successfully",
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
