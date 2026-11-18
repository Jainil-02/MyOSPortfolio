import React from "react";

type ProjectsSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ProjectsSearch({ value, onChange }: ProjectsSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onChange("");
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Search Magnifier Icon */}
      <span
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 13,
          color: "var(--color-text-muted)",
          pointerEvents: "none",
        }}
      >
        🔍
      </span>

      {/* Input Box */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search projects..."
        style={{
          width: "100%",
          height: 32,
          padding: "0 28px 0 30px",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--color-border)",
          borderRadius: 8,
          fontSize: 12,
          color: "var(--color-text-primary)",
          outline: "none",
          transition: "all var(--duration-fast)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--color-accent)";
          e.target.style.boxShadow =
            "0 0 0 1px color-mix(in srgb, var(--color-accent) 20%, transparent)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--color-border)";
          e.target.style.boxShadow = "none";
        }}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange("")}
          type="button"
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            color: "var(--color-text-muted)",
            fontSize: 12,
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "all var(--duration-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-text-primary)";
            e.currentTarget.style.background = "var(--color-surface-1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-muted)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
