import React from "react";

type AppSidebarProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function AppSidebar({ children, className, style }: AppSidebarProps) {
  return (
    <div
      className={className}
      style={{
        width: 240,
        minWidth: 240,
        borderRight: "1px solid var(--color-border)",
        background: "var(--color-bg-sidebar)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
