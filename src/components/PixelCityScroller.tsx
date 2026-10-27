import React, { useState, useEffect } from 'react';
import { PixelCharacter } from './PixelCharacter';

interface PixelCityScrollerProps {
  onStart?: () => void;
  onReview?: () => void;
}

const DIRECTION_WORDS = ['Left!', 'Right!', 'Corner!', 'Turn!', 'Traffic lights!'];

export const PixelCityScroller: React.FC<PixelCityScrollerProps> = () => {
  const [wordIndex, setWordIndex] = useState(0);

  // Cycle through speech bubbles: Left! -> Right! -> Corner! -> Turn! -> Traffic lights!
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % DIRECTION_WORDS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-72 sm:h-80 overflow-hidden border-y-4 border-black bg-[#4a98e8] select-none">
      {/* Pixel Sky Gradient Bands */}
      <div className="absolute inset-x-0 top-0 h-10 bg-[#3b82f6] opacity-40" />
      <div className="absolute inset-x-0 top-10 h-10 bg-[#60a5fa] opacity-25" />

      {/* Retro Pixel Clouds (Layer 1 - slow) */}
      <div className="absolute inset-0 pointer-events-none flex w-[200%] animate-pixel-scroll-slow">
        {[0, 1].map((copy) => (
          <div key={copy} className="w-1/2 h-full relative">
            <div className="absolute top-4 left-10 w-20 h-6 bg-white opacity-80 shadow-[4px_4px_0_#00000020]">
              <div className="absolute -top-3 left-4 w-10 h-4 bg-white" />
            </div>
            <div className="absolute top-8 left-64 w-28 h-7 bg-white opacity-70">
              <div className="absolute -top-4 left-6 w-14 h-5 bg-white" />
            </div>
            <div className="absolute top-3 right-20 w-24 h-6 bg-white opacity-75">
              <div className="absolute -top-3 left-4 w-12 h-4 bg-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Scrolling Pixel City Skyline (Layer 2 - seamless infinite loop) */}
      <div className="absolute inset-0 flex w-[200%] animate-pixel-scroll">
        {[0, 1].map((copy) => (
          <div key={copy} className="w-1/2 h-full relative flex items-end">
            {/* Background buildings */}
            <div className="absolute bottom-20 left-4 w-24 h-36 bg-[#6366f1] border-2 border-black flex flex-wrap gap-2 p-2 justify-center">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-4 h-5 bg-[#fef08a] border border-black" />
              ))}
            </div>

            {/* Uphill Road feature */}
            <div className="absolute bottom-20 left-32 w-28 h-20 bg-[#10b981] border-t-4 border-l-4 border-black">
              <div className="text-[9px] font-pixel text-white px-2 py-1">▲ UPHILL</div>
              <div className="w-6 h-8 bg-amber-800 ml-4 border-2 border-black" />
            </div>

            {/* City Bank */}
            <div className="absolute bottom-20 left-64 w-28 h-40 bg-[#ec4899] border-2 border-black p-2">
              <div className="bg-yellow-300 border border-black text-[8px] font-pixel text-center py-1 font-bold text-black">
                BANK $
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-6 h-4 bg-white border border-black" />
                ))}
              </div>
            </div>

            {/* Traffic Lights Post */}
            <div className="absolute bottom-20 left-[26rem] flex flex-col items-center">
              <div className="w-6 h-14 bg-zinc-900 border-2 border-black rounded-none p-1 flex flex-col justify-between items-center shadow-[2px_2px_0_#000]">
                <div className="w-3 h-3 bg-red-500 rounded-none border border-black" />
                <div className="w-3 h-3 bg-amber-400 rounded-none border border-black" />
                <div className="w-3 h-3 bg-emerald-400 rounded-none border border-black animate-pulse" />
              </div>
              <div className="w-2 h-10 bg-zinc-700 border-x-2 border-black" />
            </div>

            {/* Subway Station */}
            <div className="absolute bottom-20 left-[32rem] w-32 h-32 bg-[#0284c7] border-2 border-black p-2">
              <div className="bg-white border border-black text-[8px] font-pixel text-center py-1 text-blue-900 font-bold">
                METRO [M]
              </div>
              <div className="flex gap-2 justify-center mt-3">
                <div className="w-8 h-12 bg-zinc-800 border-2 border-black" />
                <div className="w-8 h-12 bg-amber-200 border-2 border-black" />
              </div>
            </div>

            {/* Downhill Slope landmark */}
            <div className="absolute bottom-20 left-[43rem] w-32 h-24 bg-[#14b8a6] border-t-4 border-r-4 border-black">
              <div className="text-[9px] font-pixel text-white px-2 py-1 text-right">DOWNHILL ▼</div>
            </div>

            {/* Street Corner Post Office */}
            <div className="absolute bottom-20 left-[53rem] w-28 h-36 bg-[#f97316] border-2 border-black p-2">
              <div className="bg-yellow-300 border border-black text-[7px] font-pixel text-center py-1 text-black font-bold">
                POST OFFICE ✉
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-6 h-4 bg-sky-200 border border-black" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pixel Ground / Road (Layer 3) */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-[#374151] border-t-4 border-black">
        {/* Sidewalk border */}
        <div className="h-3 bg-[#9ca3af] border-b-2 border-black flex">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="w-6 h-full border-r border-black" />
          ))}
        </div>

        {/* Road surface with animated scrolling lane markings & zebra crosswalks */}
        <div className="relative h-17 flex items-center overflow-hidden">
          <div className="flex w-[200%] animate-pixel-scroll">
            {[0, 1].map((copy) => (
              <div key={copy} className="w-1/2 flex items-center justify-around">
                {/* Lane dash marks */}
                <div className="w-12 h-2 bg-yellow-400 border border-black" />
                <div className="w-12 h-2 bg-yellow-400 border border-black" />
                {/* Zebra Crosswalk */}
                <div className="flex gap-1.5 bg-zinc-800 p-1 border-2 border-black">
                  {[...Array(6)].map((_, z) => (
                    <div key={z} className="w-3 h-9 bg-white border border-black" />
                  ))}
                </div>
                <div className="w-12 h-2 bg-yellow-400 border border-black" />
                <div className="w-12 h-2 bg-yellow-400 border border-black" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOREGROUND: Fixed stationary character in the exact center */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none z-10">
        {/* Dynamic retro speech bubble changing words */}
        <div className="relative mb-3 transform -translate-y-1 transition-transform">
          <div className="bg-yellow-300 text-black px-4 py-2 border-4 border-black shadow-[4px_4px_0_#000] font-pixel text-xs sm:text-sm font-bold animate-bounce tracking-wider">
            {DIRECTION_WORDS[wordIndex]}
          </div>
          {/* Pixel bubble tail */}
          <div className="w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black mx-auto" />
        </div>

        {/* The stationary 8-bit Naya character */}
        <PixelCharacter mood="idle" size={72} animate={false} />
      </div>
    </div>
  );
};
