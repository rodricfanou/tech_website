import { z } from "zod";

/**
 * Field definitions for the 5-minute AI audit. This module is the single
 * source of truth: the form renders from these option lists and the POST
 * endpoint validates against the same schema, so the two cannot drift.
 */

export const AUDIT_ROLES = ["Owner", "Manager", "Other"] as const;

export const AUDIT_BUSINESS_TYPES = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Property management",
  "Cleaning",
  "Landscaping",
  "Other",
] as const;

export const AUDIT_MISSED_CALL_HANDLING = [
  "Goes to voicemail",
  "Handled by staff later",
  "Answering service",
  "The call is usually lost",
  "Not sure",
] as const;

export const AUDIT_MISSED_CALLS_PER_WEEK = [
  "0 to 5",
  "6 to 15",
  "16 to 30",
  "30+",
  "Not sure",
] as const;

export const AUDIT_AVERAGE_JOB_VALUE = [
  "Under $200",
  "$200 to $1,000",
  "$1,000 to $5,000",
  "$5,000+",
] as const;

export const AUDIT_START_TIMING = [
  "Right away",
  "Within 3 months",
  "Just exploring",
  "Not interested",
] as const;

export const AUDIT_WALKTHROUGH = ["Yes", "No"] as const;

/** Choosing this reveals the free-text "other" field. */
export const AUDIT_OTHER_BUSINESS_TYPE = "Other";

/**
 * Offscreen field a bot will fill in and a person never sees. Checked on the
 * server; the constant is exported so the form and the endpoint cannot
 * disagree about its name.
 */
export const AUDIT_HONEYPOT_FIELD = "company_fax_number";

const oneOf = (values: readonly string[], message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => values.includes(value), { message });

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters`)
    .optional()
    .or(z.literal(""));

/** Same as oneOf, but an unanswered optional choice is allowed. */
const optionalOneOf = (values: readonly string[], message: string) =>
  z
    .string()
    .refine((value) => value === "" || values.includes(value), { message })
    .optional();

export const auditSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Please enter your name")
      .max(120, "Please keep this under 120 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Please enter your email")
      .email("Please enter a valid email address")
      .max(200, "Please keep this under 200 characters"),
    businessName: z
      .string()
      .trim()
      .min(1, "Please enter your business name")
      .max(160, "Please keep this under 160 characters"),
    role: oneOf(AUDIT_ROLES, "Please choose your role"),
    businessType: oneOf(
      AUDIT_BUSINESS_TYPES,
      "Please choose your business type",
    ),
    businessTypeOther: optionalText(120),
    missedCallHandling: oneOf(
      AUDIT_MISSED_CALL_HANDLING,
      "Please choose an option",
    ),
    missedCallsPerWeek: oneOf(
      AUDIT_MISSED_CALLS_PER_WEEK,
      "Please choose a range",
    ),
    averageJobValue: oneOf(AUDIT_AVERAGE_JOB_VALUE, "Please choose a range"),
    startTiming: oneOf(AUDIT_START_TIMING, "Please choose an option"),
    website: optionalText(200),
    automationTask: optionalText(2000),
    software: optionalText(200),
    walkthrough: optionalOneOf(AUDIT_WALKTHROUGH, "Please choose Yes or No"),
  })
  .superRefine((values, ctx) => {
    if (
      values.businessType === AUDIT_OTHER_BUSINESS_TYPE &&
      !values.businessTypeOther
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["businessTypeOther"],
        message: "Please tell us what kind of business you run",
      });
    }
  });

export type AuditValues = z.infer<typeof auditSchema>;

export const AUDIT_EMPTY_VALUES: AuditValues = {
  name: "",
  email: "",
  businessName: "",
  role: "",
  businessType: "",
  businessTypeOther: "",
  missedCallHandling: "",
  missedCallsPerWeek: "",
  averageJobValue: "",
  startTiming: "",
  website: "",
  automationTask: "",
  software: "",
  walkthrough: "",
};

export type AuditErrors = Partial<Record<keyof AuditValues, string>>;

/** Flattens a ZodError into the per-field shape the form renders. */
export function toFieldErrors(error: z.ZodError): AuditErrors {
  const errors: AuditErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof AuditValues | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
