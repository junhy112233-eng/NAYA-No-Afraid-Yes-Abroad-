import React from 'react';
import { PixelCityScroller } from './PixelCityScroller';
import { play8BitBlip } from '../utils/audio';

interface StartScreenProps {
  onStartMission: () => void;
  onOpenReview: () => void;
  browserWarning?: string | null;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartMission,
  onOpenReview,
  browserWarning,
}) => {
  const handleStart = () => {
    play8BitBlip();
    onStartMission();
  };

  const handleReview = () => {
    play8BitBlip();
    onOpenReview();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1e1b4b] text-white select-none">
      {/* Top Bar with Arcade Vibe */}
      <header className="p-4 sm:p-6 text-center border-b-4 border-black bg-[#312e81]">
        {/* Retro Header Logo */}
        <div className="inline-block relative">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl animate-bounce">😎</span>
            <h1 className="font-pixel text-3xl sm:text-5xl font-black text-yellow-300 tracking-wider drop-shadow-[4px_4px_0_#000]">
              NAYA
            </h1>
            <span className="text-2xl sm:text-3xl animate-pulse text-red-500">❤️</span>
          </div>
          <div className="text-[10px] sm:text-xs font-pixel text-yellow-200 mt-1 tracking-widest">
            [No Afraid Yes Abroad]
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-2 text-xs sm:text-sm font-pixel text-emerald-300 tracking-wide">
          “Your little guide to real-world English!”
        </p>
      </header>

      {/* Browser Warning Banner if detected (e.g. In-App browser or unsupported) */}
      {browserWarning && (
        <div className="bg-amber-400 text-black px-4 py-2 border-b-4 border-black text-xs font-bold font-pixel text-center flex items-center justify-center gap-2">
          <span>⚠️</span>
          <span>{browserWarning}</span>
        </div>
      )}

      {/* Middle: 2D Continuously Scrolling Pixel Art City with Stationary Naya */}
      <main className="flex-1 flex flex-col justify-center">
        <PixelCityScroller />
      </main>

      {/* Bottom Control Section */}
      <footer className="p-4 sm:p-6 bg-[#312e81] border-t-4 border-black flex flex-col items-center">
        <p className="font-pixel text-xs sm:text-sm text-yellow-300 mb-4 animate-pulse">
          Ready to explore? Let&apos;s go!
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-md flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleStart}
            className="w-full sm:flex-1 py-4 px-6 bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-sm sm:text-base font-bold border-4 border-black shadow-[6px_6px_0_#000] active:translate-x-1 active:translate-y-1 transition-transform flex items-center justify-center gap-2"
          >
            <span>Start Mission</span>
            <span className="text-lg">→</span>
          </button>

          <button
            onClick={handleReview}
            className="w-full sm:w-auto py-4 px-5 bg-sky-400 hover:bg-sky-300 text-black font-pixel text-xs sm:text-sm font-bold border-4 border-black shadow-[4px_4px_0_#000] active:translate-x-1 active:translate-y-1 transition-transform flex items-center justify-center gap-2"
          >
            <span>📖 Review Guide</span>
          </button>
        </div>

        {/* Technical & Privacy Requirement Notice */}
        <div className="mt-5 text-center max-w-lg">
          <div className="inline-block bg-black/40 border border-indigo-400/30 px-3 py-1.5 text-[10px] text-indigo-200">
            🔒 <span className="font-semibold">Privacy Notice:</span> Your voice is processed to turn it into text and is not recorded or saved.
          </div>
          <div className="text-[9px] text-indigo-300/60 mt-1">
            CEFR A1–A2 • Middle School Travel English • Safe Speaking Practice
          </div>
        </div>
      </footer>
    </div>
  );
};
