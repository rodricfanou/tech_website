import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Nav, Footer, ContactDialog } from "./index";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
});

const CONTACT_EMAIL = "roderick@roderickfanou.com";

function ProductsPage() {
  const [contact, setContact] = useState<{ open: boolean; feature: string }>({
    open: false,
    feature: "",
  });

  const openContact = (feature: string) => setContact({ open: true, feature });
  const closeContact = () => setContact((c) => ({ ...c, open: false }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav onContact={() => openContact("General inquiry")} />

      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-medium text-primary uppercase tracking-widest">
            Products
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold font-display max-w-3xl mx-auto">
            Awesome products we{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              commercialize.
            </span>
          </h1>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 sm:py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="rounded-2xl border border-border bg-card/60 p-8 flex flex-col items-center justify-center min-h-[420px] text-center"
              style={{ background: "var(--gradient-surface)" }}
            >
              <h3 className="w-full font-semibold text-lg mb-4">
                Mission control dashboard for daily tasks management
              </h3>
              <video
                className="w-full rounded-xl border border-border"
                src="/videos/Mission_control.mp4"
                controls
                preload="metadata"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div
              className="rounded-2xl border border-border bg-card/60 p-8 flex flex-col items-center justify-center min-h-[420px] text-center"
              style={{ background: "var(--gradient-surface)" }}
            >
              <div
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4"
                style={{ background: "var(--gradient-hero)" }}
              />
              <div className="h-5 w-32 rounded bg-muted/40 mb-3" />
              <div className="h-3 w-48 rounded bg-muted/30 mb-2" />
              <div className="h-3 w-40 rounded bg-muted/30" />
            </div>
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
                <button
                  onClick={() => openContact("Product inquiry")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-semibold text-primary-foreground transition hover:opacity-90"
                  style={{
                    background: "var(--gradient-hero)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  Request a demo <ArrowRight className="h-4 w-4" />
                </button>
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
      {contact.open && (
        <ContactDialog feature={contact.feature} onClose={closeContact} />
      )}
    </div>
  );
}
