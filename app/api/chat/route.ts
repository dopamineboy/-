import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatRequestBody = {
  message: string;
  mbti?: string;
  birthDate?: string;
  previousResponseId?: string;
  turnCount?: number;
};

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

type RewardPayload = {
  shouldReveal: boolean;
  typeName?: string;
  summary?: string;
  deepSummary?: string;
  characterBase?: string;
  identityScores?: IdentityScores;
  analysisTitle?: string;
  analysisBody?: string;
  mbtiBlend?: string;
  sajuBlend?: string;
};

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function fallbackByMbti(mbti?: string) {
  const map: Record<
    string,
    {
      typeName: string;
      summary: string;
      deepSummary: string;
      characterBase: string;
      identityScores: IdentityScores;
      analysisTitle: string;
      analysisBody: string;
      mbtiBlend: string;
      sajuBlend: string;
    }
  > = {
    INTJ: {
      typeName: "조용한 설계자",
      summary:
        "겉은 차분하지만 안쪽에서는 계속 구조를 만들고 방향을 설계하는 사람.",
      deepSummary:
        "너는 감정의 흐름에 바로 반응하기보다, 먼저 방향과 구조를 잡아야 마음이 놓이는 편으로 읽혀. 대화가 길어질수록 즉흥적으로 흔들리기보다 자신만의 기준을 세우고 그 안에서 판단하려는 결이 더 분명해졌어.",
      characterBase: "planner",
      identityScores: {
        energy: 28,
        logic: 88,
        emotion: 40,
        social: 32,
        taste: 72,
        adventure: 48,
        expression: 35,
        immersion: 84,
      },
      analysisTitle: "차분하게 전체 판을 읽는 타입",
      analysisBody:
        "처음에는 담백하고 절제된 인상인데, 대화를 깊게 할수록 네 안쪽에는 생각의 구조를 세우려는 힘이 꽤 분명하게 보여. 너는 단순히 조용한 사람이 아니라, 무엇을 믿고 어떤 방향으로 움직일지를 스스로 설계해야 안정감을 느끼는 타입에 가까워 보여. 겉으로는 흔들리지 않아 보여도, 사실은 안에서 많은 계산과 정리를 거친 뒤 움직이는 편이야.",
      mbtiBlend:
        "MBTI 흐름으로 보면 전략성과 구조 감각이 살아 있어. 다만 전형적인 차가움보다는, 확신이 설 때만 에너지를 쓰는 방식에 더 가까워 보여. 즉 사람을 밀어내기보다, 기준 없는 흐름을 불편해하는 쪽이 더 맞아.",
      sajuBlend:
        "생년월일을 바탕으로 한 사주풍 해석으로 보면, 바깥 자극에 즉각 흔들리기보다 안쪽에서 흐름을 정리한 뒤 힘을 내는 기운이 느껴져. 크게 튀기보다 축적과 정리를 통해 힘이 붙는 결이 있어서, 한 번 자기 리듬이 만들어지면 의외로 추진력도 강해지는 타입으로 읽을 수 있어.",
    },
    ENFP: {
      typeName: "감각의 탐험가",
      summary:
        "설렘과 가능성을 따라 움직이며 분위기와 감정을 빠르게 감지하는 사람.",
      deepSummary:
        "너는 대화가 쌓일수록 생각보다 더 빠르게 가능성을 열고, 감정과 분위기의 미세한 결을 잘 감지하는 사람처럼 보여. 머리로만 판단하기보다 직접 느끼고 반응하면서 자신의 방향을 찾는 타입에 가까워.",
      characterBase: "explorer",
      identityScores: {
        energy: 82,
        logic: 46,
        emotion: 78,
        social: 84,
        taste: 76,
        adventure: 86,
        expression: 80,
        immersion: 68,
      },
      analysisTitle: "가능성과 감각을 빠르게 여는 타입",
      analysisBody:
        "처음에는 밝고 가볍게 열리는 인상이지만, 대화를 길게 가져갈수록 네 안쪽에는 생각보다 더 섬세한 감정 안테나가 있는 것처럼 느껴졌어. 너는 단순히 활발한 사람이 아니라, 살아 있는 흐름 속에서 의미와 재미를 찾는 쪽에 가까워 보여. 정지된 답보다 움직이는 가능성에서 더 많은 에너지를 얻는 사람처럼 읽혀.",
      mbtiBlend:
        "MBTI 결로 보면 활력, 확장성, 호기심 쪽의 흐름이 자연스럽게 드러나. 하지만 가볍기만 한 타입이라기보다, 감정과 사람의 온도를 빠르게 감지하면서 자신의 몰입 지점을 찾아가는 편에 가까워 보여.",
      sajuBlend:
        "생년월일을 바탕으로 한 사주풍 해석으로 보면, 머무르기보다 움직이며 감각을 확인하는 기운이 비교적 강한 편으로 읽혀. 정적인 고정보다 순환과 변화 속에서 자기 리듬이 살아나는 흐름을 가진 타입으로 볼 수 있어.",
    },
    INFP: {
      typeName: "내면의 수집가",
      summary:
        "겉보다 안쪽 결이 더 풍부하고, 감정과 의미를 오래 품는 사람.",
      deepSummary:
        "짧게 보면 조용하고 부드러운 인상인데, 대화를 깊게 할수록 너는 단순히 예민한 사람이 아니라 의미와 감정을 오래 붙잡고 안쪽에서 해석하는 힘이 강한 사람처럼 보여. 반응보다 여운이 더 큰 타입이야.",
      characterBase: "dreamer",
      identityScores: {
        energy: 30,
        logic: 44,
        emotion: 90,
        social: 34,
        taste: 88,
        adventure: 55,
        expression: 52,
        immersion: 86,
      },
      analysisTitle: "겉보다 안쪽이 훨씬 깊은 타입",
      analysisBody:
        "대화를 길게 이어가면서 느낀 건, 너는 단순히 조용하거나 감성적인 사람이 아니라 안쪽에서 감정과 의미를 오래 품고 정리하는 힘이 크다는 점이야. 겉으로 크게 드러나지 않아도, 안에서는 훨씬 많은 결이 움직이고 있는 타입처럼 보여. 그래서 네 반응은 종종 느려 보여도, 사실은 얕지 않고 밀도가 높은 편이야.",
      mbtiBlend:
        "MBTI 결로 보면 감정과 의미 중심의 흐름이 살아 있어. 다만 단순히 여린 타입이라기보다, 자기 안쪽 기준과 취향을 오래 붙잡는 방향성도 꽤 뚜렷하게 느껴져.",
      sajuBlend:
        "생년월일 기반 사주풍 해석으로는 감각을 바깥으로 강하게 분출하기보다 내면에서 숙성시키는 기운이 비교적 강한 편으로 볼 수 있어. 빠른 판단보다 오래 스며드는 해석이 더 잘 맞는 흐름이야.",
    },
  };

  return (
    map[mbti || ""] || {
      typeName: "깨어나는 관찰자",
      summary: "대화를 통해 천천히 자기만의 결을 드러내는 사람.",
      deepSummary:
        "처음에는 선명하게 보이지 않지만, 대화가 길어질수록 오히려 더 또렷해지는 타입이야. 한 번에 자신을 설명하기보다, 천천히 결이 드러나는 흐름을 가지고 있어.",
      characterBase: "observer",
      identityScores: {
        energy: 50,
        logic: 50,
        emotion: 50,
        social: 50,
        taste: 50,
        adventure: 50,
        expression: 50,
        immersion: 50,
      },
      analysisTitle: "한 번에 드러나기보다 서서히 보이는 타입",
      analysisBody:
        "너는 대화를 길게 할수록 더 읽히는 사람처럼 느껴졌어. 첫인상보다 실제 결이 더 천천히 드러나는 편이고, 겉의 반응보다 안쪽의 방향이 더 중요한 타입으로 보여.",
      mbtiBlend:
        "MBTI는 하나의 힌트였고, 실제 대화에서는 그보다 더 입체적인 결이 보였어.",
      sajuBlend:
        "생년월일을 바탕으로 보면 바깥 자극보다 내 해석과 내 리듬을 중심에 두는 기운이 느껴지는 편이야.",
    }
  );
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY가 설정되지 않았어." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as ChatRequestBody;
    const {
      message,
      mbti,
      birthDate,
      previousResponseId,
      turnCount = 0,
    } = body;

    if (!message || !message.trim()) {
      return Response.json(
        { error: "message는 비어 있을 수 없어." },
        { status: 400 }
      );
    }

    const instructions = `
너는 '바이브코딩'의 AI 캐릭터다.
사용자의 MBTI는 ${mbti || "미입력"}이고 생년월일은 ${birthDate || "미입력"}이다.
친구처럼 자연스럽게 대화하되, 사용자를 시험하는 말투는 쓰지 마라.
답변은 너무 길지 않게 하고 다음 대화를 이어갈 수 있는 질문으로 끝내라.
중간중간 사용자의 결을 읽은 듯한 짧은 관찰 표현을 섞어도 좋다.

결과 분석 시 주의:
- MBTI는 출발점일 뿐, 실제 대화 인상으로 보정해라.
- 생년월일은 정통 사주 계산이 아니라 "사주풍 해석 톤"으로만 사용해라.
- 단정적 예언처럼 말하지 말고 분위기/에너지/기질 해석 수준으로 작성해라.
`;

    const shouldReveal = turnCount >= 11;

    if (!shouldReveal) {
      const response = await client.responses.create({
        model: "gpt-4.1",
        previous_response_id: previousResponseId || undefined,
        instructions,
        input: message,
      });

      const assistantMessage =
        response.output_text?.trim() ||
        "지금은 답을 정리하는 데 실패했어. 한 번만 다시 말해줄래?";

      let eggStage = 1;
      if (turnCount >= 4) eggStage = 2;
      if (turnCount >= 8) eggStage = 3;

      return Response.json({
        assistantMessage,
        characterState: {
          eggStage,
        },
        reward: {
          shouldReveal: false,
        },
        responseId: response.id,
      });
    }

    const rewardPrompt = `
사용자 마지막 메시지:
${message}

사용자 MBTI: ${mbti || "미입력"}
사용자 생년월일: ${birthDate || "미입력"}
대화는 최소 10턴 이상 진행된 상태라고 가정하고, 충분히 쌓인 인상으로 해석해라.

반드시 JSON만 반환해:
{
  "assistantMessage": string,
  "typeName": string,
  "summary": string,
  "deepSummary": string,
  "characterBase": "planner" | "explorer" | "guardian" | "dreamer" | "observer",
  "analysisTitle": string,
  "analysisBody": string,
  "mbtiBlend": string,
  "sajuBlend": string,
  "identityScores": {
    "energy": number,
    "logic": number,
    "emotion": number,
    "social": number,
    "taste": number,
    "adventure": number,
    "expression": number,
    "immersion": number
  }
}

조건:
- assistantMessage는 결과 직전의 짧은 한 줄.
- summary는 짧은 요약.
- deepSummary는 2~3문장 정도로 더 자세한 요약.
- analysisBody는 최소 4문장 이상, 대화 인상 + MBTI + 생년월일 기반 분위기 해석이 자연스럽게 섞인 설명.
- mbtiBlend는 최소 2문장.
- sajuBlend는 최소 2문장.
- identityScores는 실제 대화 인상으로 보정된 값처럼 보여야 하며 모두 0~100 정수.
- 결과는 너무 검사표처럼 딱딱하지 말고, 누군가를 읽어주는 느낌으로 써라.
`;

    const rewardResponse = await client.responses.create({
      model: "gpt-4.1",
      previous_response_id: previousResponseId || undefined,
      instructions,
      input: rewardPrompt,
    });

    const raw = rewardResponse.output_text?.trim() || "";
    const fallback = fallbackByMbti(mbti);

    let parsed: RewardPayload & { assistantMessage?: string } = {
      shouldReveal: true,
      typeName: fallback.typeName,
      summary: fallback.summary,
      deepSummary: fallback.deepSummary,
      characterBase: fallback.characterBase,
      identityScores: fallback.identityScores,
      analysisTitle: fallback.analysisTitle,
      analysisBody: fallback.analysisBody,
      mbtiBlend: fallback.mbtiBlend,
      sajuBlend: fallback.sajuBlend,
      assistantMessage: "이제 네 캐릭터가 꽤 또렷하게 보이기 시작했어.",
    };

    try {
      const json = JSON.parse(raw);

      parsed = {
        shouldReveal: true,
        typeName: json.typeName || fallback.typeName,
        summary: json.summary || fallback.summary,
        deepSummary: json.deepSummary || fallback.deepSummary,
        characterBase: json.characterBase || fallback.characterBase,
        analysisTitle: json.analysisTitle || fallback.analysisTitle,
        analysisBody: json.analysisBody || fallback.analysisBody,
        mbtiBlend: json.mbtiBlend || fallback.mbtiBlend,
        sajuBlend: json.sajuBlend || fallback.sajuBlend,
        assistantMessage:
          json.assistantMessage || "이제 네 캐릭터가 꽤 또렷하게 보이기 시작했어.",
        identityScores: {
          energy: clamp(json.identityScores?.energy ?? fallback.identityScores.energy),
          logic: clamp(json.identityScores?.logic ?? fallback.identityScores.logic),
          emotion: clamp(json.identityScores?.emotion ?? fallback.identityScores.emotion),
          social: clamp(json.identityScores?.social ?? fallback.identityScores.social),
          taste: clamp(json.identityScores?.taste ?? fallback.identityScores.taste),
          adventure: clamp(json.identityScores?.adventure ?? fallback.identityScores.adventure),
          expression: clamp(json.identityScores?.expression ?? fallback.identityScores.expression),
          immersion: clamp(json.identityScores?.immersion ?? fallback.identityScores.immersion),
        },
      };
    } catch {
      parsed = {
        shouldReveal: true,
        typeName: fallback.typeName,
        summary: fallback.summary,
        deepSummary: fallback.deepSummary,
        characterBase: fallback.characterBase,
        identityScores: fallback.identityScores,
        analysisTitle: fallback.analysisTitle,
        analysisBody: fallback.analysisBody,
        mbtiBlend: fallback.mbtiBlend,
        sajuBlend: fallback.sajuBlend,
        assistantMessage: "이제 네 캐릭터가 꽤 또렷하게 보이기 시작했어.",
      };
    }

    return Response.json({
      assistantMessage: parsed.assistantMessage,
      characterState: {
        eggStage: 3,
      },
      reward: {
        shouldReveal: true,
        typeName: parsed.typeName,
        summary: parsed.summary,
        deepSummary: parsed.deepSummary,
        characterBase: parsed.characterBase,
        identityScores: parsed.identityScores,
        analysisTitle: parsed.analysisTitle,
        analysisBody: parsed.analysisBody,
        mbtiBlend: parsed.mbtiBlend,
        sajuBlend: parsed.sajuBlend,
      },
      responseId: rewardResponse.id,
    });
  } catch (error) {
    console.error("chat api error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "채팅 처리 중 오류가 발생했어.",
      },
      { status: 500 }
    );
  }
}