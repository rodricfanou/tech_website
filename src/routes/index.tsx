import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Brain,
  Mic,
  Cog,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Check,
  Mail,
  X,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";

const LOGO_MARK = "/logos/novaris-mark.png";
const LOGO_FULL = "/logos/novaris-full.png";

export const Route = createFileRoute("/")({
  component: Index,
});

const CONTACT_EMAIL = "roderick@roderickfanou.com";

function scrollTo(path: string, id: string) {
  history.pushState(null, "", path);
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
    tag: "Technical Advisory",
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
    const map: Record<string, string> = { services: "services", process: "process", contact: "contact" };
    if (path && map[path]) {
      requestAnimationFrame(() => {
        document.getElementById(map[path])?.scrollIntoView({ behavior: "smooth" });
      });
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
      <Nav onContact={() => openContact("General inquiry")} />
      <Hero onContact={() => openContact("General inquiry")} />
      {/* <Logos /> */}
      <Services onSelect={openContact} />
      <Process />
      <CTA onContact={() => openContact("Let's work together")} />
      <Footer />
      {contact.open && (
        <ContactDialog feature={contact.feature} onClose={closeContact} />
      )}
    </div>
  );
}

function Nav({ onContact }: { onContact: () => void }) {
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
        <a
          href="/"
          className="flex items-center gap-3 font-display font-bold text-lg"
          aria-label="Novaris Nexus Tech — Home"
        >
          <img
            src={LOGO_MARK}
            alt="Novaris Nexus Tech"
            width={80}
            height={80}
            className="h-20 w-20 sm:h-28 sm:w-28 lg:h-[144px] lg:w-[144px] object-contain"
          />
          <span className="text-sm sm:text-base lg:text-lg">
            Novaris Nexus{" "}
            <span className="text-muted-foreground font-medium">Tech</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground uppercase tracking-[0.12em]">
          <a href="/services" onClick={(e) => { e.preventDefault(); scrollTo("/services", "services"); }} className="hover:text-foreground transition">
            Services
          </a>
          <a href="/process" onClick={(e) => { e.preventDefault(); scrollTo("/process", "process"); }} className="hover:text-foreground transition">
            Process
          </a>
          <a href="/contact" onClick={(e) => { e.preventDefault(); scrollTo("/contact", "contact"); }} className="hover:text-foreground transition">
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={onContact}
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            Start a project <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-card transition"
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
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4 text-sm uppercase tracking-[0.12em]">
            <a
              href="/services"
              onClick={(e) => { e.preventDefault(); setOpen(false); scrollTo("/services", "services"); }}
              className="text-muted-foreground hover:text-foreground transition py-2"
            >
              Services
            </a>
            <a
              href="/process"
              onClick={(e) => { e.preventDefault(); setOpen(false); scrollTo("/process", "process"); }}
              className="text-muted-foreground hover:text-foreground transition py-2"
            >
              Process
            </a>
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); setOpen(false); scrollTo("/contact", "contact"); }}
              className="text-muted-foreground hover:text-foreground transition py-2"
            >
              Contact
            </a>
            <button
              onClick={() => {
                setOpen(false);
                onContact();
              }}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              Start a project <ArrowRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero({ onContact }: { onContact: () => void }) {
  const [logoOnly, setLogoOnly] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoOnly(true);
      setTimeout(() => setLogoOnly(false), 2000);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden">
      <img
        src={heroImg}
        alt="Novaris Nexus Tech — neural network visualization"
        width={1920}
        height={1200}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.14 0.03 265 / 0.6) 0%, oklch(0.14 0.03 265) 90%)",
        }}
      />
      <div
        className={`relative mx-auto max-w-5xl px-6 pt-14 pb-16 sm:pt-20 sm:pb-28 md:pt-28 md:pb-36 flex flex-col items-center text-center transition-opacity duration-500 ${
          logoOnly ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={LOGO_FULL}
          alt="Novaris Nexus Tech"
          width={1200}
          height={900}
          className="mb-4 h-auto w-full max-w-[12rem] sm:max-w-[18rem] md:max-w-[28rem] lg:max-w-[42rem] xl:max-w-[54rem] object-contain drop-shadow-[0_0_30px_oklch(0.72_0.19_260/0.25)]"
          style={{
            animation:
              "float 6s ease-in-out infinite, logo-blink 5s ease-in-out infinite",
          }}
        />
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI · Infrastructure · Data at scale
        </div>
        <h1 className="mt-6 max-w-4xl text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.05]">
          Build AI Systems{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-hero)" }}
          >
            That Matter.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground">
          We help ambitious organizations transform ideas into intelligent
          systems, scalable infrastructure and measurable business outcomes.
          Strategy, delivery, and enablement -- end to end.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full px-2">
          <button
            onClick={onContact}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 sm:px-6 text-sm sm:text-base font-semibold text-primary-foreground transition hover:opacity-90"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            Book a complimentary 30-minute AI Strategy Session <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="/services"
            onClick={(e) => { e.preventDefault(); scrollTo("/services", "services"); }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 sm:px-6 text-sm sm:text-base font-medium text-foreground hover:bg-card transition"
          >
            Explore services
          </a>
        </div>
      </div>
      {logoOnly && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img
            src={LOGO_FULL}
            alt="Novaris Nexus Tech"
            width={1200}
            height={900}
            className="h-auto w-full max-w-[12rem] sm:max-w-[18rem] md:max-w-[28rem] lg:max-w-[42rem] xl:max-w-[54rem] object-contain drop-shadow-[0_0_30px_oklch(0.72_0.19_260/0.25)]"
            style={{
              animation:
                "float 6s ease-in-out infinite, logo-blink 5s ease-in-out infinite",
            }}
          />
        </div>
      )}
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
      d: "A 30-minute call to map the problem, constraints and success criteria.",
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

function CTA({ onContact }: { onContact: () => void }) {
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
              <button
                onClick={onContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 sm:px-6 text-sm sm:text-base font-semibold text-primary-foreground transition hover:opacity-90"
                style={{
                  background: "var(--gradient-hero)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                Reach out <ArrowRight className="h-4 w-4" />
              </button>
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

function Footer() {
  return (
    <footer className="border-t border-border py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        <p>
          © {new Date().getFullYear()} Novaris Nexus Tech. All rights reserved.
        </p>
        <p>Consulting · Technical Advisory · Technical Talks · Training</p>
      </div>
    </footer>
  );
}

function ContactDialog({
  feature,
  onClose,
}: {
  feature: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("https://formspree.io/f/mkoyqdla", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({
          Name: name,
          Email: email,
          Contact: contact,
          Company: company,
          Topic: topic,
          Message: message,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

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

        {sent ? (
          <div className="mt-6 rounded-2xl border border-border bg-card/60 p-6 text-center">
            <div
              className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Check className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="mt-4 font-semibold">Inquiry sent successfully.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll get back to you within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Name" value={name} onChange={setName} required />
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
            <Field
              label="Contact (phone)"
              value={contact}
              onChange={setContact}
              required
            />
            <Field label="Company" value={company} onChange={setCompany} />
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Topic
              </label>
              <select
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition"
              >
                <option value="" disabled>Select a topic</option>
                <option value="General inquiry">General inquiry</option>
                <option value="AI Consulting">AI Consulting</option>
                <option value="Talks">Talks</option>
                <option value="Technical Advisory">Technical Advisory</option>
                <option value="Training">Training</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Message
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={2000}
                className="mt-1 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition"
                placeholder="A quick description of the challenge, timeline, and any constraints…"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              {submitting ? "Sending…" : "Send inquiry"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={200}
        className="mt-1 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition"
      />
    </div>
  );
}
