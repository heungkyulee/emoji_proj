"use client";

import { useState } from "react";

export default function Registration() {
  const [username, setUsername] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      // 폼 제출 후 추가 작업 (예: 사용자 목록 새로고침)
      localStorage.setItem("user", JSON.stringify(result));
      window.location.href = "/roomlist";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div>이름 등록하기</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="이름을 입력하세요"
          required
        />
        <button type="submit">등록</button>
      </form>
    </>
  );
}
