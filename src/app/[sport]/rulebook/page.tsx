"use client";

import { useState } from "react";
import { SportHeader } from "~/app/_components/sport-header";

export default function RulebookPage({
  params,
}: {
  params: { sport: string };
}) {
  const [version, setVersion] = useState("High School");
  const sportName = params.sport;

  return (
    <div className="space-y-6">
      <SportHeader
        sport={sportName}
        version={version}
        onVersionChange={setVersion}
      />
      <h2>{sportName} Rulebook</h2>
      <p>
        This is the {version} rulebook for {sportName}.
      </p>
      {/* Add your rulebook content here */}
    </div>
  );
}
