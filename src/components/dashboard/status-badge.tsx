import { Badge, type BadgeProps } from "@/components/ui";

const VARIANTS: Record<string, NonNullable<BadgeProps["variant"]>> = {
  confirmed: "success",
  completed: "primary",
  paid: "success",
  captured: "success",
  processed: "success",
  received: "warning",
  requested: "warning",
  held: "warning",
  pending: "warning",
  contacted: "primary",
  issued: "warning",
  draft: "neutral",
  cancelled: "destructive",
  void: "destructive",
  failed: "destructive",
  no_show: "destructive",
  refunded: "neutral",
};

/** A status pill with a consistent colour mapping across the app. */
export function StatusBadge({ status }: { status: string }) {
  const variant = VARIANTS[status] ?? "neutral";
  return <Badge variant={variant}>{status.replace(/_/g, " ")}</Badge>;
}
