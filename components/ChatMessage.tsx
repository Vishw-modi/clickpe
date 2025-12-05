import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn("flex gap-3 p-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-foreground",
          isUser
            ? "bg-foreground text-background"
            : "bg-background text-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          "flex-1 max-w-[80%] p-3 border-2 border-foreground",
          isUser
            ? "bg-foreground text-background shadow-xs"
            : "bg-secondary text-foreground shadow-xs"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
