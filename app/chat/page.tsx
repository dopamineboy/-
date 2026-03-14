"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mbti = searchParams.get("mbti") || "미선택";
  const birthDate = searchParams.get("birthDate") || "미입력";

  const [input, setInput] = useState("");
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);
  const [eggStage, setEggStage] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "안녕. 너를 조금 알아가보고 싶은데, 잠깐 대화해도 괜찮아?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: Message[] = [...messages, { role: "user", text: trimmed }];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          mbti,
          birthDate,
          previousResponseId,
          turnCount: nextMessages.length,
        }),
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`JSON이 아닌 응답을 받았어: ${text.slice(0, 200)}`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "API 호출 실패");
      }

      setPreviousResponseId(data.responseId);
      setEggStage(data.characterState?.eggStage ?? 1);

      if (data.reward?.shouldReveal) {
        const query = new URLSearchParams({
          typeName: data.reward.typeName,
          summary: data.reward.summary,
          deepSummary: data.reward.deepSummary,
          characterBase: data.reward.characterBase,
          identityScores: JSON.stringify(data.reward.identityScores),
          analysisTitle: data.reward.analysisTitle,
          analysisBody: data.reward.analysisBody,
          mbtiBlend: data.reward.mbtiBlend,
          sajuBlend: data.reward.sajuBlend,
        });

        router.push(`/result?${query.toString()}`);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.assistantMessage,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? `오류가 났어: ${error.message}`
              : "지금 잠깐 연결이 흔들렸어. 한 번만 다시 말해줄래?",
        },
      ]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const eggClassName =
    eggStage === 1
      ? "chat-egg stage-1"
      : eggStage === 2
      ? "chat-egg stage-2"
      : "chat-egg stage-3";

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "sans-serif",
        background: "linear-gradient(180deg, #fffaf3 0%, #f4efff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          background: "rgba(255,255,255,0.88)",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <Link
            href="/onboarding"
            style={{
              fontSize: 14,
              color: "#666",
              textDecoration: "none",
            }}
          >
            ← 온보딩으로 돌아가기
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div className={eggClassName}>🥚</div>
        </div>

        <h1 style={{ fontSize: 28, marginBottom: 12 }}>첫 대화</h1>

        <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
          선택값: <strong>{mbti}</strong> · {birthDate}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 24,
            minHeight: 320,
          }}
        >
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={index}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  padding: "14px 16px",
                  borderRadius: 18,
                  background: isUser ? "#f3efff" : "#fff",
                  border: isUser ? "1px solid #ddd6ff" : "1px solid #eee",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {message.text}
              </div>
            );
          })}

          {isLoading && (
            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: "80%",
                padding: "14px 16px",
                borderRadius: 18,
                background: "#fff",
                border: "1px solid #eee",
                lineHeight: 1.6,
                color: "#666",
              }}
            >
              생각하는 중...
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            placeholder="메시지를 입력해줘"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: 16,
              border: "1px solid #ddd",
              fontSize: 15,
            }}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading}
            style={{
              padding: "14px 18px",
              borderRadius: 16,
              border: "none",
              background: "#7b61ff",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            전송
          </button>
        </div>
      </div>
    </main>
  );
}