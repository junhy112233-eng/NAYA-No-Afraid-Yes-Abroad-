import { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { ResultScreen, PracticeHistoryItem } from './components/ResultScreen';
import { ReviewModal } from './components/ReviewModal';
import { MISSIONS } from './data/missions';
import { EvaluationResult } from './utils/speechEvaluation';
import { checkBrowserEnvironment } from './utils/speechRecognition';

type Screen = 'start' | 'practice' | 'result';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [history, setHistory] = useState<PracticeHistoryItem[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [browserWarning, setBrowserWarning] = useState<string | null>(null);

  // Initialize and check browser environment
  useEffect(() => {
    const env = checkBrowserEnvironment();
    if (env.isInAppBrowser) {
      setBrowserWarning(
        '카카오톡/인스타그램 등 인앱 브라우저에서는 마이크가 작동하지 않을 수 있습니다. 우측 상단 메뉴에서 [다른 브라우저로 열기(Chrome)]를 눌러주세요.'
      );
    } else if (!env.isSupported) {
      setBrowserWarning(
        '이 브라우저는 음성 인식을 지원하지 않습니다. 구글 크롬(Google Chrome) 브라우저에서 열어주세요.'
      );
    }
  }, []);

  const handleStartMission = (startIndex: number = 0) => {
    setCurrentMissionIndex(startIndex);
    setHistory((prev) => {
      // If restarting from 0, initialize clean history
      if (startIndex === 0 && prev.length === 0) {
        return [];
      }
      return prev;
    });
    setCurrentScreen('practice');
  };

  const handleNextMission = (evalResult?: EvaluationResult) => {
    const currentMission = MISSIONS[currentMissionIndex];

    setHistory((prev) => {
      const existingIdx = prev.findIndex((h) => h.mission.id === currentMission.id);
      const newItem: PracticeHistoryItem = {
        mission: currentMission,
        evaluation: evalResult,
        skipped: false,
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newItem;
        return copy;
      }
      return [...prev, newItem];
    });

    if (currentMissionIndex + 1 < MISSIONS.length) {
      setCurrentMissionIndex((prev) => prev + 1);
    } else {
      // Completed all missions
      setCurrentScreen('result');
    }
  };

  const handleSkipMission = () => {
    const currentMission = MISSIONS[currentMissionIndex];

    setHistory((prev) => {
      const existingIdx = prev.findIndex((h) => h.mission.id === currentMission.id);
      const newItem: PracticeHistoryItem = {
        mission: currentMission,
        skipped: true,
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newItem;
        return copy;
      }
      return [...prev, newItem];
    });

    if (currentMissionIndex + 1 < MISSIONS.length) {
      setCurrentMissionIndex((prev) => prev + 1);
    } else {
      setCurrentScreen('result');
    }
  };

  const handleRetryDifficult = () => {
    // Find first mission that was skipped or not fully successful
    const difficultIdx = MISSIONS.findIndex((m) => {
      const hist = history.find((h) => h.mission.id === m.id);
      return !hist || hist.skipped || (!hist.evaluation?.isSuccess && !hist.evaluation?.isIntelligible);
    });

    if (difficultIdx >= 0) {
      setCurrentMissionIndex(difficultIdx);
      setCurrentScreen('practice');
    } else {
      // All were successful, restart from first
      setCurrentMissionIndex(0);
      setCurrentScreen('practice');
    }
  };

  const handleRestartAll = () => {
    setHistory([]);
    setCurrentMissionIndex(0);
    setCurrentScreen('practice');
  };

  const handleBackToHome = () => {
    setCurrentScreen('start');
  };

  const handleSelectMissionFromGuide = (index: number) => {
    setCurrentMissionIndex(index);
    setCurrentScreen('practice');
  };

  // Ensure history has all missions when entering ResultScreen even if early ended
  const completeHistory: PracticeHistoryItem[] = MISSIONS.map((m) => {
    const found = history.find((h) => h.mission.id === m.id);
    return found || { mission: m, skipped: true };
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans">
      {currentScreen === 'start' && (
        <StartScreen
          onStartMission={() => handleStartMission(0)}
          onOpenReview={() => setIsReviewOpen(true)}
          browserWarning={browserWarning}
        />
      )}

      {currentScreen === 'practice' && (
        <PracticeScreen
          mission={MISSIONS[currentMissionIndex]}
          missionIndex={currentMissionIndex}
          totalMissions={MISSIONS.length}
          onNextMission={handleNextMission}
          onSkipMission={handleSkipMission}
          onBackToHome={handleBackToHome}
          onOpenReview={() => setIsReviewOpen(true)}
        />
      )}

      {currentScreen === 'result' && (
        <ResultScreen
          history={completeHistory}
          onRetryDifficult={handleRetryDifficult}
          onRestartAll={handleRestartAll}
          onBackToHome={handleBackToHome}
          onSelectMission={handleSelectMissionFromGuide}
        />
      )}

      {/* Review & Vocabulary Study Guide Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSelectMission={handleSelectMissionFromGuide}
      />
    </div>
  );
}
