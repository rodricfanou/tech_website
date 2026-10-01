import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export const CONTACT_EMAIL = "roderick@roderickfanou.com";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mkoyqdla";

export const CONTACT_TOPICS = [
  "General inquiry",
  "AI Consulting",
  "Talks",
  "Digital & Infrastructure Advisory",
  "Training",
  "Website Creation or Makeover",
  "Products",
  "Others",
] as const;

/**
 * Maps the "AI Consulting · AI Readiness" style labels used by the service
 * cards onto the coarse topics the form actually submits, so a visitor who
 * taps a specific service does not have to pick the topic again.
 */
export function topicFromFeature(feature: string): string {
  if (/website/i.test(feature)) return "Website Creation or Makeover";
  if (/product|demo/i.test(feature)) return "Products";
  const hit = [
    "AI Consulting",
    "Talks",
    "Digital & Infrastructure Advisory",
    "Training",
  ].find((t) => feature.toLowerCase().startsWith(t.toLowerCase()));
  return hit ?? "General inquiry";
}

type ContactFormProps = {
  /** Topic preselected from context, e.g. the service card that was tapped. */
  defaultTopic?: string;
  /**
   * Show the topic picker. Off when the topic is already fixed by context (the
   * inline dialogs), on for the standalone /contact page.
   */
  showTopicSelect?: boolean;
  submitLabel?: string;
  /** Called after a successful submission, so a dialog can close itself. */
  onSent?: () => void;
};

export function ContactForm({
  defaultTopic = "",
  showTopicSelect = true,
  submitLabel = "Send inquiry",
  onSent,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState(defaultTopic);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
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
      onSent?.();
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-card/60 p-8 text-center">
        <div
          className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "var(--gradient-hero)" }}
        >
          <Check className="h-6 w-6 text-primary-foreground" />
        </div>
        <p className="mt-4 font-semibold">Inquiry sent successfully.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
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
      {showTopicSelect && (
        <div>
          <label
            htmlFor="contact-topic"
            className="text-xs font-medium text-muted-foreground"
          >
            Topic
          </label>
          <select
            id="contact-topic"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition"
          >
            <option value="" disabled>
              Select a topic
            </option>
            {CONTACT_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}
      {!showTopicSelect && topic && (
        <input type="hidden" name="Topic" value={topic} />
      )}
      <div>
        <label
          htmlFor="contact-message"
          className="text-xs font-medium text-muted-foreground"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          maxLength={2000}
          className="mt-1 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition"
          placeholder="A quick description of the challenge, timeline, and any constraints…"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        style={{
          background: "var(--gradient-hero)",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        {submitting ? "Sending…" : submitLabel}{" "}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
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
  const id = `contact-${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        name={label}
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
