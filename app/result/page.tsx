"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type IdentityScores = {
  energy: number;
  logic: number;
  emotion: number;
  social: number;
  taste: number;
  adventure: number;
  expression: number;
  immersion: number;
};

function safeScores(raw: string | null): IdentityScores {
  if (!raw) {
    return {
      energy: 50,
      logic: 50,
      emotion: 50,
      social: 50,
      taste: 50,
      adventure: 50,
      expression: 50,
      immersion: 50,
    };
  }

  try {
    return JSON.parse(raw) as IdentityScores;
  } catch {
    return {
      energy: 50,
      logic: 50,
      emotion: 50,
      social: 50,
      taste: 50,
      adventure: 50,
      expression: 50,
      immersion: 50,
    };
  }
}

function CharacterMini({ base }: { base: string }) {
  const skin = "#f4d3bd";
  const hairColor =
    base === "planner"
      ? "#2f2546"
      : base === "explorer"
      ? "#6d4cff"
      : base === "guardian"
      ? "#5b4d3c"
      : base === "dreamer"
      ? "#7a5fd6"
      : "#3a3350";

  const shirtColor =
    base === "planner"
      ? "#8b7dff"
      : base === "explorer"
      ? "#ffb36b"
      : base === "guardian"
      ? "#7fb58d"
      : base === "dreamer"
      ? "#c79cff"
      : "#a9a3c7";

  return (
    <div
      style={{
        width: 150,
        height: 210,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 12,
          width: 74,
          height: 74,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: hairColor,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 24,
          width: 62,
          height: 62,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: skin,
          border: "2px solid rgba(0,0,0,0.05)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 92,
          width: 84,
          height: 78,
          transform: "translateX(-50%)",
          borderRadius: 24,
          background: shirtColor,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 46,
          top: 170,
          width: 18,
          height: 34,
          borderRadius: 12,
          background: "#2f2546",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 46,
          top: 170,
          width: 18,
          height: 34,
          borderRadius: 12,
          background: "#2f2546",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 104,
          width: 18,
          height: 54,
          borderRadius: 12,
          background: skin,
          transform: "rotate(10deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 34,
          top: 104,
          width: 18,
          height: 54,
          borderRadius: 12,
          background: skin,
          transform: "rotate(-10deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: 92,
          height: 16,
          transform: "translateX(-50%)",
          borderRadius: 999,
          background: "rgba(56,42,102,0.12)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}

function GraphBar({
  label,
  value,
  leftLabel,
  rightLabel,
}: {
  label: string;
  value: number;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          fontSize: 14,
          color: "#4d4563",
          fontWeight: 700,
        }}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: "#eee8ff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #8b6cff, #ffbe73)",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontSize: 12,
          color: "#8a829d",
        }}
      >
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

function ResultPageInner() {
  const searchParams = useSearchParams();

  const typeName = searchParams.get("typeName") || "깨어나는 관찰자";
  const summary =
    searchParams.get("summary") || "대화를 통해 천천히 자기만의 결을 드러내는 사람.";
  const deepSummary =
    searchParams.get("deepSummary") || "대화를 길게 이어가면서 더 또렷해진 결이 보여.";
  const characterBase = searchParams.get("characterBase") || "observer";

  const analysisTitle =
    searchParams.get("analysisTitle") || "대화를 통해 드러난 너의 결";
  const analysisBody =
    searchParams.get("analysisBody") ||
    "겉으로 보이는 인상보다 안쪽의 방향성과 감정 결이 더 분명한 타입으로 읽혔어.";
  const mbtiBlend =
    searchParams.get("mbtiBlend") ||
    "MBTI는 하나의 힌트였고, 실제 대화에서는 그보다 더 입체적인 결이 보였어.";
  const sajuBlend =
    searchParams.get("sajuBlend") ||
    "생년월일을 바탕으로 보면, 바깥보다 안쪽에서 에너지를 정리한 뒤 움직이는 흐름이 느껴졌어.";

  const [characterName, setCharacterName] = useState("미니");

  const scores = useMemo(
    () => safeScores(searchParams.get("identityScores")),
    [searchParams]
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px 60px",
        fontFamily: "sans-serif",
        background: "linear-gradient(180deg, #fffaf3 0%, #f4efff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <section
          style={{
            background: "rgba(255,255,255,0.92)",
            borderRadius: 28,
            padding: 28,
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 54, marginBottom: 10 }}>🐣</div>

          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#7b61ff",
              marginBottom: 8,
            }}
          >
            너의 캐릭터가 태어났어
          </p>

          <h1
            style={{
              fontSize: 34,
              lineHeight: 1.2,
              margin: 0,
              marginBottom: 12,
              color: "#241b44",
            }}
          >
            {typeName}
          </h1>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "#5b5370",
              marginBottom: 14,
            }}
          >
            {summary}
          </p>

          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "#6b637f",
              marginBottom: 24,
            }}
          >
            {deepSummary}
          </p>

          <div
            style={{
              padding: 24,
              borderRadius: 24,
              background: "linear-gradient(135deg, #f6f1ff, #fff8ef)",
              border: "1px solid #ece3ff",
              marginBottom: 18,
            }}
          >
            <CharacterMini base={characterBase} />

            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 14,
                  color: "#7b7391",
                  marginBottom: 8,
                }}
              >
                캐릭터 이름 짓기
              </div>

              <input
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="이 캐릭터의 이름을 입력해줘"
                style={{
                  width: "100%",
                  maxWidth: 240,
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #ddd3ff",
                  fontSize: 15,
                  textAlign: "center",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 18,
                fontWeight: 800,
                color: "#2d214d",
              }}
            >
              {characterName || "이름 없는 캐릭터"}
            </div>
          </div>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "#6f6786",
              margin: 0,
            }}
          >
            이건 아직 초기 모습이야.
            <br />
            더 이야기하면 캐릭터도, 그래프도 더 또렷해질 거야.
          </p>
        </section>

        <section
          style={{
            background: "rgba(255,255,255,0.92)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 13,
              fontWeight: 700,
              color: "#7b61ff",
            }}
          >
            너에 대한 해석
          </p>

          <h2
            style={{
              margin: "0 0 14px",
              fontSize: 24,
              color: "#241b44",
            }}
          >
            {analysisTitle}
          </h2>

          <p
            style={{
              fontSize: 15,
              lineHeight: 1.85,
              color: "#554c6d",
              marginBottom: 18,
            }}
          >
            {analysisBody}
          </p>

          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "#f7f2ff",
              border: "1px solid #ece0ff",
              marginBottom: 12,
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#6d57c8",
                marginBottom: 6,
              }}
            >
              MBTI 해석이 섞인 인상
            </div>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: "#5a5173",
              }}
            >
              {mbtiBlend}
            </div>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "#fff7ef",
              border: "1px solid #ffe4c5",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#c6843a",
                marginBottom: 6,
              }}
            >
              생년월일 기반 사주풍 해석
            </div>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: "#6a5a46",
              }}
            >
              {sajuBlend}
            </div>
          </div>
        </section>

        <section
          style={{
            background: "rgba(255,255,255,0.92)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              margin: "0 0 18px",
              fontSize: 22,
              color: "#241b44",
            }}
          >
            아이덴티티 그래프
          </h2>

          <GraphBar
            label="에너지 흐름"
            value={scores.energy}
            leftLabel="혼자 충전형"
            rightLabel="사람 속 활성형"
          />
          <GraphBar
            label="판단 방식"
            value={scores.logic}
            leftLabel="감각 직진형"
            rightLabel="구조 설계형"
          />
          <GraphBar
            label="감정 표현"
            value={scores.emotion}
            leftLabel="잔잔한 내면형"
            rightLabel="바깥 표출형"
          />
          <GraphBar
            label="관계 스타일"
            value={scores.social}
            leftLabel="선택적 깊이형"
            rightLabel="넓은 연결형"
          />
        </section>

        <section
          style={{
            background: "rgba(255,255,255,0.92)",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              margin: "0 0 18px",
              fontSize: 22,
              color: "#241b44",
            }}
          >
            취향 분석표
          </h2>

          <GraphBar
            label="취향 감도"
            value={scores.taste}
            leftLabel="담백"
            rightLabel="디테일 집착"
          />
          <GraphBar
            label="새로운 자극 선호"
            value={scores.adventure}
            leftLabel="안정 선호"
            rightLabel="탐험 선호"
          />
          <GraphBar
            label="표현 취향"
            value={scores.expression}
            leftLabel="미니멀"
            rightLabel="포인트 강조"
          />
          <GraphBar
            label="몰입 방식"
            value={scores.immersion}
            leftLabel="천천히 스며듦"
            rightLabel="빠르게 꽂힘"
          />
        </section>

        <div style={{ display: "grid", gap: 12 }}>
          <Link
            href="/chat"
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px 20px",
              borderRadius: 18,
              background: "#7b61ff",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            계속 대화하기
          </Link>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px 20px",
              borderRadius: 18,
              background: "#f4efff",
              color: "#564d6b",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            처음으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>결과를 불러오는 중...</div>}>
      <ResultPageInner />
    </Suspense>
  );
}