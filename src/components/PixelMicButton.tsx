import React from 'react';

export type MicState = 'ready' | 'listening' | 'done' | 'evaluating';

interface PixelMicButtonProps {
  state: MicState;
  disabled?: boolean;
  disabledReason?: string;
  onClick: () => void;
  onStop?: () => void;
}

export const PixelMicButton: React.FC<PixelMicButtonProps> = ({
  state,
  disabled = false,
  disabledReason,
  onClick,
  onStop,
}) => {
  const isListening = state === 'listening';
  const isDone = state === 'done';
  const isEvaluating = state === 'evaluating';

  return (
    <div className="flex flex-col items-center justify-center my-3">
      {/* Main Large Pixel Button */}
      <button
        onClick={isListening ? onStop : onClick}
        disabled={disabled || isEvaluating}
        title={disabledReason || ''}
        className={`group relative w-24 h-24 sm:w-28 sm:h-28 rounded-none border-4 border-black transition-transform active:translate-x-1 active:translate-y-1 focus:outline-none select-none flex flex-col items-center justify-center ${
          disabled
            ? 'bg-zinc-400 opacity-60 cursor-not-allowed shadow-[4px_4px_0_#000]'
            : isListening
            ? 'bg-red-500 hover:bg-red-600 shadow-[6px_6px_0_#000] ring-4 ring-yellow-300'
            : isDone
            ? 'bg-emerald-500 hover:bg-emerald-600 shadow-[6px_6px_0_#000]'
            : isEvaluating
            ? 'bg-amber-400 cursor-wait shadow-[4px_4px_0_#000]'
            : 'bg-yellow-400 hover:bg-yellow-300 shadow-[6px_6px_0_#000] hover:-translate-y-1'
        }`}
        style={{ imageRendering: 'pixelated' }}
      >
        {/* State-specific 8-bit Icons */}
        {isListening ? (
          <div className="flex flex-col items-center">
            {/* Animated pixel sound waves */}
            <div className="flex items-end gap-1 h-8 mb-1">
              <span className="w-1.5 bg-white border border-black animate-[pulse_0.4s_ease-in-out_infinite] h-4" />
              <span className="w-1.5 bg-white border border-black animate-[pulse_0.3s_ease-in-out_infinite_0.1s] h-7" />
              <span className="w-1.5 bg-white border border-black animate-[pulse_0.5s_ease-in-out_infinite_0.2s] h-8" />
              <span className="w-1.5 bg-white border border-black animate-[pulse_0.35s_ease-in-out_infinite_0.15s] h-6" />
              <span className="w-1.5 bg-white border border-black animate-[pulse_0.45s_ease-in-out_infinite] h-3" />
            </div>
            <div className="bg-black text-white text-[8px] font-pixel px-1 py-0.5">
              STOP ⏹
            </div>
          </div>
        ) : isDone ? (
          <div className="flex flex-col items-center">
            {/* 8-bit Checkmark */}
            <svg className="w-10 h-10 text-white" viewBox="0 0 16 16" style={{ shapeRendering: 'crispEdges' }}>
              <rect x="2" y="8" width="2" height="2" fill="currentColor" />
              <rect x="4" y="10" width="2" height="2" fill="currentColor" />
              <rect x="6" y="12" width="2" height="2" fill="currentColor" />
              <rect x="8" y="10" width="2" height="2" fill="currentColor" />
              <rect x="10" y="8" width="2" height="2" fill="currentColor" />
              <rect x="12" y="6" width="2" height="2" fill="currentColor" />
              <rect x="14" y="4" width="2" height="2" fill="currentColor" />
            </svg>
          </div>
        ) : isEvaluating ? (
          <div className="flex flex-col items-center">
            <div className="text-xl animate-spin mb-1">⌛</div>
            <div className="text-[7px] font-pixel text-black font-bold">ANALYZING...</div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* 8-bit Microphone Sprite */}
            <svg className="w-10 h-10 text-black mb-1" viewBox="0 0 16 16" style={{ shapeRendering: 'crispEdges' }}>
              {/* Mic head */}
              <rect x="6" y="2" width="4" height="6" fill="#1e293b" />
              <rect x="7" y="3" width="2" height="4" fill="#64748b" />
              {/* Mic cradle */}
              <rect x="4" y="6" width="2" height="3" fill="#1e293b" />
              <rect x="10" y="6" width="2" height="3" fill="#1e293b" />
              <rect x="4" y="9" width="8" height="2" fill="#1e293b" />
              {/* Mic stand */}
              <rect x="7" y="11" width="2" height="2" fill="#1e293b" />
              {/* Mic base */}
              <rect x="5" y="13" width="6" height="2" fill="#1e293b" />
            </svg>
            <div className="text-[7px] font-pixel text-black font-bold tracking-tight">
              SPEAK 🎤
            </div>
          </div>
        )}
      </button>

      {/* Label under microphone */}
      <div className="mt-2 text-center">
        {disabled ? (
          <p className="text-xs font-bold text-gray-500 font-pixel">
            {disabledReason || 'Audio playing...'}
          </p>
        ) : isListening ? (
          <div className="flex items-center gap-1.5 text-red-600 font-pixel text-xs font-bold animate-pulse">
            <span className="inline-block w-2 h-2 bg-red-600 border border-black animate-ping" />
            I&apos;m listening... (말씀해 보세요!)
          </div>
        ) : isDone ? (
          <p className="text-xs font-bold text-emerald-700 font-pixel">
            Great job! Let&apos;s see how you did.
          </p>
        ) : isEvaluating ? (
          <p className="text-xs font-bold text-amber-700 font-pixel animate-pulse">
            Checking your directions...
          </p>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-zinc-900 font-pixel bg-yellow-200 px-2 py-0.5 border border-black shadow-[2px_2px_0_#000]">
              Tap to speak!
            </span>
            <span className="text-[10px] text-zinc-500 mt-1">
              (터치하고 영어로 말해보세요)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
