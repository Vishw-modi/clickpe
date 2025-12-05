import { Database } from "@/lib/supabaseTypes";
import { Badge } from "./Badge";
import { Button } from "@/components/ui/button";
import {
  generateBadges,
  formatLoanType,
  formatCurrency,
} from "@/lib/badgeUtils";
import { MessageCircle, Percent, Building2, Clock } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductCardProps {
  product: Product;
  onAskAI: (productId: string) => void;
  isBestMatch?: boolean;
}

export function ProductCard({
  product,
  onAskAI,
  isBestMatch = false,
}: ProductCardProps) {
  const badges = generateBadges(product);
  const displayBadges = badges.slice(0, 4);

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-2 border-foreground p-4 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-md",
        isBestMatch && "shadow-md"
      )}
    >
      {isBestMatch && (
        <div className="bg-foreground text-background px-3 py-1 text-xs font-mono font-bold mb-3 self-start">
          BEST MATCH
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">{product.bank}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-foreground">
            <Percent className="h-4 w-4" />
            <span className="text-2xl font-bold font-mono">
              {Number(product.rate_apr).toFixed(1)}%
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">APR</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-3 font-mono uppercase">
        {formatLoanType(product.type)}
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {displayBadges.map((badge, index) => (
          <Badge key={index} label={badge.label} variant={badge.variant} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-4 border-t-2 border-foreground pt-3">
        <div>
          <span className="text-muted-foreground text-xs font-mono">
            MIN INCOME
          </span>
          <p className="font-bold">{formatCurrency(product.min_income)}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs font-mono">
            TENURE
          </span>
          <p className="font-bold flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {product.tenure_min_months}-{product.tenure_max_months}mo
          </p>
        </div>
      </div>

      {product.summary && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.summary}
        </p>
      )}

      <Button
        onClick={() => onAskAI(product.id)}
        className="mt-auto w-full"
        variant="default"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Ask AI
      </Button>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
