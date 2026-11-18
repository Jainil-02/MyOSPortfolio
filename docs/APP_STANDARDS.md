# My OS Portfolio App Standards & Guidelines

This document defines the technical standards, architectural rules, and design constraints for all applications built within the My OS Portfolio environment (ApexOS). Adherence to these standards is mandatory for all developers and AI agents to prevent visual and architectural drift.

---

## 1. Architectural Model

All applications run within the custom client-side windowing environment.

### 1.1 App Registry Model

- Canonical Location: [app-registry/index.ts](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/src/features/app-registry/index.ts)
- Registration Constraint: Applications must **never** be registered in the active system registry until they have a fully functional implementation with real content (no placeholders).
- Metadata Schema:
  ```typescript
  export interface AppMeta {
    id: string; // Unique alphanumeric identifier
    title: string; // Human-readable display name
    icon: string; // SVG icon path or emoji identifier
    component: React.ComponentType; // Main application component
    defaultSize: {
      // Default window size
      width: number;
      height: number;
    };
    pinned: boolean; // Pinned to the desktop taskbar dock
  }
  ```

### 1.2 Isolation & Boundaries

- **Direction of Dependencies**: Apps (`src/apps/*`) can consume typed core APIs (`src/core/*`) and shared UI primitives (`src/shared/*`). They must **never** import components or logic from other applications, nor from the device-specific shells (`src/shells/*`).
- **State Management**: Apps must subscribe to core stores (e.g. `settings`, `wallpaper`, `notifications`) via custom React hooks or subscription patterns. They should trigger actions using core API functions and must not mutate core state variables directly.

---

## 2. Window and Sizing Model

### 2.1 Window Chrome Interaction

- Apps do **not** render their own window frames or title bars. The system wrapper [WindowChrome](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/src/features/window-chrome/index.tsx) provides:
  - Traffic light window control buttons (Close/Red → Minimize/Yellow → Maximize/Green).
  - Window dragging boundaries using global window event listeners.
  - Draggable borders for manual window resizing.
- Applications must design their internal scroll states so they do not conflict with window dragging.

### 2.2 Sizing Standards

- Apps must be responsive down to their minimum functional dimensions.
- If an app's window is resized below its usable layout threshold, it must scale gracefully or offer a scrollable content area.
- Default sizes from [PHASE_3_ARCHITECTURE.md](file:///c:/Users/lenov/OneDrive/Desktop/Project-X/my-os-portfolio/docs/PHASE_3_ARCHITECTURE.md) must be strictly respected.

---

## 3. Design System & Layout Rules

### 3.1 Visual Source of Truth

- All designs must conform to the approved high-fidelity screenshots in `docs/design/`.
- Colors, typography, spacing, and borders must exclusively use CSS variables declared in `src/app/globals.css` (e.g., `var(--color-accent)`, `var(--color-bg-sidebar)`).

### 3.2 Layout A (Profile / Dashboard)

- **Usage**: Flat content, single-view dashboards (About, Contact, Achievements).
- **Constraints**:
  - No secondary sidebar.
  - Scrollable body area with fixed header.
  - Standardized paddings (`24px`).
  - Structured info grids utilizing `AppInfoCard` components.

### 3.3 Layout B (Master-Detail / Sidebar)

- **Usage**: Explorer interfaces, category lists (Projects, Skills, Files, Settings).
- **Constraints**:
  - Left sidebar width: `240px`.
  - Sidebar background: `var(--color-bg-sidebar)`.
  - Section titles in uppercase, 11px font size, `var(--color-text-label)` color.
  - Main content area wrapped in `AppContentArea` with translucent dark background.

---

## 4. Continuity & External Links

To maintain the illusion of a self-contained operating system:

1. **Internal Redirection**: Navigating to other internal views (e.g., jumping from About to Resume) must use the Window Manager API to launch/focus the target application rather than changing page URLs.
2. **External Link Interception**: External hyperlinks (such as GitHub profiles, LinkedIn, and live project deployments) should ideally be caught and opened inside the virtual **Browser App** window, providing a unified OS sandboxed experience.
