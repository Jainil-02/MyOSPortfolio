import React from "react";

type BadgeVariant = "neutral" | "status" | "active" | "tech";

type AppTagBadgeProps = {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  statusType?: "completed" | "in-progress" | "planned" | "archived";
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
};

export default function AppTagBadge({
  children,
  variant = "neutral",
  statusType,
  style,
  className,
  onClick,
}: AppTagBadgeProps) {
  const isClickable = !!onClick;

  const getStatusConfig = () => {
    switch (statusType) {
      case "completed":
        return { color: "var(--color-accent)", label: "Completed" };
      case "in-progress":
        return { color: "#fbbf24", label: "In Progress" };
      case "planned":
        return { color: "#64748b", label: "Planned" };
      case "archived":
        return { color: "#475569", label: "Archived" };
      default:
        return { color: "#64748b", label: statusType ?? "" };
    }
  };

  const statusConfig = getStatusConfig();

  // Base style
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 11,
    fontWeight: 500,
    borderRadius: "12px",
    padding: "2px 10px",
    height: 24,
    whiteSpace: "nowrap",
    cursor: isClickable ? "pointer" : "default",
    transition: "all var(--duration-fast) var(--ease-spring)",
    userSelect: "none",
  };

  let variantStyle: React.CSSProperties = {};

  if (variant === "neutral") {
    variantStyle = {
      background: "var(--color-surface-1)",
      color: "var(--color-text-secondary)",
      border: "1px solid var(--color-border)",
    };
  } else if (variant === "active") {
    variantStyle = {
      background: "rgba(16, 185, 129, 0.15)",
      color: "var(--color-accent)",
      border: "1px solid rgba(16, 185, 129, 0.3)",
    };
  } else if (variant === "tech") {
    variantStyle = {
      background: "rgba(255, 255, 255, 0.05)",
      color: "var(--color-text-primary)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      fontSize: 11,
      padding: "2px 8px",
      borderRadius: 6,
      height: 22,
    };
  } else if (variant === "status") {
    variantStyle = {
      background: "rgba(0, 0, 0, 0.2)",
      color: "var(--color-text-primary)",
      border: `1px solid ${statusConfig.color}44`,
      padding: "2px 8px",
      gap: 6,
    };
  }

  return (
    <span
      className={className}
      onClick={onClick}
      style={{
        ...baseStyle,
        ...variantStyle,
        ...style,
      }}
    >
      {variant === "status" && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: statusConfig.color,
            display: "inline-block",
          }}
        />
      )}
      {children || (variant === "status" ? statusConfig.label : "")}
    </span>
  );
}
