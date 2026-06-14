import type { ReactElement } from "react";

export default function MobileShell({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0" }}>
      <header style={{ padding: "18px 16px", borderBottom: "1px solid rgba(226, 232, 240, 0.12)" }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Mobile Shell</div>
      </header>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}
