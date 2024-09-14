import { HydrateClient } from "~/trpc/server";
import { SportsList } from "../_components/sports-list";

export default async function Home() {
  const sports = [
    { name: "Basketball", slug: "basketball", active: true },
    { name: "Football", slug: "football", active: true },
    { name: "Soccer", slug: "soccer", active: true },
    { name: "Volleyball", slug: "volleyball", active: true },
    { name: "Baseball", slug: "baseball", active: true },
    { name: "Tennis", slug: "tennis", active: true },
    { name: "Golf", slug: "golf", active: true },
    { name: "Basketball", slug: "basketball", active: true },
  ];
  return (
    <HydrateClient>
      <SportsList
        sports={sports}
        onSportClick={() => {
          console.log("clicked");
        }}
      />
    </HydrateClient>
  );
}
