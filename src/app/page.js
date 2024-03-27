"use client";

// src/pages/page.js
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
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
    <div>
      <h1>Welcome to the Chat App</h1>
      <nav>
        <ul>
          <li>
            <Link href="/registration">Registration</Link>
          </li>
          <li>
            <Link href="/roomlist">Room List</Link>
          </li>
          <li>
            <Link href="/chatroom">Chat Room</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
