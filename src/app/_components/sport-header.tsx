import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface SportHeaderProps {
  sport: string;
  version: string;
  onVersionChange: (version: string) => void;
}

const versions = ["High School", "NCAA", "FIBA"];
const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];

export function SportHeader({
  sport,
  version,
  onVersionChange,
}: SportHeaderProps) {
  const [year, setYear] = useState(currentYear);

  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        {sport} {year}
      </h1>
      <div className="flex space-x-4">
        <Select
          value={year.toString()}
          onValueChange={(value) => setYear(Number(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={version} onValueChange={onVersionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            {versions.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
