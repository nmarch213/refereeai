import { type Metadata } from "next";
import ChatInterface from "../../_components/chat-interface";

export const metadata: Metadata = {
  title: "Sport Rulebook Chat",
  description: "Chat with the rulebook of your favorite sport",
};

const sports = [
  {
    id: "basketball",
    name: "Basketball",
    description: "A fast-paced game played on a court with two teams.",
  },
  {
    id: "volleyball",
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

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <ChatInterface sport={sport?.id ?? ""} />
          </div>
        </div>
      </main>
    </div>
  );
}
