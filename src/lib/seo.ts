import { SITE_URL, OG_IMAGE_URL } from "./constants";
export function pageMeta(path: string, title: string, description: string) {
  const name = `${title} — Abilitio`;
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    meta: [
      { title: name },
      { name: "description", content: description },
      { property: "og:title", content: name },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: name },
      { name: "twitter:description", content: description },
      { property: "og:image", content: OG_IMAGE_URL },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
