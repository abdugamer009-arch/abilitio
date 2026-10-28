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
      en: "Co-founder & Speaker",
      uz: "Hamasoschi va spiker",
      ru: "Сооснователь и спикер",
    },
    bio: {
      en: "Abduraxmon works on project planning and outreach, helps with school partnerships, and is Abilitio’s main speaker.",
      uz: "Abduraxmon loyihani rejalashtirish va targ‘ib qilishda qatnashadi, maktablar bilan hamkorlikni yo‘lga qo‘yishga yordam beradi va Abilitio loyihasining asosiy spikeri sifatida chiqish qiladi.",
      ru: "Абдурахмон занимается планированием проекта и внешними коммуникациями, помогает налаживать партнёрства со школами и выступает как основной спикер Abilitio.",
    },
    src: "/images/founders/abduraxmon.jpg",
    width: 640,
    height: 640,
  },
  {
    id: "sarvarbek",
    name: "Izzatulloyev Sarvarbek",
    role: { en: "Manager", uz: "Menejer", ru: "Менеджер" },
    bio: {
      en: "Helped connect schools with Abilitio and recruit volunteers.",
      uz: "Maktablar bilan Abilitio o‘rtasida aloqa o‘rnatish va ko‘ngillilarni jalb qilishga yordam berdi.",
      ru: "Помог наладить связи между школами и Abilitio и привлечь волонтёров.",
    },
    src: "/images/founders/izzatulloyev-sarvarbek.png",
    width: 306,
    height: 237,
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
