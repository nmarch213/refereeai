"use client";

import React from "react";
import {
  Book,
  MessageCircle,
  Video,
  FileText,
  Lock,
  CheckCircle,
  Badge,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Sports() {
  const [subscribedSports, setSubscribedSports] = React.useState([
    "volleyball",
  ]);
  const allSports = ["volleyball", "football", "basketball", "soccer"];

  const toggleSportSubscription = (sport: string) => {
    setSubscribedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport],
    );
  };

  return (
    <div className="container mx-auto space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Subscriptions</CardTitle>
          <CardDescription>Manage your sport subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {allSports.map((sport) => (
              <div key={sport} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {subscribedSports.includes(sport) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                  <Label
                    htmlFor={`${sport}-subscription`}
                    className="text-lg capitalize"
                  >
                    {sport}
                  </Label>
                </div>
                <Switch
                  id={`${sport}-subscription`}
                  checked={subscribedSports.includes(sport)}
                  onCheckedChange={() => toggleSportSubscription(sport)}
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Update Subscriptions</Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="volleyball" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {allSports.map((sport) => (
            <TabsTrigger
              key={sport}
              value={sport}
              disabled={!subscribedSports.includes(sport)}
            >
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        {allSports.map((sport) => (
          <TabsContent key={sport} value={sport} className="space-y-4">
            {subscribedSports.includes(sport) ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {sport.charAt(0).toUpperCase() + sport.slice(1)} Rulebook
                    </CardTitle>
                    <CardDescription>
                      Access the latest NFHS {sport} rulebook and related
                      publications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Button className="w-full">
                      <Book className="mr-2 h-4 w-4" /> View Rulebook
                    </Button>
                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" /> Chat with AI
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Video Discussions</CardTitle>
                    <CardDescription>
                      Analyze and discuss game situations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="flex items-center p-2">
                          <Video className="mr-2 h-8 w-8" />
                          <div>
                            <h3 className="font-semibold">
                              Play Scenario #{i}
                            </h3>
                            <p className="text-sm text-gray-500">23 comments</p>
                          </div>
                          <Badge className="ml-auto">New</Badge>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">View All Discussions</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Exam Preparation</CardTitle>
                    <CardDescription>
                      Practice for your {sport} referee exam
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <FileText className="mr-2 h-4 w-4" /> Start Practice Test
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {sport.charAt(0).toUpperCase() + sport.slice(1)} Content
                    Locked
                  </CardTitle>
                  <CardDescription>
                    Subscribe to access {sport} rulebooks and features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => toggleSportSubscription(sport)}
                  >
                    <Lock className="mr-2 h-4 w-4" /> Unlock{" "}
                    {sport.charAt(0).toUpperCase() + sport.slice(1)} Content
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
