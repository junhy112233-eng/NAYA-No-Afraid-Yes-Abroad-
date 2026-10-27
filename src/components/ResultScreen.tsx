import React, { useEffect } from 'react';
import { Mission, MISSIONS } from '../data/missions';
import { PixelCharacter } from './PixelCharacter';
import { EvaluationResult } from '../utils/speechEvaluation';
import { speakSentence, play8BitFanfare, play8BitBlip } from '../utils/audio';

export interface PracticeHistoryItem {
  mission: Mission;
  evaluation?: EvaluationResult;
  skipped?: boolean;
}

interface ResultScreenProps {
  history: PracticeHistoryItem[];
  onRetryDifficult: () => void;
  onRestartAll: () => void;
  onBackToHome: () => void;
  onSelectMission: (index: number) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  history,
  onRetryDifficult,
  onRestartAll,
  onBackToHome,
  onSelectMission,
}) => {
  useEffect(() => {
    play8BitFanfare();
  }, []);

  const totalPracticed = history.filter((h) => !h.skipped).length;
  const successfulCount = history.filter((h) => h.evaluation?.isSuccess || h.evaluation?.isIntelligible).length;

  // Star calculation according to Section 6: Reward completion, not accuracy!
  // ⭐⭐⭐ Finished all and spoke many directions clearly
  // ⭐⭐ Practiced most missions
  // ⭐ Finished the whole dialogue
  const starsCount =
    successfulCount >= 8 ? 3 : totalPracticed >= 5 ? 2 : 1;

  const handlePlayModel = (sentence: string) => {
    play8BitBlip();
    speakSentence(sentence, 0.9);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white select-none">
      {/* Retro Confetti / Header Banner */}
      <header className="p-6 bg-[#312e81] border-b-4 border-black text-center relative overflow-hidden">
        {/* Retro pixel confetti particles */}
        <div className="absolute inset-0 pointer-events-none flex justify-around">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="text-lg animate-bounce"
              style={{
                animationDuration: `${1 + (i % 5) * 0.3}s`,
                animationDelay: `${(i % 4) * 0.2}s`,
              }}
            >
              {['✨', '⭐', '🎉', '🎊', '💛'][i % 5]}
            </span>
          ))}
        </div>

        {/* Celebrating Naya */}
        <div className="relative z-10 flex flex-col items-center">
          <PixelCharacter mood="happy" size={72} className="mb-2" />
          <h1 className="font-pixel text-2xl sm:text-3xl text-yellow-300 drop-shadow-[3px_3px_0_#000]">
            CORRECT DIRECTION! 🎉
          </h1>
          <p className="text-xs sm:text-sm font-pixel text-emerald-300 mt-1">
            대화 완주 성공! 해외에서 길 찾기 문제 없어요!
          </p>
          <div className="mt-3 bg-black/40 border border-yellow-400/40 px-3 py-1 text-xs font-pixel text-yellow-200">
            PRACTICED: {totalPracticed} / {MISSIONS.length} EXPRESSIONS
          </div>
        </div>
      </header>

      {/* Main Review Section */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col justify-between">
        {/* Star Rating Card */}
        <div className="bg-[#1f2937] border-4 border-black p-4 text-center shadow-[6px_6px_0_#000] mb-4">
          <span className="text-[10px] font-pixel text-zinc-400 block mb-1">
            MISSION COMPLETION REWARD:
          </span>
          <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl my-2">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`transition-transform duration-300 ${
                  i < starsCount ? 'text-yellow-400 scale-110 drop-shadow-[2px_2px_0_#000]' : 'text-zinc-600'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="font-pixel text-xs text-yellow-300 mt-1">
            {starsCount === 3
              ? '⭐⭐⭐ Super Navigator! Excellent directions!'
              : starsCount === 2
              ? '⭐⭐ Great Explorer! Almost got all directions!'
              : '⭐ Awesome Effort! Finished the whole dialogue!'}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            “You&apos;re getting better! One more try?” (점점 좋아지고 있어요! 한 번 더 해볼까요?)
          </p>
        </div>

        {/* Expressions Review List */}
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[45vh] pr-1">
          <div className="text-[10px] font-pixel text-zinc-400 uppercase tracking-wider">
            DETAILED EXPRESSIONS SUMMARY:
          </div>

          {history.map((item, idx) => {
            const isSuccess = item.evaluation?.isSuccess;
            const isIntelligible = item.evaluation?.isIntelligible;

            return (
              <div
                key={item.mission.id}
                className={`border-2 border-black p-3 shadow-[3px_3px_0_#000] ${
                  item.skipped
                    ? 'bg-zinc-800 opacity-60'
                    : isSuccess
                    ? 'bg-emerald-950/70 border-emerald-500'
                    : isIntelligible
                    ? 'bg-sky-950/70 border-sky-400'
                    : 'bg-amber-950/70 border-amber-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-pixel text-[9px] text-yellow-300">
                    #{item.mission.id} {item.mission.locationName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-pixel">
                      {item.skipped
                        ? '⏭️ SKIPPED'
                        : isSuccess
                        ? '⭐ UNDERSTOOD'
                        : isIntelligible
                        ? '💡 GOOD'
                        : '🔄 NEEDS PRACTICE'}
                    </span>
                    <button
                      onClick={() => handlePlayModel(item.mission.targetSentence)}
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-[8px] px-2 py-0.5 border border-black shadow-[1px_1px_0_#000]"
                      title="Listen model sentence again"
                    >
                      🔊 Listen Again
                    </button>
                  </div>
                </div>

                {/* Target Sentence with Key Expressions in Bold */}
                <div className="text-sm text-white font-medium">
                  {item.mission.targetSentence.split(' ').map((word, wIdx) => {
                    const cleanW = word.toLowerCase().replace(/[^a-z-]/g, '');
                    const isKey = item.mission.keyWords.some((kw) =>
                      kw.toLowerCase().split(' ').includes(cleanW)
                    );
                    return (
                      <span
                        key={wIdx}
                        className={`mr-1 ${isKey ? 'font-black text-yellow-300 underline' : 'text-zinc-200'}`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>

                <div className="text-xs text-zinc-400 mt-0.5">
                  뜻: {item.mission.koreanMeaning}
                </div>

                {/* Friendly hint if missing words */}
                {item.evaluation?.hasSmallWordMissing && item.evaluation.missingSmallWordName && (
                  <div className="mt-1.5 text-xs text-amber-300 bg-black/40 p-1 border-l-2 border-amber-400">
                    💡 Tip: 다음에는 &ldquo;{item.evaluation.missingSmallWordName}&rdquo;를 넣어 완전한 문장으로 말해 보세요!
                  </div>
                )}

                {/* Retry single item button */}
                <div className="mt-2 pt-1 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => onSelectMission(idx)}
                    className="text-[9px] font-pixel text-sky-300 hover:text-sky-200 underline"
                  >
                    Practice this mission again ↺
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t-2 border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            onClick={onRetryDifficult}
            className="w-full sm:flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-black font-pixel text-xs font-bold border-2 border-black shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            🔄 Try Again (복습하기)
          </button>

          <button
            onClick={onRestartAll}
            className="w-full sm:flex-1 py-3 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-xs font-bold border-2 border-black shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            🎯 Practice All Again
          </button>

          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto py-3 px-4 bg-zinc-700 hover:bg-zinc-600 text-white font-pixel text-xs border-2 border-black shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            🏠 Back to Map
          </button>
        </div>
      </main>
    </div>
  );
};
