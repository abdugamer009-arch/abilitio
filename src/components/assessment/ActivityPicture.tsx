/** Decorative activity drawings chosen from the public caption; no hidden scoring data. */
export function ActivityPicture({ caption }: { caption: string }) {
  const s = caption.toLowerCase();
  const kind = /repair|build|engineering|device|maker|fix|make a (toy|kite)|tools/.test(s)
    ? "build"
    : /scien|biology|research|analy|investigat|quality|observ|cloud|birds|experiment/.test(s)
      ? "science"
      : /draw|design|art|paint|creative|visual|song|story|music|poster/.test(s)
        ? "art"
        : /help|support|interview|people|participant|friend|teach|care|younger/.test(s)
          ? "help"
          : /lead|pitch|present|business|entrep|fundrais|organis|organiz|host|group/.test(s)
            ? "lead"
            : "plan";
  return (
    <svg
      viewBox="0 0 92 92"
      aria-hidden="true"
      fill="none"
      stroke="#1d1b16"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "build" ? (
        <>
          <circle cx="58" cy="35" r="20" fill="#ffd93d" />
          <circle cx="58" cy="35" r="7" fill="white" />
          <path d="M58 9v6M58 55v6M32 35h6M78 35h6M40 17l4 4M72 49l4 4M40 53l4-4M72 21l4-4" />
          <path d="M14 80L40 54" strokeWidth="9" />
          <path d="M14 80L40 54" stroke="#ff7a66" strokeWidth="4" />
        </>
      ) : kind === "science" ? (
        <>
          <path
            d="M36 12h20M40 12v24L22 70c-3 6 1 12 8 12h32c7 0 11-6 8-12L52 36V12"
            fill="white"
          />
          <path d="M28 60h36l6 10c3 6-1 12-8 12H30c-7 0-11-6-8-12z" fill="#45c97a" />
          <circle cx="40" cy="70" r="3" fill="white" stroke="none" />
          <circle cx="52" cy="66" r="2.5" fill="white" stroke="none" />
        </>
      ) : kind === "art" ? (
        <>
          <path
            d="M46 12C24 12 10 28 10 46c0 18 14 32 30 32 6 0 8-4 6-8-3-6 1-10 7-10h10c12 0 19-8 19-18C82 25 66 12 46 12z"
            fill="white"
          />
          {[
            [30, 40, "#d9381e"],
            [44, 27, "#ffd93d"],
            [62, 30, "#2f62d0"],
            [28, 58, "#45c97a"],
          ].map(([x, y, fill]) => (
            <circle key={x} cx={x} cy={y} r="6" fill={String(fill)} />
          ))}
        </>
      ) : kind === "help" ? (
        <>
          <circle cx="30" cy="30" r="12" fill="#ffd93d" />
          <circle cx="62" cy="30" r="12" fill="white" />
          <path
            d="M10 74c0-14 9-24 20-24s20 10 20 24M42 74c0-14 9-24 20-24s20 10 20 24"
            fill="white"
          />
          <path d="M46 14c-3-6-12-4-10 3 1 4 10 9 10 9s9-5 10-9c2-7-7-9-10-3z" fill="#d9381e" />
        </>
      ) : kind === "lead" ? (
        <>
          <path d="M12 35h22l35-17v53L34 54H12Z" fill="#ffd93d" />
          <path d="M34 54l6 24H25l-5-24" fill="white" />
          <path d="M34 35v19M77 28l7-5M80 44h9M77 61l7 5" />
          <circle cx="18" cy="44" r="3" fill="#d9381e" />
        </>
      ) : (
        <>
          <rect x="19" y="16" width="54" height="66" rx="8" fill="white" />
          <rect x="33" y="10" width="26" height="14" rx="5" fill="#ffd93d" />
          <path d="M29 39l4 4 7-8M46 40h15M29 56l4 4 7-8M46 57h15M29 72h32" stroke="#2f62d0" />
        </>
      )}
    </svg>
  );
}
