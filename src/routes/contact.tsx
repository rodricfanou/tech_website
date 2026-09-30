import { createFileRoute } from "@tanstack/react-router";
import { Index } from "./index";

export const Route = createFileRoute("/contact")({
  component: Index,
  head: () => ({
    meta: [
      {
        title: "Contact — Start an AI Project | Novaris Nexus Tech",
      },
      {
        name: "description",
        content:
          "Have a project, a talk proposal or a challenge? Book a complimentary 30-minute AI strategy session and we'll reply within one business day.",
      },
    ],
  }),
});
