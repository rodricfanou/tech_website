import type { AuditValues } from "./ai-audit";

/**
 * Deterministic lead scoring for the AI audit.
 *
 * Every point here comes from an answer the visitor gave, so nothing has to be
 * invented later: the score exists to sort the inbox, never to be shown to the
 * visitor as a statistic.
 */

type PointsTable = Record<string, Record<string, number>>;

const POINTS: PointsTable = {
  role: {
    Owner: 8,
    Manager: 5,
    Other: 2,
  },
  missedCallHandling: {
    "Goes to voicemail": 6,
    "Handled by staff later": 10,
    "Answering service": 8,
    "The call is usually lost": 18,
    "Not sure": 8,
  },
  missedCallsPerWeek: {
    "0 to 5": 0,
    "6 to 15": 10,
    "16 to 30": 20,
    "30+": 30,
    "Not sure": 12,
  },
  averageJobValue: {
    "Under $200": 2,
    "$200 to $1,000": 6,
    "$1,000 to $5,000": 12,
    "$5,000+": 18,
  },
  startTiming: {
    "Right away": 15,
    "Within 3 months": 10,
    "Just exploring": 3,
    "Not interested": 0,
  },
  walkthrough: {
    Yes: 5,
    No: 0,
  },
};

/** 8 + 18 + 30 + 18 + 15 + 5. Used to report the score as a percentage. */
export const AUDIT_MAX_SCORE = 94;

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
      label: "What happens on a missed call",
      points: POINTS.missedCallHandling[values.missedCallHandling] ?? 0,
    },
    {
      label: "Calls missed per week",
      points: POINTS.missedCallsPerWeek[values.missedCallsPerWeek] ?? 0,
    },
    {
      label: "Average job value",
      points: POINTS.averageJobValue[values.averageJobValue] ?? 0,
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
