import React from 'react';

const ICONS = {
  sparkle: (
    <>
      <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />
      <path d="M19 14L19.7 16L21.7 16.7L19.7 17.4L19 19.4L18.3 17.4L16.3 16.7L18.3 16L19 14Z" />
    </>
  ),
  sparkles: <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />,
  home: <path d="M3 11L12 4L21 11V20A1 1 0 0 1 20 21H15V14H9V21H4A1 1 0 0 1 3 20V11Z" />,
  pipeline: (
    <>
      <path d="M3 3V21H21" />
      <path d="M7 16V12" />
      <path d="M11 16V8" />
      <path d="M15 16V13" />
      <path d="M19 16V5" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7A2 2 0 0 0 5 5V19A2 2 0 0 0 7 21H17A2 2 0 0 0 19 19V8L14 3Z" />
      <path d="M14 3V8H19" />
      <path d="M9 13H15" />
      <path d="M9 17H13" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21L16 16" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8A6 6 0 0 1 18 8C18 15 21 17 21 17H3S6 15 6 8Z" />
      <path d="M10 21A2 2 0 0 0 14 21" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15A1.65 1.65 0 0 0 19.7 16.8L19.8 16.9A2 2 0 0 1 17 19.7L16.9 19.6A1.65 1.65 0 0 0 15.1 19.3A1.65 1.65 0 0 0 14 21V21A2 2 0 0 1 10 21V21A1.65 1.65 0 0 0 8.9 19.3A1.65 1.65 0 0 0 7.1 19.6L7 19.7A2 2 0 0 1 4.3 17L4.4 16.9A1.65 1.65 0 0 0 4.7 15.1A1.65 1.65 0 0 0 3 14V14A2 2 0 0 1 3 10V10A1.65 1.65 0 0 0 4.7 8.9A1.65 1.65 0 0 0 4.4 7.1L4.3 7A2 2 0 0 1 7 4.3L7.1 4.4A1.65 1.65 0 0 0 8.9 4.7A1.65 1.65 0 0 0 10 3V3A2 2 0 0 1 14 3V3A1.65 1.65 0 0 0 15.1 4.7A1.65 1.65 0 0 0 16.9 4.4L17 4.3A2 2 0 0 1 19.7 7L19.6 7.1A1.65 1.65 0 0 0 19.3 8.9A1.65 1.65 0 0 0 21 10H21A2 2 0 0 1 21 14H21A1.65 1.65 0 0 0 19.4 15Z" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5V19" />
      <path d="M5 12H19" />
    </>
  ),
  trendingUp: (
    <>
      <path d="M3 17L9 11L13 15L21 7" />
      <path d="M14 7H21V14" />
    </>
  ),
  alertCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8V12" />
      <path d="M12 16H12.01" />
    </>
  ),
  alertOctagon: (
    <>
      <path d="M7.86 3H16.14L21 7.86V16.14L16.14 21H7.86L3 16.14V7.86L7.86 3Z" />
      <path d="M12 8V12" />
      <path d="M12 16H12.01" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12L11 15L16 9" />
    </>
  ),
  check: <path d="M5 13L9 17L19 7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7V12L15 14" />
    </>
  ),
  x: (
    <>
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12H19" />
      <path d="M13 6L19 12L13 18" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="M11 18L5 12L11 6" />
    </>
  ),
  grip: (
    <>
      <circle cx="9" cy="7" r="1" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="17" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="7" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="17" r="1" fill="currentColor" stroke="none"/>
    </>
  ),
  externalLink: (
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  dollar: (
    <>
      <path d="M12 2V22" />
      <path d="M17 6.5H9.5A3 3 0 0 0 9.5 12.5H14.5A3 3 0 0 1 14.5 18.5H6" />
    </>
  ),
  chevronRight: <path d="M9 6L15 12L9 18" />,
  chevronDown: <path d="M6 9L12 15L18 9" />,
  chevronUp: <path d="M18 15L12 9L6 15" />,
  send: (
    <>
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </>
  ),
  moreH: (
    <>
      <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  moreV: (
    <>
      <circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  phone: <path d="M5 4H9L11 9L8.5 10.5C9.6 12.7 11.3 14.4 13.5 15.5L15 13L20 15V19A2 2 0 0 1 18 21A16 16 0 0 1 3 6A2 2 0 0 1 5 4Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7L12 13L21 7" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" />
      <path d="M17 8L12 3L7 8" />
      <path d="M12 3V15" />
    </>
  ),
  download: (
    <>
      <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" />
      <path d="M7 10L12 15L17 10" />
      <path d="M12 15V3" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M8 6H16" />
      <path d="M8 11H10" />
      <path d="M13 11H16" />
      <path d="M8 15H10" />
      <path d="M13 15H16" />
      <path d="M8 19H10" />
      <path d="M13 19H16" />
    </>
  ),
  fileSearch: (
    <>
      <path d="M14 3H7A2 2 0 0 0 5 5V19A2 2 0 0 0 7 21H17A2 2 0 0 0 19 19V8L14 3Z" />
      <path d="M14 3V8H19" />
      <circle cx="11.5" cy="14.5" r="2.2" />
      <path d="M13 16L14.5 17.5" />
    </>
  ),
  listCheck: (
    <>
      <path d="M9 6H21" />
      <path d="M9 12H21" />
      <path d="M9 18H21" />
      <path d="M4 5L5 6L7 4" />
      <path d="M4 11L5 12L7 10" />
      <path d="M4 17L5 18L7 16" />
    </>
  ),
  shoppingCart: (
    <>
      <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <path d="M3 4H5.5L8 16H19L21.5 8H7" />
    </>
  ),
  filter: <path d="M3 5H21L14 13V20L10 18V13L3 5Z" />,
  book: (
    <>
      <path d="M4 4A2 2 0 0 1 6 2H20V18H6A2 2 0 0 0 4 20V4Z" />
      <path d="M4 20A2 2 0 0 0 6 22H20" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5V12C4 13.7 7.6 15 12 15S20 13.7 20 12V5" />
      <path d="M4 12V19C4 20.7 7.6 22 12 22S20 20.7 20 19V12" />
    </>
  ),
  pin: (
    <>
      <path d="M12 22S5 14.5 5 9A7 7 0 0 1 19 9C19 14.5 12 22 12 22Z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  command: <path d="M9 6A3 3 0 1 0 6 9V15A3 3 0 1 0 9 18H15A3 3 0 1 0 18 15V9A3 3 0 1 0 15 6H9Z" />,
  zap: <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" />,
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 9H10" />
      <path d="M9 13H10" />
      <path d="M9 17H10" />
      <path d="M14 9H15" />
      <path d="M14 13H15" />
      <path d="M14 17H15" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7H13" />
      <path d="M17 7H20" />
      <circle cx="15" cy="7" r="2" />
      <path d="M4 17H7" />
      <path d="M11 17H20" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  workflow: (
    <>
      <rect x="3" y="4" width="6" height="5" rx="1" />
      <rect x="15" y="15" width="6" height="5" rx="1" />
      <path d="M6 9V13A2 2 0 0 0 8 15H15" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7H20" />
      <path d="M10 11V17" />
      <path d="M14 11V17" />
      <path d="M6 7L7 19A2 2 0 0 0 9 21H15A2 2 0 0 0 17 19L18 7" />
      <path d="M9 7V4A1 1 0 0 1 10 3H14A1 1 0 0 1 15 4V7" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4A2 2 0 0 1 2 13V4A2 2 0 0 1 4 2H13A2 2 0 0 1 15 4V5" />
    </>
  ),
};

export function Icon({ name, size = 16, color, strokeWidth = 1.75, style, ...rest }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      {...rest}
    >
      {path}
    </svg>
  );
}

export default Icon;
