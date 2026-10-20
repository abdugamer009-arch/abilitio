export const FOUNDERS = [
  {
    id: "umar",
    name: "Axmedov Umar",
    role: {
      en: "Co-founder & Developer",
      uz: "Hamasoschi va dasturchi",
      ru: "Сооснователь и разработчик",
    },
    bio: {
      en: "Umar co-founded Abilitio and developed its website. He is responsible for the technical side of the project.",
      uz: "Umar Abilitio loyihasiga hamasoschi bo‘lgan va uning veb-saytini ishlab chiqqan. U loyihaning texnik tomoniga mas’ul.",
      ru: "Умар — сооснователь Abilitio и разработчик сайта. Он отвечает за техническую часть проекта.",
    },
    src: "/images/founders/axmedov-umar.jpg",
    width: 960,
    height: 1280,
  },
  {
    id: "abduraxmon",
    name: "Abduraxmon",
    role: {
      en: "Co-founder",
      uz: "Hamasoschi",
      ru: "Сооснователь",
    },
    bio: {
      en: "Abduraxmon co-founded Abilitio with Axmedov Umar.",
      uz: "Abduraxmon Axmedov Umar bilan birga Abilitio loyihasiga asos solgan.",
      ru: "Абдурахмон основал Abilitio вместе с Умаром Ахмедовым.",
    },
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
