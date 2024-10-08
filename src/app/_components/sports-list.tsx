import Image from "next/image";
import Link from "next/link";
import { HelpCircle, Book, MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";

const sports = [
  {
    name: "Volleyball",
    image: "/placeholder.svg?height=100&width=200",
    slug: "volleyball",
  },
  {
    name: "Basketball",
    image: "/placeholder.svg?height=100&width=200",
    slug: "basketball",
  },
];

export default function SportsCards() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport) => (
          <Card key={sport.name} className="overflow-hidden">
            <CardHeader className="p-0">
              <Image
                src={sport.image}
                alt={sport.name}
                width={200}
                height={100}
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mb-2 text-xl">{sport.name}</CardTitle>
            </CardContent>
            <CardFooter className="flex justify-between bg-secondary p-4">
              <Link href={`/${sport.slug}/question`} passHref>
                <Button variant="ghost" size="sm" asChild>
                  <span>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Ask Question
                  </span>
                </Button>
              </Link>
              <Link href={`/${sport.slug}/chat`} passHref>
                <Button variant="ghost" size="sm">
                  <Book className="mr-2 h-4 w-4" />
                  Chat with Rules
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="mr-2 h-4 w-4" />
                View Rules
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
