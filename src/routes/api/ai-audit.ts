import { createFileRoute } from "@tanstack/react-router";
import { getRequestIP } from "@tanstack/react-start/server";

import {
  AUDIT_HONEYPOT_FIELD,
  auditSchema,
  toFieldErrors,
} from "@/lib/ai-audit";
import { scoreLead } from "@/lib/ai-audit-score.server";
import { isRateLimited, persistLead } from "@/lib/ai-audit-submit.server";

/** Generous for 13 short answers, small enough to refuse a stuffed body. */
const MAX_BODY_BYTES = 16_000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export const Route = createFileRoute("/api/ai-audit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";

        if (isRateLimited(ip)) {
          return json(
            {
              ok: false,
              formError:
                "Too many submissions from this connection. Please try again in a minute.",
            },
            429,
          );
        }

        const body = await request.text();
        if (body.length > MAX_BODY_BYTES) {
          return json({ ok: false, formError: "Submission too large." }, 413);
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(body);
        } catch {
          return json({ ok: false, formError: "Malformed request." }, 400);
        }

        if (typeof parsed !== "object" || parsed === null) {
          return json({ ok: false, formError: "Malformed request." }, 400);
        }

        const fields = parsed as Record<string, unknown>;

        // A bot filled the hidden field. Report success so it learns nothing,
        // but send nothing.
        const trap = fields[AUDIT_HONEYPOT_FIELD];
        if (typeof trap === "string" && trap.trim() !== "") {
          return json({ ok: true });
        }

        const result = auditSchema.safeParse(fields);
        if (!result.success) {
          return json({ ok: false, errors: toFieldErrors(result.error) }, 422);
        }

        try {
          await persistLead(result.data, scoreLead(result.data));
        } catch (error) {
          console.error("ai-audit: delivery failed", error);
          return json(
            {
              ok: false,
              formError:
                "We couldn't send that through. Please try again, or email us directly.",
            },
            502,
          );
        }

        return json({ ok: true });
      },
    },
  },
});
