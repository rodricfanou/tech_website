import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessageSquare, Clock } from "lucide-react";
import { Nav, Footer } from "./index";
import { CONTACT_EMAIL, ContactForm } from "@/components/contact-form";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Start an AI Project | Novaris Nexus Tech" },
      {
        name: "description",
        content:
          "Tell us about your project, talk proposal or challenge. Fill in the form or email us directly — we reply within one business day.",
      },
    ],
  }),
});

const PROMISES = [
  {
    icon: Clock,
    title: "Reply within one business day",
    body: "Every inquiry gets a human response from us — not an autoresponder.",
  },
  {
    icon: MessageSquare,
    title: "A real conversation first",
    body: "We start with a complimentary 20-minute session to understand the problem before quoting anything.",
  },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main>
        {/* Intro */}
        <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 border-b border-border">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Contact
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl mx-auto">
              Let&apos;s talk about{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                what you need built.
              </span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
              Tell us where it hurts — a project, a talk proposal, or a
              challenge your team is stuck on. We&apos;ll come back within one
              business day.
            </p>
          </div>
        </section>

        {/* Form + assurances */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-[minmax(0,1fr)_20rem] gap-10 lg:gap-14 items-start">
            <div
              className="rounded-3xl border border-border p-6 sm:p-10"
              style={{
                background: "var(--gradient-surface)",
                boxShadow: "var(--shadow-elegant)",
              }}
            >
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fields marked required help us route your inquiry to the right
                person first time.
              </p>
              <div className="mt-8">
                <ContactForm
                  defaultTopic="General inquiry"
                  submitLabel="Send inquiry"
                />
              </div>
            </div>

            <aside className="space-y-6">
              {PROMISES.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-border bg-card/60 p-6"
                >
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <p.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                </div>
              ))}

              <div className="rounded-2xl border border-border bg-card/60 p-6">
                <h3 className="font-semibold">Prefer email?</h3>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline break-all"
                >
                  <Mail className="h-4 w-4 shrink-0" /> {CONTACT_EMAIL}
                </a>
                <Link
                  to="/products"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  See what we build <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
