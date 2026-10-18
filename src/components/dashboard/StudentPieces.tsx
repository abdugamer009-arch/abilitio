import type { ReactNode } from "react";

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} width="44" height="44" viewBox="-16 -16 32 32" aria-hidden="true">
      <path
        d="M0 -14C1.8 -4.5 4.5 -1.8 14 0C4.5 1.8 1.8 4.5 0 14C-1.8 4.5 -4.5 1.8 -14 0C-4.5 -1.8 -1.8 -4.5 0 -14Z"
        fill="#ffd93d"
        stroke="#1d1b16"
        strokeWidth="2.5"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export function CameraDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 8h3l2-3h6l2 3h3v11H4z"></path>
      <circle cx="12" cy="13" r="3.5"></circle>
    </svg>
  );
}

export function StampStar({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
        fill="#ffd93d"
        stroke="#d9381e"
        strokeWidth="2.2"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export function FinishFlag({ className }: { className?: string }) {
  return (
    <svg className={className} width="30" height="36" viewBox="0 0 30 36" aria-hidden="true">
      <path d="M6 34V4" stroke="#1d1b16" strokeWidth="3" strokeLinecap="round"></path>
      <path
        d="M6 4L26 10L6 16Z"
        fill="#d9381e"
        stroke="#1d1b16"
        strokeWidth="2.5"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export function MedalDrawing({ className }: { className?: string }) {
  return (
    <svg className={className} width="96" height="110" viewBox="0 0 96 110" aria-hidden="true">
      <path
        d="M30 4h36l-10 40H40z"
        fill="#d9381e"
        stroke="#1d1b16"
        strokeWidth="3"
        strokeLinejoin="round"
      ></path>
      <path d="M44 4l4 40M52 4l-4 40" stroke="#1d1b16" strokeWidth="2"></path>
      <circle cx="51" cy="74" r="28" fill="#1d1b16"></circle>
      <circle cx="48" cy="71" r="28" fill="#ffd93d" stroke="#1d1b16" strokeWidth="3"></circle>
      <circle
        cx="48"
        cy="71"
        r="18"
        fill="none"
        stroke="#1d1b16"
        strokeWidth="2.5"
        strokeDasharray="4 4"
      ></circle>
      <path
        d="M48 60l3.2 6.6 7.2 1-5.2 5 1.3 7.2L48 76.4l-6.5 3.4 1.3-7.2-5.2-5 7.2-1z"
        fill="#fff"
        stroke="#1d1b16"
        strokeWidth="2.2"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export function LaptopDrawing({ className }: { className?: string }) {
  return (
    <svg className={className} width="62" height="48" viewBox="0 0 70 52" aria-hidden="true">
      <rect
        x="10"
        y="6"
        width="50"
        height="32"
        rx="4"
        fill="#dbe9ff"
        stroke="#1d1b16"
        strokeWidth="3"
      ></rect>
      <path
        d="M4 42h62l-4 6H8z"
        fill="#fff"
        stroke="#1d1b16"
        strokeWidth="3"
        strokeLinejoin="round"
      ></path>
      <path
        d="M26 17l-5 5 5 5M44 17l5 5-5 5M38 14l-6 16"
        fill="none"
        stroke="#1d1b16"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export function SwordsDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1d1b16"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4l11 11M13 17l4-4M16 16l3 3M20 4L9 15M11 17l-4-4M8 16l-3 3"></path>
    </svg>
  );
}

export function LightningDrawing({ className }: { className?: string }) {
  return (
    <svg className={className} width="44" height="52" viewBox="0 0 44 52" aria-hidden="true">
      <path
        d="M26 2L8 30h12l-4 20 20-30H24z"
        fill="#ffd93d"
        stroke="#1d1b16"
        strokeWidth="3"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export function ArrowDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1d1b16"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h15"></path>
      <path d="M13 6l6 6-6 6"></path>
    </svg>
  );
}

export function SatDrawing({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" width="54" height="54" viewBox="0 0 48 48">
      <path
        d="M12 22V32C12 36 18 39 24 39S36 36 36 32V22L24 27Z"
        fill="#fff"
        stroke="#1d1b16"
        strokeWidth="3"
        strokeLinejoin="round"
      ></path>
      <path
        d="M4 18L24 9L44 18L24 27Z"
        fill="#d9381e"
        stroke="#1d1b16"
        strokeWidth="3"
        strokeLinejoin="round"
      ></path>
      <path d="M40 20V31" stroke="#1d1b16" strokeWidth="3" strokeLinecap="round"></path>
      <circle cx="40" cy="33.5" r="2.8" fill="#1d1b16"></circle>
    </svg>
  );
}

export function IeltsDrawing({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" width="52" height="52" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="18" fill="#dbe9ff" stroke="#1d1b16" strokeWidth="3"></circle>
      <path
        d="M6 24h36M24 6c-6 6-6 30 0 36M24 6c6 6 6 30 0 36"
        fill="none"
        stroke="#1d1b16"
        strokeWidth="2.5"
      ></path>
      <path
        d="M30 30h14v10h-6l-4 4v-4h-4z"
        fill="#ffd93d"
        stroke="#1d1b16"
        strokeWidth="2.5"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export function UniversityDrawing({ className }: { className?: string }) {
  return (
    <svg className={className} width="200" height="170" viewBox="0 0 200 170" aria-hidden="true">
      <path
        d="M100 10V-6"
        stroke="#1d1b16"
        strokeWidth="3"
        strokeLinecap="round"
        transform="translate(0 16)"
      ></path>
      <path
        d="M100 10L120 15L100 20Z"
        fill="#d9381e"
        stroke="#1d1b16"
        strokeWidth="2.5"
        strokeLinejoin="round"
      ></path>
      <path d="M30 62L100 24L170 62Z" fill="#1d1b16" transform="translate(6 6)"></path>
      <path
        d="M30 62L100 24L170 62Z"
        fill="#fff0c2"
        stroke="#1d1b16"
        strokeWidth="3"
        strokeLinejoin="round"
      ></path>
      <circle cx="100" cy="47" r="7" fill="#ffd93d" stroke="#1d1b16" strokeWidth="2.5"></circle>
      <rect
        x="36"
        y="62"
        width="128"
        height="12"
        fill="#fff"
        stroke="#1d1b16"
        strokeWidth="3"
      ></rect>
      <rect
        x="46"
        y="74"
        width="14"
        height="52"
        fill="#fff"
        stroke="#1d1b16"
        strokeWidth="3"
      ></rect>
      <rect
        x="76"
        y="74"
        width="14"
        height="52"
        fill="#fff"
        stroke="#1d1b16"
        strokeWidth="3"
      ></rect>
      <rect
        x="110"
        y="74"
        width="14"
        height="52"
        fill="#fff"
        stroke="#1d1b16"
        strokeWidth="3"
      ></rect>
      <rect
        x="140"
        y="74"
        width="14"
        height="52"
        fill="#fff"
        stroke="#1d1b16"
        strokeWidth="3"
      ></rect>
      <rect
        x="30"
        y="126"
        width="140"
        height="14"
        fill="#fde0dc"
        stroke="#1d1b16"
        strokeWidth="3"
      ></rect>
      <path
        d="M18 152C60 146 140 156 182 150"
        fill="none"
        stroke="#1d1b16"
        strokeWidth="3"
        strokeLinecap="round"
      ></path>
      <g transform="translate(176 96) rotate(32)">
        <rect
          x="-6"
          y="-40"
          width="12"
          height="62"
          fill="#ffd93d"
          stroke="#1d1b16"
          strokeWidth="2.5"
        ></rect>
        <path
          d="M-6 22L0 36L6 22Z"
          fill="#fff0c2"
          stroke="#1d1b16"
          strokeWidth="2.5"
          strokeLinejoin="round"
        ></path>
        <rect
          x="-6"
          y="-48"
          width="12"
          height="9"
          fill="#ff7a66"
          stroke="#1d1b16"
          strokeWidth="2.5"
        ></rect>
      </g>
      <g transform="translate(22 34) scale(0.7)">
        <path
          d="M0 -14C1.8 -4.5 4.5 -1.8 14 0C4.5 1.8 1.8 4.5 0 14C-1.8 4.5 -4.5 1.8 -14 0C-4.5 -1.8 -1.8 -4.5 0 -14Z"
          fill="#ffd93d"
          stroke="#1d1b16"
          strokeWidth="3.5"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
}

export function AbbiHead({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" width="96" height="110" viewBox="0 0 80 92">
      <path d="M40 20V9" stroke="#1d1b16" strokeWidth="3" strokeLinecap="round"></path>
      <circle cx="40" cy="8" r="5.5" fill="#ff7a66" stroke="#1d1b16" strokeWidth="2.5"></circle>
      <rect
        x="25"
        y="66"
        width="30"
        height="20"
        rx="8"
        fill="#45c97a"
        stroke="#1d1b16"
        strokeWidth="3"
      ></rect>
      <rect
        x="3"
        y="38"
        width="10"
        height="18"
        rx="5"
        fill="#ff7a66"
        stroke="#1d1b16"
        strokeWidth="2.5"
      ></rect>
      <rect
        x="67"
        y="38"
        width="10"
        height="18"
        rx="5"
        fill="#ff7a66"
        stroke="#1d1b16"
        strokeWidth="2.5"
      ></rect>
      <rect x="15" y="24" width="58" height="48" rx="19" fill="#1d1b16"></rect>
      <rect
        x="11"
        y="20"
        width="58"
        height="48"
        rx="19"
        fill="#ffd93d"
        stroke="#1d1b16"
        strokeWidth="3"
      ></rect>
      <rect
        x="19"
        y="29"
        width="42"
        height="29"
        rx="11"
        fill="#d6f5e0"
        stroke="#1d1b16"
        strokeWidth="2.5"
      ></rect>
      <circle cx="32" cy="42" r="4" fill="#1d1b16"></circle>
      <circle cx="48" cy="42" r="4" fill="#1d1b16"></circle>
      <circle cx="33.4" cy="40.6" r="1.3" fill="#fff"></circle>
      <circle cx="49.4" cy="40.6" r="1.3" fill="#fff"></circle>
      <path
        d="M34 49Q40 56 46 49"
        fill="#d9381e"
        stroke="#1d1b16"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <ellipse cx="25" cy="51" rx="3.2" ry="2" fill="#ff7a66"></ellipse>
      <ellipse cx="55" cy="51" rx="3.2" ry="2" fill="#ff7a66"></ellipse>
    </svg>
  );
}

export function AbbiHand({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
      <path d="M8 30L14 16" stroke="#1d1b16" strokeWidth="7" strokeLinecap="round"></path>
      <path d="M8 30L14 16" stroke="#45c97a" strokeWidth="3" strokeLinecap="round"></path>
      <circle cx="16" cy="12" r="7" fill="#ffd93d" stroke="#1d1b16" strokeWidth="2.5"></circle>
      <path
        d="M25 4q4 2 5 6M27 1q5 3 6 8"
        fill="none"
        stroke="#1d1b16"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}

export function AbbiFace({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" width="40" height="40" viewBox="8 14 64 60">
      <rect
        x="11"
        y="20"
        width="58"
        height="48"
        rx="19"
        fill="#ffd93d"
        stroke="#1d1b16"
        strokeWidth="3"
      ></rect>
      <rect
        x="19"
        y="29"
        width="42"
        height="29"
        rx="11"
        fill="#d6f5e0"
        stroke="#1d1b16"
        strokeWidth="2.5"
      ></rect>
      <circle cx="32" cy="42" r="4" fill="#1d1b16"></circle>
      <circle cx="48" cy="42" r="4" fill="#1d1b16"></circle>
      <path
        d="M35 50Q40 55 45 50"
        fill="none"
        stroke="#1d1b16"
        strokeWidth="2.5"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}

export function UploadDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1d1b16"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 8.5a4 4 0 0 1-.5 9.5"></path>
      <path d="M12 20v-8M8.5 15l3.5-3.5 3.5 3.5"></path>
    </svg>
  );
}

export function MailDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1d1b16"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5"></rect>
      <path d="M3.5 6.5l8.5 7 8.5-7"></path>
    </svg>
  );
}

export function ResultsTabDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9"></circle>
      <circle cx="12" cy="12" r="5"></circle>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
    </svg>
  );
}

export function ScoresTabDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 20V11M11 20V5M17 20v-7M3 20h18"></path>
    </svg>
  );
}

export function ActivitiesTabDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 4h8v5a4 4 0 0 1-8 0z"></path>
      <path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"></path>
    </svg>
  );
}

export function RecordedTabDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 17l6-6 4 4 8-8"></path>
      <path d="M15 7h6v6"></path>
    </svg>
  );
}

export function UniversitiesTabDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 9l10-5 10 5-10 5z"></path>
      <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"></path>
    </svg>
  );
}

export function AbbiTabDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z"></path>
      <path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"></path>
    </svg>
  );
}

export function SettingsTabDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.5"></circle>
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"></path>
    </svg>
  );
}

export function ReasoningDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1d1b16"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9"></circle>
      <circle cx="12" cy="12" r="5"></circle>
      <circle cx="12" cy="12" r="1.5" fill="#1d1b16"></circle>
    </svg>
  );
}

export function PersonalityDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1d1b16"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z"></path>
    </svg>
  );
}

export function AssessmentsDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1d1b16"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="4" width="14" height="17" rx="2"></rect>
      <path d="M9 4V2.5h6V4M8.5 11l2 2 4-4M8.5 17h7"></path>
    </svg>
  );
}

export function FitDrawing({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1d1b16"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M15.5 8.5l-2 5-5 2 2-5z" fill="#d9381e"></path>
    </svg>
  );
}

export function StripedCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`student-shadow ${className}`}>
      <span className="student-hatch" aria-hidden="true" />
      <div className="student-card-face">{children}</div>
    </div>
  );
}
export function Tape() {
  return <span className="student-tape" aria-hidden="true" />;
}
export function Pushpin({ color = "#d9381e" }: { color?: string }) {
  return (
    <svg className="student-pin" width="30" height="34" viewBox="0 0 30 34" aria-hidden="true">
      <path d="M15 20V32" stroke="#1d1b16" strokeWidth="3" strokeLinecap="round" />
      <circle cx="15" cy="13" r="10" fill={color} stroke="#1d1b16" strokeWidth="3" />
      <circle cx="11.5" cy="9.5" r="3" fill="#fff" opacity="0.8" />
    </svg>
  );
}
export function WavyLine({ dashed = false }: { dashed?: boolean }) {
  return (
    <svg
      className="student-wave"
      viewBox="0 0 1200 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 6Q50 0 100 6T200 6T300 6T400 6T500 6T600 6T700 6T800 6T900 6T1000 6T1100 6T1200 6"
        fill="none"
        stroke="var(--ink)"
        strokeWidth={dashed ? 2.5 : 3}
        strokeDasharray={dashed ? "10 8" : undefined}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
export function AbbiMascot() {
  return (
    <div className="student-mascot">
      <AbbiHead />
      <AbbiHand className="student-mascot-hand" />
    </div>
  );
}
export function SpiralBinding() {
  return (
    <div className="student-binding" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
export function TallyMarks({ count }: { count: number }) {
  const n = Math.max(0, Math.floor(count));
  return (
    <span className="student-tallies" aria-hidden="true">
      {Array.from({ length: Math.ceil(n / 5) }, (_, g) => (
        <svg key={g} width="70" height="58" viewBox="0 0 70 58">
          {["M10 6L8 52", "M24 4L23 54", "M38 6L39 52", "M53 4L54 54", "M3 44L61 14"]
            .slice(0, Math.min(5, n - g * 5))
            .map((d) => (
              <path
                key={d}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            ))}
        </svg>
      ))}
    </span>
  );
}
