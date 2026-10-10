export const FOUNDERS = [
  {
    id: "umar",
    name: "Axmedov Umar",
    src: "/images/founders/axmedov-umar.jpg",
    width: 960,
    height: 1280,
  },
  {
    id: "abduraxmon",
    name: "Abduraxmon",
    src: "/images/founders/abduraxmon.jpg",
    width: 640,
    height: 640,
  },
] as const;

export function FounderPortrait({ founder }: { founder: (typeof FOUNDERS)[number] }) {
  return (
    <div className={`founder-portrait founder-portrait--${founder.id}`}>
      <img
        src={founder.src}
        alt={founder.name}
        width={founder.width}
        height={founder.height}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
