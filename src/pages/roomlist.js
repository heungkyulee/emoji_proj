import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // useRouter 임포트

const RoomListScreen = () => {
  const [roomList, setRoomList] = useState([]);
  const router = useRouter(); // useRouter 훅 사용

  const getRoomList = async () => {
    try {
      const response = await fetch("/api/get-chat-room-list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result.results);
      setRoomList(result.results);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getRoomList();
  }, []);

  const handleRoomClick = (roomId) => {
    // 방 클릭 시 해당 방의 ID를 이용해 페이지 이동
    router.push(`/room/${roomId}`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>채팅방 목록</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {roomList.map((room) => (
          <div
            key={room.ChatRoomID}
            onClick={() => handleRoomClick(room.ChatRoomID)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <a>{room.RoomName}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomListScreen;
