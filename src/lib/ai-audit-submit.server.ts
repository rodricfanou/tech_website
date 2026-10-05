import { AUDIT_OTHER_BUSINESS_TYPE, type AuditValues } from "./ai-audit";
import { AUDIT_MAX_SCORE, type AuditScore } from "./ai-audit-score.server";

/**
 * Server-only concerns for the AI audit: rate limiting and delivery.
 *
 * Delivery goes over email via Formspree, the same endpoint the contact form
 * uses, which also acts as the submission record. There is no database. The
 * endpoint is overridable through the environment so tests can aim delivery at
 * a local stub instead of emailing a real inbox.
 */

const FORMSPREE_ENDPOINT =
  readEnv("AI_AUDIT_FORMSPREE_ENDPOINT") ?? "https://formspree.io/f/mkoyqdla";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
/** Bound the map so a flood of distinct addresses cannot grow it without limit. */
const RATE_LIMIT_MAX_TRACKED_BUCKETS = 5_000;

const submissionsByBucket = new Map<string, number[]>();

/**
 * Works under the Node build and the Workers build. Wrangler surfaces vars on
 * the global scope, while the Node build and local tooling expose them through
 * process.env.
 */
function readEnv(key: string): string | undefined {
  const fromProcess =
    typeof process !== "undefined" ? process.env?.[key] : undefined;
  if (fromProcess) return fromProcess;
  const fromWorkers = (
    globalThis as typeof globalThis & {
      env?: Record<string, string | undefined>;
    }
  ).env?.[key];
  return fromWorkers;
}

/**
 * Rate-limit buckets are keyed by a hash of the address salted with a value
 * generated per process. The address is still needed to decide which bucket a
 * request falls into, but it is not what gets kept: the key cannot be reversed
 * back into an IP, means nothing outside this process, and disappears with it.
 * A plain non-cryptographic hash is enough here, because the goal is not to
 * hide the address from a reader of the map, it is to never hold it.
 */
const BUCKET_SALT = Math.random().toString(36).slice(2);

function bucketKey(address: string): string {
  const input = `${BUCKET_SALT}:${address}`;
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

/**
 * Per-isolate rate limit. Workers recycle isolates, so this blunts casual
 * abuse rather than enforcing a hard global cap — use a Cloudflare rate
 * limiting rule if you need that.
 */
export function isRateLimited(address: string, now = Date.now()): boolean {
  const key = bucketKey(address);
  const recent = (submissionsByBucket.get(key) ?? []).filter(
    (at) => now - at < RATE_LIMIT_WINDOW_MS,
  );

  if (submissionsByBucket.size >= RATE_LIMIT_MAX_TRACKED_BUCKETS) {
    for (const [staleKey, times] of submissionsByBucket) {
      if (times.every((at) => now - at >= RATE_LIMIT_WINDOW_MS)) {
        submissionsByBucket.delete(staleKey);
      }
    }
  }

  if (recent.length >= RATE_LIMIT_MAX) {
    submissionsByBucket.set(key, recent);
    return true;
  }

  recent.push(now);
  submissionsByBucket.set(key, recent);
  return false;
}

function optional(value: string | undefined): string {
  return value && value.trim() ? value.trim() : "—";
}

/**
 * Hands the lead to Formspree, which emails it to us and keeps a copy in the
 * Formspree dashboard. The score is included so the notification can be triaged
 * without opening anything else.
 *
 * The payload holds the questionnaire answers and nothing else. No IP, no
 * user agent, no referrer, no page URL, no campaign parameters — if the visitor
 * did not type it into the form, it does not come with the submission.
 */
export async function persistLead(
  values: AuditValues,
  score: AuditScore,
): Promise<void> {
  const businessType =
    values.businessType === AUDIT_OTHER_BUSINESS_TYPE
      ? `Other — ${values.businessTypeOther ?? ""}`.trim()
      : values.businessType;

  // The tier already appears in the subject below, so the flags only carry what
  // the tier does not say on its own.
  const subjectFlags = [
    score.needsCloserLook ? "Needs a closer look" : "",
  ].filter(Boolean);

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: [
        "[AI Audit]",
        ...subjectFlags,
        `${score.tier} — ${score.score}/${AUDIT_MAX_SCORE} — ${values.businessName}`,
      ]
        .filter(Boolean)
        .join(" "),
      "Lead score": `${score.score} / ${AUDIT_MAX_SCORE} (${score.tier})`,
      "Needs a closer look": score.needsCloserLook ? "Yes" : "No",
      Priority: score.priority,
      "Score breakdown": score.breakdown
        .map((part) => `${part.label}: ${part.points}`)
        .join(" · "),
      Name: values.name,
      Email: values.email,
      Business: values.businessName,
      Role: values.role,
      "Business type": businessType,
      "Unanswered request": values.unansweredRequest,
      "Weekly inquiry volume": values.weeklyInquiryVolume,
      "Repetitive work": values.repetitiveWork,
      Frequency: values.problemFrequency,
      "Average value": values.averageValue,
      "Wants to start": values.startTiming,
      Website: optional(values.website),
      Phone: optional(values.phone),
      "Task to automate": optional(values.automationTask),
      Software: optional(values.software),
      "Open to walkthrough": values.walkthrough || "—",
      "Follow-up opt-in": values.followUpOptIn ? "Yes" : "No",
    }),
  });

  if (!response.ok) {
    throw new Error(`Formspree responded ${response.status}`);
  }
}
