import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let className = "";

  switch (status.toLowerCase()) {
    case "reported":
      variant = "destructive";
      className = "bg-red-100 text-red-700 hover:bg-red-200 border-transparent shadow-none";
      break;
    case "in-progress":
    case "available":
      variant = "default";
      className = "bg-amber-100 text-amber-700 hover:bg-amber-200 border-transparent shadow-none";
      break;
    case "resolved":
    case "adopted":
      variant = "default";
      className = "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent shadow-none";
      break;
    default:
      variant = "secondary";
  }

  return (
    <Badge variant={variant} className={`font-semibold capitalize px-3 py-1 ${className}`}>
      {status}
    </Badge>
  );
}
