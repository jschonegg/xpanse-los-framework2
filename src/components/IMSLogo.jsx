import React from 'react';

// ── IMS Logo system ─────────────────────────────────────────────────────────
// Three concepts for the IMS (Intelligent Mortgage Solutions) brand mark.
// All are 1:1 SVGs so they scale crisp from favicon to billboard.
//
// Usage:
//   <IMSLogoMonogram size={32}/>             — bold mark (default)
//   <IMSLogoNode     size={32}/>             — AI-forward node mark
//   <IMSWordmark     size={28} variant="full"/>  — IMS + tagline
//
// Pass `color` or `gradient={false}` to drop the gradient for a flat fill.

const PRIMARY = {
  start: '#7E68FA',  // indigo-light
  mid:   '#5B21B6',  // indigo-deep
  end:   '#3D2B96',  // indigo-darker
};

// ── Concept A: Stacked monogram ─────────────────────────────────────────────
// Bold geometric IMS letters in a tile. Most versatile — works as favicon,
// app icon, brand mark, etc.
export function IMSLogoMonogram({ size = 32, gradient = true, color }) {
  const id = React.useId();
  const fill = gradient ? `url(#${id})` : (color || PRIMARY.mid);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="IMS">
      {gradient && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor={PRIMARY.start}/>
            <stop offset="0.55" stopColor={PRIMARY.mid}/>
            <stop offset="1" stopColor={PRIMARY.end}/>
          </linearGradient>
        </defs>
      )}
      {/* Rounded tile background */}
      <rect width="48" height="48" rx="11" fill={fill}/>
      {/* I — left bar */}
      <rect x="10"  y="14" width="4"  height="20" rx="1.5" fill="#fff"/>
      {/* M — two angled strokes meeting at a peak */}
      <path d="M17 34 V14 L23.5 24 L30 14 V34" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* S — flowing stroke */}
      <path d="M38 16 C 35 14, 32 14, 32 18 C 32 22, 38 22, 38 26 C 38 30, 35 32, 32 30"
        stroke="#fff" strokeWidth="3.4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ── Concept B: Node mark + wordmark ─────────────────────────────────────────
// Three connected nodes (one per letter). Reads as "intelligent connection."
// Use this on marketing surfaces and AI-flagged moments.
export function IMSLogoNode({ size = 32, gradient = true, color }) {
  const id = React.useId();
  const fill = gradient ? `url(#${id})` : (color || PRIMARY.mid);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="IMS">
      {gradient && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor={PRIMARY.start}/>
            <stop offset="1" stopColor={PRIMARY.mid}/>
          </linearGradient>
        </defs>
      )}
      {/* Edges (connections between nodes) */}
      <path d="M12 16 L24 32 L36 16" stroke={fill} strokeWidth="2.5" strokeLinecap="round" opacity="0.45"/>
      <path d="M12 16 L36 16"       stroke={fill} strokeWidth="2.5" strokeLinecap="round" opacity="0.45"/>
      {/* Nodes */}
      <circle cx="12" cy="16" r="5"   fill={fill}/>
      <circle cx="36" cy="16" r="5"   fill={fill}/>
      <circle cx="24" cy="32" r="6.5" fill={fill}/>
      {/* Inner highlight on the bottom node — signals "active intelligence" */}
      <circle cx="24" cy="32" r="2.5" fill="#fff" opacity="0.85"/>
    </svg>
  );
}

// ── Wordmark — IMS letters + tagline ────────────────────────────────────────
// Variants:
//   compact   → "IMS" only
//   full      → "IMS" + tagline below
//   horizontal → mark + IMS + tagline inline (lockup)
export function IMSWordmark({ size = 28, variant = 'compact', gradient = true, color, useNodeMark = false }) {
  const fill = color || PRIMARY.mid;
  const tagline = 'Intelligent Mortgage Solutions';
  const Mark = useNodeMark ? IMSLogoNode : IMSLogoMonogram;

  if (variant === 'horizontal') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <Mark size={size + 4} gradient={gradient} color={color}/>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{
            fontSize: size,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: fill,
            fontFamily: 'inherit',
          }}>IMS</span>
          <span style={{
            fontSize: size * 0.36,
            color: '#6B7280',
            fontWeight: 500,
            marginTop: 2,
            letterSpacing: '0.02em',
          }}>{tagline}</span>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <Mark size={size + 8} gradient={gradient} color={color}/>
        <span style={{
          fontSize: size,
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: fill,
        }}>IMS</span>
        <span style={{
          fontSize: size * 0.36,
          color: '#6B7280',
          fontWeight: 500,
          letterSpacing: '0.02em',
        }}>{tagline}</span>
      </div>
    );
  }

  // compact — IMS letters only, no tagline
  return (
    <span style={{
      fontSize: size,
      fontWeight: 800,
      letterSpacing: '-0.025em',
      color: fill,
      fontFamily: 'inherit',
    }}>IMS</span>
  );
}

// Default export: the most-used mark (monogram tile)
export default IMSLogoMonogram;
