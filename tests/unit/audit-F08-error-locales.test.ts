import { describe, expect, it } from "vitest";
import { runInNewContext } from "node:vm";
import { renderErrorPage } from "@/lib/error-page";

describe("F-08 catastrophic error localization", () => {
  it.each([
    ["ru-RU,uz;q=0.5", "ru", "Страница не загрузилась"],
    ["en;q=0.2,uz-UZ;q=0.9", "uz", "Sahifa yuklanmadi"],
    ["ru;q=0,en;q=0.5", "en", "This page didn't load"],
    ["fr", "en", "This page didn't load"],
  ])("uses a supported request preference for %s", (header, language, title) => {
    const html = renderErrorPage(header);
    expect(html).toContain(`<html lang="${language}">`);
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toContain('href="/"');
  });

  it("does not interpolate untrusted header text", () => {
    const attack = '"><img src=x onerror=alert(1)>';
    const html = renderErrorPage(attack);
    expect(html).toContain('<html lang="en">');
    expect(html).not.toContain(attack);
  });

  it.each(["ru", "uz", "en"])(
    "honors the saved interface language %s without React",
    (language) => {
      const html = renderErrorPage("en");
      const elements = Object.fromEntries(
        ["title", "body", "retry", "home"].map((key) => [key, { textContent: "" }]),
      );
      const document = {
        title: "",
        documentElement: { lang: "en" },
        getElementById: (id: string) => elements[id.replace("fallback-", "")],
      };
      const script = html.match(/<script>([\s\S]*?)<\/script>/)![1];
      runInNewContext(script, { document, localStorage: { getItem: () => language } });
      expect(document.documentElement.lang).toBe(language);
      expect(document.title).toBe(elements.title.textContent);
      expect(elements.body.textContent.length).toBeGreaterThan(20);
      expect(elements.retry.textContent.length).toBeGreaterThan(0);
    },
  );

  it("keeps the server fallback when storage is blocked", () => {
    const html = renderErrorPage("uz");
    const document = { documentElement: { lang: "uz" } };
    expect(() =>
      runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)![1], {
        document,
        localStorage: {
          getItem: () => {
            throw new Error("blocked");
          },
        },
      }),
    ).not.toThrow();
    expect(document.documentElement.lang).toBe("uz");
  });
});
