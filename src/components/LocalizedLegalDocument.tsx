import { Fragment } from "react";
import { LegalList, LegalPage, LegalSection } from "./LegalPage";
import { useI18n } from "@/lib/i18n";
import { legalTranslations } from "@/lib/legal-translations";
import { COMPANY_LOCATION, CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

type Section = {
  heading: string[];
  paragraphs?: string[][];
  items?: string[][];
  after?: string[][];
};
/** Faithful translations of the existing documents. Source policy remains unchanged. */
export function LocalizedLegalDocument({ kind }: { kind: "privacy" | "terms" }) {
  const { lang } = useI18n();
  const index = lang === "ru" ? 1 : 0;
  const copy = legalTranslations[kind];
  const expand = (text: string) =>
    text.replaceAll("{site}", SITE_NAME).replaceAll("{location}", COMPANY_LOCATION);
  const rich = (text: string) =>
    expand(text)
      .split("{email}")
      .map((part, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
              {CONTACT_EMAIL}
            </a>
          )}
          {part}
        </Fragment>
      ));
  const item = (text: string) => {
    const split = text.indexOf(" — ");
    return split < 0 ? (
      rich(text)
    ) : (
      <>
        <strong className="text-foreground">{text.slice(0, split)}</strong>
        {rich(text.slice(split))}
      </>
    );
  };
  return (
    <LegalPage title={copy.title[index]} intro={expand(copy.intro[index])}>
      {(copy.sections as Section[]).map((section) => (
        <LegalSection key={section.heading[0]} heading={section.heading[index]}>
          {section.paragraphs?.map((text, i) => (
            <p key={i}>{rich(text[index])}</p>
          ))}
          {section.items && <LegalList items={section.items.map((text) => item(text[index]))} />}
          {section.after?.map((text, i) => (
            <p key={i}>{rich(text[index])}</p>
          ))}
        </LegalSection>
      ))}
    </LegalPage>
  );
}
