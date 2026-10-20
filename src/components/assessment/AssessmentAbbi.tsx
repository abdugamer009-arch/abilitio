/** The same ABBI drawing as the approved assessment reference, with a waving arm. */
export function AssessmentAbbi({ celebrate = false }: { celebrate?: boolean }) {
  return (
    <div className={`picture-abbi ${celebrate ? "picture-abbi-party" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 110 110">
        <g stroke="#1d1b16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 20V9" />
          <circle cx="40" cy="8" r="5.5" fill="#ff7a66" />
          <rect x="25" y="66" width="30" height="20" rx="8" fill="#45c97a" />
          <rect x="3" y="38" width="10" height="18" rx="5" fill="#ff7a66" />
          <rect x="67" y="38" width="10" height="18" rx="5" fill="#ff7a66" />
          <rect x="15" y="24" width="58" height="48" rx="19" fill="#1d1b16" />
          <rect
            x="11"
            y="20"
            width="58"
            height="48"
            rx="19"
            fill={celebrate ? "white" : "#ffd93d"}
          />
          <rect x="19" y="29" width="42" height="29" rx="11" fill="#d6f5e0" />
          {celebrate ? (
            <path d="M28 43Q32 37 36 43M44 43Q48 37 52 43" fill="none" />
          ) : (
            <>
              <circle cx="32" cy="42" r="3" fill="#1d1b16" />
              <circle cx="48" cy="42" r="3" fill="#1d1b16" />
            </>
          )}
          <path d="M34 49Q40 56 46 49" fill="#d9381e" />
          <g className="picture-abbi-arm">
            <path d="M76 54L88 32" strokeWidth="7" />
            <path d="M76 54L88 32" stroke="#45c97a" />
            <circle cx="91" cy="26" r="8" fill="#ffd93d" />
          </g>
          {celebrate && (
            <>
              <path d="M12 6l5 4M91 70l8 3M65 99l-2 7" stroke="#d9381e" />
              <path d="M4 89l7-4M92 8l-4 9" stroke="#2f62d0" />
              <circle cx="100" cy="95" r="4" fill="#45c97a" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
