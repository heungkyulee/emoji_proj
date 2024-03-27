"use client";

import React, { useEffect, useRef, useState } from "react";
import DefaultProfile from "../../assets/profile/defaultProfile.png";
import Lottie from "react-lottie";
import TouchAnimation from "../../assets/animation/touch/TouchAnimation.json";
import SwipeLeftAnimation from "../../assets/animation/swipe_left/SwipeLeftAnimation.json";
import Image from "next/image";

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

const ChatComponent = ({ emoticons, updateEmoticonFrame }) => {
  const endOfMessagesRef = useRef(null); // 메시지의 끝을 참조할 ref 생성
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 userInfo를 가져오고 userId 상태를 설정합니다.
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUserId(parsedUserInfo.userId);
    }
  }, []);

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
    // emoticons 배열이 변경될 때마다 스크롤을 메시지의 끝으로 이동
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [emoticons]);

  // 메시지 발송 시간 포맷팅 함수
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 스와이프 방향을 판단하고 프레임 업데이트
  const handleTouchMove = (index) => {
    if (touchStart - touchEnd > 50) {
      // 오른쪽에서 왼쪽으로 충분히 스와이프
      updateEmoticonFrame(index, -1);
    } else if (touchStart - touchEnd < -50) {
      // 왼쪽에서 오른쪽으로 충분히 스와이프
      updateEmoticonFrame(index, 1);
    }
  };

  return (
    <div
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
          onClick={() => updateEmoticonFrame(index, 1)}
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
                style={{ width: "48px", height: "48px", borderRadius: "50%" }}
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
                      {
                        // <Lottie
                        //   options={swipeLeftAnimationOptions}
                        //   height={"100%"}
                        //   width={"100%"}
                        // />
                      }
                      {/* <Lottie
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
                <div>{convertToKoreanTimeFormat(item.Timestamp)}</div>{" "}
                {/* 메시지 발송 시간 표시 */}
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
                {/* 메시지 발송 시간 표시 */}
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
      <div ref={endOfMessagesRef} /> {/* 메시지의 끝을 나타내는 빈 div */}
    </div>
  );
};

export default ChatComponent;
