import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalList } from "@/components/LegalPage";
import { SITE_NAME, CONTACT_EMAIL, COMPANY_LOCATION } from "@/lib/constants";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Abilitio" },
      {
        name: "description",
        content:
          "The terms that govern your use of Abilitio, including eligibility, assessments, and payments.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={`These terms govern your use of ${SITE_NAME}. By creating an account or using the service, you agree to them.`}
    >
      <LegalSection heading="1. Acceptance of terms">
        <p>
          By accessing or using {SITE_NAME}, you agree to be bound by these Terms of Service and our
          Privacy Policy. If you do not agree, please do not use the service.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility">
        <p>
          {SITE_NAME} is intended for students and the parents, guardians, and schools that support
          them. If you are a minor, you may use the service only with the consent and involvement of
          a parent, guardian, or participating school. Schools confirm they are authorized to invite
          the students they onboard.
        </p>
      </LegalSection>

      <LegalSection heading="3. Your account">
        <LegalList
          items={[
            "You are responsible for the accuracy of the information you provide.",
            "You are responsible for keeping your password secure and for activity under your account.",
            "Notify us promptly of any unauthorized use.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="4. Nature of assessments">
        <p>
          {SITE_NAME}'s assessments — including personality, interest, cognitive, and IQ-style tests
          — are designed for self-discovery, guidance, and educational planning. They are{" "}
          <strong className="text-foreground">not</strong> clinical, diagnostic, or psychometrically
          certified instruments, and they should not be used as a substitute for professional
          psychological, medical, or career counseling. Results are indicative and meant to spark
          reflection and conversation, not to label or limit anyone.
        </p>
      </LegalSection>

      <LegalSection heading="5. A free service">
        <p>
          Abilitio is provided free of charge. There are no paid plans, subscriptions, or in-app
          purchases, and we do not collect payment information. We may introduce optional paid
          features in the future; if we ever do, we will update these terms and clearly disclose any
          pricing before you are asked to pay.
        </p>
      </LegalSection>

      <LegalSection heading="6. Acceptable use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            "Use the service for any unlawful purpose or in violation of these terms.",
            "Attempt to disrupt, reverse-engineer, or gain unauthorized access to the platform.",
            "Submit content that is harmful, abusive, or infringes the rights of others.",
            "Misrepresent your identity or your authority to enroll students.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="7. Intellectual property">
        <p>
          The {SITE_NAME} platform, including its design, content, and assessment materials, is
          owned by {SITE_NAME} and protected by applicable law. Your own data and results remain
          yours; you grant us the limited rights needed to operate the service for you.
        </p>
      </LegalSection>

      <LegalSection heading="8. Disclaimers and limitation of liability">
        <p>
          The service is provided "as is" without warranties of any kind. To the maximum extent
          permitted by law, {SITE_NAME} is not liable for indirect, incidental, or consequential
          damages, or for decisions made solely on the basis of assessment results.
        </p>
      </LegalSection>

      <LegalSection heading="9. Termination">
        <p>
          You may stop using {SITE_NAME} and request account deletion at any time. We may suspend or
          terminate accounts that violate these terms or harm other users or the service.
        </p>
      </LegalSection>

      <LegalSection heading="10. Governing law">
        <p>
          These terms are governed by the laws of {COMPANY_LOCATION}, without regard to
          conflict-of-law principles.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contact">
        <p>
          Questions about these terms? Email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
