import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "success" | "info" | "warning" | "default";
  className?: string;
}

export function Badge({ label, variant = "default", className }: BadgeProps) {
  const variantStyles = {
    success: "bg-accent border-2 border-foreground",
    info: "bg-secondary border-2 border-foreground",
    warning: "bg-muted border-2 border-foreground",
    default: "bg-background border-2 border-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-mono font-medium text-foreground shadow-2xs",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
