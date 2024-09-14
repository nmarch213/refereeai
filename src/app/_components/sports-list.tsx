import Image from "next/image";
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
    name: "Football",
    image: "/placeholder.svg?height=100&width=200",
    slug: "football",
  },
  {
    name: "Basketball",
    image: "/placeholder.svg?height=100&width=200",
    slug: "basketball",
  },
  {
    name: "Tennis",
    image: "/placeholder.svg?height=100&width=200",
    slug: "tennis",
  },
  {
    name: "Soccer",
    image: "/placeholder.svg?height=100&width=200",
    slug: "soccer",
  },
  {
    name: "Baseball",
    image: "/placeholder.svg?height=100&width=200",
    slug: "baseball",
  },
  {
    name: "Golf",
    image: "/placeholder.svg?height=100&width=200",
    slug: "golf",
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
              <Button variant="ghost" size="sm">
                <HelpCircle className="mr-2 h-4 w-4" />
                Ask Question
              </Button>
              <Button variant="ghost" size="sm">
                <Book className="mr-2 h-4 w-4" />
                View Rules
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="mr-2 h-4 w-4" />
                View Other
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
