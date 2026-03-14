"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [isCracked, setIsCracked] = useState(false);

  const handleEggClick = () => {
    setIsCracked(true);
    setTimeout(() => {
      setIsCracked(false);
    }, 900);
  };

  return (
    <main className="poster-page">
      <section className="poster-center">
        <div className="egg-stage">
          <div className="egg-glow" />

          <button
            type="button"
            className={`floating-egg-button ${isCracked ? "active" : ""}`}
            onClick={handleEggClick}
            aria-label="알 흔들기"
          >
            <div className={`floating-egg ${isCracked ? "active" : ""}`}>
              <span className="egg-highlight" />
              <span className="egg-crack crack-1" />
              <span className="egg-crack crack-2" />
              <span className="egg-crack crack-3" />
            </div>
          </button>

          <div className="egg-shadow" />
        </div>

        <h1 className="poster-title">너에 대해 알고싶어!</h1>

        <div className="chat-bubble bubble-left">
          너와의 대화를 통해
          <br />
          <strong>너만의 캐릭터가 탄생해.</strong>
        </div>

        <div className="chat-bubble bubble-right">
          너의 취향대로 성장하는 캐릭터를
          <br />
          만나러 가볼까?
        </div>

        <Link href="/onboarding" className="poster-button">
          대화 시작하기
        </Link>
      </section>
    </main>
  );
}