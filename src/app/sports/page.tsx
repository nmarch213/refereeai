import { HydrateClient } from "~/trpc/server";
import { SportsList } from "../_components/sports-list";

export default async function Home() {
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
