import { AUDIT_OTHER_BUSINESS_TYPE, type AuditValues } from "./ai-audit";
import { AUDIT_MAX_SCORE, type AuditScore } from "./ai-audit-score.server";

/**
 * Server-only concerns for the AI audit: rate limiting and delivery.
 *
 * Delivery currently goes over email via Formspree, the same endpoint the
 * contact form uses. Everything the endpoint needs is funnelled through
 * persistLead() below, so adding a database later is a change to this one
 * function rather than to the route or the form.
 */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mkoyqdla";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
/** Bound the map so a flood of distinct IPs cannot grow it without limit. */
const RATE_LIMIT_MAX_TRACKED_IPS = 5_000;

const submissionsByIp = new Map<string, number[]>();

/**
 * Per-isolate rate limit. Workers recycle isolates, so this blunts casual
 * abuse rather than enforcing a hard global cap — use a Cloudflare rate
 * limiting rule if you need that.
 */
export function isRateLimited(ip: string, now = Date.now()): boolean {
  const recent = (submissionsByIp.get(ip) ?? []).filter(
    (at) => now - at < RATE_LIMIT_WINDOW_MS,
  );

  if (submissionsByIp.size >= RATE_LIMIT_MAX_TRACKED_IPS) {
    for (const [key, times] of submissionsByIp) {
      if (times.every((at) => now - at >= RATE_LIMIT_WINDOW_MS)) {
        submissionsByIp.delete(key);
      }
    }
  }

  if (recent.length >= RATE_LIMIT_MAX) {
    submissionsByIp.set(ip, recent);
    return true;
  }

  recent.push(now);
  submissionsByIp.set(ip, recent);
  return false;
}

function optional(value: string | undefined): string {
  return value && value.trim() ? value.trim() : "—";
}

/**
 * Hands the lead to Formspree, which emails it to us and keeps a copy in the
 * Formspree dashboard. The score is included so the notification can be triaged
 * without opening anything else.
 */
export async function persistLead(
  values: AuditValues,
  score: AuditScore,
): Promise<void> {
  const businessType =
    values.businessType === AUDIT_OTHER_BUSINESS_TYPE
      ? `Other — ${values.businessTypeOther ?? ""}`.trim()
      : values.businessType;

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `[AI Audit] ${score.band} — ${score.score}/${AUDIT_MAX_SCORE} — ${values.businessName}`,
      "Lead score": `${score.score} / ${AUDIT_MAX_SCORE} (${score.band})`,
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
      "Repetitive work": values.repetitiveWork,
      Frequency: values.problemFrequency,
      "Average value": values.averageValue,
      "Wants to start": values.startTiming,
      Website: optional(values.website),
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
