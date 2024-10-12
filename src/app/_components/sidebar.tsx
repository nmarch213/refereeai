"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  LayoutDashboard,
  Book,
  MessageCircle,
  Video,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";

const sports = [
  { name: "Volleyball", subscribed: true },
  { name: "Football", subscribed: true },
  { name: "Soccer", subscribed: false },
  { name: "Basketball", subscribed: false },
];

const subMenuItems = [
  { name: "Rulebook", href: "/rulebook", icon: Book },
  { name: "Chat with AI", href: "/chat", icon: MessageCircle },
  { name: "Video Discussions", href: "/videos", icon: Video },
  { name: "Exam Preparation", href: "/exam", icon: FileText },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSport, setExpandedSport] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleSportExpansion = (sportName: string) => {
    setExpandedSport(expandedSport === sportName ? null : sportName);
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center justify-end px-3 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          <Link
            href="/"
            className={cn(
              "group flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
            <span
              className={cn(
                "ml-3 transition-all duration-300 ease-in-out",
                isCollapsed
                  ? "w-0 overflow-hidden opacity-0"
                  : "w-auto opacity-100",
              )}
            >
              Dashboard
            </span>
          </Link>
          {sports.map((sport) => (
            <div key={sport.name}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between px-3 py-2 text-sm font-medium",
                  sport.subscribed
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
                onClick={() =>
                  sport.subscribed && toggleSportExpansion(sport.name)
                }
              >
                <span className="flex items-center">
                  {sport.subscribed ? (
                    expandedSport === sport.name ? (
                      <ChevronUp className="mr-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="mr-2 h-4 w-4" />
                    )
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  {!isCollapsed && sport.name}
                </span>
                {!sport.subscribed && !isCollapsed && (
                  <span className="text-xs text-primary">Unlock</span>
                )}
              </Button>
              {sport.subscribed &&
                expandedSport === sport.name &&
                !isCollapsed && (
                  <div className="ml-4 space-y-1">
                    {subMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={`/${sport.name.toLowerCase()}${item.href}`}
                        className={cn(
                          "flex h-8 items-center rounded-md px-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname ===
                            `/${sport.name.toLowerCase()}${item.href}`
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
