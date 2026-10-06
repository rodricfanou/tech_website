import type { AuditValues } from "./ai-audit";

/**
 * Lead scoring for the AI audit.
 *
 * Seven binary or near-binary questions, worth 12 points in total. Each one is
 * something the visitor answered, so the score exists only to sort the inbox —
 * it is never shown to the visitor and never presented as a statistic.
 *
 * Note what is deliberately absent: where the repetitive work sits. It is still
 * captured and still reaches the notification email, because it shapes the
 * summary, but it does not move the score. Priority here is about who is
 * losing money right now, not who has the most interesting automation story.
 */

export type AuditTier = "HOT" | "WARM" | "NURTURE";

export type AuditScore = {
  score: number;
  tier: AuditTier;
  /** Set when the volume answer is unusable but the job value is high. */
  needsCloserLook: boolean;
  priority: string;
  breakdown: { label: string; points: number }[];
};

/** 1 + 2 + 2 + 1 + 2 + 3 + 1. */
export const AUDIT_MAX_SCORE = 12;

const HOT_AT = 8;
const WARM_AT = 4;

/** Owner or Manager can actually sign off on the work. */
const ROLE_QUALIFIES = new Set<AuditValues["role"]>(["Owner", "Manager"]);

/**
 * "Lost or wait": the request dies, or it sits until someone gets to it. An
 * assistant or service already picking it up is the good outcome, so it scores
 * nothing.
 */
const UNANSWERED_LOST_OR_WAIT = new Set<AuditValues["unansweredRequest"]>([
  "Nothing happens until someone gets to it",
  "Someone follows up later",
  "The request is usually lost",
]);

const FREQUENT_ENOUGH = new Set<AuditValues["problemFrequency"]>([
  "A few times a week",
  "Daily",
  "Several times a day",
]);

const HIGH_VOLUME = new Set<AuditValues["weeklyInquiryVolume"]>([
  "30 to 100",
  "100+",
]);

const HIGH_VALUE = new Set<AuditValues["averageValue"]>([
  "$1,000 to $5,000",
  "$5,000+",
]);

const START_POINTS: Partial<Record<AuditValues["startTiming"], number>> = {
  "Right away": 3,
  "Within 3 months": 2,
};

const PRIORITY: Record<AuditTier, string> = {
  HOT: "Reply within one business day and offer the 15-minute walkthrough.",
  WARM: "Reply within two business days with the written summary.",
  NURTURE: "Send the summary only. Revisit if they follow up.",
};

export function scoreLead(values: AuditValues): AuditScore {
  const breakdown: AuditScore["breakdown"] = [
    {
      label: "Role is Owner or Manager",
      points: ROLE_QUALIFIES.has(values.role) ? 1 : 0,
    },
    {
      label: "Unanswered requests are lost or wait",
      points: UNANSWERED_LOST_OR_WAIT.has(values.unansweredRequest) ? 2 : 0,
    },
    {
      label: "Happens a few times a week or more",
      points: FREQUENT_ENOUGH.has(values.problemFrequency) ? 2 : 0,
    },
    {
      label: "30 or more inbound requests a week",
      points: HIGH_VOLUME.has(values.weeklyInquiryVolume) ? 1 : 0,
    },
    {
      label: "Average value is $1,000 or more",
      points: HIGH_VALUE.has(values.averageValue) ? 2 : 0,
    },
    {
      label: "Wants to start right away",
      points: START_POINTS[values.startTiming] ?? 0,
    },
    {
      label: "Open to a walkthrough",
      points: values.walkthrough === "Yes" ? 1 : 0,
    },
  ];

  const score = breakdown.reduce((total, part) => total + part.points, 0);
  const tier: AuditTier =
    score >= HOT_AT ? "HOT" : score >= WARM_AT ? "WARM" : "NURTURE";

  /*
   * "Not sure" on volume means the one number that decides the size of the
   * problem is missing, which is exactly the case a rubric cannot resolve on
   * its own. Paired with a high job value it is worth a human look rather than
   * a quiet NURTURE, because the upside could be large.
   */
  const needsCloserLook =
    values.weeklyInquiryVolume === "Not sure" &&
    HIGH_VALUE.has(values.averageValue);

  return { score, tier, needsCloserLook, priority: PRIORITY[tier], breakdown };
}
