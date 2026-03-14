"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const mbtiTypes = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

export default function OnboardingPage() {
  const router = useRouter();

  const [selectedMbti, setSelectedMbti] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState("");

  const handleStart = () => {
    if (!selectedMbti) {
      alert("MBTI를 선택해줘.");
      return;
    }

    router.push(
      `/chat?mbti=${selectedMbti}&birthDate=${encodeURIComponent(birthDate)}`
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffaf3 0%, #f4efff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          background: "white",
          borderRadius: 24,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 10 }}>
          먼저 너를 조금 알려줘
        </h1>

        <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
          MBTI와 생년월일을 바탕으로 첫 대화를 시작할게.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {mbtiTypes.map((type) => {
            const selected = selectedMbti === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedMbti(type)}
                style={{
                  padding: "10px 0",
                  borderRadius: 12,
                  border: selected ? "2px solid #7b61ff" : "1px solid #ddd",
                  background: selected ? "#f3efff" : "white",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {type}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          placeholder="생년월일 (예: 1994-03-21)"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #ddd",
            marginBottom: 20,
            boxSizing: "border-box",
          }}
        />

        <div style={{ marginBottom: 20, fontSize: 14, color: "#666" }}>
          현재 선택:
          <strong> {selectedMbti || "MBTI 미선택"}</strong>
          {birthDate && ` · ${birthDate}`}
        </div>

        <button
          type="button"
          onClick={handleStart}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 16,
            border: "none",
            background: "#7b61ff",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          대화 시작하러 가기
        </button>
      </div>
    </main>
  );
}