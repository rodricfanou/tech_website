import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { Nav, Footer } from "./index";
import { CONTACT_EMAIL } from "@/components/contact-form";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy | Novaris Nexus Tech" },
      {
        name: "description",
        content:
          "How Novaris Nexus Tech collects, uses and stores the information you share through this website.",
      },
    ],
  }),
});

const SECTIONS = [
  {
    heading: "What we collect",
    body: [
      "When you send us the contact form, we receive the name, email address, business name, role, type of business, and the project details you type in.",
      "When you complete the free AI audit, we also receive your answers to the audit questions: how you handle missed calls, roughly how many calls or messages you miss in a week, the average value of a job, how soon you would want to start, and anything you choose to add in the optional fields.",
      "Our hosting provider, Cloudflare, processes this traffic in order to serve the site and may keep technical logs such as IP address, browser type and requested pages for security and reliability.",
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      "We use your details to answer your inquiry, or in the case of the AI audit, to prepare and send you the summary you asked for.",
      "We use your answers to judge which follow-up, if any, is worth our time. We do not sell your information, rent your contact details to anyone, or share them with advertisers.",
    ],
  },
  {
    heading: "Form submissions and email",
    body: [
      "Form submissions from this site are delivered using Formspree, which sends them to us by email and stores a copy in its own database so we can retrieve them later.",
      "Because our email is delivered through Formspree, the information you submit is also processed by Formspree as part of delivering that email.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep inquiry and audit details for as long as needed to deal with your request and to keep a record of our business conversations. If you ask us to delete your information, we will remove it from our records and ask our form provider to delete it too.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      `You can ask us at any time what we hold about you, ask for it to be corrected, or ask for it to be deleted. Email ${CONTACT_EMAIL} and we will action it.`,
      "You can also unsubscribe from any follow-up email using the link in that email.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "This site does not set advertising or analytics cookies. If that changes, we will say so here and update this policy.",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main>
        <section className="pt-28 sm:pt-36 pb-10 border-b border-border">
          <div className="mx-auto max-w-3xl px-6">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Legal
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-6">
            <div className="space-y-10">
              {SECTIONS.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {section.heading}
                  </h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 32)}
                        className="text-sm sm:text-base leading-relaxed text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-card/60 p-6">
              <h2 className="font-semibold">Questions about this policy?</h2>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline break-all"
              >
                <Mail className="h-4 w-4 shrink-0" /> {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
