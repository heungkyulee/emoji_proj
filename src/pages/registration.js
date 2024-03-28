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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f0f2f5",
        }}
      >
        <div
          style={{
            width: "400px",
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "black",
              fontWeight: 800,
              fontSize: "24px",
            }}
          >
            Eterners
          </h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="이름을 입력하세요"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                color: "white",
                backgroundColor: "#007bff",
                cursor: "pointer",
              }}
            >
              등록
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
