// EmoticonPicker.js
import React, { useEffect, useState } from "react";
import Image from "next/image";

const Starbucks1 =
  "https://eterners.s3.ap-northeast-2.amazonaws.com/Coupon_Starbucks_1.png";
const Starbucks2 =
  "https://eterners.s3.ap-northeast-2.amazonaws.com/Coupon_Starbucks_2.png";
const Starbucks3 =
  "https://eterners.s3.ap-northeast-2.amazonaws.com/Coupon_Starbucks_3.png";
const Starbucks4 =
  "https://eterners.s3.ap-northeast-2.amazonaws.com/Coupon_Starbucks_4.png";
const Starbucks5 =
  "https://eterners.s3.ap-northeast-2.amazonaws.com/Coupon_Starbucks_5.png";
const Gift1 =
  "https://eterners.s3.ap-northeast-2.amazonaws.com/Coupon_Gift_1.png";
const Gift2 =
  "https://eterners.s3.ap-northeast-2.amazonaws.com/Coupon_Gift_2.png";
const Gift3 =
  "https://eterners.s3.ap-northeast-2.amazonaws.com/Coupon_Gift_3.png";
const Gift4 =
  "https://eterners.s3.ap-northeast-2.amazonaws.com/Coupon_Gift_4.png";
const Gift5 =
  "https://eterners.s3.ap-northeast-2.amazonaws.com/Coupon_Gift_5.png";
const Gift = "https://eterners.s3.ap-northeast-2.amazonaws.com/Gift.gif";

// 이모티콘 객체 배열 예시 (각 이모티콘마다 프레임별 이미지 URL 포함)
const emoticons = [
  {
    name: Starbucks1,
    images: [Starbucks1, Starbucks2, Starbucks3, Starbucks4, Starbucks5],
  },
  {
    name: Gift1,
    images: [Gift1, Gift2, Gift3, Gift4, Gift5, Gift],
  },
  // 여기에 더 많은 이모티콘과 프레임을 추가할 수 있습니다.
];

const EmoticonPicker = ({ onEmoticonSelect }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 userInfo를 가져오고 userId 상태를 설정합니다.
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      console.log(parsedUserInfo);
      setUserId(parsedUserInfo.userId);
    }
  }, []);
  return (
    <div
      style={{
        backgroundColor: "white",
        position: "absolute",
        bottom: 0,
        maxWidth: "600px",
        minWidth: "400px",
        height: "66px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        width: "100%",
        zIndex: 1,
        borderColor: "#F3F3F3",
        borderWidth: 1,
      }}
    >
      {emoticons.map((emoticon, index) => (
        <button key={index} onClick={() => onEmoticonSelect(emoticon)}>
          <Image
            src={emoticon.name}
            width={48}
            height={48}
            alt={emoticon.name}
            style={{ height: "48px", width: "48px" }}
          />
        </button>
      ))}
    </div>
  );
};

export default EmoticonPicker;
