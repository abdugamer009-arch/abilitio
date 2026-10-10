/** Exact cartoon paths from Main.dc.html. The active pin follows the illustration clock. */
export function BrainPoster({
  label = "Illustrative folded brain with two hemispheres",
  signal = 0,
}: {
  label?: string;
  signal?: number;
}) {
  return (
    <svg viewBox="0 0 360 300" role="img" aria-label={label} className="cartoon-brain">
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: "bob 5.5s ease-in-out infinite",
        }}
      >
        <path
          d="M192 208C192 238 194 260 200 276C204 286 220 286 222 274C224 256 220 232 218 208Z"
          fill="var(--brain-shade)"
          stroke="var(--illustration-ink)"
          strokeWidth="3.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M214 210A17 17 0 0 1 232 190A22 22 0 0 1 268 184A21 21 0 0 1 300 196A17 17 0 0 1 306 222A18 18 0 0 1 284 242A23 23 0 0 1 246 244A18 18 0 0 1 220 230A13 13 0 0 1 214 210Z"
          fill="var(--brain-shade)"
          stroke="var(--illustration-ink)"
          strokeWidth="3.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M238 206Q262 199 292 206M232 220Q264 212 298 221M242 233Q264 228 286 233"
          fill="none"
          stroke="var(--illustration-ink)"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M70 190A32 32 0 0 1 52 140A30 30 0 0 1 68 92A32 32 0 0 1 110 58A32 32 0 0 1 162 44A31 31 0 0 1 214 46A31 31 0 0 1 262 64A30 30 0 0 1 296 100A28 28 0 0 1 306 146A26 26 0 0 1 290 186A57 57 0 0 1 246 204A61 61 0 0 1 196 214A60 60 0 0 1 146 216A51 51 0 0 1 104 210A26 26 0 0 1 70 190Z"
          fill="var(--brain-pink)"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M82 197C96 205 120 211 146 213C170 214 222 211 246 201C262 196 276 192 284 188C262 192 228 196 196 199C164 202 120 203 82 197Z"
          fill="var(--brain-shade)"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M98 172C118 164 138 172 160 162C182 152 204 160 222 148M196 52C186 70 202 84 192 102C184 118 198 130 190 146M78 122C92 108 108 120 120 106C130 94 146 100 150 86M226 78C238 92 254 84 262 100C270 114 284 112 288 128M134 190C148 184 164 192 178 186M244 132C254 144 266 138 272 152M96 146C108 138 120 148 132 140"
          fill="none"
          stroke="var(--illustration-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M70 190A32 32 0 0 1 52 140A30 30 0 0 1 68 92A32 32 0 0 1 110 58A32 32 0 0 1 162 44A31 31 0 0 1 214 46A31 31 0 0 1 262 64A30 30 0 0 1 296 100A28 28 0 0 1 306 146A26 26 0 0 1 290 186A57 57 0 0 1 246 204A61 61 0 0 1 196 214A60 60 0 0 1 146 216A51 51 0 0 1 104 210A26 26 0 0 1 70 190Z"
          fill="none"
          stroke="var(--illustration-ink)"
          strokeWidth="3.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M96 90C104 80 114 72 126 67"
          fill="none"
          stroke="var(--white)"
          strokeWidth="6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="86" cy="104" r="4" fill="var(--white)" vectorEffect="non-scaling-stroke" />
        <g style={{ opacity: signal === 0 ? 1 : 0, transition: "opacity .3s ease" }}>
          <circle
            cx="150"
            cy="66"
            r="11"
            fill="none"
            stroke="var(--mint-text)"
            strokeWidth="3"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "pulse 1.6s ease-out infinite",
            }}
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <circle
          cx="150"
          cy="66"
          r="11"
          fill="var(--mint-solid)"
          stroke="var(--illustration-ink)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="150"
          cy="66"
          r="3.5"
          fill="var(--illustration-ink)"
          vectorEffect="non-scaling-stroke"
        />
        <g style={{ opacity: signal === 1 ? 1 : 0, transition: "opacity .3s ease" }}>
          <circle
            cx="228"
            cy="118"
            r="11"
            fill="none"
            stroke="var(--butter-text)"
            strokeWidth="3"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "pulse 1.6s ease-out infinite",
            }}
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <circle
          cx="228"
          cy="118"
          r="11"
          fill="var(--butter-solid)"
          stroke="var(--illustration-ink)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="228"
          cy="118"
          r="3.5"
          fill="var(--illustration-ink)"
          vectorEffect="non-scaling-stroke"
        />
        <g style={{ opacity: signal === 2 ? 1 : 0, transition: "opacity .3s ease" }}>
          <circle
            cx="254"
            cy="176"
            r="11"
            fill="none"
            stroke="var(--pink-text)"
            strokeWidth="3"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "pulse 1.6s ease-out infinite",
            }}
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <circle
          cx="254"
          cy="176"
          r="11"
          fill="var(--pink-solid)"
          stroke="var(--illustration-ink)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="254"
          cy="176"
          r="3.5"
          fill="var(--illustration-ink)"
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <g transform="translate(30 52)">
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
      <g transform="translate(334 40) scale(0.75)">
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
            animationDelay: ".7s",
          }}
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <g transform="translate(336 252) scale(1.1)">
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
            animationDelay: "1.4s",
          }}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
