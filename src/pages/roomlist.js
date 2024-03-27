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
    <div>
      <div>채팅방 만들기</div>
      <div>채팅방 목록</div>
      {roomList.map((room) => (
        <div
          key={room.ChatRoomID}
          onClick={() => handleRoomClick(room.ChatRoomID)}
        >
          <a style={{ cursor: "pointer" }}>{room.RoomName}</a>
        </div>
      ))}
    </div>
  );
};

export default RoomListScreen;
