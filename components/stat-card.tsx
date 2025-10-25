import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  className?: string;
}

export function StatCard({ label, value, change, className }: StatCardProps) {
  return (
    <Card className={cn("p-2", className)}>
      <div className="text-[10px] text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm font-semibold font-mono">{value}</div>
      {change !== undefined && (
        <div
          className={cn(
            "text-[10px] font-mono",
            change >= 0 ? "text-chart-3" : "text-destructive",
          )}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}%
        </div>
      )}
    </Card>
  );
}
