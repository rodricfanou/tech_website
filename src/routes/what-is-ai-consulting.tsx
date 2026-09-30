import { createFileRoute } from "@tanstack/react-router";
import { Index } from "./index";

export const Route = createFileRoute("/what-is-ai-consulting")({
  component: Index,
  head: () => ({
    meta: [
      {
        title: "What Is AI Consulting? | Novaris Nexus Tech",
      },
      {
        name: "description",
        content:
          "AI consultants translate between business and technology — closing the knowledge gap, streamlining repetitive work, and building the systems that make AI adoption stick.",
      },
    ],
  }),
});
