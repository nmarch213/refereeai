"use client";

import { useState } from "react";
import { SportHeader } from "~/app/_components/sport-header";
import { subMenuItems } from "~/app/_components/sidebar"; // Import this if you want to use the same submenu items

export default function SportPage({ params }: { params: { sport: string } }) {
  const [version, setVersion] = useState("High School");
  const sportName = params.sport;

  return (
    <div className="space-y-6">
      <SportHeader
        sport={sportName}
        version={version}
        onVersionChange={setVersion}
      />
      <nav className="flex space-x-4">
        {subMenuItems.map((item) => (
          <a
            key={item.name}
            href={`/${sportName}${item.href}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {item.name}
          </a>
        ))}
      </nav>
      {/* Rest of your sport page content */}
      <h2>Welcome to {sportName}</h2>
      <p>This is the {version} version.</p>
    </div>
  );
}
