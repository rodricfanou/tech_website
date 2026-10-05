import { useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Progress } from "@/components/ui/progress";

import {
  AUDIT_AVERAGE_VALUE,
  AUDIT_BUSINESS_TYPES,
  AUDIT_EMPTY_VALUES,
  AUDIT_HONEYPOT_FIELD,
  AUDIT_OTHER_BUSINESS_TYPE,
  AUDIT_PROBLEM_FREQUENCY,
  AUDIT_REPETITIVE_WORK,
  AUDIT_ROLES,
  AUDIT_START_TIMING,
  AUDIT_STEP_SCHEMAS,
  AUDIT_STEPS,
  AUDIT_UNANSWERED_REQUEST,
  AUDIT_WALKTHROUGH,
  AUDIT_WEEKLY_INQUIRY_VOLUME,
  auditSchema,
  toFieldErrors,
  type AuditErrors,
  type AuditValues,
} from "@/lib/ai-audit";

const CONTROL =
  "mt-1 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition";

const OPTION_CARD =
  "flex cursor-pointer items-center rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground transition peer-checked:border-primary peer-checked:bg-card peer-focus-visible:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary";

const SECONDARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:opacity-90";

const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50";

export function AiAuditForm() {
  const [values, setValues] = useState<AuditValues>(AUDIT_EMPTY_VALUES);
  const [errors, setErrors] = useState<AuditErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const stepHeading = useRef<HTMLParagraphElement>(null);

  const step = AUDIT_STEPS[stepIndex];
  const isLastStep = stepIndex === AUDIT_STEPS.length - 1;
  const progress = Math.round(((stepIndex + 1) / AUDIT_STEPS.length) * 100);

  const set = <K extends keyof AuditValues>(key: K, value: AuditValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  /**
   * Checks only what is on screen right now. Returns true when this step is
   * complete enough to move on.
   */
  const validateStep = (index: number) => {
    const parsed = AUDIT_STEP_SCHEMAS[AUDIT_STEPS[index].id].safeParse(values);
    if (parsed.success) {
      setFormError("");
      return true;
    }
    setErrors((prev) => ({ ...prev, ...toFieldErrors(parsed.error) }));
    setFormError("Please check the highlighted answers to continue.");
    return false;
  };

  const goToStep = (index: number) => {
    setStepIndex(index);
    setErrors({});
    setFormError("");
    // Send focus to the new step heading rather than leaving it on the button
    // that was pressed, which otherwise strands keyboard and screen reader
    // users a screen away from what they just opened.
    stepHeading.current?.focus();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    if (!validateStep(stepIndex)) return;

    // Enter submits the visible step, so the last step is the only one that
    // actually sends anything.
    if (!isLastStep) {
      goToStep(stepIndex + 1);
      return;
    }

    setFormError("");

    // Same schema the endpoint uses, so a rejection here means it would be
    // rejected there too.
    const parsed = auditSchema.safeParse(values);
    if (!parsed.success) {
      setErrors((prev) => ({ ...prev, ...toFieldErrors(parsed.error) }));
      setFormError("Please check the highlighted answers.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/ai-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The server ignores the referrer, but there is no reason to put the
        // page URL on the wire when the answers are all it needs.
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ ...parsed.data, [AUDIT_HONEYPOT_FIELD]: "" }),
      });
      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        errors?: AuditErrors;
        formError?: string;
      } | null;

      if (!response.ok || !payload?.ok) {
        if (payload?.errors) setErrors(payload.errors);
        setFormError(
          payload?.formError ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setSent(true);
    } catch {
      setFormError("Something went wrong. Please try again.");
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
        <p className="mt-4 font-semibold">Thanks — your answers are in.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We read every one of these ourselves. You&apos;ll get your{" "}
          <strong className="font-semibold text-foreground">
            AI Opportunity Summary
          </strong>{" "}
          within 3 business days, and there&apos;s no obligation on either side.
        </p>
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm font-semibold">
            Want to talk it through now instead of waiting?
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            If the audit flagged something worth a conversation, book a
            15-minute walkthrough and we&apos;ll dig into it live.
          </p>
          {/* Plain anchor so this stays a full-page load into the contact
              form rather than a router navigation. */}
          <a
            href="/contact"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:w-auto sm:text-base"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            Book a 15min walkthrough <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  const isOther = values.businessType === AUDIT_OTHER_BUSINESS_TYPE;

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
          <p
            ref={stepHeading}
            tabIndex={-1}
            className="font-semibold text-foreground outline-none"
          >
            Step {stepIndex + 1} of {AUDIT_STEPS.length}
          </p>
          <p>{step.title}</p>
        </div>
        <Progress value={progress} aria-label="Audit progress" />
      </div>

      {step.id === "about" && (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              id="audit-name"
              label="Name"
              required
              autoComplete="name"
              value={values.name}
              error={errors.name}
              onChange={(v) => set("name", v)}
            />
            <TextField
              id="audit-email"
              label="Email"
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              error={errors.email}
              onChange={(v) => set("email", v)}
            />
          </div>

          <TextField
            id="audit-business-name"
            label="Business name"
            required
            autoComplete="organization"
            value={values.businessName}
            error={errors.businessName}
            onChange={(v) => set("businessName", v)}
          />

          <RadioField
            name="audit-role"
            legend="Your role"
            required
            options={AUDIT_ROLES}
            value={values.role}
            error={errors.role}
            onChange={(v) => set("role", v)}
          />

          <SelectField
            id="audit-business-type"
            label="Type of business"
            required
            options={AUDIT_BUSINESS_TYPES}
            value={values.businessType}
            error={errors.businessType}
            onChange={(v) => set("businessType", v)}
            placeholder="Select a business type"
          />

          {isOther && (
            <TextField
              id="audit-business-type-other"
              label="Tell us what kind of business you run"
              required
              value={values.businessTypeOther ?? ""}
              error={errors.businessTypeOther}
              onChange={(v) => set("businessTypeOther", v)}
            />
          )}
        </div>
      )}

      {step.id === "inbound" && (
        <div className="space-y-6">
          <RadioField
            name="audit-unanswered-request"
            legend="When an inbound request comes in and no one can respond, what usually happens?"
            required
            options={AUDIT_UNANSWERED_REQUEST}
            value={values.unansweredRequest}
            error={errors.unansweredRequest}
            onChange={(v) => set("unansweredRequest", v)}
          />

          <SelectField
            id="audit-problem-frequency"
            label="Roughly how often does that happen?"
            required
            options={AUDIT_PROBLEM_FREQUENCY}
            value={values.problemFrequency}
            error={errors.problemFrequency}
            onChange={(v) => set("problemFrequency", v)}
            placeholder="Select a frequency"
          />

          <SelectField
            id="audit-weekly-inquiry-volume"
            label="Roughly how many inbound requests do you get in a typical week?"
            required
            options={AUDIT_WEEKLY_INQUIRY_VOLUME}
            value={values.weeklyInquiryVolume}
            error={errors.weeklyInquiryVolume}
            onChange={(v) => set("weeklyInquiryVolume", v)}
            placeholder="Select a range"
          />

          <SelectField
            id="audit-average-value"
            label="What's the average value of a customer, project, booking, or job?"
            required
            options={AUDIT_AVERAGE_VALUE}
            value={values.averageValue}
            error={errors.averageValue}
            onChange={(v) => set("averageValue", v)}
            placeholder="Select a range"
          />

          <SelectField
            id="audit-repetitive-work"
            label="Where does your team spend the most time on repetitive work?"
            required
            options={AUDIT_REPETITIVE_WORK}
            value={values.repetitiveWork}
            error={errors.repetitiveWork}
            onChange={(v) => set("repetitiveWork", v)}
            placeholder="Select the biggest time sink"
          />
        </div>
      )}

      {step.id === "next" && (
        <div className="space-y-6">
          <RadioField
            name="audit-start-timing"
            legend="If a solution handled this for you, how soon would you want to start?"
            required
            options={AUDIT_START_TIMING}
            value={values.startTiming}
            error={errors.startTiming}
            onChange={(v) => set("startTiming", v)}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              id="audit-website"
              label="Website"
              optional
              inputMode="url"
              autoComplete="url"
              placeholder="https://"
              value={values.website ?? ""}
              error={errors.website}
              onChange={(v) => set("website", v)}
            />
            <TextField
              id="audit-phone"
              label="Phone number"
              optional
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              hint="Only if you'd prefer a call or a text."
              value={values.phone ?? ""}
              error={errors.phone}
              onChange={(v) => set("phone", v)}
            />
          </div>

          <TextAreaField
            id="audit-automation-task"
            label="What's the one task you'd most like to automate?"
            optional
            value={values.automationTask ?? ""}
            error={errors.automationTask}
            onChange={(v) => set("automationTask", v)}
          />

          <TextField
            id="audit-software"
            label="What software do you use to run the business?"
            optional
            value={values.software ?? ""}
            error={errors.software}
            onChange={(v) => set("software", v)}
          />

          <RadioField
            name="audit-walkthrough"
            legend="Would you be open to a short walkthrough of your results?"
            optional
            options={AUDIT_WALKTHROUGH}
            value={values.walkthrough ?? ""}
            error={errors.walkthrough}
            onChange={(v) => set("walkthrough", v)}
          />

          {/* Kept separate from the audit consent: the summary is what they asked
              for, this is us asking to keep going after that. */}
          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="audit-follow-up-opt-in"
              checked={values.followUpOptIn ?? false}
              onChange={(e) => set("followUpOptIn", e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
            />
            <span>
              It&apos;s also fine to send me occasional follow-up about AI and
              automation.{" "}
              <span className="text-muted-foreground/70">Optional</span>
            </span>
          </label>
        </div>
      )}

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor={AUDIT_HONEYPOT_FIELD}>Company fax number</label>
        <input
          id={AUDIT_HONEYPOT_FIELD}
          name={AUDIT_HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {formError && (
        <p role="alert" className="text-sm text-red-500">
          {formError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={() => goToStep(stepIndex - 1)}
            className={SECONDARY_BUTTON}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
          style={{
            background: "var(--gradient-hero)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          {isLastStep
            ? submitting
              ? "Sending…"
              : "Send my answers"
            : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        By submitting, you agree to receive the AI Opportunity Summary you asked
        for from Novaris Nexus Tech. Your answers are used only to prepare it
        and to decide whether follow-up is worth both our time. Anything further
        is opt-in above. See our{" "}
        <Link to="/privacy" className="text-primary hover:underline">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}

const LEGEND_CLASS = "text-xs font-medium text-muted-foreground";

/**
 * A real <label> when it belongs to one control, and a <legend> when it labels
 * a group of radios inside a fieldset. Using a bare <legend> outside a fieldset
 * associates the text with nothing, so clicking the label would not focus the
 * input and a screen reader would announce it unlabelled.
 */
function Legend({
  htmlFor,
  legend,
  required,
  optional,
}: {
  htmlFor?: string;
  legend: string;
  required?: boolean;
  optional?: boolean;
}) {
  const content = (
    <>
      {legend}
      {required ? (
        <span className="ml-1 text-primary">Required</span>
      ) : optional ? (
        <span className="ml-1 text-muted-foreground/70">Optional</span>
      ) : null}
    </>
  );

  return htmlFor ? (
    <label htmlFor={htmlFor} className={LEGEND_CLASS}>
      {content}
    </label>
  ) : (
    <legend className={LEGEND_CLASS}>{content}</legend>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-500">
      {message}
    </p>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  optional,
  hint,
  type = "text",
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  return (
    <div>
      <Legend
        htmlFor={id}
        legend={label}
        required={required}
        optional={optional}
      />
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-muted-foreground/80">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? hintId : "", error ? errorId : ""]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={`${CONTROL} ${error ? "border-red-500/70" : ""}`}
        {...rest}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  optional,
  rows = 4,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  rows?: number;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <Legend
        htmlFor={id}
        legend={label}
        required={required}
        optional={optional}
      />
      <textarea
        id={id}
        name={id}
        rows={rows}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${CONTROL} resize-y ${error ? "border-red-500/70" : ""}`}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function SelectField({
  id,
  label,
  options,
  value,
  onChange,
  error,
  required,
  optional,
  placeholder,
}: {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  placeholder: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
        {required ? (
          <span className="ml-1 text-primary">Required</span>
        ) : optional ? (
          <span className="ml-1 text-muted-foreground/70">Optional</span>
        ) : null}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${CONTROL} ${error ? "border-red-500/70" : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function RadioField({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  required,
  optional,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset>
      <Legend legend={legend} required={required} optional={optional} />
      <div
        className="mt-2 grid gap-2 sm:grid-cols-2"
        aria-describedby={error ? errorId : undefined}
      >
        {options.map((option) => (
          <label key={option} className="block">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span className={OPTION_CARD}>{option}</span>
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
