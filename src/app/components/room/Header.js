import React from "react";
import DefaultProfile from "../../assets/profile/defaultProfile.png";
import Image from "next/image";

export const Header = ({ roomName }) => {
  return (
    <div
      style={{
        backgroundColor: "#B2C7DA",
        position: "absolute",
        top: 0,
        maxWidth: "600px",
        minWidth: "400px",
        height: "66px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        width: "100%",
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "24px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Image
          src={DefaultProfile}
          alt="Profile"
          style={{ height: "48px", width: "48px", borderRadius: "24px" }}
        />
        <div>{roomName}</div>
      </div>
    </div>
  );
};
