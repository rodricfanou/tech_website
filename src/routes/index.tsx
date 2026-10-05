import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Brain,
  Mic,
  Cog,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Mail,
  X,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  Shield,
  Zap,
  Award,
} from "lucide-react";
import {
  CONTACT_EMAIL,
  ContactForm,
  topicFromFeature,
} from "@/components/contact-form";
import heroImg from "@/assets/hero.jpg";
import heroImgWebp from "@/assets/hero.webp";

const LOGO_FULL = "/logos/novaris-full-optimized.png";
const LOGO_FULL_WEBP = "/logos/novaris-full.webp";

export const Route = createFileRoute("/")({
  component: Index,
});

const MARQUEE_ITEMS = [
  "Website Creation or Makeover",
  "Building AI Systems & Networks",
  "AI Consulting",
  "Training",
  "Digital & Infrastructure Advisory",
  "Talks",
];

const MARQUEE_SLIDE_FRACTION = 0.25;

// Pause at the loop point, as a fraction of the whole cycle. Half a dwell, so
// the ribbon does not sit still for a full beat every time it wraps.
const MARQUEE_TAIL_HOLD = 0.0625;

/*
 * Builds the stepping keyframes from measured pixel offsets.
 *
 * Each keyword gets its own slot, but the slots are NOT equal width: "Talks"
 * is a fraction of the size of "Digital & Infrastructure Advisory". Stepping by
 * a fixed fraction of the track therefore comes to rest between keywords
 * instead of on one, so the offsets have to be measured rather than assumed.
 *
 * Slot i slides during the first MARQUEE_SLIDE_FRACTION of its slot and then
 * holds, which is what makes the keywords read individually. The last slot is
 * the exception: it slides until MARQUEE_TAIL_HOLD from the end so the wrap is
 * quick rather than a full-length pause.
 *
 * The final stop is one full copy width, which lands on the start of the
 * identical second copy and so loops seamlessly.
 */
function buildMarqueeKeyframes(offsets: number[], copyWidth: number) {
  const stops = [...offsets, copyWidth];
  const count = offsets.length;
  const last = count - 1;
  const pct = (v: number) => `${+(v * 100).toFixed(4)}%`;
  const px = (v: number) => `${-Math.round(v * 100) / 100}px`;
  const rules = [`0%{transform:translateX(${px(stops[0])})}`];

  for (let i = 0; i < count; i++) {
    const to = px(stops[i + 1]);
    const slideEnd =
      i === last ? 1 - MARQUEE_TAIL_HOLD : (i + MARQUEE_SLIDE_FRACTION) / count;
    rules.push(`${pct(slideEnd)}{transform:translateX(${to})}`);
    rules.push(`${pct((i + 1) / count)}{transform:translateX(${to})}`);
  }

  return `@keyframes marquee-scroll{${rules.join("")}}`;
}

function MarqueeBanner() {
  const styleRef = useRef<HTMLStyleElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const style = styleRef.current;
    if (!track || !style) return;

    let frame = 0;

    const measure = () => {
      const copy = track.querySelector<HTMLElement>('[data-marquee-copy="0"]');
      if (!copy) return;
      const offsets = Array.from(copy.children).map(
        (child) => Math.round((child as HTMLElement).offsetLeft * 100) / 100,
      );
      if (offsets.length === 0) return;
      style.textContent = buildMarqueeKeyframes(offsets, copy.offsetWidth);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    schedule();

    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    document.fonts.ready.then(schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="overflow-hidden border-t border-border bg-card/40"
      aria-label="Our services"
    >
      <style ref={styleRef} />
      <div ref={trackRef} className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            data-marquee-copy={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16"
          >
            {MARQUEE_ITEMS.map((item) => (
              <li
                key={item}
                className="flex shrink-0 items-center gap-10 whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:gap-16 sm:text-xs sm:tracking-[0.22em]"
              >
                {item}
                <span
                  aria-hidden
                  className="h-1 w-1 shrink-0 rounded-full bg-primary/70"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function scrollTo(_path: string, id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

type Feature = { title: string; desc: string };
type Category = {
  id: string;
  icon: typeof Brain;
  tag: string;
  title: string;
  blurb: string;
  features: Feature[];
};

const CATEGORIES: Category[] = [
  {
    id: "ai",
    icon: Brain,
    tag: "AI Consulting",
    title: "Ship AI that actually moves the business.",
    blurb:
      "From board-level strategy to team enablement — we help you move from AI curiosity to measurable outcomes.",
    features: [
      {
        title: "AI Readiness",
        desc: "Assess your data, infrastructure and team readiness for AI adoption.",
      },
      {
        title: "AI Strategy",
        desc: "A roadmap aligned with business goals — from opportunity to deployment.",
      },
      {
        title: "AI Adoption",
        desc: "Guide teams through tooling, workflows, change management and governance.",
      },
    ],
  },
  {
    id: "speaking",
    icon: Mic,
    tag: "Talks",
    title: "Keynotes that translate technology into strategy.",
    blurb:
      "Talks and panels informed by hands-on experience shipping systems and shaping global infrastructure.",
    features: [
      {
        title: "AI & Agentic Systems",
        desc: "Trends, real-world deployment lessons, and where agents actually work.",
      },
      {
        title: "Internet Infrastructure",
        desc: "Measurement, BGP routing, IXPs, and the evolution of connectivity.",
      },
      {
        title: "Future of Work",
        desc: "How AI and automation are reshaping jobs, skills and org design.",
      },
      {
        title: "Digital Transformation",
        desc: "Technology adoption in emerging markets and developing regions.",
      },
    ],
  },
  {
    id: "advisory",
    icon: Cog,
    tag: "Digital & Infrastructure Advisory",
    title: "Battle-tested advice for data-intensive systems.",
    blurb:
      "Architecture reviews, observability strategy and measurement studies for teams operating at scale.",
    features: [
      {
        title: "Network Monitoring",
        desc: "Design and implement monitoring for large-scale network infrastructure.",
      },
      {
        title: "Internet Measurement",
        desc: "Custom studies: topology, performance, routing and CDN analysis.",
      },
      {
        title: "Data Systems",
        desc: "Architecture, pipelines and real-time analytics for data-intensive apps.",
      },
      {
        title: "Observability",
        desc: "Metrics, logs and traces strategies for distributed systems.",
      },
    ],
  },
  {
    id: "training",
    icon: GraduationCap,
    tag: "Training",
    title: "Turn AI curiosity into team capability.",
    blurb:
      "Hands-on programs that meet teams where they are — from executives to engineers.",
    features: [
      {
        title: "AI Training",
        desc: "Hands-on programs tailored to your team's skill level and use cases.",
      },
      {
        title: "Team Workshops",
        desc: "Align technical and non-technical teams on AI strategy and execution.",
      },
      {
        title: "AI Productivity Training",
        desc: "Practical training on AI tools for daily workflows and decisions.",
      },
    ],
  },
];

export function Index() {
  const [contact, setContact] = useState<{ open: boolean; feature: string }>({
    open: false,
    feature: "",
  });

  const openContact = (feature: string) => setContact({ open: true, feature });
  const closeContact = () => setContact((c) => ({ ...c, open: false }));

  useEffect(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, "");
    const map: Record<string, string> = {
      services: "services",
      "what-is-ai-consulting": "what-is-ai-consulting",
      "why-ai-consulting": "why-ai-consulting",
      process: "process",
      contact: "contact",
    };
    if (path && map[path]) {
      const el = document.getElementById(map[path]);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="/services"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Nav />
      <Hero />
      {/* <Logos /> */}
      <Services onSelect={openContact} />
      <AIConsultingExplainer />
      <WhyAIConsultants />
      <Process />
      <CTA />
      <Footer />
      {contact.open && (
        <ContactDialog feature={contact.feature} onClose={closeContact} />
      )}
    </div>
  );
}

function handleSectionClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  path: string,
  id: string,
) {
  if (window.location.pathname === "/") {
    e.preventDefault();
    scrollTo(path, id);
  }
}

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <a href="/" aria-label="Novaris Nexus Tech — Home">
          <img
            src="/logos/novaris-nav.png"
            alt=""
            width={128}
            height={96}
            className="h-8 w-auto sm:h-10 lg:h-12"
          />
        </a>
        <nav className="hidden lg:flex items-center gap-8 text-sm text-muted-foreground uppercase tracking-[0.12em]">
          <a
            href="/services"
            onClick={(e) => handleSectionClick(e, "/services", "services")}
            className="hover:text-foreground transition"
          >
            Services
          </a>
          <Link to="/products" className="hover:text-foreground transition">
            Products
          </Link>
          <a
            href="/what-is-ai-consulting"
            onClick={(e) =>
              handleSectionClick(
                e,
                "/what-is-ai-consulting",
                "what-is-ai-consulting",
              )
            }
            className="hover:text-foreground transition"
          >
            AI Consulting
          </a>
          <a
            href="/why-ai-consulting"
            onClick={(e) =>
              handleSectionClick(e, "/why-ai-consulting", "why-ai-consulting")
            }
            className="hover:text-foreground transition"
          >
            Why Us
          </a>
          <a
            href="/process"
            onClick={(e) => handleSectionClick(e, "/process", "process")}
            className="hover:text-foreground transition"
          >
            Process
          </a>
          <Link to="/contact" className="hover:text-foreground transition">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            Start a project <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-card transition"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <MarqueeBanner />
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4 text-sm uppercase tracking-[0.12em]">
            <a
              href="/services"
              onClick={(e) => {
                setOpen(false);
                handleSectionClick(e, "/services", "services");
              }}
              className="text-muted-foreground hover:text-foreground transition py-2"
            >
              Services
            </a>
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition py-2"
            >
              Products
            </Link>
            <a
              href="/what-is-ai-consulting"
              onClick={(e) => {
                setOpen(false);
                handleSectionClick(
                  e,
                  "/what-is-ai-consulting",
                  "what-is-ai-consulting",
                );
              }}
              className="text-muted-foreground hover:text-foreground transition py-2"
            >
              AI Consulting
            </a>
            <a
              href="/why-ai-consulting"
              onClick={(e) => {
                setOpen(false);
                handleSectionClick(
                  e,
                  "/why-ai-consulting",
                  "why-ai-consulting",
                );
              }}
              className="text-muted-foreground hover:text-foreground transition py-2"
            >
              Why Us
            </a>
            <a
              href="/process"
              onClick={(e) => {
                setOpen(false);
                handleSectionClick(e, "/process", "process");
              }}
              className="text-muted-foreground hover:text-foreground transition py-2"
            >
              Process
            </a>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition py-2"
            >
              Contact
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              Start a project <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <picture>
        <source srcSet={heroImgWebp} type="image/webp" />
        <img
          src={heroImg}
          alt="Novaris Nexus Tech — neural network visualization"
          width={1200}
          height={750}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          decoding="async"
        />
      </picture>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.14 0.03 265 / 0.6) 0%, oklch(0.14 0.03 265) 90%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-6 pt-10 pb-16 sm:pt-14 sm:pb-28 md:pt-20 md:pb-36 flex flex-col items-center text-center">
        <picture>
          <source srcSet={LOGO_FULL_WEBP} type="image/webp" />
          <img
            src={LOGO_FULL}
            alt="Novaris Nexus Tech"
            width={800}
            height={533}
            className="mb-4 h-auto w-full max-w-[12rem] sm:max-w-[18rem] md:max-w-[28rem] lg:max-w-[42rem] xl:max-w-[54rem] object-contain drop-shadow-[0_0_30px_oklch(0.72_0.19_260/0.25)]"
          />
        </picture>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI · Infrastructure · Data at scale
        </div>
        <h1 className="mt-6 max-w-4xl text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.05]">
          We build{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-hero)" }}
          >
            AI systems
            <br />
            and networks
          </span>{" "}
          that matter and operate efficiently.
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground">
          Strategy, delivery, and enablement — from AI curiosity to measurable
          outcomes.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full px-2">
          <Link
            to="/ai-audit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 sm:px-6 text-sm sm:text-base font-semibold text-primary-foreground transition hover:opacity-90"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            Take the free 5-minute AI audit <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="/services"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("/services", "services");
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 sm:px-6 text-sm sm:text-base font-medium text-foreground hover:bg-card transition"
          >
            Explore services
          </a>
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          The audit is the first step. Answer three minutes of questions and we
          review them ourselves, then reply with a summary and an invitation to
          a 20-minute session.
        </p>
      </div>
    </section>
  );
}

/* function Logos() {
  const items = [
    "FINTECH",
    "TELCO",
    "GOV & POLICY",
    "RESEARCH LABS",
    "SCALE-UPS",
    "IXPs",
  ];
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-3 sm:gap-y-4 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground">
        <span className="text-foreground/70">TRUSTED BY TEAMS IN</span>
        {items.map((i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </section>
  );
} */

function Services({ onSelect }: { onSelect: (feature: string) => void }) {
  return (
    <section id="services" className="relative py-16 sm:py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">
            Services
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
            Four ways we plug into your team.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Pick any capability that resonates — tap it and we'll open a
            tailored conversation. No forms lost in the void.
          </p>
        </div>

        <div className="mt-16 grid gap-8">
          {CATEGORIES.map((cat) => (
            <CategoryBlock key={cat.id} cat={cat} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryBlock({
  cat,
  onSelect,
}: {
  cat: Category;
  onSelect: (feature: string) => void;
}) {
  const Icon = cat.icon;
  return (
    <div
      className="rounded-3xl border border-border p-6 sm:p-8 md:p-12"
      style={{ background: "var(--gradient-surface)" }}
    >
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Icon className="h-7 w-7 text-primary-foreground" />
          </div>
          <p className="mt-6 text-sm uppercase tracking-widest text-primary">
            {cat.tag}
          </p>
          <h3 className="mt-2 text-2xl md:text-3xl font-bold">{cat.title}</h3>
          <p className="mt-4 text-muted-foreground">{cat.blurb}</p>
          {cat.id === "ai" && (
            <a
              href="#what-is-ai-consulting"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#what-is-ai-consulting", "what-is-ai-consulting");
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Learn more <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {cat.features.map((f) => (
            <button
              key={f.title}
              onClick={() => onSelect(`${cat.tag} · ${f.title}`)}
              className="group text-left rounded-2xl border border-border bg-card/60 p-6 transition hover:border-primary/60 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-display text-lg font-semibold">
                  {f.title}
                </h4>
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-primary opacity-0 group-hover:opacity-100 transition"
                  aria-hidden
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Process() {
  const steps = [
    {
      n: "01",
      t: "Discover",
      d: "A 20-minute call to map the problem, constraints and success criteria.",
    },
    {
      n: "02",
      t: "Design",
      d: "A crisp proposal: scope, milestones, deliverables and pricing — usually within 5 days.",
    },
    {
      n: "03",
      t: "Deliver",
      d: "Weekly cadence, working artefacts every sprint, no theatre — just outcomes.",
    },
    {
      n: "04",
      t: "Enable",
      d: "We hand the keys over. Your team owns the system, playbook and next roadmap.",
    },
  ];
  return (
    <section
      id="process"
      className="py-16 sm:py-24 md:py-32 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">
            Process
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
            A studio-grade way of working.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-border bg-card/60 p-6"
            >
              <div className="text-sm font-mono text-primary">{s.n}</div>
              <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="py-16 sm:py-24 md:py-32">
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
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold max-w-3xl mx-auto">
              Let's build something the market{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                actually feels.
              </span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a project, a talk proposal or a challenge you need help with?
              Tell us where it hurts and we'll be back within one business day.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 sm:px-6 text-sm sm:text-base font-semibold text-primary-foreground transition hover:opacity-90"
                style={{
                  background: "var(--gradient-hero)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                Reach out <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 sm:px-6 text-sm sm:text-base font-medium hover:bg-card transition break-all sm:break-normal"
              >
                <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        <p>
          © {new Date().getFullYear()} Novaris Nexus Tech. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link to="/services" className="hover:text-foreground transition">
            Services
          </Link>
          <Link to="/products" className="hover:text-foreground transition">
            Products
          </Link>
          <Link to="/ai-audit" className="hover:text-foreground transition">
            Free AI Audit
          </Link>
          <Link to="/contact" className="hover:text-foreground transition">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-foreground transition">
            Privacy
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-foreground transition break-all sm:break-normal"
          >
            {CONTACT_EMAIL}
          </a>
        </nav>
      </div>
    </footer>
  );
}

export function ContactDialog({
  feature,
  onClose,
}: {
  feature: string;
  onClose: () => void;
}) {
  const topic = topicFromFeature(feature);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg rounded-3xl border border-border p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        style={{
          background: "var(--gradient-surface)",
          boxShadow: "var(--shadow-elegant)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-card transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-xs uppercase tracking-widest text-primary">
          You're inquiring about
        </p>
        <h3 className="mt-2 text-2xl font-bold">{feature}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us a little about your context — we'll reply within one business
          day.
        </p>

        <div className="mt-6">
          <ContactForm
            defaultTopic={topic}
            showTopicSelect={false}
            submitLabel="Send inquiry"
          />
        </div>
      </div>
    </div>
  );
}

function AIConsultingExplainer() {
  return (
    <section
      id="what-is-ai-consulting"
      className="py-16 sm:py-24 md:py-32 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">
            What is AI Consulting
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
            What's an AI consultant?
          </h2>
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Ask most people outside the tech bubble about AI, and you'll get
              blank stares. The reality is that many businesses are unaware of
              how AI can transform their operations — not because the technology
              isn't ready, but because the knowledge gap is real.
            </p>
            <p className="text-lg text-muted-foreground">
              The gap between what AI can do and what businesses know it can do
              is enormous.
            </p>
            <p className="text-lg text-muted-foreground">
              That's where an AI consultant comes in. Think of us as translators
              who speak both business and technology. We help organizations
              understand what AI is capable of, identify where it can save time
              and streamline processes, and then build the systems that make it
              happen.
            </p>
            <p className="text-lg text-muted-foreground">
              We help you grow exponentially and increase profits by making AI
              work for your specific challenges, not the other way around.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Understand AI</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We close the knowledge gap — helping your team understand what
                AI is, what it isn't, and where it fits your business reality.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">
                Save Time & Streamline
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                AI eliminates repetitive tasks, streamlines workflows, and lets
                your team focus on what actually moves the business forward.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "var(--gradient-hero)" }}
              >
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Grow Exponentially</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We help you grow exponentially and increase profits by making AI
                work for your specific challenges.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Build the Systems</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We don't just advise — we build the AI systems that make the
                transformation happen in your organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyAIConsultants() {
  const reasons = [
    { icon: Lightbulb, title: "We speak business and tech" },
    { icon: Target, title: "Strategy tied to real outcomes" },
    { icon: Shield, title: "Battle-tested across industries" },
    { icon: Zap, title: "We build, not just advise" },
    { icon: Cog, title: "Ongoing support and maintenance" },
    { icon: Award, title: "Ethical, responsible AI" },
  ];

  return (
    <section
      id="why-ai-consulting"
      className="py-16 sm:py-24 md:py-32 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">
            Why Us
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
            Why teams choose Novaris Nexus Tech.
          </h2>
        </div>

        <div className="mt-16 grid lg:grid-cols-[minmax(0,1fr)_auto] items-center gap-8">
          <div
            className="rounded-3xl border border-border p-8 sm:p-12"
            style={{ background: "var(--gradient-surface)" }}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reasons.map((r) => (
                <div key={r.title} className="flex items-center gap-4">
                  <div
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <r.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full shrink-0 lg:w-96">
            <img
              src="/logos/certifications/certified_agent_builder.png"
              alt="Certified Agent Builder"
              width={1536}
              height={1536}
              className="w-full rounded-3xl border border-border object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
