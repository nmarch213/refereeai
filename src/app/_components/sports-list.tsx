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
    image:
      "https://images.pexels.com/photos/17397548/pexels-photo-17397548/free-photo-of-women-playing-volleyball.jpeg",
    slug: "volleyball",
  },
  {
    name: "Basketball",
    image: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg",
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
                priority
                src={sport.image}
                alt={sport.name}
                height={200}
                width={400}
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl">{sport.name}</CardTitle>
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
