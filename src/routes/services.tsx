import { createFileRoute } from "@tanstack/react-router";
import { Index } from "./index";

export const Route = createFileRoute("/services")({
  component: Index,
  head: () => ({
    meta: [
      {
        title:
          "Services — AI Consulting, Advisory, Talks & Training | Novaris Nexus Tech",
      },
      {
        name: "description",
        content:
          "Four ways Novaris Nexus Tech plugs into your team: AI consulting, technical talks, technical advisory, and hands-on training.",
      },
    ],
  }),
});
