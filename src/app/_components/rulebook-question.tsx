"use client";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import Markdown from "react-markdown";
import { api } from "~/trpc/react";
import { ScrollArea } from "~/components/ui/scroll-area";

export function RulebookQuestion({
  sport,
}: {
  sport: "basketball" | "volleyball";
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askQuestionMutation = api.question.askQuestion.useMutation({
    onSuccess: (data) => {
      setAnswer(data);
    },
    onError: (error) => {
      console.error("Error fetching answer:", error);
      setAnswer(
        "Sorry, there was an error processing your question. Please try again.",
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    askQuestionMutation.mutate({ question, sport });
  };

  return (
    <Card className="flex h-[80vh] flex-col">
      <CardHeader>
        <CardTitle>{sport} Rulebook Q&A</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {answer && (
            <div className="mb-4 rounded-lg bg-secondary p-4 text-secondary-foreground">
              <Markdown>{answer}</Markdown>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Ask a question about the rulebook..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={askQuestionMutation.isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={askQuestionMutation.isPending}
          >
            {askQuestionMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
