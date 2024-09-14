"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface({ sport }: { sport: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your ${sport} rulebook assistant. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      // Here you would typically send the message to your backend for processing
      // For this example, we'll just echo the user's message
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `You asked about "${input}". Here's what I found in the ${sport} rulebook...`,
          },
        ]);
      }, 1000);
      setInput("");
    }
  };

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader>
        <CardTitle>{sport} Rulebook Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block rounded-lg p-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
