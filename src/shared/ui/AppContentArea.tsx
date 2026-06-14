import React from "react";

type AppContentAreaProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function AppContentArea({ children, className, style }: AppContentAreaProps) {
  return (
    <div
      className={className}
      style={{
        flex: 1,
        height: "100%",
        overflowY: "auto",
        background: "var(--color-bg-surface)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
