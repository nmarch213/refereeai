import { Metadata } from "next";
import ChatInterface from "../_components/chat-interface";

export const metadata: Metadata = {
  title: "Sport Rulebook Chat",
  description: "Chat with the rulebook of your favorite sport",
};

const sports = [
  {
    id: "football",
    name: "Football",
    description: "American football, a game of strategy and physical prowess.",
  },
  {
    id: "basketball",
    name: "Basketball",
    description: "A fast-paced game played on a court with two teams.",
  },
  {
    id: "tennis",
    name: "Tennis",
    description: "A racket sport played individually or in pairs.",
  },
  {
    id: "soccer",
    name: "Soccer",
    description: "Also known as football, the world's most popular sport.",
  },
];

export default function SportRulebookChat({
  params,
}: {
  params: { sport: string };
}) {
  const sport = sports.find((s) => s.id === params.sport) ?? sports[0];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-4 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">{sport?.name} Rulebook Chat</h1>
        </div>
      </header>
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="mb-4 text-xl font-semibold">About {sport?.name}</h2>
            <p className="mb-4 text-muted-foreground">{sport?.description}</p>
            <h3 className="mb-2 text-lg font-semibold">Quick Links</h3>
            <ul className="list-inside list-disc text-muted-foreground">
              <li>Official Rules</li>
              <li>Player Positions</li>
              <li>Equipment Guide</li>
              <li>Common Penalties</li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <ChatInterface sport={sport?.name ?? ""} />
          </div>
        </div>
      </main>
      <footer className="bg-secondary py-4">
        <div className="container mx-auto px-4 text-center text-secondary-foreground">
          © 2023 Sport Rulebook Chat. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
