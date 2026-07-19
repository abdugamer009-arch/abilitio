import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalList } from "@/components/LegalPage";
import { SITE_NAME, CONTACT_EMAIL, COMPANY_LOCATION } from "@/lib/constants";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Abilitio" },
      { name: "description", content: "How Abilitio collects, uses, and protects student data, including assessment responses and information about minors." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`This policy explains what ${SITE_NAME} collects, why, and the choices you have. We built ${SITE_NAME} for students, so protecting young people's data is central to how we operate.`}
    >
      <LegalSection heading="1. Who we are">
        <p>
          {SITE_NAME} is a talent-discovery platform based in {COMPANY_LOCATION}. We provide career and
          cognitive assessments for students, parents, and schools. For any privacy question or request you can
          reach us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection heading="2. Information we collect">
        <LegalList
          items={[
            <><strong className="text-foreground">Account details</strong> — your name, surname, and email address when you register.</>,
            <><strong className="text-foreground">Assessment data</strong> — your responses to personality, cognitive, interest, and IQ questions, and the results we generate (career matches, strengths, MBTI type, and scores).</>,
            <><strong className="text-foreground">School membership</strong> — if you join with a school code, your class and school association.</>,
            <><strong className="text-foreground">Profile content</strong> — an optional avatar photo you choose to upload.</>,
            <><strong className="text-foreground">Usage information</strong> — basic technical data such as your language preference and how you interact with the product, used to keep the service working and improve it.</>,
          ]}
        />
        <p>
          {SITE_NAME} is free to use, so we do <strong className="text-foreground">not</strong> collect payment card
          numbers or any billing information.
        </p>
      </LegalSection>

      <LegalSection heading="3. Children and students">
        <p>
          {SITE_NAME} is designed for students, including minors. Where a student is below the age of digital consent
          in their country, we rely on consent from a parent, legal guardian, or the participating school acting on
          the family's behalf. Schools that invite students confirm they have the authority and consent to do so.
        </p>
        <p>
          We collect only what is needed to deliver assessments and insights, and we never sell students' personal
          data or use it for third-party advertising.
        </p>
      </LegalSection>

      <LegalSection heading="4. How we use your information">
        <LegalList
          items={[
            "Generate your assessment results and personalized talent insights.",
            "Provide schools with aggregated and individual talent analytics for students who joined their school.",
            "Maintain your account, save your progress, and keep the service secure.",
            "Respond to your requests and improve the quality of the platform.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="5. Service providers">
        <p>We share data only with the processors that make the service run, under appropriate safeguards:</p>
        <LegalList
          items={[
            <><strong className="text-foreground">Supabase</strong> — authentication, database, and file storage hosting.</>,
            <><strong className="text-foreground">Anthropic</strong> — powering AI features (such as the ABBI assistant) when enabled; conversation content needed to answer you may be processed.</>,
          ]}
        />
        <p>We do not sell your personal information to anyone.</p>
      </LegalSection>

      <LegalSection heading="6. Data retention and deletion">
        <p>
          We keep your data for as long as your account is active. You can ask us to delete your account and
          associated personal data at any time by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>. Schools
          may retain aggregated, de-identified statistics that cannot reasonably identify an individual student.
        </p>
      </LegalSection>

      <LegalSection heading="7. Your rights">
        <p>Depending on where you live, you may have the right to:</p>
        <LegalList
          items={[
            "Access the personal data we hold about you.",
            "Correct inaccurate information.",
            "Delete your account and personal data.",
            "Withdraw consent you previously gave.",
          ]}
        />
        <p>
          To exercise any of these, contact{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection heading="8. Cookies and local storage">
        <p>
          We use your browser's storage to keep you signed in and to save your in-progress assessments so a reload
          never loses your work. We do not use third-party advertising cookies.
        </p>
      </LegalSection>

      <LegalSection heading="9. Security">
        <p>
          Data is transmitted over encrypted connections, and access to student records is restricted at the database
          level so that only you, and the school you join, can see your results. No method of transmission or storage
          is perfectly secure, but we work to protect your information using current best practices.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to this policy">
        <p>
          We may update this policy as the product evolves. When we make material changes, we will update the date at
          the top of this page. Continued use of {SITE_NAME} after changes take effect means you accept the updated
          policy.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
