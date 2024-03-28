import React, { useCallback, useEffect, useRef, useState } from "react";
import DefaultProfile from "../../assets/profile/defaultProfile.png";
import Lottie from "react-lottie";
import TouchAnimation from "../../assets/animation/touch/TouchAnimation.json";
import SwipeLeftAnimation from "../../assets/animation/swipe_left/SwipeLeftAnimation.json";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "react-query";

const updateEmoticonFrame = async (messageID, frameChange) => {
  const response = await fetch(`/api/update-emoticon-frame`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messageID,
      frameChange,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

function convertToKoreanTimeFormat(isoString) {
  const date = new Date(isoString);
  return date
    .toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace("오전", "AM")
    .replace("오후", "PM")
    .replace("AM", "오전")
    .replace("PM", "오후");
}

const ChatComponent = ({ emoticons = [], roomId }) => {
  const endOfMessagesRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const queryClient = useQueryClient();
  const mutation = useMutation(updateEmoticonFrame, {
    onSuccess: () => {
      queryClient.invalidateQueries(["emoticons", roomId]);
    },
    onError: (error) => {
      console.error("An error occurred: ", error.message);
    },
  });

  const handleUpdateFrame = useCallback(
    (messageID, direction) => {
      const emoticonIndex = emoticons.findIndex(
        (e) => e.messageID === messageID
      );
      if (emoticonIndex === -1) return; // 해당 이모티콘을 찾지 못한 경우

      const currentFrame = emoticons[emoticonIndex].frame;
      let newFrame = currentFrame + direction;
      newFrame = Math.max(0, Math.min(newFrame, 4)); // 프레임 범위 제한

      if (newFrame !== currentFrame) {
        // 프레임이 변경된 경우에만 업데이트
        mutation.mutate({ messageID, frameChange: newFrame - currentFrame });
      }
    },
    [mutation, emoticons]
  );

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchMoreMessages = useCallback(async () => {
    const lastMessageId = emoticons[emoticons.length - 1]?.MessageID;
    if (!lastMessageId) return;

    try {
      const response = await fetch(
        `/api/get-messages?roomId=${roomId}&lastMessageId=${lastMessageId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      const newEmoticons = result.results;

      queryClient.setQueryData(["emoticons", roomId], (oldData) => [
        ...oldData,
        ...newEmoticons,
      ]);
    } catch (error) {
      console.error("Error fetching more messages:", error);
    }
  }, [roomId, queryClient, emoticons]);

  const touchAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: TouchAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const swipeLeftAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: SwipeLeftAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
  }, [isInitialLoad]);

  const handleTouchMove = useCallback(
    (index, direction) => {
      const messageID = emoticons[index].messageID;
      handleUpdateFrame(messageID, direction); // direction 값을 그대로 전달
    },
    [handleUpdateFrame, emoticons]
  );

  useEffect(() => {
    const handleTouchStart = (e) => {
      setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = (e, index) => {
      setTouchEnd(e.changedTouches[0].clientX);
      console.log(touchStart, touchEnd);
      const direction =
        touchStart - touchEnd > 50 ? -1 : touchStart - touchEnd < -50 ? 1 : 0;
      if (direction !== 0) {
        handleTouchMove(index, direction);
      }
    };

    const emoticonElements = document.querySelectorAll(".emoticon-div");
    emoticonElements.forEach((elem, index) => {
      elem.addEventListener("touchstart", handleTouchStart);
      elem.addEventListener("touchend", (e) => handleTouchEnd(e, index));
    });

    return () => {
      emoticonElements.forEach((elem) => {
        elem.removeEventListener("touchstart", handleTouchStart);
        elem.removeEventListener("touchend", handleTouchEnd);
      });
    };
  }, [handleUpdateFrame, touchStart, touchEnd]);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUserId(parsedUserInfo.userId);
    }
  }, []);

  useEffect(() => {
    const loadMoreMessages = () => {
      if (scrollContainer.scrollTop === 0) {
        fetchMoreMessages();
      }
    };
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", loadMoreMessages);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", loadMoreMessages);
      }
    };
  }, [emoticons]);

  return (
    <div
      ref={scrollContainerRef}
      style={{
        overflowY: "scroll",
        position: "relative",
        height: "calc(var(--vh, 1vh) * 100 - 66px)",
        flexDirection: "column",
        display: "flex",
        gap: "20px",
        backgroundColor: "#B2C7DA",
        width: "100%",
        scrollbarColor: "#F3F3F3",
        scrollbarWidth: "none",
        scrollbarGutter: "10px",
      }}
    >
      {emoticons.map((item, index) => (
        <div
          key={index}
          onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
          onTouchEnd={(e) => {
            setTouchEnd(e.changedTouches[0].clientX);
            handleTouchMove(index);
          }}
          onClick={() => {
            updateEmoticonFrame(index, 1);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            updateEmoticonFrame(index, -1);
          }}
          style={{
            display: "flex",
            justifyContent: item.SenderID == userId ? "flex-end" : "flex-start",
            alignItems: "flex-start",
            paddingLeft: "16px",
            paddingRight: "16px",
            width: "100%",
            gap: "10px",
          }}
        >
          {item.SenderID !== userId && (
            <>
              <Image
                src={item.ProfileImageURL}
                width={48}
                height={48}
                alt="Profile"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "5px",
                  }}
                >
                  <div>{item.Username}</div>
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "10px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                      }}
                    >
                      {/* <Lottie
                        options={swipeLeftAnimationOptions}
                        height={"100%"}
                        width={"100%"}
                      />
                      <Lottie
                        options={touchAnimationOptions}
                        height={"100%"}
                        width={"100%"}
                      /> */}
                    </div>
                    <Image
                      src={JSON.parse(item.MessageContent)[item.Frame]}
                      width={100}
                      height={100}
                      alt={"name"}
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                </div>
                <div>{convertToKoreanTimeFormat(item.Timestamp)}</div>
              </div>
            </>
          )}
          {item.SenderID === userId && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  gap: "10px",
                }}
              >
                <div>{convertToKoreanTimeFormat(item.Timestamp)}</div>
                <div
                  style={{
                    backgroundColor: "#F8E44B",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <Image
                    src={JSON.parse(item.MessageContent)[item.Frame]}
                    width={100}
                    height={100}
                    alt={"name"}
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatComponent;
