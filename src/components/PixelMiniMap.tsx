import React from 'react';
import { Mission } from '../data/missions';

interface PixelMiniMapProps {
  mission: Mission;
  className?: string;
}

export const PixelMiniMap: React.FC<PixelMiniMapProps> = ({ mission, className = '' }) => {
  return (
    <div
      className={`relative w-full h-36 bg-[#2d3748] border-4 border-black p-2 overflow-hidden shadow-[4px_4px_0_#000] select-none ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Corner map badge */}
      <div className="absolute top-1 left-2 bg-yellow-300 text-black border-2 border-black px-1.5 py-0.5 text-[8px] font-pixel z-10">
        MAP: {mission.locationName}
      </div>

      {/* Grid texture for retro radar / map look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Dynamic Mini Map Visuals based on mission mapType */}
      {mission.mapType === 'traffic-left' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Crossroads */}
          <div className="absolute w-12 h-full bg-[#4b5563] border-x-2 border-black" />
          <div className="absolute h-12 w-full bg-[#4b5563] border-y-2 border-black" />
          {/* Traffic light */}
          <div className="absolute top-4 right-14 w-4 h-9 bg-black border border-white p-0.5 flex flex-col justify-between items-center">
            <div className="w-2 h-2 bg-red-800 rounded-none" />
            <div className="w-2 h-2 bg-yellow-800 rounded-none" />
            <div className="w-2 h-2 bg-green-400 rounded-none animate-ping" />
          </div>
          {/* Target: Bank */}
          <div className="absolute top-3 left-4 bg-pink-500 border-2 border-black px-2 py-1 text-[8px] font-pixel text-white">
            BANK $
          </div>
          {/* Turn Left Arrow */}
          <svg className="absolute w-24 h-24 pointer-events-none" viewBox="0 0 100 100">
            <path
              d="M 50 85 L 50 50 L 25 50"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="6"
              strokeDasharray="6,4"
              className="animate-pulse"
            />
            <polygon points="20,50 30,44 30,56" fill="#fbbf24" />
          </svg>
        </div>
      )}

      {mission.mapType === 'crosswalk' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Straight road */}
          <div className="w-20 h-full bg-[#4b5563] border-x-2 border-black relative flex flex-col justify-between items-center">
            {/* Metro station */}
            <div className="absolute -top-1 bg-sky-500 border-2 border-black px-2 py-0.5 text-[8px] font-pixel text-white z-10">
              STATION [M]
            </div>
            {/* Zebra crosswalk */}
            <div className="absolute top-12 w-full h-8 bg-zinc-800 flex justify-around items-center border-y-2 border-black">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-6 bg-white border border-black" />
              ))}
            </div>
            {/* Straight Arrow */}
            <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 80 140">
              <line
                x1="40"
                y1="120"
                x2="40"
                y2="30"
                stroke="#fbbf24"
                strokeWidth="5"
                strokeDasharray="6,4"
              />
              <polygon points="40,20 34,34 46,34" fill="#fbbf24" />
            </svg>
          </div>
        </div>
      )}

      {mission.mapType === 'crossroads' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-14 h-full bg-[#4b5563] border-x-2 border-black" />
          <div className="absolute h-14 w-full bg-[#4b5563] border-y-2 border-black" />
          {/* Turn Right Arrow */}
          <svg className="absolute w-28 h-28 pointer-events-none" viewBox="0 0 100 100">
            <path
              d="M 50 85 L 50 50 L 78 50"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="6"
              strokeDasharray="6,4"
              className="animate-pulse"
            />
            <polygon points="85,50 75,44 75,56" fill="#fbbf24" />
          </svg>
          <div className="absolute bottom-2 left-6 bg-emerald-600 border border-black text-[7px] font-pixel text-white px-1">
            YOU
          </div>
          <div className="absolute top-4 right-4 bg-amber-500 border border-black text-[7px] font-pixel text-black font-bold px-1">
            NEXT ST
          </div>
        </div>
      )}

      {mission.mapType === 't-junction' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* T road */}
          <div className="absolute top-6 h-12 w-full bg-[#4b5563] border-y-2 border-black" />
          <div className="absolute top-18 bottom-0 w-12 bg-[#4b5563] border-x-2 border-black" />
          {/* Turn Left at T Arrow */}
          <svg className="absolute w-28 h-28 pointer-events-none" viewBox="0 0 100 100">
            <path
              d="M 50 85 L 50 42 L 20 42"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="6"
              strokeDasharray="6,4"
              className="animate-pulse"
            />
            <polygon points="15,42 25,36 25,48" fill="#fbbf24" />
          </svg>
          <div className="absolute top-2 left-3 bg-indigo-500 border border-black text-[7px] font-pixel text-white px-1">
            T-JUNCTION
          </div>
        </div>
      )}

      {mission.mapType === 'roundabout' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Roundabout circle */}
          <div className="w-24 h-24 rounded-full border-4 border-black bg-[#4b5563] flex items-center justify-center relative">
            <div className="w-12 h-12 rounded-full bg-emerald-600 border-2 border-black flex items-center justify-center">
              <div className="w-4 h-4 bg-emerald-800 border border-black" />
            </div>
            {/* Museum target */}
            <div className="absolute -top-3 right-0 bg-purple-600 border border-black text-[7px] font-pixel text-white px-1">
              MUSEUM 🏛
            </div>
            {/* Orbit arrow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none animate-spin" style={{ animationDuration: '8s' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="14,10" />
            </svg>
          </div>
        </div>
      )}

      {mission.mapType === 'lane' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-36 h-full bg-[#374151] border-x-4 border-black relative flex">
            {/* Left lane */}
            <div className="w-1/2 h-full border-r-2 border-dashed border-yellow-400 flex flex-col items-center justify-center bg-blue-900/30">
              <div className="text-[7px] font-pixel text-yellow-300 font-bold mb-2">LEFT LANE</div>
              <svg className="w-6 h-12" viewBox="0 0 24 48">
                <line x1="12" y1="44" x2="12" y2="10" stroke="#fbbf24" strokeWidth="3" />
                <polygon points="12,4 6,14 18,14" fill="#fbbf24" />
              </svg>
            </div>
            {/* Right lane */}
            <div className="w-1/2 h-full flex flex-col items-center justify-center opacity-40">
              <div className="text-[7px] font-pixel text-gray-300">RIGHT</div>
            </div>
          </div>
        </div>
      )}

      {mission.mapType === 'pedestrian' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-full h-14 bg-[#4b5563] border-y-2 border-black flex items-center justify-center relative">
            {/* Crosswalk strips */}
            <div className="w-24 h-full bg-zinc-800 border-x-2 border-black flex justify-between p-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2 h-full bg-white border border-black" />
              ))}
            </div>
            {/* Pedestrian icon badge */}
            <div className="absolute top-1 right-8 bg-blue-600 border-2 border-black p-1 text-[8px] font-pixel text-white">
              🚶 CROSSING
            </div>
          </div>
        </div>
      )}

      {mission.mapType === 'uphill' && (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Uphill terrain slope */}
          <div className="absolute bottom-0 w-full h-24 bg-[#10b981] border-t-4 border-black [clip-path:polygon(0_100%,100%_20%,100%_100%)] flex justify-between px-6 pt-6">
            <div className="text-[8px] font-pixel text-white">ROAD ▲ UPHILL</div>
          </div>
          {/* Sunny Park target at peak */}
          <div className="absolute top-2 right-4 bg-emerald-700 border-2 border-black p-1 text-[8px] font-pixel text-white">
            PARK 🌲
          </div>
          {/* Traffic light passed */}
          <div className="absolute bottom-4 left-10 w-3 h-7 bg-black border border-white flex flex-col justify-around items-center p-0.5">
            <div className="w-1.5 h-1.5 bg-green-400" />
            <div className="w-1.5 h-1.5 bg-yellow-400" />
          </div>
        </div>
      )}

      {mission.mapType === 'across-from' && (
        <div className="relative w-full h-full flex flex-col justify-between p-2">
          {/* Top building: Library */}
          <div className="flex justify-between items-center">
            <div className="bg-sky-600 border-2 border-black px-2 py-1 text-[8px] font-pixel text-white">
              LIBRARY 📖
            </div>
            <div className="text-[7px] font-pixel text-yellow-300">ACROSS FROM ▲</div>
          </div>
          {/* Street in middle */}
          <div className="h-6 bg-[#4b5563] border-y-2 border-black flex items-center justify-center">
            <div className="w-full border-t border-dashed border-yellow-300" />
          </div>
          {/* Bottom building: Post Office */}
          <div className="flex justify-between items-center">
            <div className="bg-amber-600 border-2 border-black px-2 py-1 text-[8px] font-pixel text-white">
              POST OFFICE ✉
            </div>
            <div className="text-[7px] font-pixel text-zinc-300">OPPOSITE SIDE</div>
          </div>
        </div>
      )}

      {mission.mapType === 'downhill' && (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          {/* Downhill slope */}
          <div className="absolute top-0 w-full h-full bg-[#059669] [clip-path:polygon(0_0,100%_70%,100%_100%,0_100%)] opacity-80" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-[8px] font-pixel text-white mb-2">▼ DOWNHILL SLOPE</div>
            <div className="bg-orange-500 border-2 border-black px-2 py-1 text-[8px] font-pixel text-white shadow-[2px_2px_0_#000]">
              TURN RIGHT AT CORNER ↱ BUS STOP 🚌
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
