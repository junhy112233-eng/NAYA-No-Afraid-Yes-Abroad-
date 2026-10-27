import React from 'react';

interface PixelCharacterProps {
  mood?: 'idle' | 'listening' | 'happy' | 'thinking';
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * 8-Bit Pixel Sprite for Naya
 * Rendered using pure pixel blocks on a crisp 16x16 grid.
 * Classic retro arcade colors: warm skin tone, blocky yellow cap with sunglasses (NAYA 😎),
 * blue retro tunic, pixel legs and arms.
 */
export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  mood = 'idle',
  size = 64,
  className = '',
  animate = true,
}) => {
  // 16x16 pixel matrix:
  // Cap: #EAB308 (yellow), Sunglasses: #18181B (black) with white glint #FFFFFF
  // Face: #FDE047 (light yellow/peach #FCD34D)
  // Body: #3B82F6 (retro blue)
  // Belt/Detail: #EF4444 (red)
  // Pants: #1E3A8A (navy)
  // Shoes: #78350F (brown)

  const isHappy = mood === 'happy';
  const isListening = mood === 'listening';

  return (
    <div
      className={`inline-block relative select-none ${animate ? (isHappy ? 'animate-bounce' : isListening ? 'animate-pulse' : '') : ''} ${className}`}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    >
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Shadow on ground */}
        <rect x="3" y="15" width="10" height="1" fill="#000000" opacity="0.3" />

        {/* --- CAP / HAT --- */}
        <rect x="5" y="1" width="6" height="1" fill="#EAB308" />
        <rect x="4" y="2" width="8" height="1" fill="#EAB308" />
        <rect x="4" y="3" width="9" height="1" fill="#F59E0B" />
        <rect x="11" y="3" width="2" height="1" fill="#F59E0B" /> {/* Cap brim */}

        {/* --- HEAD / FACE --- */}
        <rect x="4" y="4" width="8" height="4" fill="#FDE047" />

        {/* SUNGLASSES (NAYA 😎) */}
        <rect x="5" y="4" width="3" height="2" fill="#18181B" />
        <rect x="9" y="4" width="3" height="2" fill="#18181B" />
        <rect x="8" y="4" width="1" height="1" fill="#18181B" /> {/* bridge */}
        {/* Cool glint in sunglasses */}
        <rect x="5" y="4" width="1" height="1" fill="#60A5FA" />
        <rect x="9" y="4" width="1" height="1" fill="#60A5FA" />

        {/* SMILE / CHEEKS */}
        {isHappy ? (
          <>
            <rect x="6" y="6" width="4" height="1" fill="#B91C1C" />
            <rect x="7" y="7" width="2" height="1" fill="#B91C1C" />
            <rect x="4" y="6" width="1" height="1" fill="#F87171" />
            <rect x="11" y="6" width="1" height="1" fill="#F87171" />
          </>
        ) : isListening ? (
          <>
            <rect x="7" y="6" width="2" height="1" fill="#991B1B" />
            {/* Listening retro headphone blips */}
            <rect x="3" y="4" width="1" height="2" fill="#EF4444" />
            <rect x="12" y="4" width="1" height="2" fill="#EF4444" />
          </>
        ) : (
          <>
            <rect x="6" y="6" width="4" height="1" fill="#B45309" />
            <rect x="4" y="6" width="1" height="1" fill="#FCA5A5" />
            <rect x="11" y="6" width="1" height="1" fill="#FCA5A5" />
          </>
        )}

        {/* --- TORSO / SHIRT --- */}
        <rect x="5" y="8" width="6" height="3" fill="#2563EB" />
        {/* Heart logo or badge on shirt */}
        <rect x="7" y="8" width="2" height="1" fill="#EF4444" />

        {/* ARMS */}
        {isHappy ? (
          // Arms raised cheering
          <>
            <rect x="3" y="6" width="2" height="2" fill="#2563EB" />
            <rect x="2" y="5" width="2" height="1" fill="#FDE047" />
            <rect x="11" y="6" width="2" height="2" fill="#2563EB" />
            <rect x="12" y="5" width="2" height="1" fill="#FDE047" />
          </>
        ) : isListening ? (
          // One hand on ear listening
          <>
            <rect x="3" y="8" width="2" height="3" fill="#2563EB" />
            <rect x="3" y="10" width="2" height="1" fill="#FDE047" />
            <rect x="11" y="6" width="2" height="2" fill="#2563EB" />
            <rect x="12" y="5" width="2" height="1" fill="#FDE047" />
          </>
        ) : (
          // Idle arms down
          <>
            <rect x="3" y="8" width="2" height="3" fill="#2563EB" />
            <rect x="3" y="10" width="2" height="1" fill="#FDE047" />
            <rect x="11" y="8" width="2" height="3" fill="#2563EB" />
            <rect x="11" y="10" width="2" height="1" fill="#FDE047" />
          </>
        )}

        {/* BELT */}
        <rect x="5" y="11" width="6" height="1" fill="#DC2626" />
        <rect x="7" y="11" width="2" height="1" fill="#FBBF24" />

        {/* PANTS */}
        <rect x="5" y="12" width="2" height="2" fill="#1E3A8A" />
        <rect x="9" y="12" width="2" height="2" fill="#1E3A8A" />

        {/* SHOES */}
        <rect x="4" y="14" width="3" height="1" fill="#78350F" />
        <rect x="9" y="14" width="3" height="1" fill="#78350F" />
      </svg>
    </div>
  );
};
