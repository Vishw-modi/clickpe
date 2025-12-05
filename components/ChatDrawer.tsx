import { useState, useEffect, useRef } from "react";
import { Database } from "@/lib/supabaseTypes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "./Badge";
import { ChatMessage } from "./ChatMessage";
import { generateBadges } from "@/lib/badgeUtils";
import { Send, X, Percent, Building2 } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPayload {
  productId: string;
  message: string;
  history: Message[];
}

interface ChatDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatDrawer({ product, isOpen, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset messages when product changes
  useEffect(() => {
    if (product) {
      setMessages([]);
    }
  }, [product?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !product) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          message: inputValue.trim(),
          history: messages, // Send previous messages, not including the current one
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.details || `HTTP ${res.status}`
        );
      }

      const data = await res.json();

      const assistantReply: Message = {
        role: "assistant",
        content: typeof data.reply === "string" ? data.reply : "No response.",
      };

      setMessages([...updatedMessages, assistantReply]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error contacting AI.";
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: `Error: ${errorMessage}`,
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!product) return null;

  const badges = generateBadges(product).slice(0, 3);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-l-2 border-foreground">
        {/* Header */}
        <SheetHeader className="p-4 border-b-2 border-foreground bg-secondary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-left text-lg font-bold">
                {product.name}
              </SheetTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm">
                  <Building2 className="h-4 w-4" />
                  <span>{product.bank}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-mono font-bold">
                  <Percent className="h-4 w-4" />
                  <span>{Number(product.rate_apr).toFixed(1)}% APR</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="border-2 border-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {badges.map((badge, index) => (
              <Badge key={index} label={badge.label} variant={badge.variant} />
            ))}
          </div>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 bg-background">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              <div className="text-center px-6 w-full">
                <p className="text-base font-medium text-foreground mb-6">
                  Ask any question about <strong>{product.name}</strong>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mx-auto max-w-md">
                  {/* Popular Questions */}
                  <div className="border border-foreground/20 rounded-lg p-4 bg-card">
                    <p className="font-semibold mb-2 text-foreground">
                      Popular questions
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li>• What is the APR?</li>
                      <li>• What is the minimum income required?</li>
                      <li>• What is the minimum credit score?</li>
                      <li>• Are there any processing fees?</li>
                      <li>• Is prepayment allowed?</li>
                    </ul>
                  </div>

                  {/* You can ask about */}
                  <div className="border border-foreground/20 rounded-lg p-4 bg-card">
                    <p className="font-semibold mb-2 text-foreground">
                      You can ask about:
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li>• Interest rate (APR)</li>
                      <li>• Minimum income</li>
                      <li>• Credit score</li>
                      <li>• Loan tenure</li>
                      <li>• Processing fees</li>
                      <li>• Prepayment policy</li>
                      <li>• Disbursal speed</li>
                      <li>• Documentation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t-2 border-foreground bg-card">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this loan..."
              className="min-h-[60px] max-h-[120px] resize-none border-2 border-foreground"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="self-end"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
