// simple monoline SVG icons — original artwork, sized to fill their container
const common = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function AboutIcon() {
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinksIcon() {
  return (
    <svg {...common}>
      <path d="M9.5 14.5 L14.5 9.5" />
      <path d="M8 16 C6 16 4.5 14.5 4.5 12.5 C4.5 10.5 6 9 8 9 L9.5 9" />
      <path d="M16 8 C18 8 19.5 9.5 19.5 11.5 C19.5 13.5 18 15 16 15 L14.5 15" />
    </svg>
  );
}

export function WorkIcon() {
  return (
    <svg {...common}>
      <rect x="3.5" y="7.5" width="17" height="11" rx="1.5" />
      <path d="M8 7.5 V6 a1.5 1.5 0 0 1 1.5 -1.5 h5 a1.5 1.5 0 0 1 1.5 1.5 v1.5" />
      <line x1="3.5" y1="12" x2="20.5" y2="12" />
    </svg>
  );
}

export function ContactIcon() {
  return (
    <svg {...common}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 6.5 L12 13 L20 6.5" />
    </svg>
  );
}

export function MailIcon() {
  const small = { ...common, width: 20, height: 20 };
  return (
    <svg {...small}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 6.5 L12 13 L20 6.5" />
    </svg>
  );
}

export function ChainIcon() {
  const small = { ...common, width: 20, height: 20 };
  return (
    <svg {...small}>
      <path d="M9.5 14.5 L14.5 9.5" />
      <path d="M8 16 C6 16 4.5 14.5 4.5 12.5 C4.5 10.5 6 9 8 9 L9.5 9" />
      <path d="M16 8 C18 8 19.5 9.5 19.5 11.5 C19.5 13.5 18 15 16 15 L14.5 15" />
    </svg>
  );
}
