type IllustrationKind = "methodology" | "for-schools" | "about";
export function CartoonIllustration({ kind }: { kind: IllustrationKind }) {
  return (
    <>
      {kind === "methodology" && (
        <svg viewBox="0 0 320 260" className="cartoon-illustration">
          <g transform="rotate(-6 140 125)">
            <rect
              x="48"
              y="48"
              width="200"
              height="170"
              rx="18"
              fill="var(--illustration-ink)"
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x="40"
              y="40"
              width="200"
              height="170"
              rx="18"
              fill="var(--white)"
              stroke="var(--illustration-ink)"
              strokeWidth="3.5"
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x="60"
              y="62"
              width="74"
              height="20"
              rx="10"
              fill="var(--mint)"
              stroke="var(--illustration-ink)"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M62 108H210M62 130H190M62 152H160"
              fill="none"
              stroke="var(--paper-dots)"
              strokeWidth="7"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="70"
              cy="184"
              r="8"
              fill="var(--yellow)"
              stroke="var(--illustration-ink)"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M88 184H140"
              fill="none"
              stroke="var(--paper-dots)"
              strokeWidth="7"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <g
            style={{
              transformBox: "fill-box",
              transformOrigin: "30% 30%",
              animation: "sway 4s ease-in-out infinite",
            }}
          >
            <path
              d="M250 186L292 228"
              fill="none"
              stroke="var(--illustration-ink)"
              strokeWidth="16"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M250 186L292 228"
              fill="none"
              stroke="var(--yellow)"
              strokeWidth="8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="214"
              cy="150"
              r="48"
              fill="var(--sky)"
              fillOpacity="0.88"
              stroke="var(--illustration-ink)"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M186 136C192 120 206 110 222 108"
              fill="none"
              stroke="var(--white)"
              strokeWidth="7"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M202 142C202 128 228 126 226 142C225 151 214 153 214 164"
              fill="none"
              stroke="var(--illustration-ink)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="214"
              cy="177"
              r="4"
              fill="var(--illustration-ink)"
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <g transform="translate(288 50)">
            <path
              d="M0 -14C1.8 -4.5 4.5 -1.8 14 0C4.5 1.8 1.8 4.5 0 14C-1.8 4.5 -4.5 1.8 -14 0C-4.5 -1.8 -1.8 -4.5 0 -14Z"
              fill="var(--yellow)"
              stroke="var(--illustration-ink)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "twinkle 2.8s ease-in-out infinite",
              }}
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <g transform="translate(22 226) scale(0.8)">
            <path
              d="M0 -14C1.8 -4.5 4.5 -1.8 14 0C4.5 1.8 1.8 4.5 0 14C-1.8 4.5 -4.5 1.8 -14 0C-4.5 -1.8 -1.8 -4.5 0 -14Z"
              fill="var(--yellow)"
              stroke="var(--illustration-ink)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "twinkle 2.8s ease-in-out infinite",
                animationDelay: "1.1s",
              }}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      )}
      {kind === "for-schools" && (
        <svg viewBox="0 0 320 260" className="cartoon-illustration">
          <path
            d="M160 50V14"
            fill="none"
            stroke="var(--illustration-ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M160 16C170 10 180 22 194 16V36C180 42 170 30 160 36Z"
            fill="var(--mint-solid)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
            style={{
              transformBox: "fill-box",
              transformOrigin: "left center",
              animation: "flutter 2.4s ease-in-out infinite",
            }}
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="76"
            y="116"
            width="180"
            height="110"
            fill="var(--illustration-ink)"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="70"
            y="110"
            width="180"
            height="116"
            rx="4"
            fill="var(--pink)"
            stroke="var(--illustration-ink)"
            strokeWidth="3.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M62 120L166 56L270 120Z"
            fill="var(--illustration-ink)"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M56 114L160 50L264 114Z"
            fill="var(--pink-solid)"
            stroke="var(--illustration-ink)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="160"
            cy="92"
            r="14"
            fill="var(--white)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M160 84V92L166 96"
            fill="none"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="88"
            y="128"
            width="36"
            height="30"
            rx="4"
            fill="var(--sky)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="196"
            y="128"
            width="36"
            height="30"
            rx="4"
            fill="var(--sky)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="88"
            y="176"
            width="36"
            height="30"
            rx="4"
            fill="var(--sky)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="196"
            y="176"
            width="36"
            height="30"
            rx="4"
            fill="var(--sky)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M106 128V158M88 143H124M214 128V158M196 143H232M106 176V206M88 191H124M214 176V206M196 191H232"
            fill="none"
            stroke="var(--illustration-ink)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M140 226V188C140 168 180 168 180 188V226"
            fill="var(--yellow)"
            stroke="var(--illustration-ink)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="171"
            cy="204"
            r="2.5"
            fill="var(--illustration-ink)"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M24 230C12 230 10 208 24 206C24 190 48 188 52 202C66 200 70 224 56 230Z"
            fill="var(--mint-solid)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M266 230C256 230 254 212 266 210C268 198 288 198 290 210C302 210 302 230 292 230Z"
            fill="var(--mint-solid)"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M10 230C90 224 230 236 310 228"
            fill="none"
            stroke="var(--illustration-ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <g transform="translate(42 70)">
            <path
              d="M0 -14C1.8 -4.5 4.5 -1.8 14 0C4.5 1.8 1.8 4.5 0 14C-1.8 4.5 -4.5 1.8 -14 0C-4.5 -1.8 -1.8 -4.5 0 -14Z"
              fill="var(--yellow)"
              stroke="var(--illustration-ink)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "twinkle 2.8s ease-in-out infinite",
              }}
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <g transform="translate(286 52) scale(0.8)">
            <path
              d="M0 -14C1.8 -4.5 4.5 -1.8 14 0C4.5 1.8 1.8 4.5 0 14C-1.8 4.5 -4.5 1.8 -14 0C-4.5 -1.8 -1.8 -4.5 0 -14Z"
              fill="var(--yellow)"
              stroke="var(--illustration-ink)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "twinkle 2.8s ease-in-out infinite",
                animationDelay: "1s",
              }}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      )}
      {kind === "about" && (
        <svg viewBox="0 0 320 260" className="cartoon-illustration">
          <g style={{ animation: "float 4.5s ease-in-out infinite" }}>
            <path
              transform="translate(7 7)"
              d="M40 40H196C208 40 216 48 216 60V124C216 136 208 144 196 144H104L72 174L80 144H40C28 144 20 136 20 124V60C20 48 28 40 40 40Z"
              fill="var(--illustration-ink)"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M40 40H196C208 40 216 48 216 60V124C216 136 208 144 196 144H104L72 174L80 144H40C28 144 20 136 20 124V60C20 48 28 40 40 40Z"
              fill="var(--yellow)"
              stroke="var(--illustration-ink)"
              strokeWidth="3.5"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M50 78H170M50 104H136"
              fill="none"
              stroke="var(--illustration-ink)"
              strokeWidth="7"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <g style={{ animation: "float 4.5s ease-in-out infinite", animationDelay: "-2.2s" }}>
            <path
              transform="translate(7 7)"
              d="M144 118H280C292 118 300 126 300 138V200C300 212 292 220 280 220H266L272 248L240 220H144C132 220 124 212 124 200V138C124 126 132 118 144 118Z"
              fill="var(--illustration-ink)"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M144 118H280C292 118 300 126 300 138V200C300 212 292 220 280 220H266L272 248L240 220H144C132 220 124 212 124 200V138C124 126 132 118 144 118Z"
              fill="var(--mint)"
              stroke="var(--illustration-ink)"
              strokeWidth="3.5"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M152 198C170 160 200 200 226 156"
              fill="none"
              stroke="var(--illustration-ink)"
              strokeWidth="4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M216.4 161.4L226 156L225.9 167"
              fill="none"
              stroke="var(--illustration-ink)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="152"
              cy="198"
              r="5"
              fill="var(--white)"
              stroke="var(--illustration-ink)"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <g transform="translate(266 150) scale(0.7)">
              <path
                d="M0 -14C1.8 -4.5 4.5 -1.8 14 0C4.5 1.8 1.8 4.5 0 14C-1.8 4.5 -4.5 1.8 -14 0C-4.5 -1.8 -1.8 -4.5 0 -14Z"
                fill="var(--yellow)"
                stroke="var(--illustration-ink)"
                strokeWidth="3"
                strokeLinejoin="round"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  animation: "twinkle 2.6s ease-in-out infinite",
                }}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </g>
          <g transform="translate(286 46)">
            <path
              d="M0 -14C1.8 -4.5 4.5 -1.8 14 0C4.5 1.8 1.8 4.5 0 14C-1.8 4.5 -4.5 1.8 -14 0C-4.5 -1.8 -1.8 -4.5 0 -14Z"
              fill="var(--yellow)"
              stroke="var(--illustration-ink)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "twinkle 2.8s ease-in-out infinite",
                animationDelay: ".9s",
              }}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      )}
    </>
  );
}
export function CartoonRowIcon({ kind, index }: { kind: string; index: number }) {
  return (
    <>
      {kind === "methodology" && index === 0 && (
        <svg
          width="46"
          height="46"
          viewBox="0 0 48 48"
          fill="none"
          stroke="var(--illustration-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 30H42" vectorEffect="non-scaling-stroke" />
          <circle
            cx="8"
            cy="30"
            r="3.5"
            fill="var(--white)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="16"
            cy="30"
            r="3.5"
            fill="var(--white)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="24"
            cy="30"
            r="3.5"
            fill="var(--white)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="32" cy="30" r="6" fill="var(--red)" vectorEffect="non-scaling-stroke" />
          <circle
            cx="40"
            cy="30"
            r="3.5"
            fill="var(--white)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M27 12H37L32 19Z"
            fill="var(--illustration-ink)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {kind === "methodology" && index === 1 && (
        <svg
          width="46"
          height="46"
          viewBox="0 0 48 48"
          fill="none"
          stroke="var(--illustration-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M24 7C15 7 10 14 12 21C13.5 26 18 28 18 33H30C30 28 34.5 26 36 21C38 14 33 7 24 7Z"
            fill="var(--yellow)"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M19 38H29M21 43H27" vectorEffect="non-scaling-stroke" />
          <path d="M20 21L24 26L28 21" vectorEffect="non-scaling-stroke" />
          <path d="M4 15L8 17M44 15L40 17M24 1.5V3.5" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {kind === "methodology" && index === 2 && (
        <svg
          width="46"
          height="46"
          viewBox="0 0 48 48"
          fill="none"
          stroke="var(--illustration-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="15"
            y="6"
            width="27"
            height="23"
            rx="4"
            fill="var(--pink)"
            transform="rotate(10 28 17)"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="6"
            y="15"
            width="30"
            height="26"
            rx="4"
            fill="var(--white)"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M10 37L18 27L24 33L28 29L33 37" vectorEffect="non-scaling-stroke" />
          <circle
            cx="27"
            cy="22"
            r="3"
            fill="var(--yellow)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {kind === "for-schools" && index === 0 && (
        <svg
          width="44"
          height="44"
          viewBox="0 0 48 48"
          fill="none"
          stroke="var(--illustration-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 42V22L24 12L40 22V42Z" fill="var(--pink)" vectorEffect="non-scaling-stroke" />
          <path d="M20 42V32H28V42" vectorEffect="non-scaling-stroke" />
          <path d="M24 12V4L31 6L24 8" vectorEffect="non-scaling-stroke" />
          <path d="M4 42H44" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {kind === "for-schools" && index === 1 && (
        <svg
          width="44"
          height="44"
          viewBox="0 0 48 48"
          fill="none"
          stroke="var(--illustration-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M6 8H28C30.2 8 32 9.8 32 12V22C32 24.2 30.2 26 28 26H16L10 31L11 26H6C3.8 26 2 24.2 2 22V12C2 9.8 3.8 8 6 8Z"
            fill="var(--pink-solid)"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M22 21H42C44.2 21 46 22.8 46 25V35C46 37.2 44.2 39 42 39H40L41 44L35 39H22C19.8 39 18 37.2 18 35V25C18 22.8 19.8 21 22 21Z"
            fill="var(--white)"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M25 30H39" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {kind === "for-schools" && index === 2 && (
        <svg
          width="44"
          height="44"
          viewBox="0 0 48 48"
          fill="none"
          stroke="var(--illustration-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 42C12 28 32 26 45 42Z" fill="var(--mint)" vectorEffect="non-scaling-stroke" />
          <path d="M24 31V7" vectorEffect="non-scaling-stroke" />
          <path d="M24 8L38 12L24 17Z" fill="var(--red)" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </>
  );
}
export function MarkedText({
  text,
  mark = "scribble",
  words = 1,
}: {
  text: string;
  mark?: "scribble" | "circle" | "highlight";
  words?: number;
}) {
  const pieces = text.split(" ");
  const start = Math.max(0, pieces.length - words);
  return (
    <>
      {pieces.slice(0, start).join(" ")}
      {start > 0 ? " " : ""}
      <span className={"pen-mark pen-mark--" + mark}>
        {pieces.slice(start).join(" ")}
        {mark === "scribble" && (
          <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M4 14C40 4 70 22 110 12S180 4 220 14S280 18 296 8"
              fill="none"
              stroke="var(--pen-red)"
              strokeWidth="6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
        {mark === "circle" && (
          <svg viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M24 22C64 4 168 4 190 34C206 58 166 84 104 86C44 88 6 70 10 46C14 24 50 10 112 8"
              fill="none"
              stroke="var(--pen-red)"
              strokeWidth="4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
      </span>
    </>
  );
}
export function CartoonSparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      width="46"
      height="46"
      viewBox="-16 -16 32 32"
      aria-hidden="true"
      className={"cartoon-sparkle " + className}
    >
      <path
        d="M0 -14C1.8 -4.5 4.5 -1.8 14 0C4.5 1.8 1.8 4.5 0 14C-1.8 4.5 -4.5 1.8 -14 0C-4.5 -1.8 -1.8 -4.5 0 -14Z"
        fill="var(--yellow)"
        stroke="var(--illustration-ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
export function CartoonLoop({ small = false }: { small?: boolean }) {
  return (
    <>
      {small ? (
        <svg
          width="58"
          height="44"
          viewBox="0 0 58 44"
          fill="none"
          stroke="var(--pen-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="cartoon-loop cartoon-loop--small"
        >
          <path d="M4 8C26 2 46 10 44 34" vectorEffect="non-scaling-stroke" />
          <path d="M40.6 26.8L44 34L48.6 27.4" vectorEffect="non-scaling-stroke" />
        </svg>
      ) : (
        <svg
          width="70"
          height="60"
          viewBox="0 0 70 60"
          fill="none"
          stroke="var(--pen-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="cartoon-loop"
        >
          <path
            d="M62 6C40 2 22 14 32 28C40 40 58 30 48 20C38 10 14 26 10 50"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M6.8 41.6L10 50L15.7 43.1" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </>
  );
}
export function CartoonConnector() {
  return (
    <svg
      className="cartoon-connector"
      width="48"
      height="30"
      viewBox="0 0 48 30"
      fill="none"
      stroke="var(--illustration-ink)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 18C14 6 30 6 42 15" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
      <path d="M38.9 7.6L42 15L34.1 14" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
