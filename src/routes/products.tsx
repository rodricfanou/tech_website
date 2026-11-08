import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Nav, Footer } from "./index";
import { CONTACT_EMAIL } from "@/components/contact-form";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      {
        title:
          "Products — Mission Control & AI Maintenance Coordinator | Novaris Nexus Tech",
      },
      {
        name: "description",
        content:
          "See how Novaris Nexus Tech builds AI systems around real business workflows — from an executive command center to an AI maintenance coordinator.",
      },
    ],
  }),
});

function ProductsPage() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">
            Products
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold font-display max-w-3xl mx-auto">
            AI systems built around{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              real business workflows.
            </span>
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
            Explore examples of how we use AI to automate repetitive work,
            connect information, and turn everyday business processes into
            intelligent workflows.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 sm:py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-semibold text-primary-foreground transition hover:opacity-90"
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              Get a custom quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ai-audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm sm:text-base font-medium hover:bg-card transition"
            >
              Free 5-minute AI audit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div
            className="mb-12 sm:mb-16 flex flex-col sm:flex-row items-center justify-center gap-3 rounded-2xl border border-border px-6 py-5 text-center"
            style={{ background: "var(--gradient-surface)" }}
          >
            <Sparkles className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm sm:text-base">
              <span className="font-semibold text-foreground">
                Fully customizable:
              </span>{" "}
              <span className="text-muted-foreground">
                every tool below is tailored to your business, your data, and
                your workflows.
              </span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div
              id="ai-call-assistant"
              className="scroll-mt-28 rounded-2xl border border-border bg-card/60 p-8 flex flex-col items-start justify-center min-h-[420px] text-left"
              style={{ background: "var(--gradient-surface)" }}
            >
              <h3 className="w-full font-semibold text-lg mb-2">
                AI Call Assistant
              </h3>
              <a
                href="/videos/demo_voice_assistant.mp4"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Watch the video <ArrowRight className="h-4 w-4" />
              </a>
              <p className="w-full font-medium text-base mb-2">
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-hero)" }}
                >
                  Never lose another client to voicemail.
                </span>
              </p>
              <div className="w-full text-sm text-muted-foreground mb-5 max-w-xl space-y-3">
                <p>
                  Our 24/7 AI Voice Assistant answers inbound calls instantly,
                  qualifies prospects, and books appointments directly onto your
                  live calendar in under 2 minutes.
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Zero phone tag",
                    "Zero back-and-forth messaging",
                    "100% automated bookings around the clock",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <strong className="font-semibold text-foreground">
                        {item}
                      </strong>
                    </li>
                  ))}
                </ul>
                <p>
                  Built for clinics, law firms, real estate companies, leasing
                  offices, home services, and appointment-based businesses.
                  Fully configured and live in 48 hours.
                </p>
              </div>
              <div
                className="relative mt-auto w-full overflow-hidden rounded-xl border border-border"
                style={{ aspectRatio: "16 / 9" }}
              >
                <video
                  className="absolute inset-0 h-full w-full object-contain"
                  src="/videos/demo_voice_assistant.mp4"
                  poster="/videos/demo_voice_assistant.png"
                  controls
                  muted
                  preload="metadata"
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div
              id="mission-control"
              className="scroll-mt-28 rounded-2xl border border-border bg-card/60 p-8 flex flex-col items-start justify-center min-h-[420px] text-left"
              style={{ background: "var(--gradient-surface)" }}
            >
              <h3 className="w-full font-semibold text-lg mb-2">
                Mission Control: The Executive AI Chief of Staff
              </h3>
              <a
                href="/videos/mission_control.mp4"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Watch the 2-minute executive briefing{" "}
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="w-full font-medium text-base mb-2">
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-hero)" }}
                >
                  Reclaim 10+ hours a week from operational noise.
                </span>
              </p>
              <div className="w-full text-sm text-muted-foreground mb-5 max-w-xl space-y-3">
                <p>
                  Stop context-switching across 10 different tabs. Mission
                  Control integrates with your email, calendar, documents, and
                  company data to act as your autonomous operational cockpit.
                </p>
                <ul className="space-y-1.5">
                  {[
                    {
                      title: "Zero Morning Scramble:",
                      desc: "Delivers an intelligent 8:00 AM daily briefing prioritizing only the decisions that move the needle.",
                    },
                    {
                      title: "Zero Dropped Balls:",
                      desc: "Instantly flags high-risk emails, overdue client deliverables, and blocked team initiatives.",
                    },
                    {
                      title: "Autonomous Triage:",
                      desc: "Drafts responses, schedules high-priority meetings, and tracks action items on autopilot.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="font-semibold text-foreground">
                          {item.title}
                        </strong>{" "}
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="italic">
                  Turn scattered information into decisive execution.
                </p>
              </div>
              <div
                className="relative mt-auto w-full overflow-hidden rounded-xl border border-border"
                style={{ aspectRatio: "16 / 9" }}
              >
                <video
                  className="absolute inset-0 h-full w-full object-contain"
                  src="/videos/mission_control.mp4"
                  poster="/videos/demo_mission_control_3.png"
                  controls
                  muted
                  preload="metadata"
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div
              id="ai-maintenance-coordinator"
              className="scroll-mt-28 rounded-2xl border border-border bg-card/60 p-8 flex flex-col items-start justify-center min-h-[420px] text-left"
              style={{ background: "var(--gradient-surface)" }}
            >
              <h3 className="w-full font-semibold text-lg mb-2">
                Novaris AI Maintenance Coordinator
              </h3>
              <a
                href="/videos/Novaris-Maintenance-app.mp4"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Watch the 2-minute demo <ArrowRight className="h-4 w-4" />
              </a>
              <p className="w-full font-medium text-base mb-2">
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-hero)" }}
                >
                  Built for property management: cut maintenance response times
                  by 80% without adding headcount.
                </span>
              </p>
              <div className="w-full text-sm text-muted-foreground mb-5 max-w-xl space-y-3">
                <p>
                  Triage every resident request the second it arrives. Novaris
                  automatically classifies the issue, flags urgent safety risks,
                  matches the right vendor, and preps work orders—so your
                  property team only steps in for final approvals.
                </p>
                <ul className="space-y-1.5">
                  {[
                    {
                      title: "Zero Delayed Emergencies:",
                      desc: "Instant 24/7 triage catches water leaks and safety hazards immediately.",
                    },
                    {
                      title: "Zero Manual Dispatch:",
                      desc: "Matches preferred vendors and drafts work orders on autopilot.",
                    },
                    {
                      title: "Zero Back-and-Forth:",
                      desc: "Keeps residents automatically updated at every step.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="font-semibold text-foreground">
                          {item.title}
                        </strong>{" "}
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="italic">
                  Seamlessly connects with your existing property management
                  software.
                </p>
              </div>
              <div
                className="relative mt-auto w-full overflow-hidden rounded-xl border border-border"
                style={{ aspectRatio: "16 / 9" }}
              >
                <video
                  className="absolute inset-0 h-full w-full object-contain"
                  src="/videos/Novaris-Maintenance-app.mp4"
                  poster="/videos/thumbnail_maintenance.jpg"
                  controls
                  muted
                  preload="metadata"
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            These are examples of what we can build around your business.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground">
            Every organization works differently. We design AI systems around
            your workflows, data, tools, and teams—not the other way around.
          </p>
          <p className="mt-8 text-xl sm:text-2xl font-semibold">
            What could we automate in your business?
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/ai-audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-semibold text-primary-foreground transition hover:opacity-90"
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              Take the free 5-minute AI audit <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="w-full text-xs sm:text-sm text-muted-foreground sm:max-w-sm">
              We review your answers ourselves, then reply with a summary and an
              invitation to a complimentary session.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div
            className="relative overflow-hidden rounded-3xl border border-border p-8 sm:p-12 md:p-20 text-center"
            style={{
              background: "var(--gradient-surface)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "var(--gradient-glow)" }}
            />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-2xl mx-auto">
                Interested in a product?
              </h2>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                Tell us what you're looking for — request a demo or a
                walkthrough, and we'll get back to you within one business day.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-semibold text-primary-foreground transition hover:opacity-90"
                  style={{
                    background: "var(--gradient-hero)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  Request a demo <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm sm:text-base font-medium hover:bg-card transition break-all sm:break-normal"
                >
                  <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
