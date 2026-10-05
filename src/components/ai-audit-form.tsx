import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import {
  AUDIT_AVERAGE_JOB_VALUE,
  AUDIT_BUSINESS_TYPES,
  AUDIT_EMPTY_VALUES,
  AUDIT_HONEYPOT_FIELD,
  AUDIT_MISSED_CALL_HANDLING,
  AUDIT_MISSED_CALLS_PER_WEEK,
  AUDIT_OTHER_BUSINESS_TYPE,
  AUDIT_ROLES,
  AUDIT_START_TIMING,
  AUDIT_WALKTHROUGH,
  auditSchema,
  toFieldErrors,
  type AuditErrors,
  type AuditValues,
} from "@/lib/ai-audit";

const CONTROL =
  "mt-1 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition";

const OPTION_CARD =
  "flex cursor-pointer items-center rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground transition peer-checked:border-primary peer-checked:bg-card peer-focus-visible:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary";

export function AiAuditForm() {
  const [values, setValues] = useState<AuditValues>(AUDIT_EMPTY_VALUES);
  const [errors, setErrors] = useState<AuditErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = <K extends keyof AuditValues>(key: K, value: AuditValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setFormError("");

    // Same schema the endpoint uses, so a rejection here means it would be
    // rejected there too.
    const parsed = auditSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      setFormError("Please check the highlighted answers.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/ai-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          We read every one of these ourselves. You&apos;ll get a short summary
          within 3 business days, and there&apos;s no obligation on either side.
        </p>
      </div>
    );
  }

  const isOther = values.businessType === AUDIT_OTHER_BUSINESS_TYPE;

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
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

      <RadioField
        name="audit-missed-call-handling"
        legend="When a customer calls and you can't pick up, what usually happens?"
        required
        options={AUDIT_MISSED_CALL_HANDLING}
        value={values.missedCallHandling}
        error={errors.missedCallHandling}
        onChange={(v) => set("missedCallHandling", v)}
      />

      <SelectField
        id="audit-missed-calls"
        label="Roughly how many calls or messages do you miss in a typical week?"
        required
        options={AUDIT_MISSED_CALLS_PER_WEEK}
        value={values.missedCallsPerWeek}
        error={errors.missedCallsPerWeek}
        onChange={(v) => set("missedCallsPerWeek", v)}
        placeholder="Select a range"
      />

      <SelectField
        id="audit-job-value"
        label="What's the average value of a job?"
        required
        options={AUDIT_AVERAGE_JOB_VALUE}
        value={values.averageJobValue}
        error={errors.averageJobValue}
        onChange={(v) => set("averageJobValue", v)}
        placeholder="Select a range"
      />

      <RadioField
        name="audit-start-timing"
        legend="If a solution handled this for you, how soon would you want to start?"
        required
        options={AUDIT_START_TIMING}
        value={values.startTiming}
        error={errors.startTiming}
        onChange={(v) => set("startTiming", v)}
      />

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
        label="What software do you use to manage jobs and calls?"
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

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        style={{
          background: "var(--gradient-hero)",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        {submitting ? "Sending…" : "Send my answers"}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        By submitting, you agree to receive your audit summary and occasional
        follow-up from Novaris Nexus Tech. Your answers are used only to prepare
        your audit. See our{" "}
        <Link to="/privacy" className="text-primary hover:underline">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}

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
  return (
    <legend className="text-xs font-medium text-muted-foreground">
      {legend}
      {required ? (
        <span className="ml-1 text-primary">Required</span>
      ) : optional ? (
        <span className="ml-1 text-muted-foreground/70">Optional</span>
      ) : null}
      {htmlFor && legend ? <span className="sr-only">{legend}</span> : null}
    </legend>
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
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  const errorId = `${id}-error`;
  return (
    <div>
      <Legend legend={label} required={required} optional={optional} />
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
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
      <Legend legend={label} required={required} optional={optional} />
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
