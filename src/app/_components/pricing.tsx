import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CheckCircle } from "lucide-react";

export function Pricing() {
  return (
    <div id="pricing" className="bg-gray-100 py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
          Pricing Plans
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Basic Plan */}
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
                  <CheckCircle className="mr-2 h-4 w-4" /> Single sport support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          {/* Pro Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For serious officials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">$19.99/month</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" /> All Basic features
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" /> Advanced case studies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" /> Multi-sport support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" /> Personalized study
                  plans
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          {/* Enterprise Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For associations and schools</CardDescription>
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
                  <CheckCircle className="mr-2 h-4 w-4" /> Bulk user management
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
  );
}
