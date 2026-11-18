# KNOWN ISSUES & WORKAROUNDS

This document records active technical limitations, known issues, and documentation gaps for Phase 3 (App Ecosystem).

---

## 1. Technical & Runtime Limitations

### 1.1 Browser App Iframe Constraints

- **Issue**: Custom iframe-based `Browser App` may fail to render certain external websites (e.g. GitHub, LinkedIn, Google) due to strict `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors` headers on their servers.
- **Workaround**: For blocked sites, the Browser App should fall back to rendering a neat dialog with a click-through external link (opening in a new browser window/tab), clearly informing the user that the site restricts iframe embeds.

### 1.2 Multi-Window Focus Management

- **Issue**: When multiple windows are overlapped, clicking inside an iframe window does not always bubble up to trigger the OS window focus handler, causing the iframe to capture input without raising its parent window index.
- **Workaround**: Place a transparent overlay wrapper on top of the iframe window that is active when the window is unfocused, intercepting the first click to focus the window, then disappearing to allow direct iframe interaction once focused.

### 1.3 Mobil/Tablet Layout Adaptations

- **Issue**: Drag-to-resize window behaviors are only appropriate for Desktop shell. In Mobile and Tablet mode, draggable windows are too difficult to navigate.
- **Workaround**: The Window Manager locks window dimensions to full-screen or predefined docked layouts in Mobile/Tablet shells, ignoring individual app `defaultSize` overrides.

---

## 2. Active Documentation & Data Gaps

### 2.1 Missing Structured Data Files

- The `src/data/skills.ts` and `src/data/achievements.ts` datasets are planned but not yet implemented. They must be created with typescript interfaces matching [PHASE_3_ARCHITECTURE.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/PHASE_3_ARCHITECTURE.md) before their respective applications are registered.

### 2.2 Desktop Right-Click Handler

- Custom right-click context menus on desktop wallpaper and taskbar are stubbed out. High-fidelity actions (refresh, display settings, launch settings) are not wired up to core routines.
