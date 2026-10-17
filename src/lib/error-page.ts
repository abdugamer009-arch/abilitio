import appCss from "../styles.css?url";

// Reuse the existing ENG/RU/UZ errorPages and common labels from i18n.tsx.
const copy = {
  en: {
    title: "This page didn't load",
    body: "Something went wrong on our end. You can try refreshing or head back home.",
    retry: "Try again",
    home: "Go home",
  },
  ru: {
    title: "Страница не загрузилась",
    body: "Что-то пошло не так на нашей стороне. Попробуйте обновить страницу или вернуться на главную.",
    retry: "Повторить",
    home: "На главную",
  },
  uz: {
    title: "Sahifa yuklanmadi",
    body: "Bizning tomonda xatolik yuz berdi. Sahifani yangilab ko'ring yoki bosh sahifaga qayting.",
    retry: "Qayta urinish",
    home: "Bosh sahifaga",
  },
};

function requestLanguage(header: string | null | undefined): keyof typeof copy {
  const preferences = (header ?? "").split(",").map((entry) => {
    const [tag, ...parameters] = entry.trim().toLowerCase().split(";");
    const quality = parameters.find((part) => part.trim().startsWith("q="));
    return { tag: tag.split("-")[0], q: quality ? Number(quality.trim().slice(2)) : 1 };
  });
  for (const { tag, q } of preferences.sort((a, b) => b.q - a.q)) {
    if (q > 0 && q <= 1 && (tag === "en" || tag === "ru" || tag === "uz")) return tag;
  }
  return "en";
}

export function renderErrorPage(acceptLanguage?: string | null): string {
  const language = requestLanguage(acceptLanguage);
  const text = copy[language];
  return `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8" />
    <title>${text.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="${appCss}" />
  </head>
  <body class="fallback-error">
    <div class="panel empty-card">
      <h1 id="fallback-title">${text.title}</h1>
      <p id="fallback-body">${text.body}</p>
      <div class="actions">
        <button id="fallback-retry" class="field-button" onclick="location.reload()">${text.retry}</button>
        <a id="fallback-home" class="field-button secondary" href="/">${text.home}</a>
      </div>
    </div>
    <script>
      try {
        const language = localStorage.getItem("abilitio_lang");
        const copies = ${JSON.stringify(copy).replace(/</g, "\\u003c")};
        if (language === "en" || language === "ru" || language === "uz") {
          const text = copies[language];
          document.documentElement.lang = language;
          document.title = text.title;
          for (const key of ["title", "body", "retry", "home"])
            document.getElementById("fallback-" + key).textContent = text[key];
        }
      } catch { /* Browser storage is optional; request language remains usable. */ }
    </script>
  </body>
</html>`;
}
