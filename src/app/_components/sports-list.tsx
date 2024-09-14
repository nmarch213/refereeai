import React from "react";
import { Badge } from "~/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

interface Sport {
  name: string;
  slug: string;
  active: boolean;
}

interface SportsListProps {
  sports: Sport[];
  onSportClick: (sportName: string) => void;
}

export function SportsList({ sports, onSportClick }: SportsListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {sports.map((sport, index) => (
        <Card
          key={index}
          className="transition-shadow duration-300 hover:shadow-lg"
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {sport.name}
              <Badge variant={sport.active ? "default" : "secondary"}>
                {sport.active ? "Active" : "Inactive"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <button
              className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              onClick={() => onSportClick(sport.name)}
            >
              View Sport
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
