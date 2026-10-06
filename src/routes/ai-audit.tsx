import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Terminal } from "lucide-react";

import { Nav, Footer } from "./index";
import { AiAuditForm } from "@/components/ai-audit-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { canonicalMeta, socialMeta } from "@/lib/seo";

export const Route = createFileRoute("/ai-audit")({
  component: AiAuditPage,
  head: () => ({
    meta: [
      {
        title:
          "Free 5-Minute AI Audit: What Are Missed Inquiries Costing You? | Novaris Nexus Tech",
      },
      {
        name: "description",
        content:
          "Answer a few quick questions and get a personalized AI Opportunity Summary within 3 business days. Free. No call needed.",
      },
      ...canonicalMeta("/ai-audit"),
      ...socialMeta({
        title: "Free 5-Minute AI Audit: What Are Missed Inquiries Costing You?",
        description:
          "Answer a few quick questions and get a personalized AI Opportunity Summary within 3 business days. Free. No call needed.",
        path: "/ai-audit",
        image: {
          path: "/og/ai-audit.png",
          alt: "Free 5-Minute AI Audit from Novaris Nexus Tech",
        },
      }),
    ],
  }),
});

const FAQ = [
  {
    q: "Is it really free?",
    a: "Yes. The audit and the AI Opportunity Summary cost nothing, and there is nothing to buy afterwards. If we find something worth building, we will tell you what we would do and what it would roughly involve — the decision stays entirely yours.",
  },
  {
    q: "Will you pitch me afterward?",
    a: "You get the summary either way. If it turns out there is a clear opportunity and you want help with it, we will suggest a short walkthrough. If the honest answer is that nothing here is worth automating yet, that is what we will tell you.",
  },
  {
    q: "What happens after I submit?",
    a: "We read your answers, work through your numbers by hand, and email your AI Opportunity Summary within 3 business days. You can optionally book a 15-minute walkthrough from the confirmation screen if you would rather talk it through than wait.",
  },
];

const CTA =
  "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90";

const CTA_STYLE = {
  background: "var(--gradient-hero)",
  boxShadow: "var(--shadow-glow)",
};

const CREDIBILITY = [
  {
    icon: Terminal,
    title: "Senior Systems Engineer",
    body: "15+ years spent building and running production infrastructure, not just advising on it. CPD (Continuing Professional Development) certified AI Agents builder.",
  },
];

function AiAuditPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main>
        {/* Hero */}
        <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 border-b border-border">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Free AI audit
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl xl:text-[3.25rem] leading-[1.1] font-bold max-w-5xl mx-auto text-balance">
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                Find out where Novaris AI Products could save your business time,
                automate repetitive work, and recover missed opportunities.
              </span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
              Answer a few quick questions and get a Free{" "}
              <strong className="font-semibold text-foreground">
                personalized AI Opportunity Summary
              </strong>{" "}
              within 3 business days, manually reviewed. No call needed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#audit-form" className={CTA} style={CTA_STYLE}>
                Start my free audit <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 sm:py-20 border-b border-border">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary uppercase tracking-widest">
                What you&apos;ll get
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
                Numbers first, then a recommendation.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground">
                Your summary starts with what the answers suggest is going
                unanswered, what that costs, and what we would look at first.
                Here is the shape of it, using a fictional business:
              </p>
            </div>

            <div className="mt-8 sm:mt-10 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Example only — a fictional business
              </p>

              <div className="mt-5 space-y-5 text-sm sm:text-base">
                <div>
                  <p className="font-semibold">Based on</p>
                  <p className="mt-1 text-muted-foreground">
                    35 inbound requests a week, average customer value $1,200, a
                    small team, and replies that usually run a day or two
                    behind.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">What that suggests</p>
                  <p className="mt-1 text-muted-foreground">
                    Roughly 12 to 18 requests a month go unanswered — the
                    estimate widens once we see the real backlog. At $1,200 a
                    customer, that is somewhere between{" "}
                    <span className="font-semibold text-foreground">
                      $14,000 and $21,000 a month
                    </span>{" "}
                    in value that never gets captured.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">What we&apos;d check first</p>
                  <p className="mt-1 text-muted-foreground">
                    Whether overflow and after-hours requests can be answered by
                    an assistant that responds immediately and books on your
                    calendar, before anything else is automated. Ranges,
                    assumptions and the reasoning all come written out, so you
                    can disagree with any of it.
                  </p>
                </div>
              </div>
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
            <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="max-w-xl">
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
              <div className="w-56 max-w-full shrink-0">
                <img
                  src="/logos/certifications/certified_agent_builder.png"
                  alt="Certified Agent Builder"
                  width={1536}
                  height={1536}
                  className="w-full rounded-2xl border border-border object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 border-t border-border">
          <div className="mx-auto max-w-3xl px-6">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Questions
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
              Before you hand over the answers.
            </h2>
            <Accordion type="single" collapsible className="mt-8">
              {FAQ.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-16 sm:py-20 border-t border-border">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">
              Find out what&apos;s walking out of the door.
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-sm sm:text-base text-muted-foreground">
              About five minutes of questions. A written summary within 3
              business days, manually reviewed.
            </p>
            <div className="mt-8 flex justify-center">
              <a href="#audit-form" className={CTA} style={CTA_STYLE}>
                Start my free audit <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
