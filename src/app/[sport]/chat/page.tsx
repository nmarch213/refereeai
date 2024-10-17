import { type Metadata } from "next";
import ChatInterface from "../../_components/chat-interface";
import { MDXBookPage } from "~/app/_components/mdx-book-page";
import type { Sport } from "~/app/_models/sports";
import type { BookYear } from "~/app/_models/years";

export const metadata: Metadata = {
  title: "Sport Rulebook Chat",
  description: "Chat with the rulebook of your favorite sport",
};

type Sports = {
  id: Sport;
  year: BookYear;
  name: string;
  description: string;
  rulebookId: string;
}[];

const sports: Sports = [
  {
    id: "basketball",
    year: "2024-25",
    name: "Basketball",
    description: "A fast-paced game played on a court with two teams.",
    rulebookId: "358e37f0-9939-45f3-b2d6-23a4be99201f",
  },
  {
    id: "volleyball",
    year: "2024-25",
    name: "Volleyball",
    description: "A team sport played on a court with two teams.",
    rulebookId: "358e37f0-9939-45f3-b2d6-23a4be99201f",
  },
];

export default function SportRulebookChat({
  params,
}: {
  params: { sport: string };
}) {
  const sport = sports.find((s) => s.id === params.sport) ?? sports[0];

  if (!sport) {
    return <div>Sport not found</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <div className="h-full w-full p-4">
          {/* <MDXBookPage sport={sport.id} year={sport.year} /> */}
          <ChatInterface rulebookId={sport.rulebookId} />
        </div>
      </main>
    </div>
  );
}
