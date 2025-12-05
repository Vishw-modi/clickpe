import { Database } from "@/lib/supabaseSchema";

type Product = Database["public"]["Tables"]["products"]["Row"];

export interface BadgeInfo {
  label: string;
  variant: "success" | "info" | "warning" | "default";
}

export function generateBadges(product: Product): BadgeInfo[] {
  const badges: BadgeInfo[] = [];

  // Low APR badge
  if (product.rate_apr < 12) {
    badges.push({ label: "Low APR", variant: "success" });
  }

  // Fast Disbursal badge
  if (product.disbursal_speed !== "standard") {
    badges.push({ label: "Fast Disbursal", variant: "info" });
  }

  // Low Docs badge
  if (product.docs_level === "low") {
    badges.push({ label: "Low Docs", variant: "info" });
  }

  // Credit Score badge
  badges.push({
    label: `Credit Score ≥ ${product.min_credit_score}`,
    variant: "default",
  });

  // Salary Eligible badge
  badges.push({
    label: `Salary > $${(product.min_income / 1000).toFixed(0)}K Eligible`,
    variant: "default",
  });

  // Prepayment Allowed badge
  if (product.prepayment_allowed) {
    badges.push({ label: "Prepayment Allowed", variant: "success" });
  }

  // Flexible Tenure badge
  if (product.tenure_max_months && product.tenure_max_months > 48) {
    badges.push({ label: "Flexible Tenure", variant: "info" });
  }

  return badges;
}

export function formatLoanType(type: string | null): string {
  if (!type) return "Loan";

  const typeMap: Record<string, string> = {
    personal: "Personal Loan",
    education: "Education Loan",
    vehicle: "Vehicle Loan",
    home: "Home Loan",
    credit_line: "Credit Line",
    debt_consolidation: "Debt Consolidation",
  };

  return typeMap[type] || "Loan";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
