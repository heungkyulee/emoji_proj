"use client";

// src/pages/page.js
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    function setScreenSize() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
    setScreenSize();
    window.addEventListener("resize", setScreenSize);
    return () => window.removeEventListener("resize", setScreenSize);
  }, []);
  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 userInfo를 가져오고 userId 상태를 설정합니다.
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      JSON.parse(userInfo)
        ? (window.location.href = "/roomlist")
        : (window.location.href = "/registration");
    }
  }, []);
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
        backgroundColor: "#f9f9f9",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ color: "#191919" }}>Eterners</h1>
    </div>
  );
}
