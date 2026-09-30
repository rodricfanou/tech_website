import { createFileRoute } from "@tanstack/react-router";
import { Index } from "./index";

export const Route = createFileRoute("/process")({
  component: Index,
  head: () => ({
    meta: [
      {
        title:
          "Our Process — Discover, Design, Deliver, Enable | Novaris Nexus Tech",
      },
      {
        name: "description",
        content:
          "A studio-grade way of working: map the problem, propose within five days, deliver weekly, and hand over the keys to your team.",
      },
    ],
  }),
});
