import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav, Footer, ContactDialog } from "./index";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
});

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
            Products we{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              commercialize.
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Coming soon — products built on years of hands-on experience in AI,
            data systems, and internet infrastructure.
          </p>
        </div>
      </section>

      {/* Products placeholder */}
      <section className="py-16 sm:py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card/60 p-8 flex flex-col items-center justify-center min-h-[280px] text-center"
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
            ))}
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
