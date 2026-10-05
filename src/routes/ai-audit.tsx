import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Terminal } from "lucide-react";

import { Nav, Footer } from "./index";
import { AiAuditForm } from "@/components/ai-audit-form";

export const Route = createFileRoute("/ai-audit")({
  component: AiAuditPage,
  head: () => ({
    meta: [
      {
        title: "Free 5-Minute AI Audit — Missed Calls | Novaris Nexus Tech",
      },
      {
        name: "description",
        content:
          "Answer a few quick questions and get a short summary of where AI automation could save your service business time or win back missed leads. Free, no call needed.",
      },
    ],
  }),
});

const STEPS = [
  {
    n: "01",
    title: "Answer a few quick questions",
    body: "About 3 minutes. No account, no card, no email verification.",
  },
  {
    n: "02",
    title: "We review your answers personally",
    body: "Not an automated report. We read them ourselves and think about your specific trade and call flow.",
  },
  {
    n: "03",
    title: "You receive a short summary",
    body: "Within 3 business days: where the time goes, and where AI could realistically help.",
  },
];

const CREDIBILITY = [
  {
    icon: Terminal,
    title: "Senior Systems Engineer",
    body: "15+ years spent building and running production infrastructure, not just advising on it.",
  },
];

function AiAuditPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main>
        {/* Hero */}
        <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 border-b border-border">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Free AI audit
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl mx-auto">
              Find out how many jobs missed calls are costing your business.
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
              Answer a few quick questions and get a short summary of where AI
              automation could save you time or win back missed leads. Free. No
              call needed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#audit-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90"
                style={{
                  background: "var(--gradient-hero)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                Start my free audit <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-20 border-b border-border">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary uppercase tracking-widest">
                How it works
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
                Three steps, about five minutes.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl border border-border bg-card/60 p-6"
                >
                  <div className="text-sm font-mono text-primary">{step.n}</div>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section id="audit-form" className="scroll-mt-28 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div
              className="rounded-3xl border border-border p-6 sm:p-10"
              style={{
                background: "var(--gradient-surface)",
                boxShadow: "var(--shadow-elegant)",
              }}
            >
              <h2 className="text-2xl font-bold">The audit questions</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fields marked required are the ones that actually change the
                summary.
              </p>
              <div className="mt-8">
                <AiAuditForm />
              </div>
            </div>
          </div>
        </section>

        {/* Credibility */}
        <section className="py-16 sm:py-20 border-t border-border">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary uppercase tracking-widest">
                Who reads this
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
                A person, not a funnel.
              </h2>
            </div>
            <div className="mt-10 max-w-xl">
              {CREDIBILITY.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-border bg-card/60 p-6"
                >
                  <div
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <item.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
