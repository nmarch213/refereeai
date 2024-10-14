"use client";

import Image from "next/image";
import Link from "next/link";
import { HelpCircle, Book, Video, MessageSquare, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { api } from "~/trpc/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function SportsCards() {
  const { data: sports, isLoading } = api.sports.getAllSports.useQuery();

  if (isLoading) {
    return <div>Loading sports...</div>;
  }

  const availableSports = sports?.filter((sport) => sport.imgUrl) ?? [];
  const comingSoonSports = sports?.filter((sport) => !sport.imgUrl) ?? [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-bold">Available Sports</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {availableSports.map((sport) => (
          <Card key={sport.id} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <Image
                src={sport.imgUrl!}
                alt={sport.name}
                height={200}
                width={400}
                className="h-48 w-full object-cover"
              />
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <CardTitle className="mb-2 text-xl">{sport.name}</CardTitle>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/${sport.slug}/question`} passHref>
                      <Button variant="outline" size="sm" className="w-full">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Explore</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Explore questions about {sport.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/${sport.slug}/chat`} passHref>
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Chat</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chat about {sport.name} rules</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/${sport.slug}/rulebook`} passHref>
                      <Button variant="outline" size="sm" className="w-full">
                        <Book className="mr-2 h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Rulebook</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View {sport.name} rulebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/${sport.slug}/video`} passHref>
                      <Button variant="outline" size="sm" className="w-full">
                        <Video className="mr-2 h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Video</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Watch video discussions about {sport.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
