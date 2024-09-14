import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Search, CheckSquare, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold">Referee AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#testimonials"
          >
            Testimonials
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#pricing"
          >
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <div className="bg-black py-12 text-white md:py-24 lg:py-32 xl:py-48">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Add this wrapper */}
            <section className="w-full bg-black py-12 text-white md:py-24 lg:py-32 xl:py-48">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                      Master the Rulebook with AI
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                      Referee AI: Your intelligent companion for NFHS rulebooks,
                      exam preparation, and instant rule clarifications.
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
                    Ask questions about specific rules and get instant, accurate
                    answers from the official NFHS rulebooks.
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
        <div id="pricing" className="bg-gray-100 py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
              Pricing Plans
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>For individual referees</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">$9.99/month</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> Rulebook Q&A
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> Basic exam prep
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> Single sport
                      support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For serious officials</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">$19.99/month</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> All Basic
                      features
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> Advanced case
                      studies
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> Multi-sport
                      support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> Personalized
                      study plans
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>
                    For associations and schools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">Custom</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> All Pro features
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> Custom rule
                      integrations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> Bulk user
                      management
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" /> Analytics and
                      reporting
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Contact Sales</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        <div className="bg-black py-12 text-white md:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Become a Rule Expert
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join Referee AI today and take your officiating knowledge to
                  the next level. Perfect for new and experienced NFHS officials
                  alike.
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
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500">
          © 2023 Referee AI. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
