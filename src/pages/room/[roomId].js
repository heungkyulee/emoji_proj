"use client";

import ChatComponent from "@/app/components/room/ChatComponent";
import EmoticonPicker from "@/app/components/room/EmoticonPicker";
import { Header } from "@/app/components/room/Header";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const RoomDetailScreen = () => {
  const [emoticons, setEmoticons] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState([]);
  const [roomName, setRoomName] = useState();
  const router = useRouter();
  const { roomId } = router.query; // URL에서 roomId 파라미터를 가져옴

  const [userId, setUserId] = useState();

  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 userInfo를 가져오고 userId 상태를 설정합니다.
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUserId(parsedUserInfo.userId);
    }
  }, []);

  useEffect(() => {
    if (roomId) {
      const fetchEmoticons = async () => {
        try {
          const response = await fetch(`/api/get-messages?roomId=${roomId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const result = await response.json();
          const _emoticons = result.results;
          setEmoticons(_emoticons);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      const getRoomInfo = async () => {
        try {
          const response = await fetch(`/api/get-room-info?roomId=${roomId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const result = await response.json();
          setRoomInfo(result.results);
          setRoomName(roomInfo != [] ? roomInfo[0].RoomName : "");
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchEmoticons();
      getRoomInfo();
    }
  }, [roomId]);

  useEffect(() => {
    function setScreenSize() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
    setScreenSize();
    window.addEventListener("resize", setScreenSize);
    return () => window.removeEventListener("resize", setScreenSize);
  }, []);

  // EmoticonPicker 컴포넌트 안에 있는 onEmoticonSelect 함수 예시
  const handleEmoticonSelect = async (emoticon) => {
    const senderID = userId; // 예시: 현재 사용자 ID
    const messageContent = JSON.stringify(emoticon.images); // 이모티콘 이미지 URL 배열을 문자열로 변환

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ChatRoomID: roomId,
          SenderID: senderID,
          MessageContent: messageContent,
          Timestamp: new Date().toISOString(), // 현재 시각
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Message sent successfully:", result);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateEmoticonFrame = (index, FrameChange) => {
    setEmoticons((prevEmoticons) =>
      prevEmoticons.map((item, i) => {
        if (i === index) {
          const newFrame = item.Frame + FrameChange;
          const maxFrame = JSON.parse(item.MessageContent).length - 1;
          return {
            ...item,
            Frame:
              newFrame >= 0 && newFrame <= maxFrame ? newFrame : item.Frame,
          };
        }
        return item;
      })
    );
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        minWidth: "400px",
        height: "calc(var(--vh, 1vh) * 100 - 132px)",
        margin: "0 auto",
        marginTop: "66px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#B2C7DA",
      }}
    >
      <Header roomName={roomName} />
      <EmoticonPicker onEmoticonSelect={handleEmoticonSelect} />
      <ChatComponent
        emoticons={emoticons}
        updateEmoticonFrame={updateEmoticonFrame}
      />
    </div>
  );
};

export default RoomDetailScreen;
