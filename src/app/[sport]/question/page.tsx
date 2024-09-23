import { type Metadata } from "next";
import { RulebookQuestion } from "~/app/_components/rulebook-question";

export const metadata: Metadata = {
  title: "Sport Rulebook Question",
  description: "Ask a question about the rulebook of your favorite sport",
};

const sports: { id: "basketball" | "volleyball"; name: string }[] = [
  { id: "basketball", name: "Basketball" },
  { id: "volleyball", name: "Volleyball" },
];
export default function SportRulebookQuestionPage({
  params,
}: {
  params: { sport: string };
}) {
  const sport = sports.find((s) => s.id === params.sport) ?? sports[0];

  if (!sport) {
    return <div>Invalid sport</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <RulebookQuestion sport={sport.id} />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{sport.name} Rulebook</h2>
            <p>
              Ask a single question about the {sport?.name} rulebook and get an
              instant answer.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
