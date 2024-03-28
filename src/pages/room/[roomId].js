import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ChatComponent from "@/app/components/room/ChatComponent";
import EmoticonPicker from "@/app/components/room/EmoticonPicker";
import { Header } from "@/app/components/room/Header";
import { useMutation, useQuery, useQueryClient } from "react-query";

const fetchEmoticons = async (roomId) => {
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
  return result.results;
};

const sendMessage = async ({ roomId, senderID, messageContent }) => {
  const response = await fetch("/api/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ChatRoomID: roomId,
      SenderID: senderID,
      MessageContent: messageContent,
      Timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

const RoomDetailScreen = () => {
  // const [emoticons, setEmoticons] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState([]);
  const [roomName, setRoomName] = useState();
  const [userId, setUserId] = useState();

  const queryClient = useQueryClient();

  const mutation = useMutation(sendMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries(["emoticons", roomId]);
    },
  });

  const handleEmoticonSelect = (emoticon) => {
    mutation.mutate({
      roomId: roomId,
      senderID: userId,
      messageContent: JSON.stringify(emoticon.images),
    });
  };

  const router = useRouter();
  const { roomId } = router.query;

  // 여기서 useQuery를 사용하여 emoticons 데이터를 관리
  const {
    data: emoticons,
    isError,
    error,
    refetch,
  } = useQuery(["emoticons", roomId], () => fetchEmoticons(roomId), {
    enabled: !!roomId, // roomId가 있을 때만 쿼리를 실행
    refetchInterval: 500,
  });

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUserId(parsedUserInfo.userId);
    }
  }, []);

  useEffect(() => {
    if (roomId) {
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
          setRoomName(roomInfo.length !== 0 ? roomInfo[0].RoomName : "");
        } catch (error) {
          console.error("Error:", error);
        }
      };

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

  // const handleEmoticonSelect = async (emoticon) => {
  //   const senderID = userId;
  //   const messageContent = JSON.stringify(emoticon.images);

  //   try {
  //     const response = await fetch("/api/send-message", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ChatRoomID: roomId,
  //         SenderID: senderID,
  //         MessageContent: messageContent,
  //         Timestamp: new Date().toISOString(),
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const result = await response.json();
  //     console.log("Message sent successfully:", result);
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };

  // const updateEmoticonFrame = (index, FrameChange) => {
  //   setEmoticons((prevEmoticons) =>
  //     prevEmoticons.map((item, i) => {
  //       if (i === index) {
  //         const newFrame = item.Frame + FrameChange;
  //         const maxFrame = JSON.parse(item.MessageContent).length - 1;
  //         return {
  //           ...item,
  //           Frame:
  //             newFrame >= 0 && newFrame <= maxFrame ? newFrame : item.Frame,
  //         };
  //       }
  //       return item;
  //     })
  //   );
  // };

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
        // updateEmoticonFrame={updateEmoticonFrame}
        roomId={roomId}
        // setEmoticons={setEmoticons}
      />
    </div>
  );
};

export default RoomDetailScreen;
