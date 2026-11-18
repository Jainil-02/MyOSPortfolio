# PROPOSED ARCHITECTURE

> **Document purpose**: Comprehensive architecture specification for the My OS Portfolio (ApexOS) project. This document consolidates all architectural knowledge, patterns, decisions, and standards in one authoritative reference.
> **Status**: Reference - synthesizes current state from PRODUCT_BLUEPRINT.md, DESIGN_SYSTEM.md, PHASE_3_ARCHITECTURE.md, and DECISIONS.md
> **Authority**: This document combines the authoritative documentation from multiple sources and serves as the definitive architectural reference.

---

## 1. System Overview

### 1.1 What Is ApexOS?

ApexOS (My OS Portfolio) is a **browser-based personal operating system** built with:
- **Next.js 16.2.9** with App Router
- **React 19** with client/server component architecture
- **TypeScript** with strict type checking
- **Zod** for schema validation

It is **not** a traditional portfolio website. It is a simulated desktop operating system that contains a portfolio inside it.

### 1.2 Core Architecture Paradigm

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser Viewport                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────────────┐ │
│  │  Desktop Shell  │  │  Floating Windows (WindowChrome)    │ │
│  │  - Wallpaper    │  │  - Title Bar                        │ │
│  │  - Taskbar      │  │  - Draggable, Resizable             │ │
│  │  - Desktop Grid │  │  - App Content (React Components)   │ │
│  └─────────────────┘  └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Key Principles

1. **OS-First Experience**: Every element exists inside the OS metaphor
2. **Window-Based Navigation**: Apps communicate via window manager, not props
3. **Design System Governance**: All visual decisions follow DESIGN_SYSTEM.md tokens
4. **Recruiter-Optimized**: 2-5 minute evaluation path from boot to contact

---

## 2. Repository Structure & Domain Boundaries

### 2.1 Directory Structure

```
src/
├── app/                    # Next.js App Router entry points
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Welcome/home page
│   ├── globals.css        # Global styles + design tokens
│   └── apps/              # App routes (projects, files, browser, gallery, terminal)
│
├── apps/                  # Independent app components
│   ├── about/
│   ├── browser/
│   ├── achievements/
│   ├── contact/
│   ├── files/
│   ├── gallery/
│   ├── projects/
│   ├── resume/
│   ├── settings/
│   ├── skills/
│   └── terminal/
│
├── core/                  # Platform runtime systems (protected)
│   ├── notifications/     # Notification queue & subscriber API
│   ├── os-runtime/        # Runtime state, boot, lock, app activation
│   ├── settings/          # Settings store with localStorage persistence
│   ├── wallpaper/         # Wallpaper configuration
│   ├── analytics/         # Reserved for Phase 4
│   ├── theme/             # Reserved for Phase 4
│   ├── device/            # Reserved for Phase 4
│   └── search/            # Reserved for Phase 4
│
├── features/              # Cross-app capabilities
│   ├── app-registry/      # App metadata registry
│   ├── boot/              # Boot sequence animation
│   ├── command-palette/   # Ctrl+K quick launcher
│   ├── lock-screen/       # Lock screen with clock
│   ├── reels/             # Portable slide/video carousel
│   └── window-chrome/     # Floating window container
│
├── shells/                # Device-adaptive presentations
│   ├── desktop/           # Full OS desktop layout
│   ├── tablet/            # Bottom-dock layout
│   └── mobile/            # Bottom-tab layout
│
├── shared/                # Domain-neutral primitives
│   ├── ui/                # Shared UI components (AppSidebar, AppTagBadge, etc.)
│   ├── schemas/           # Zod validation schemas
│   ├── motion/            # Reserved for animation helpers
│   └── utils/             # Utility functions
│
├── config/                # Static configuration
│   ├── site.ts            # Site metadata
│   └── constants.ts       # App IDs, reserved names
│
└── data/                   # Validated static content
    ├── projects/          # Project data with reels
    ├── skills.ts          # Skills by category
    ├── resume.ts          # Resume data
    ├── achievements.ts    # Achievement entries
    └── gallery.ts         # Gallery image manifest
```

### 2.2 Dependency Direction (MUST NOT BE REVERSED)

```
src/app          →  src/shells, src/features, src/shared, src/core
src/shells       →  src/core, src/features, src/apps
src/apps         →  src/features (window manager), src/core (settings), src/shared (UI)
src/features     →  src/shared (UI), src/core (runtime)
src/core         →  src/shared (types only)
src/shared       →  (domain-neutral, no dependencies)
src/config       →  (static, no dependencies)
src/data         →  src/shared (schemas only)
```

---

## 3. Core Systems Architecture

### 3.1 OS Runtime (`src/core/os-runtime/`)

**Purpose**: Central state management for the operating system.

**Exported API**:
```typescript
type RuntimeState = {
  booted: boolean;
  locked: boolean;
  activeAppId: string | null;
  windows: WindowState[];
};

// State management
function getRuntimeState(): RuntimeState
function subscribeToRuntime(fn: (state: RuntimeState) => void): () => void
function setActiveApp(appId: string): void

// Lifecycle
function completeBoot(): void
function lock(): void
function unlock(): void
```

**Key Behaviors**:
- SSR-compatible state initialization
- Lock screen gating
- App activation coordination
- Boot sequence coordination

### 3.2 Window Manager (`src/core/window-manager/`)

**Purpose**: Window lifecycle and focus management.

**Exported API**:
```typescript
type WindowState = {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
};

type WindowManager = {
  openWindow(appId: string, props?: WindowProps): string
  closeWindow(windowId: string): void
  focusWindow(windowId: string): void
  minimizeWindow(windowId: string): void
  maximizeWindow(windowId: string): void
  getWindows(): WindowState[]
  subscribeToWindows(fn: (windows: WindowState[]) => void): () => void
};
```

### 3.3 App Registry (`src/features/app-registry/`)

**Purpose**: Source of truth for registered applications.

**Type Definition**:
```typescript
type AppMeta = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  entry?: string;
  component: ComponentType;
  defaultSize: { width: number; height: number };
  pinned: boolean;
};
```

**Registered Apps (11 total)**:
| ID | Title | Size | Layout | Pinned |
|----|-------|------|--------|--------|
| about | About | 720×560 | Layout A | ✅ |
| projects | Projects | 960×640 | Layout B | ✅ |
| skills | Skills | 840×580 | Layout B | ✅ |
| resume | Resume | 820×720 | Layout A | ❌ |
| contact | Contact | 640×480 | Layout A | ❌ |
| settings | Settings | 960×720 | Layout B | ❌ |
| files | Files | 1100×700 | Layout B | ✅ |
| browser | Browser | 1000×700 | Full | ✅ |
| gallery | Gallery | 900×640 | Full | ✅ |
| terminal | Terminal | 760×480 | Full | ❌ |
| achievements | Achievements | 720×560 | Layout A | ❌ |

### 3.4 Settings Store (`src/core/settings/`)

**Purpose**: Persist user preferences.

**State Shape**:
```typescript
type SettingsState = {
  wallpaper: string;
  wallpaperVariant: string;
  accentColor: string;
  lockScreenEnabled: boolean;
};
```

**Persistence**: `localStorage` with key `my-os-portfolio-settings`

---

## 4. Layout Patterns (Design System Governance)

### 4.1 Layout A — Profile / Dashboard

**Used by**: About, Contact, Achievements, Resume (document variant)

```
┌─────────────────────────────────────────────────────┐
│  WindowChrome title bar                             │
├─────────────────────────────────────────────────────┤
│  Profile Card (full-width hero)                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Avatar  Icon  Name  Role Tags  Bio Text      │   │
│  │  [CTA Buttons: View Resume, Get in Touch]     │   │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                │
│  │  Info Card   │  │  Info Card   │  ← 2-column  │
│  │  ...         │  │  ...         │     grid       │
│  └──────────────┘  └──────────────┘                │
└─────────────────────────────────────────────────────┘
```

### 4.2 Layout B — Master-Detail with Sidebar

**Used by**: Projects, Skills, Files, Settings

```
┌─────────────────────────────────────────────────────┐
│  WindowChrome title bar                             │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  Sidebar     │   Content Area                       │
│  (~240px)     │   (tabs / detail / grid)             │
│              │                                      │
│  SECTION     │                                      │
│  > Item      │                                      │
│  > Item      │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

**Shared Components** (`src/shared/ui/`):
- `AppSidebar.tsx` - Sidebar with sections and items
- `AppContentArea.tsx` - Scrollable content panel
- `AppTagBadge.tsx` - Category/status badges
- `AppInfoCard.tsx` - Profile/info cards
- `AppStatusBar.tsx` - Bottom status bar for Files

---

## 5. Design System (CSS Token Reference)

### 5.1 Color Tokens

```css
:root {
  /* Backgrounds */
  --color-bg-base: #0a0f1a;
  --color-bg-surface: rgba(30, 41, 59, 0.95);
  --color-bg-title-bar: rgba(15, 23, 42, 0.6);
  --color-bg-taskbar: rgba(15, 23, 42, 0.8);

  /* Text */
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;

  /* Accent (user-selectable) */
  --color-accent: #10b981;  /* Default: teal-green */
}
```

### 5.2 Typography

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", monospace;
```

**Type Scale**:
| Role | Size | Weight | Color |
|------|------|--------|-------|
| App Title | 12px | 600 | #f1f5f9 |
| Body | 13-14px | 400 | #94a3b8 |
| Caption | 12px | 400 | #64748b |

### 5.3 Window Chrome

```
┌─────────────────────────────────────────┐
│  [Icon]  Window Title  [⋯] [─] [□] [✕] │
│  ─────────────────────────────────────  │
│  Content Area                           │
└─────────────────────────────────────────┘
```

- **Traffic light order**: Close (red) → Minimize (yellow) → Maximize (green)
- **Background**: `rgba(30, 41, 59, 0.95)` with `backdrop-filter: blur(16px)`
- **Radius**: 12px (0px when maximized)

---

## 6. Data Architecture

### 6.1 Zod Schema Validation (`src/shared/schemas/`)

- `project.schema.ts` - Project and reel validation
- Validates: IDs, slugs, URLs, asset paths, uniqueness constraints

### 6.2 Data Files (`src/data/`)

**Projects Data** (`projects.json`):
- Real project entries with: title, description, techStack, reelSlides, githubUrl, liveUrl, tags, featured, timeline
- At least 3-4 projects required with real screenshots

**Skills Data** (`skills.ts`):
- Categories: Frontend, Backend, Mobile, Tools
- Level badges: expert, proficient, learning (NO progress bars)

**Resume Data** (`resume.ts`):
- Work experience, education, skills summary
- Used by Resume App and referenced by About App

**Achievements Data** (`achievements.ts`):
- 6-8 real, verifiable achievements
- Categories: Project, Certification, Contribution, Recognition

**Gallery Data** (`gallery.ts`):
- Image manifest with paths, captions, dates

---

## 7. Cross-App Interaction Model

### 7.1 Window Launch API

```typescript
// From any app component:
import { getWindowManager } from "@/core/window-manager";

const wm = getWindowManager();
wm.openWindow("browser", { initialUrl: "https://github.com/..." });
wm.openWindow("resume");
```

### 7.2 Recruiter Journey Flow

```
Boot (2-3s) → Lock Screen → Desktop → About → Projects → Resume → Contact
                                    ↓
                              Command Palette
                                    ↓
                              Terminal (power-user)
```

### 7.3 External Link Handling

All external URLs open in the **Browser App** (not new tabs):

| Source App | Destination | Method |
|------------|-------------|--------|
| Projects (GitHub/Live Demo) | Browser | `openWindow("browser", { initialUrl })` |
| About (LinkedIn/GitHub) | Browser | Same |
| Files (Resume.pdf) | Resume | `openWindow("resume")` |
| Files (project folder) | Projects | `openWindow("projects")` |

---

## 8. Animation & Motion System

### 8.1 Duration Scale

```css
--duration-fast: 150ms;   /* Hover states, button presses */
--duration-normal: 250ms;  /* Window transitions */
--duration-slow: 400ms;    /* Boot/lock transitions */
```

### 8.2 Window Animations

| Event | Animation | Duration |
|-------|-----------|----------|
| Open | `scale(0.95→1) + opacity(0→1)` | 250ms |
| Close | `scale(1→0.95) + opacity(1→0)` | 250ms |
| Minimize | `translateY(200px) + scale(0.5)` | 250ms |
| Maximize | Width/height transition | 250ms |

---

## 9. Implementation Status

### 9.1 Phase 1 — Foundation ✅ Complete

- Next.js App Router scaffold (`src/app/`)
- ESLint, Prettier, TypeScript, Vitest configured
- Zod schemas defined
- Architecture documentation established
- Static configuration and data accessors

### 9.2 Phase 2 — OS Runtime and Shells ✅ Complete

- `src/core/os-runtime/` - Runtime state, boot, lock, app activation
- `src/core/window-manager/` - Window lifecycle
- `src/core/settings/` - Settings persistence
- `src/core/wallpaper/` - Wallpaper system
- `src/shells/` - Desktop, tablet, mobile adaptive shells
- `src/features/boot/` - Boot animation
- `src/features/lock-screen/` - Lock screen
- `src/features/command-palette/` - Ctrl+K launcher
- `src/features/notifications/` - Notification queue

### 9.3 Phase 3 — App Ecosystem ✅ Complete

| App | Size | Layout | Status |
|-----|------|--------|--------|
| About | 720×560 | Layout A | ✅ |
| Projects | 960×640 | Layout B | ✅ |
| Skills | 840×580 | Layout B | ✅ |
| Resume | 820×720 | Layout A | ✅ |
| Contact | 640×480 | Layout A | ✅ |
| Settings | 960×720 | Layout B | ✅ |
| Files | 1100×700 | Layout B | ✅ |
| Browser | 1000×700 | Full | ✅ |
| Gallery | 900×640 | Full | ✅ |
| Terminal | 760×480 | Full | ✅ |
| Achievements | 720×560 | Layout A | ✅ |

### 9.4 Phase 4 — Polish and AI Integration 🟡 In Progress

- Window resize handles (drag edges)
- Taskbar pinned vs running indicator refinement
- Custom wallpaper upload
- Real Dark/Light theme toggle
- Contact form backend integration
- AI Assistant app window (future)

---

## 10. Multi-Agent Engineering System

For a complete specification of the Multi-Agent Engineering System, see:
- **`docs/agent-system/PROPOSED_ARCHITECTURE.md`** — Complete SDD workflow, agent roles, feedback loops, security architecture, and implementation roadmap.

### 10.1 Three-System Separation
- **ApexOS**: The production portfolio operating system
- **Internal Multi-Agent Engineering System**: AI-assisted development workflow (this document's subject)
- **Future User-Facing AI Assistant**: Embedded AI chat feature (Phase 5)

---

## 11. Reserved Systems (Phase 4/5)

```
ai-assistant    # AI chat interface inside OS
mcp-hub         # MCP server integration panel
agent-workspace # Agent collaboration area
knowledge-base  # Personal wiki/knowledge store
memory-center   # AI-aware session memory
prompt-library  # Reusable prompt templates
tool-registry   # Dynamic tool configuration
```

---

## 12. File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| App Components | `index.tsx` | `src/apps/files/index.tsx` |
| Feature Components | `index.tsx` or `Component.tsx` | `src/features/command-palette/index.tsx` |
| Shared UI | PascalCase.tsx | `src/shared/ui/AppSidebar.tsx` |
| Schemas | `*.schema.ts` | `project.schema.ts` |
| Data Types | `*.ts` | `skills.ts`, `resume.ts` |

---

## 13. Success Criteria Checklist

### Application Completeness
- [ ] All 11 apps implemented with correct layouts
- [ ] No placeholder content visible to users
- [ ] All interactive elements have unique IDs

### Design Consistency
- [ ] All apps use only `var(--color-*)` tokens
- [ ] All apps use `var(--font-sans)`
- [ ] Shared UI components used where applicable
- [ ] Window sizes match `defaultSize` specifications

### Technical Quality
- [ ] No broken image references
- [ ] No `alert()` calls visible to users
- [ ] Error boundaries wrap app components
- [ ] Z-index focus order correct

### Performance
- [ ] Boot-to-desktop < 3 seconds
- [ ] Window animations at ≥ 60fps
- [ ] CLS = 0 during initial load
- [ ] Initial load < 2 seconds

---

## 14. Key Architecture Decisions (from DECISIONS.md)

### Browser Strategy (Decision #1)
**Context**: Next.js 16.2.9 App Router is the delivery boundary.

**Decision**: Hybrid browser model
- Internal Browser: Project details, resume, case studies, internal content
- External Browser: GitHub, LinkedIn, Live Deployments, external websites

### Projects and Reels (Decision #2)
**Current Model**: One Reel = One Project
**Future Model**: One Project = Multiple Reels (v2 schema)

### Desktop Experience (Decision #3)
**Decision**: Multi-window desktop behavior is expected.
- Floating windows with drag/resize
- Taskbar with app indicators
- App switching via window manager

---

## 15. Documentation Cross-Reference Index

| For... | See... |
|--------|--------|
| Visual tokens | `docs/DESIGN_SYSTEM.md` Section 11 |
| Design screenshots | `docs/design/` |
| App specs | `docs/PHASE_3_ARCHITECTURE.md` |
| Product vision | `docs/PRODUCT_BLUEPRINT.md` |
| Recruiter journey | Section 3 of PRODUCT_BLUEPRINT.md |
| App relationships | Section 5 of PRODUCT_BLUEPRINT.md |
| Implementation details | `docs/CHANGELOG.md` |
| Multi-Agent Workflow | `docs/agent-system/PROPOSED_ARCHITECTURE.md` |

---

**Document Version**: 1.1  
**Last Updated**: 2026-11-18  
**Author**: Claude Code (synthesized from all architectural documentation)