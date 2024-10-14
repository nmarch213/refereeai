"use client";

import Image from "next/image";
import Link from "next/link";
import { HelpCircle, Book, MoreHorizontal, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function SportsCards() {
  const { data: sports, isLoading } = api.sports.getAllSports.useQuery();

  if (isLoading) {
    return <div>Loading sports...</div>;
  }

  const availableSports = sports?.filter((sport) => sport.imgUrl) ?? [];
  const comingSoonSports = sports?.filter((sport) => !sport.imgUrl) ?? [];

  return (
    <div className="container mx-auto py-8">
      <h2 className="mb-4 text-2xl font-bold">Available Sports</h2>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {availableSports.map((sport) => (
          <Card key={sport.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <Image
                src={sport.imgUrl!}
                alt={sport.name}
                height={100}
                width={200}
                className="h-32 w-full object-cover"
              />
            </CardHeader>
            <CardContent className="p-2">
              <CardTitle className="text-lg">{sport.name}</CardTitle>
            </CardContent>
            <CardFooter className="flex justify-center p-2">
              <Link href={`/${sport.slug}/question`} passHref>
                <Button variant="secondary" size="sm">
                  Explore
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {comingSoonSports.length > 0 && (
        <>
          <h2 className="mb-4 text-2xl font-bold">Coming Soon</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {comingSoonSports.map((sport) => (
              <Card key={sport.id} className="overflow-hidden">
                <CardHeader className="flex h-24 items-center justify-center bg-secondary p-2">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-2">
                  <CardTitle className="text-sm">{sport.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">Coming Soon</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
