import React from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">Privacy Policy</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Commitment to Your Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            At Referee AI, we value your privacy and are committed to protecting
            your personal information. This policy outlines how we collect, use,
            and safeguard your data.
          </p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="mb-8 space-y-4">
        <AccordionItem value="item-1" className="rounded-lg border">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
            <span className="text-lg font-semibold">
              1. Information We Collect
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3 text-muted-foreground">
            <p>We collect information you provide directly to us, such as:</p>
            <ul className="mt-2 list-inside list-disc">
              <li>Account creation details</li>
              <li>Usage data from our services</li>
              <li>Communication during support interactions</li>
              <li>Feedback and survey responses</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="rounded-lg border">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
            <span className="text-lg font-semibold">
              2. How We Use Your Information
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3 text-muted-foreground">
            <p>We use the information we collect to:</p>
            <ul className="mt-2 list-inside list-disc">
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about our services</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="rounded-lg border">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
            <span className="text-lg font-semibold">
              3. Sharing of Information
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3 text-muted-foreground">
            <p>
              We do not sell your personal information. We may share information
              with:
            </p>
            <ul className="mt-2 list-inside list-disc">
              <li>
                Third-party service providers who perform services on our behalf
              </li>
              <li>
                Law enforcement or government entities when required by law
              </li>
              <li>Other parties with your explicit consent</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="rounded-lg border">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
            <span className="text-lg font-semibold">
              4. Your Choices and Rights
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3 text-muted-foreground">
            <p>You have the right to:</p>
            <ul className="mt-2 list-inside list-disc">
              <li>Access, update, or delete your account information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>
                Object to the processing of your data in certain circumstances
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <footer className="mt-12 text-sm text-muted-foreground">
        <p>Last updated: October 2024</p>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
