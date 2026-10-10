export function StageBadge({ stage }: { stage: number }) {
  return (
    <>
      {stage === 0 && (
        <svg width="60" height="60" viewBox="0 0 64 64" aria-hidden="true" className="stage-badge">
          <path
            d="M33.5 6.5L56 19.5V45.5L33.5 58.5L11 45.5V19.5Z"
            fill="var(--illustration-ink)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M31 4L53.5 17V43L31 56L8.5 43V17Z"
            fill="var(--mint)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M15.5 20.5L27 13.8"
            fill="none"
            stroke="var(--white)"
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="31"
            cy="30"
            r="12"
            fill="none"
            stroke="var(--illustration-ink)"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="31"
            cy="30"
            r="5"
            fill="var(--illustration-ink)"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M31 13.5v3M31 43.5v3M14.5 30h3M44.5 30h3"
            fill="none"
            stroke="var(--illustration-ink)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {stage === 1 && (
        <svg width="60" height="60" viewBox="0 0 64 64" aria-hidden="true" className="stage-badge">
          <path
            d="M33.5 6.5L56 19.5V45.5L33.5 58.5L11 45.5V19.5Z"
            fill="var(--illustration-ink)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M31 4L53.5 17V43L31 56L8.5 43V17Z"
            fill="var(--butter)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M15.5 20.5L27 13.8"
            fill="none"
            stroke="var(--white)"
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M20 41L41 20"
            fill="none"
            stroke="var(--illustration-ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M30 19.5L41.5 19.5L41.5 31"
            fill="none"
            stroke="var(--illustration-ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="20"
            cy="41"
            r="3.5"
            fill="var(--illustration-ink)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {stage === 2 && (
        <svg width="60" height="60" viewBox="0 0 64 64" aria-hidden="true" className="stage-badge">
          <path
            d="M33.5 6.5L56 19.5V45.5L33.5 58.5L11 45.5V19.5Z"
            fill="var(--illustration-ink)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M31 4L53.5 17V43L31 56L8.5 43V17Z"
            fill="var(--pink)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M15.5 20.5L27 13.8"
            fill="none"
            stroke="var(--white)"
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M17 41C22 22 38 40 44 21"
            fill="none"
            stroke="var(--illustration-ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="17"
            cy="41"
            r="4"
            fill="var(--white)"
            stroke="var(--illustration-ink)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="30.1"
            cy="31"
            r="3"
            fill="var(--illustration-ink)"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="44"
            cy="21"
            r="4"
            fill="var(--illustration-ink)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </>
  );
}
