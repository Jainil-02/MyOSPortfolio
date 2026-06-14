import type { ReactElement } from "react";

export default function TabletShell({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <div style={{ minHeight: "100vh", background: "#e2e7ef", color: "#0f172a" }}>
      <header style={{ padding: "20px 24px", borderBottom: "1px solid #cbd5e1" }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Tablet Shell</div>
      </header>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
