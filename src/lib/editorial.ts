import { useI18n } from "./i18n";

/** All new editorial copy has an explicit EN/UZ/RU equivalent. */
export function useWords() {
  const { lang } = useI18n();
  return (en: string, uz: string, ru: string) => ({ en, uz, ru })[lang];
}
