import React, { useState } from 'react';
import { MISSIONS, VOCABULARY_LIST } from '../data/missions';
import { speakSentence } from '../utils/audio';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMission?: (index: number) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSelectMission,
}) => {
  const [activeTab, setActiveTab] = useState<'dialogues' | 'vocab'>('dialogues');
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handlePlay = (text: string, idx: number, rate: number = 0.9) => {
    setPlayingIndex(idx);
    speakSentence(
      text,
      rate,
      undefined,
      () => setPlayingIndex(null)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#f8fafc] border-4 border-black shadow-[8px_8px_0_#000] flex flex-col overflow-hidden">
        {/* Retro Header */}
        <div className="bg-[#4338ca] text-white p-3 border-b-4 border-black flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <div>
              <h2 className="font-pixel text-xs sm:text-sm font-bold text-yellow-300">
                TRAVEL ENGLISH STUDY GUIDE
              </h2>
              <p className="text-[10px] text-indigo-200">
                해외 여행 길 찾기 핵심 대화 & 단어장
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-red-500 hover:bg-red-600 border-2 border-black text-white font-pixel text-xs flex items-center justify-center shadow-[2px_2px_0_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-4 border-black bg-zinc-200">
          <button
            onClick={() => setActiveTab('dialogues')}
            className={`flex-1 py-2.5 font-pixel text-xs border-r-2 border-black transition-colors ${
              activeTab === 'dialogues'
                ? 'bg-yellow-400 text-black font-bold shadow-inner'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            💬 10 Practice Missions
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex-1 py-2.5 font-pixel text-xs transition-colors ${
              activeTab === 'vocab'
                ? 'bg-yellow-400 text-black font-bold shadow-inner'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            📖 Direction Words
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'dialogues' ? (
            <div className="space-y-3">
              {MISSIONS.map((m, idx) => (
                <div
                  key={m.id}
                  className="bg-white border-2 border-black p-3 shadow-[3px_3px_0_#000] hover:bg-amber-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="bg-blue-600 text-white font-pixel text-[9px] px-2 py-0.5 border border-black">
                      Mission #{m.id}: {m.locationName}
                    </span>
                    {onSelectMission && (
                      <button
                        onClick={() => {
                          onSelectMission(idx);
                          onClose();
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-pixel text-[8px] px-2 py-1 border border-black shadow-[2px_2px_0_#000]"
                      >
                        Practice This 🎯
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-zinc-600 mb-1">
                    <span className="font-bold text-purple-700">Partner:</span> {m.partner}
                  </div>

                  <div className="text-sm font-bold text-zinc-900 mb-1">
                    <span className="text-blue-700 font-pixel text-xs">You:</span>{' '}
                    <span>{m.targetSentence}</span>
                  </div>

                  <div className="text-xs text-zinc-500 mb-2">
                    뜻: {m.koreanMeaning}
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-200">
                    <span className="text-[10px] text-zinc-400 font-pixel">KEY WORDS:</span>
                    <div className="flex flex-wrap gap-1">
                      {m.keyWords.map((kw, i) => (
                        <span
                          key={i}
                          className="bg-yellow-200 text-zinc-800 border border-black px-1.5 py-0.2 text-[9px] font-bold"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    <div className="ml-auto flex gap-1">
                      <button
                        onClick={() => handlePlay(m.targetSentence, idx, 0.9)}
                        disabled={playingIndex === idx}
                        className="bg-sky-400 hover:bg-sky-500 border border-black px-2 py-0.5 text-[9px] font-pixel text-black shadow-[1px_1px_0_#000]"
                      >
                        🔊 Listen
                      </button>
                      <button
                        onClick={() => handlePlay(m.targetSentence, idx, 0.7)}
                        disabled={playingIndex === idx}
                        className="bg-amber-300 hover:bg-amber-400 border border-black px-2 py-0.5 text-[9px] font-pixel text-black shadow-[1px_1px_0_#000]"
                      >
                        🐢 Slow
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VOCABULARY_LIST.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-black p-3 shadow-[3px_3px_0_#000]"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-blue-900 text-sm">{v.english}</h3>
                    <button
                      onClick={() => handlePlay(v.english, 100 + idx, 0.8)}
                      className="bg-yellow-300 hover:bg-yellow-400 border border-black px-1.5 py-0.5 text-[9px] font-pixel shadow-[1px_1px_0_#000]"
                    >
                      🔊
                    </button>
                  </div>
                  <div className="text-xs font-bold text-amber-700 mb-2">
                    {v.korean}
                  </div>
                  <div className="text-xs bg-zinc-50 border border-zinc-200 p-1.5 text-zinc-700">
                    <div className="font-semibold">{v.example}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{v.meaning}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-zinc-100 p-3 border-t-4 border-black flex justify-between items-center">
          <span className="text-[10px] text-zinc-500">
            총 10개 해외 여행 필수 길 찾기 표현 수록
          </span>
          <button
            onClick={onClose}
            className="bg-yellow-400 hover:bg-yellow-500 border-2 border-black px-4 py-1.5 font-pixel text-xs text-black font-bold shadow-[2px_2px_0_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            Close 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
