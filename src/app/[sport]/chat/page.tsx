import { type Metadata } from "next";
import ChatInterface from "../../_components/chat-interface";
import { MDXBookPage } from "~/app/_components/mdx-book-page";
import type { Sport } from "~/app/_models/sports";
import { BookYear } from "~/app/_models/years";

export const metadata: Metadata = {
  title: "Sport Rulebook Chat",
  description: "Chat with the rulebook of your favorite sport",
};

type Sports = {
  id: Sport;
  year: BookYear;
  name: string;
  description: string;
}[];

const sports: Sports = [
  {
    id: "basketball",
    year: "2024-25",
    name: "Basketball",
    description: "A fast-paced game played on a court with two teams.",
  },
  {
    id: "volleyball",
    year: "2024-25",
    name: "Volleyball",
    description: "A team sport played on a court with two teams.",
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
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <MDXBookPage sport={sport.id} year={sport.year} />
            <ChatInterface sport={sport.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
