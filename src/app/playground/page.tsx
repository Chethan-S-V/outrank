import type { Metadata } from "next";
import { PlaygroundExperience } from "@/components/outrank/playground-experience";

export const metadata: Metadata = {
  title: "World Map Playground - Outrank",
  description:
    "Interactive global territory grid. Select any space or tech region on the world map and claim sovereign rank with direct verification.",
};

export default function PlaygroundPage() {
  return (
    <main className="outrank-main w-full py-4">
      <PlaygroundExperience />
    </main>
  );
}
