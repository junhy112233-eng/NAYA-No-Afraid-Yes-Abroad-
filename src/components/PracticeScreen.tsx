import React, { useState, useEffect, useRef } from 'react';
import { Mission } from '../data/missions';
import { PixelCharacter } from './PixelCharacter';
import { PixelMiniMap } from './PixelMiniMap';
import { PixelMicButton, MicState } from './PixelMicButton';
import { speakSentence, stopSpeaking, play8BitBlip, play8BitSuccess, play8BitTryAgain } from '../utils/audio';
import { SpeechRecognitionManager, requestMicPermission } from '../utils/speechRecognition';
import { EvaluationResult, getFeedbackWithGeminiFallback } from '../utils/speechEvaluation';

interface PracticeScreenProps {
  mission: Mission;
  missionIndex: number;
  totalMissions: number;
  onNextMission: (evalResult?: EvaluationResult) => void;
  onSkipMission: () => void;
  onBackToHome: () => void;
  onOpenReview: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  mission,
  missionIndex,
  totalMissions,
  onNextMission,
  onSkipMission,
  onBackToHome,
  onOpenReview,
}) => {
  const [micState, setMicState] = useState<MicState>('ready');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [attemptCount, setAttemptCount] = useState(1);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showKeyboardInput, setShowKeyboardInput] = useState(false);
  const [keyboardText, setKeyboardText] = useState('');

  const speechManagerRef = useRef<SpeechRecognitionManager | null>(null);

  useEffect(() => {
    speechManagerRef.current = new SpeechRecognitionManager();
    return () => {
      stopSpeaking();
      speechManagerRef.current?.stop();
    };
  }, []);

  // Reset state when mission changes
  useEffect(() => {
    setMicState('ready');
    setSpokenText('');
    setKeyboardText('');
    setAttemptCount(1);
    setEvaluation(null);
    setErrorMessage(null);
    setShowKeyboardInput(false);
    stopSpeaking();
  }, [mission.id]);

  // Audio playback handler
  const handleListen = (rate: 0.9 | 0.7 = 0.9) => {
    if (micState === 'listening') {
      speechManagerRef.current?.stop();
      setMicState('ready');
    }
    setIsPlayingAudio(true);
    play8BitBlip();
    speakSentence(
      mission.targetSentence,
      rate,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handlePartnerSpeak = () => {
    if (micState === 'listening') {
      speechManagerRef.current?.stop();
      setMicState('ready');
    }
    setIsPlayingAudio(true);
    play8BitBlip();
    speakSentence(
      mission.partner,
      0.9,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  // Start Voice Recording
  const handleStartRecording = async () => {
    if (isPlayingAudio) return;
    setErrorMessage(null);
    setSpokenText('');
    setMicState('listening');
    play8BitBlip();

    try {
      await speechManagerRef.current?.start(
        (transcript, isFinal) => {
          setSpokenText(transcript);
          if (isFinal) {
            if (transcript.trim()) {
              handleProcessSpeech(transcript);
            } else {
              setMicState('ready');
              setErrorMessage('음성이 감지되지 않았습니다. 마이크 가까이에서 영어로 말씀해 보세요.');
              play8BitTryAgain();
            }
          }
        },
        (error) => {
          setErrorMessage(error);
          setMicState('ready');
          play8BitTryAgain();
        },
        () => {
          // Recognition ended
        }
      );
    } catch (e: any) {
      console.error('Error starting speech recognition:', e);
      setErrorMessage('마이크를 시작하지 못했습니다. 브라우저 마이크 권한을 확인해주세요.');
      setMicState('ready');
    }
  };

  const handleStopRecording = () => {
    speechManagerRef.current?.stop();
  };

  const handleRetryPermission = async () => {
    const perm = await requestMicPermission();
    if (perm.granted) {
      setErrorMessage(null);
      handleStartRecording();
    } else {
      setErrorMessage(perm.error || '마이크 권한을 승인해주세요.');
    }
  };

  // Process speech with Gemini API or Section 7 local fallback
  const handleProcessSpeech = async (text: string) => {
    setMicState('evaluating');
    const result = await getFeedbackWithGeminiFallback(mission, text, attemptCount);
    setEvaluation(result);
    setMicState('done');

    if (result.isSuccess || result.isIntelligible) {
      play8BitSuccess();
    } else {
      play8BitTryAgain();
    }
  };

  const handleKeyboardSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!keyboardText.trim()) return;
    setSpokenText(keyboardText.trim());
    handleProcessSpeech(keyboardText.trim());
  };

  const handleTryAgain = () => {
    play8BitBlip();
    setAttemptCount((prev) => prev + 1);
    setMicState('ready');
    setSpokenText('');
    setKeyboardText('');
    setEvaluation(null);
    setErrorMessage(null);
  };

  const handleNext = () => {
    play8BitBlip();
    onNextMission(evaluation || undefined);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-white select-none">
      {/* Top Navigation Bar */}
      <header className="p-3 bg-[#1e293b] border-b-4 border-black flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="bg-zinc-700 hover:bg-zinc-600 text-white font-pixel text-[10px] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_#000]"
        >
          ← EXIT
        </button>

        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs text-yellow-300">
            MISSION {missionIndex + 1}/{totalMissions}
          </span>
          {/* Progress bar in 8-bit blocks */}
          <div className="flex gap-1">
            {[...Array(totalMissions)].map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-3 border border-black ${
                  i < missionIndex
                    ? 'bg-emerald-500'
                    : i === missionIndex
                    ? 'bg-yellow-400 animate-pulse'
                    : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={onOpenReview}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-pixel text-[10px] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_#000]"
        >
          📖 GUIDE
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col justify-between">
        {/* --- TOP SECTION: Partner question & Mini Pixel Map --- */}
        <section className="space-y-3">
          {/* Partner Speech Bubble with Naya/Pixel avatar */}
          <div className="flex items-start gap-3 bg-[#1e293b] border-4 border-black p-3 shadow-[4px_4px_0_#000]">
            <div className="flex flex-col items-center shrink-0">
              <PixelCharacter mood={isPlayingAudio ? 'listening' : 'idle'} size={48} />
              <span className="text-[8px] font-pixel text-yellow-400 mt-1">PIXEL 🙋</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-pixel text-zinc-400">
                  A local person asks you:
                </span>
                <button
                  onClick={handlePartnerSpeak}
                  disabled={isPlayingAudio}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-[9px] font-pixel px-2 py-0.5 border border-black shadow-[1px_1px_0_#000]"
                >
                  🔊 Listen
                </button>
              </div>

              <div className="text-base sm:text-lg font-bold text-white mt-1">
                “{mission.partner}”
              </div>
              <div className="text-xs text-amber-300 mt-0.5">
                ({mission.koreanMeaning})
              </div>
            </div>
          </div>

          {/* Visual Mini Pixel Map */}
          <PixelMiniMap mission={mission} />
        </section>

        {/* --- MIDDLE SECTION: Target Sentence in LARGEST TEXT --- */}
        <section className="my-4 p-4 sm:p-5 bg-[#1e293b] border-4 border-black shadow-[6px_6px_0_#000] text-center">
          <div className="text-[10px] font-pixel text-yellow-300 tracking-wider mb-2">
            YOUR ANSWER (목표 문장):
          </div>

          {/* TARGET SENTENCE - Largest text on screen with key words in bold */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed tracking-wide">
            {mission.targetSentence.split(' ').map((word, idx) => {
              const cleanW = word.toLowerCase().replace(/[^a-z-]/g, '');
              const isKey = mission.keyWords.some((kw) =>
                kw.toLowerCase().split(' ').includes(cleanW)
              );
              return (
                <span
                  key={idx}
                  className={`inline-block mr-1.5 ${
                    isKey ? 'text-yellow-300 font-black underline decoration-yellow-400 decoration-4' : 'text-zinc-100 font-bold'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-medium">
            뜻: {mission.koreanMeaning}
          </p>

          {/* Audio Playback Controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => handleListen(0.9)}
              disabled={isPlayingAudio}
              className="bg-sky-400 hover:bg-sky-300 text-black font-pixel text-xs font-bold px-4 py-2 border-2 border-black shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform flex items-center gap-1.5"
            >
              <span>🔊</span>
              <span>Listen (보통)</span>
            </button>

            <button
              onClick={() => handleListen(0.7)}
              disabled={isPlayingAudio}
              className="bg-amber-300 hover:bg-amber-200 text-black font-pixel text-xs font-bold px-4 py-2 border-2 border-black shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform flex items-center gap-1.5"
            >
              <span>🐢</span>
              <span>Slow (천천히)</span>
            </button>
          </div>

          {/* Key Words Pill Hints */}
          <div className="mt-3 pt-3 border-t border-zinc-700 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] font-pixel text-zinc-400">KEY WORDS:</span>
            {mission.keyWords.map((kw, i) => (
              <span
                key={i}
                className="bg-yellow-400/20 text-yellow-300 border border-yellow-400 px-2 py-0.5 text-[10px] font-pixel font-bold"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* --- BOTTOM SECTION: Mic Button & Feedback Box --- */}
        <section className="space-y-3">
          {/* Error Message if speech recognition fails */}
          {errorMessage && (
            <div className="bg-red-950 border-2 border-red-500 text-red-200 p-3 text-xs font-pixel text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleRetryPermission}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 text-[10px] font-bold border border-black shadow-[2px_2px_0_#000]"
                >
                  마이크 권한 다시 요청 🎙️
                </button>
                <button
                  onClick={() => setShowKeyboardInput(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 text-[10px] font-bold border border-black shadow-[2px_2px_0_#000]"
                >
                  직접 키보드로 입력 ⌨️
                </button>
              </div>
            </div>
          )}

          {/* Transcribed Spoken Text preview */}
          {spokenText && (
            <div className="bg-zinc-800 border-2 border-black p-3 text-center">
              <span className="text-[9px] font-pixel text-zinc-400 block mb-1">
                YOU SAID (인식된 문장):
              </span>
              <p className="text-sm sm:text-base font-bold text-yellow-200 font-pixel">
                &ldquo;{spokenText}&rdquo;
              </p>
            </div>
          )}

          {/* Fallback Keyboard Input Option */}
          {showKeyboardInput ? (
            <form onSubmit={handleKeyboardSubmit} className="bg-[#1e293b] border-4 border-black p-4 shadow-[4px_4px_0_#000] space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-pixel text-xs text-yellow-300">
                  ⌨️ 직접 입력하여 말하기 테스트
                </span>
                <button
                  type="button"
                  onClick={() => setShowKeyboardInput(false)}
                  className="text-[10px] text-zinc-400 hover:text-white"
                >
                  ✕ 닫기
                </button>
              </div>
              <input
                type="text"
                value={keyboardText}
                onChange={(e) => setKeyboardText(e.target.value)}
                placeholder="영어로 방향을 입력하세요 (예: Turn left at the traffic lights.)"
                className="w-full bg-zinc-900 border-2 border-black p-2.5 text-sm text-white font-medium focus:outline-none focus:border-yellow-400"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setKeyboardText(mission.targetSentence)}
                  className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-[10px] font-pixel px-2 py-1.5 border border-black"
                >
                  정답 문장 붙여넣기
                </button>
                <button
                  type="submit"
                  disabled={!keyboardText.trim()}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-xs font-bold px-4 py-1.5 border-2 border-black shadow-[2px_2px_0_#000]"
                >
                  피드백 받기 →
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center">
              {/* The Large 8-Bit Mic Button */}
              <PixelMicButton
                state={micState}
                disabled={isPlayingAudio}
                disabledReason={isPlayingAudio ? 'Model voice is speaking...' : undefined}
                onClick={handleStartRecording}
                onStop={handleStopRecording}
              />

              {/* Direct Keyboard Option Button */}
              <button
                type="button"
                onClick={() => setShowKeyboardInput(true)}
                className="mt-1 text-[11px] text-indigo-300 hover:text-yellow-300 underline font-medium"
              >
                마이크가 안 되시나요? 직접 텍스트로 입력하기 ⌨️
              </button>
            </div>
          )}

          {/* Feedback Box (Section 7 Rules) */}
          {evaluation && (
            <div
              className={`border-4 border-black p-4 shadow-[6px_6px_0_#000] transition-all ${
                evaluation.isSuccess
                  ? 'bg-emerald-950/90 border-emerald-500'
                  : evaluation.isIntelligible
                  ? 'bg-blue-950/90 border-blue-400'
                  : 'bg-amber-950/90 border-amber-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <PixelCharacter
                  mood={evaluation.isSuccess ? 'happy' : 'thinking'}
                  size={48}
                  className="shrink-0"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-pixel text-yellow-300">
                      NAYA&apos;S FEEDBACK (Attempt #{evaluation.attemptNumber}):
                    </span>
                    {evaluation.isSuccess ? (
                      <span className="bg-emerald-500 text-black font-pixel text-[9px] px-2 py-0.5 border border-black font-bold">
                        SUCCESS! ⭐
                      </span>
                    ) : evaluation.isIntelligible ? (
                      <span className="bg-sky-400 text-black font-pixel text-[9px] px-2 py-0.5 border border-black font-bold">
                        GOOD! 💡
                      </span>
                    ) : (
                      <span className="bg-yellow-400 text-black font-pixel text-[9px] px-2 py-0.5 border border-black font-bold">
                        TRY AGAIN 🔄
                      </span>
                    )}
                  </div>

                  {/* English Feedback (max 1 sentence) */}
                  <p className="text-sm sm:text-base font-bold text-white">
                    {evaluation.englishFeedback}
                  </p>

                  {/* Korean Feedback in parentheses */}
                  <p className="text-xs sm:text-sm text-yellow-200 mt-1 font-medium">
                    {evaluation.koreanFeedback}
                  </p>

                  {/* Word-by-word Breakdown */}
                  <div className="mt-3 pt-2 border-t border-white/20 flex flex-wrap gap-1 items-center">
                    <span className="text-[9px] font-pixel text-zinc-400">WORDS:</span>
                    {evaluation.allTargetWords.map((item, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] px-1.5 py-0.5 border ${
                          item.matched
                            ? 'bg-emerald-600/50 border-emerald-400 text-emerald-200 font-bold'
                            : item.isKey
                            ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 font-bold'
                            : 'bg-zinc-800 border-zinc-600 text-zinc-400'
                        }`}
                      >
                        {item.word} {item.matched ? '✓' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons: Try Again / Next / Skip */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              onClick={handleTryAgain}
              className="py-3 px-4 bg-zinc-700 hover:bg-zinc-600 text-white font-pixel text-xs border-2 border-black shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5"
            >
              🔄 Try Again
            </button>

            <button
              onClick={onSkipMission}
              className="py-3 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-pixel text-[10px] border border-black"
            >
              Skip 건너뛰기
            </button>

            <button
              onClick={handleNext}
              className="py-3 px-5 bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-xs font-bold border-2 border-black shadow-[4px_4px_0_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
            >
              <span>{missionIndex + 1 === totalMissions ? 'Finish 🎉' : 'Next Mission →'}</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
