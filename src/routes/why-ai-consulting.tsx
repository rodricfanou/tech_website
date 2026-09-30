import { createFileRoute } from "@tanstack/react-router";
import { Index } from "./index";

export const Route = createFileRoute("/why-ai-consulting")({
  component: Index,
  head: () => ({
    meta: [
      {
        title: "Why Choose Novaris Nexus Tech? | AI Consulting",
      },
      {
        name: "description",
        content:
          "Teams choose Novaris Nexus Tech because we speak business and tech, tie strategy to real outcomes, and build rather than only advise.",
      },
    ],
  }),
});
