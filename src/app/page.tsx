import { CheckSquare, MessageSquare, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { HydrateClient } from "~/trpc/server";
import { Pricing } from "./_components/pricing";
import { Dashboard } from "./_components/dashboard";
import { getServerAuthSession } from "~/server/auth";

export default async function LandingPage() {
  const session = await getServerAuthSession();

  if (session) {
    return <Dashboard />;
  }

  return (
    <HydrateClient>
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex-1">
          <div className="bg-black py-12 text-white md:py-24 lg:py-32 xl:py-48">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <section className="w-full bg-black py-12 text-white md:py-24 lg:py-32 xl:py-48">
                <div className="container px-4 md:px-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                        Master the Rulebook with AI
                      </h1>
                      <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                        Referee AI: Your intelligent companion for NFHS
                        rulebooks, exam preparation, and instant rule
                        clarifications.
                      </p>
                    </div>
                    <div className="space-x-4">
                      <Button>Try It Free</Button>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div id="features" className="bg-gray-100 py-12 md:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
                Key Features
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Search className="mb-2 h-8 w-8" />
                    <CardTitle>Instant Rule Lookup</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Ask questions about specific rules and get instant,
                      accurate answers from the official NFHS rulebooks.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CheckSquare className="mb-2 h-8 w-8" />
                    <CardTitle>Exam Preparation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Practice with AI-generated questions based on real exam
                      scenarios to improve your test scores.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <MessageSquare className="mb-2 h-8 w-8" />
                    <CardTitle>Case Study Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Explore complex scenarios and learn how to apply rules
                      correctly in various game situations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <div id="testimonials" className="py-12 md:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
                What Officials Are Saying
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>John Smith</CardTitle>
                    <CardDescription>NFHS Basketball Referee</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      &quot;Referee AI has been a game-changer for my exam
                      preparation. I aced my recertification test thanks to the
                      practice questions and instant rule clarifications.&quot;
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Sarah Johnson</CardTitle>
                    <CardDescription>NFHS Soccer Official</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      &quot;The case study analysis feature helped me understand
                      complex scenarios much better. It&apos;s like having a
                      veteran referee mentor available 24/7.&quot;
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <Pricing />

          <div className="bg-black py-12 text-white md:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Become a Rule Expert
                  </h2>
                  <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Join Referee AI today and take your officiating knowledge to
                    the next level. Perfect for new and experienced NFHS
                    officials alike.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <Button className="w-full" size="lg">
                    Start Your Free Trial
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </HydrateClient>
  );
}
