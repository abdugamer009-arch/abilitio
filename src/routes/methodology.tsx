import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalList } from "@/components/LegalPage";
import { FlaskConical, ArrowRight } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "How It Works — Abilitio Methodology" },
      {
        name: "description",
        content:
          "How Abilitio's assessments work: what personality, cognitive, and interest signals measure, how career matches are scored, and the limits of the results.",
      },
    ],
  }),
  component: MethodologyPage,
});

function MethodologyPage() {
  return (
    <LegalPage
      eyebrow="How it works"
      icon={FlaskConical}
      showUpdated={false}
      title="Our Methodology"
      intro={`${SITE_NAME} turns a short set of questions into a structured picture of your strengths. Here is exactly what we measure, how we combine it, and what the results do and don't mean.`}
    >
      <LegalSection heading="Three signals we measure">
        <p>
          The Career Intelligence Assessment is 30 questions across three complementary signals:
        </p>
        <LegalList
          items={[
            <>
              <strong className="text-foreground">Personality (12 questions)</strong> —
              agree/disagree statements that map your working style across well-established
              personality dimensions (the same trait families behind Big Five and MBTI-style
              frameworks).
            </>,
            <>
              <strong className="text-foreground">Cognitive reasoning (9 questions)</strong> — a
              short check of logic, pattern recognition, and analytical reasoning that produces your
              IQ signal. Treat it as a fast, directional read that sharpens with retakes.
            </>,
            <>
              <strong className="text-foreground">Interests (9 questions)</strong> — what kinds of
              activities and problems genuinely pull your attention, in the spirit of
              interest-inventory models like RIASEC.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="How career matches are scored">
        <p>
          Each career in our library is described by the profile of strengths it tends to reward. We
          score your fit by weighting the three signals:
        </p>
        <LegalList
          items={[
            <>
              <strong className="text-foreground">40%</strong> personality fit
            </>,
            <>
              <strong className="text-foreground">35%</strong> cognitive fit
            </>,
            <>
              <strong className="text-foreground">25%</strong> interest fit
            </>,
          ]}
        />
        <p>
          The result is a ranked list of matches with a percentage for each, plus a cognitive
          profile and a personality type. Questions are drawn from a larger bank and rotate between
          attempts, so retaking gives a fresh — and often sharper — read.
        </p>
      </LegalSection>

      <LegalSection heading="One assessment, three sections in order">
        <p>
          Everything happens inside a single{" "}
          <Link to="/career-assessment" className="text-primary hover:underline">
            assessment
          </Link>
          : cognitive ability first, then personality, then interests. The 9-question cognitive
          section produces your IQ signal — a fast, directional indicator that sharpens with
          retakes, since questions rotate from a larger bank on every attempt.
        </p>
      </LegalSection>

      <LegalSection heading="What the results mean — and what they don't">
        <LegalList
          items={[
            "Results are designed for self-discovery and planning: a starting point for conversations with mentors, teachers, and parents.",
            "They are indicative, not clinical or diagnostic, and are not a certified psychometric instrument.",
            "No single result should be used to label a student or close off any path. People grow, and so do their scores.",
            "Because questions rotate and people change, your profile is a snapshot in time — revisit it as you grow.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Privacy by design">
        <p>
          Your answers and results belong to you. We restrict access at the database level so only
          you — and a school you explicitly join — can see your results. See our{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          for the full picture.
        </p>
        <div className="pt-2">
          <Link
            to="/career-assessment"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] transition-all hover:-translate-y-0.5"
          >
            Take the assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
