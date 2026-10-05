import type { AuditValues } from "./ai-audit";

/**
 * Deterministic lead scoring for the AI audit.
 *
 * The dimensions mirror how a lead actually gets qualified: is this our kind
 * of buyer, how much does the problem hurt, how often does it bite, what is it
 * worth, how much of it can be automated, how soon do they want relief, and
 * will they actually take a call.
 *
 * Every point comes from an answer the visitor gave, so nothing has to be
 * invented later: the score exists to sort the inbox, never to be shown to the
 * visitor as a statistic.
 */

type PointsTable = Record<string, Record<string, number>>;

const POINTS: PointsTable = {
  /** Fit: can this person decide. */
  role: {
    Owner: 8,
    Manager: 5,
    Other: 2,
  },
  /** Business pain: what happens to an inbound request nobody can answer. */
  unansweredRequest: {
    "Nothing happens until someone gets to it": 8,
    "Someone follows up later": 12,
    "An assistant or service picks it up": 10,
    "The request is usually lost": 20,
    "Not sure": 10,
  },
  /** Automation potential: where the repeatable work sits. */
  repetitiveWork: {
    "Scheduling and booking": 14,
    "Responding to inquiries": 16,
    "Data entry and paperwork": 14,
    "Reporting and follow-ups": 10,
    "Quoting and proposals": 14,
    "Not sure": 8,
  },
  /** Frequency: how often the problem lands. */
  problemFrequency: {
    Rarely: 0,
    "A few times a month": 6,
    "A few times a week": 12,
    Daily: 16,
    "Several times a day": 18,
  },
  /** Economic value: what one recovered customer or project is worth. */
  averageValue: {
    "Under $200": 2,
    "$200 to $1,000": 6,
    "$1,000 to $5,000": 12,
    "$5,000+": 18,
  },
  /** Urgency. */
  startTiming: {
    "Right away": 15,
    "Within 3 months": 10,
    "Just exploring": 4,
    "Not interested": 0,
  },
  /** Willingness to engage. */
  walkthrough: {
    Yes: 5,
    No: 0,
  },
};

/** 8 + 20 + 16 + 18 + 18 + 15 + 5, so the score reads directly as a percent. */
export const AUDIT_MAX_SCORE = 100;

const HOT_AT = 70;
const WARM_AT = 45;

export type AuditScore = {
  score: number;
  band: "Hot" | "Warm" | "Nurture";
  priority: string;
  breakdown: { label: string; points: number }[];
};

const PRIORITY: Record<AuditScore["band"], string> = {
  Hot: "Reply within one business day and offer the 20-minute session.",
  Warm: "Reply within two business days with the written summary.",
  Nurture: "Send the summary only. Revisit if they follow up.",
};

export function scoreLead(values: AuditValues): AuditScore {
  const breakdown: AuditScore["breakdown"] = [
    { label: "Role", points: POINTS.role[values.role] ?? 0 },
    {
      label: "What happens to an unanswered request",
      points: POINTS.unansweredRequest[values.unansweredRequest] ?? 0,
    },
    {
      label: "Biggest area of repetitive work",
      points: POINTS.repetitiveWork[values.repetitiveWork] ?? 0,
    },
    {
      label: "How often it happens",
      points: POINTS.problemFrequency[values.problemFrequency] ?? 0,
    },
    {
      label: "Average value of a customer or project",
      points: POINTS.averageValue[values.averageValue] ?? 0,
    },
    {
      label: "How soon they want to start",
      points: POINTS.startTiming[values.startTiming] ?? 0,
    },
    {
      label: "Open to a walkthrough",
      points: POINTS.walkthrough[values.walkthrough ?? ""] ?? 0,
    },
  ];

  const score = breakdown.reduce((total, part) => total + part.points, 0);
  const band: AuditScore["band"] =
    score >= HOT_AT ? "Hot" : score >= WARM_AT ? "Warm" : "Nurture";

  return { score, band, priority: PRIORITY[band], breakdown };
}
