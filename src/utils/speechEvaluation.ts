import { Mission } from '../data/missions';

export interface EvaluationResult {
  isSuccess: boolean;
  isIntelligible: boolean;
  hasSmallWordMissing: boolean;
  missingSmallWordName?: string;
  missingKeyWords: string[];
  matchedWords: string[];
  allTargetWords: { word: string; matched: boolean; isKey: boolean; isSmall: boolean }[];
  englishFeedback: string;
  koreanFeedback: string;
  attemptNumber: number;
}

export function cleanWord(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
    .trim();
}

export function evaluateSpeechLocally(
  mission: Mission,
  spokenText: string,
  attemptNumber: number
): EvaluationResult {
  const cleanSpoken = cleanWord(spokenText);

  // If no speech recognized
  if (!cleanSpoken) {
    return {
      isSuccess: false,
      isIntelligible: false,
      hasSmallWordMissing: false,
      missingKeyWords: mission.keyWords,
      matchedWords: [],
      allTargetWords: mission.targetSentence.split(/\s+/).map((w) => ({
        word: w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ''),
        matched: false,
        isKey: mission.keyWords.some((kw) => kw.toLowerCase().includes(cleanWord(w))),
        isSmall: ['a', 'the', 'please', 'at', 'in', 'to', 'across', 'past'].includes(cleanWord(w)),
      })),
      englishFeedback: "That's okay! Let's try again. Tap the microphone and say it aloud.",
      koreanFeedback: `(괜찮아요! 다시 해 봐요. 마이크를 누르고 "${mission.koreanMeaning}"라고 말해 보세요.)`,
      attemptNumber,
    };
  }

  const spokenWords = cleanSpoken.split(/\s+/);
  const targetWordsRaw = mission.targetSentence.split(/\s+/);

  const allTargetWords = targetWordsRaw.map((rawWord) => {
    const wordClean = cleanWord(rawWord);
    const matched = spokenWords.includes(wordClean);
    const isKey = mission.keyWords.some((kw) =>
      kw.toLowerCase().split(/\s+/).includes(wordClean)
    );
    const isSmall = ['a', 'the', 'please', 'at', 'in', 'to', 'and', 'it', 'is'].includes(wordClean);
    return {
      word: rawWord,
      matched,
      isKey,
      isSmall,
    };
  });

  // Check key words match
  const missingKeyWords = mission.keyWords.filter((kw) => {
    const parts = kw.toLowerCase().split(/\s+/);
    return !parts.every((p) => cleanSpoken.includes(p));
  });

  // Check small words match
  const missingSmallWords = mission.smallWords.filter((sw) => {
    return !cleanSpoken.split(/\s+/).includes(sw.toLowerCase());
  });

  const matchedWords = spokenWords.filter((sw) =>
    targetWordsRaw.some((tw) => cleanWord(tw) === sw)
  );

  const matchedKeyWordRatio =
    (mission.keyWords.length - missingKeyWords.length) / Math.max(1, mission.keyWords.length);

  // Direction is intelligible if main key words are spoken
  const isIntelligible = missingKeyWords.length === 0 || matchedKeyWordRatio >= 0.7;
  const hasSmallWordMissing = isIntelligible && missingSmallWords.length > 0;
  const isSuccess = isIntelligible && missingSmallWords.length === 0;

  let englishFeedback = '';
  let koreanFeedback = '';

  if (isSuccess) {
    englishFeedback = 'Great job! I understood your directions clearly.';
    koreanFeedback = '(잘했어요! 길 안내를 명확하게 이해했어요.)';
  } else if (hasSmallWordMissing) {
    const missingWord = missingSmallWords[0];
    englishFeedback = `Nice job! I understood you. Try adding "${missingWord}": "${mission.targetSentence}"`;
    koreanFeedback = `(잘했어요! 의미는 이해했어요. ${missingWord}를 넣어 완전한 문장으로 말해 볼까요?)`;
  } else {
    // Failure hierarchy based on attempt number
    if (attemptNumber === 1) {
      // 1st attempt: Recast
      englishFeedback = `Good try! You can say, "${mission.targetSentence}"`;
      koreanFeedback = `(잘 시도했어요! 이렇게 말해 볼까요? "${mission.koreanMeaning}")`;
    } else if (attemptNumber === 2) {
      // 2nd attempt: Elicitation
      englishFeedback = `You're getting closer! Try "${mission.firstLetterHint}"`;
      koreanFeedback = `(점점 좋아지고 있어요! 첫 글자 힌트를 떠올려 방향을 말해 보세요.)`;
    } else {
      // 3rd attempt+: Chunking
      englishFeedback = `Good effort! Let's say it in small parts: "${mission.chunks[0]}" / "${mission.chunks[1]}"`;
      koreanFeedback = `(잘 노력했어요! 짧은 부분으로 나눠서 말해 봐요.)`;
    }
  }

  return {
    isSuccess,
    isIntelligible,
    hasSmallWordMissing,
    missingSmallWordName: missingSmallWords[0],
    missingKeyWords,
    matchedWords,
    allTargetWords,
    englishFeedback,
    koreanFeedback,
    attemptNumber,
  };
}

export async function getFeedbackWithGeminiFallback(
  mission: Mission,
  spokenText: string,
  attemptNumber: number
): Promise<EvaluationResult> {
  const localEval = evaluateSpeechLocally(mission, spokenText, attemptNumber);

  // If spokenText is empty, always use fast local evaluation
  if (!spokenText.trim()) {
    return localEval;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout for fast UI responsiveness

    const res = await fetch('/api/gemini/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetSentence: mission.targetSentence,
        spokenText,
        attemptNumber,
        partnerQuestion: mission.partner,
        keyWords: mission.keyWords,
        koreanMeaning: mission.koreanMeaning,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.source === 'gemini' && data.data) {
        const gData = data.data;
        return {
          ...localEval,
          isSuccess: Boolean(gData.isUnderstood && (!gData.missingSmallWords || gData.missingSmallWords.length === 0)),
          isIntelligible: Boolean(gData.isUnderstood),
          englishFeedback: gData.englishFeedback || localEval.englishFeedback,
          koreanFeedback: gData.koreanFeedback || localEval.koreanFeedback,
        };
      }
    }
  } catch (err) {
    // Network / timeout / offline fallback silently to local rule-based feedback
  }

  return localEval;
}
