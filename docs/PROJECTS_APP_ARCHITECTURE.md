# PROJECTS APP ARCHITECTURE

> **Document purpose**: Production-ready architecture specification for the Projects application.
> **Authority**: Informs implementation. Does not override `docs/DESIGN_SYSTEM.md` or `docs/AGENT_RULES.md`.
> **Status**: Approved for implementation — design and structure decisions final.
> **Created**: 2026-06-14

---

## 1. Purpose and Role

The Projects App is the primary technical portfolio surface in ApexOS. It is the application a recruiter will spend the most time inside. Its quality directly signals Jainil's engineering and product design maturity.

**Primary goals**:

- Allow a recruiter to scan all projects at a glance (Explorer Mode)
- Allow a recruiter to go deep on any single project (Detail View)
- Show visual proof of the work through screenshots, reels, and demo media
- Tell a project story — not just list facts

**Design positioning** (from `DESIGN_SYSTEM.md § 8`):

- Layout: **Master-Detail with Sidebar (Layout B)**
- Window title: `"Projects"` with folder icon
- Default window size: `960 × 640px`

---

## 2. Reel Model — Current vs. Future

This is the central architectural decision. The reel model must be compatible with both versions without a breaking schema change.

### Current Version (v1): One Reel = One Project

Each project has a single embedded reel — a sequence of ordered slides (`reelSlides[]`). The reel is the visual showcase for that project. There is no concept of a standalone reel object outside the project.

```
Project
  └── reelSlides[]  ← slides embedded in project, one sequence per project
        ├── Slide 0  (image or video)
        ├── Slide 1
        └── Slide 2
```

**Current schema**: `reelSlides` is embedded directly in `projectSchema` as a required array of `projectReelSchema` objects.

### Future Version (v2): One Project = Multiple Reels

Each project can have multiple named reels. Each reel is a standalone narrative unit — a "case study chapter." Together, they form a storytelling case study.

```
Project
  └── reels[]  ← multiple named reels per project
        ├── Reel: "Product Overview"     → slides[]
        ├── Reel: "Engineering Deep Dive" → slides[]
        └── Reel: "Results & Impact"     → slides[]
```

### Compatibility Bridge

The v1 schema is preserved in its exact current form. The v2 schema **extends** it. The key design decision:

> **`reelSlides[]` in the current schema becomes Reel #0 in the future model — the "default reel."**

This means:

- All existing `projects.json` entries remain valid forever — no migration required
- The Projects App reads `reelSlides` as the default reel in v1 data
- In v2 data, `reels[]` contains named reels; `reelSlides` on the project is deprecated but still readable
- The Reel Player component renders the same regardless of which model sourced the slides

The schema upgrade path is **additive only** — no fields are removed, renamed, or made required.

---

## 3. Data Structure

### 3.1 Current Schema (v1) — `src/shared/schemas/project.schema.ts`

The existing schema is valid and must not be broken. It is reproduced here for reference:

```typescript
// projectReelSchema — one slide within a reel
{
  id: string;           // kebab-case identifier, unique within project
  projectId: string;    // must match parent project.id
  title: string;        // slide headline
  description: string;  // slide body copy (1–2 sentences)
  video?: string;       // asset path — prefer to image when both present
  image?: string;       // asset path — fallback if no video
  cta?: string;         // optional call-to-action label (e.g. "View on GitHub")
  order: number;        // int, 0-indexed, unique within the reel
}

// projectSchema — one project entry
{
  id: string;           // kebab-case, globally unique
  slug: string;         // same format as id, used for URL routing
  title: string;
  shortDescription: string;   // 1 sentence, used in sidebar and cards
  fullDescription: string;    // 2–5 sentences, used in detail panel
  category: string;           // "Mobile App", "Web App", "Library", etc.
  techStack: string[];         // min 1 item
  githubUrl?: string;
  liveUrl?: string;
  thumbnail: string;           // 40×40px sidebar thumbnail asset path
  coverImage: string;          // full-width detail header image asset path
  screenshots: string[];       // additional static screenshots
  demoVideo?: string;          // standalone demo video (separate from reel)
  featured: boolean;           // used by About App "Current Focus" card
  status: "planned" | "in-progress" | "completed" | "archived";
  timeline: string;            // e.g. "Jan 2024 – Jun 2024"
  role: string;                // e.g. "Sole Engineer", "Frontend Lead"
  teamSize: number;
  features: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
  tags: string[];
  reelSlides: ProjectReel[];   // min 1 — the default reel
  createdAt: string;           // ISO 8601
  updatedAt: string;
}
```

### 3.2 Future Schema Extension (v2) — Additive Only

The following fields are **added** to `projectSchema`. Existing fields are unchanged. A project with only `reelSlides` (no `reels`) is still valid.

```typescript
// New type: a named reel within a project (v2)
export const projectNamedReelSchema = z.object({
  id: identifierSchema,                     // kebab-case, unique within project
  projectId: identifierSchema,
  title: nonEmptyTextSchema,               // reel headline: "Product Overview"
  description: nonEmptyTextSchema.optional(), // reel subtitle
  coverImage: assetPathSchema.optional(),  // reel-specific cover (optional)
  order: z.number().int().nonnegative(),   // sequence order among sibling reels
  slides: z.array(projectReelSchema).min(1), // reuses existing slide schema
});

// Extended project fields (v2 additions, all optional)
{
  // ...all existing v1 fields...

  reels: z.array(projectNamedReelSchema).optional(),
  // When present, these named reels replace reelSlides as the primary media.
  // reelSlides is retained for backward compatibility.

  storyChapters: z.array(storyChapterSchema).optional(),
  // Future: long-form case study text structure (see § 3.3)

  platform: z.enum(["web", "mobile", "desktop", "cli", "library", "other"]).optional(),
  // Enables platform-specific filtering in Explorer Mode

  displayOrder: z.number().int().nonnegative().optional(),
  // Manual ordering override for the sidebar list
}
```

### 3.3 Story Chapter Schema (v2, future storytelling)

Not implemented in Phase 3 but defined here to prevent incompatible future additions:

```typescript
export const storyChapterSchema = z.object({
  id: identifierSchema,
  title: nonEmptyTextSchema, // "The Problem", "The Solution"
  body: nonEmptyTextSchema, // Markdown or rich text
  order: z.number().int().nonnegative(),
  media: z.array(assetPathSchema).default([]), // inline images
  reelId: identifierSchema.optional(), // links to a named reel for this chapter
});
```

### 3.4 Reel Slide Schema — Clarifications

The existing `projectReelSchema` is extended with one optional field in v2:

```typescript
{
  // ...all existing fields...
  type: z.enum(["image", "video", "split", "text-only"]).optional(),
  // v2 only: explicit slide type. Inferred from video/image presence in v1.
  // "split": left media + right copy panel
  // "text-only": no media, just title/description full-width
}
```

### 3.5 `src/data/projects/index.ts` — Accessor Layer

The data accessor must hide v1 vs. v2 differences from the UI. All components must consume the normalized output, never the raw JSON directly.

```typescript
// Normalized reel shape — what the UI always receives
export type NormalizedReel = {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  order: number;
  slides: NormalizedSlide[];
};

export type NormalizedSlide = {
  id: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  cta?: string;
  order: number;
};

// Normalization function (v1 → NormalizedReel[])
// Returns a single-item array wrapping reelSlides as "Default Reel"
export function normalizeProjectReels(project: Project): NormalizedReel[] {
  if (project.reels && project.reels.length > 0) {
    // v2 path: use named reels
    return project.reels.map((reel) => ({
      id: reel.id,
      title: reel.title,
      description: reel.description,
      coverImage: reel.coverImage,
      order: reel.order,
      slides: reel.slides,
    }));
  }
  // v1 path: wrap reelSlides as a single default reel
  return [
    {
      id: `${project.id}-default-reel`,
      title: "Project Overview",
      description: undefined,
      coverImage: project.coverImage,
      order: 0,
      slides: project.reelSlides,
    },
  ];
}

// Accessor functions
export function getProjects(): Project[];
export function getProjectBySlug(slug: string): Project | undefined;
export function getFeaturedProject(): Project | undefined;
export function getProjectsByCategory(category: string): Project[];
export function getProjectsByTag(tag: string): Project[];
export function getProjectsByStatus(status: Project["status"]): Project[];
export function searchProjects(query: string): Project[];
export function getAllProjectSlugs(): { slug: string }[];
export function getAllCategories(): string[];
export function getAllTags(): string[];
export function normalizeProjectReels(project: Project): NormalizedReel[];
```

---

## 4. Folder Structure

```
src/
├── apps/
│   └── projects/
│       ├── index.tsx                    ← Root component (app entry point)
│       ├── ProjectsApp.tsx              ← Main container, wires Explorer + Detail
│       │
│       ├── explorer/                    ← Explorer Mode (project list + sidebar)
│       │   ├── ProjectsSidebar.tsx      ← Sidebar: project list with filters
│       │   ├── ProjectSidebarItem.tsx   ← Single project row in sidebar
│       │   ├── ProjectsFilterBar.tsx    ← Category/status/tag filter chips
│       │   └── ProjectsSearch.tsx       ← Search input inside sidebar header
│       │
│       ├── detail/                      ← Project detail panel (right side)
│       │   ├── ProjectDetail.tsx        ← Main detail layout orchestrator
│       │   ├── ProjectHeader.tsx        ← Title, category, timeline, status badge
│       │   ├── ProjectDescription.tsx   ← Full description + features/challenges
│       │   ├── ProjectTechStack.tsx     ← Tech badge row
│       │   ├── ProjectLinks.tsx         ← GitHub + Live Demo buttons
│       │   └── ProjectEmptyState.tsx    ← "Select a project" placeholder
│       │
│       └── reel/                        ← Reel Mode (media viewer)
│           ├── ProjectReelViewer.tsx    ← Top-level reel viewer (v1 + v2 aware)
│           ├── ReelSelector.tsx         ← v2 only: tab/list to switch reels
│           ├── ReelSlidePlayer.tsx      ← Renders one slide (image or video)
│           ├── ReelControls.tsx         ← Prev/Next, dot indicators, counter
│           └── ReelSlideCaption.tsx     ← Slide title + description overlay
│
├── features/
│   └── reels/
│       └── index.tsx                    ← Shared reel player (used by Projects App)
│                                           This is the portable reel engine.
│                                           ProjectReelViewer wraps this.
│
├── shared/
│   ├── ui/
│   │   ├── AppSidebar.tsx               ← Generic sidebar shell (Layout B)
│   │   ├── AppContentArea.tsx           ← Generic right-panel shell (Layout B)
│   │   └── AppTagBadge.tsx              ← Reusable tag/badge component
│   └── schemas/
│       └── project.schema.ts            ← Existing — extended for v2 (additive)
│
└── data/
    └── projects/
        ├── index.ts                     ← Accessor layer (normalizeProjectReels lives here)
        ├── projects.json                ← Project content (v1 format)
        └── sample-project.json          ← Legacy sample (keep for reference)
```

**Boundary rules**:

- Components inside `src/apps/projects/` may only import from:
  - `src/data/projects/` (data)
  - `src/shared/ui/` (shared UI primitives)
  - `src/features/reels/` (reel player engine)
  - `src/features/app-registry/` (to open other apps)
  - `src/core/window-manager/` (to open Browser App for external links)
- Components inside `src/apps/projects/` must NOT import from other `src/apps/*`
- The `src/features/reels/` module is portable — it knows nothing about projects specifically

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
ProjectsApp (index.tsx)
│  State: selectedProjectId, activeMode ("explorer" | "reel"), searchQuery, activeFilter
│  Reads: projects[] from data layer
│
├── ProjectsSidebar (explorer/)
│   │  Props: projects, selectedId, searchQuery, activeFilter, onSelect, onSearch, onFilter
│   │
│   ├── ProjectsSearch
│   │     Props: value, onChange
│   │
│   ├── ProjectsFilterBar
│   │     Props: activeFilter, categories, tags, onChange
│   │
│   └── ProjectSidebarItem (× N)
│         Props: project, isSelected, onClick
│         Renders: thumbnail, title, shortDescription, status badge
│
└── AppContentArea (shared/ui/)
    │
    ├── [if no project selected]
    │   └── ProjectEmptyState
    │
    └── [if project selected]
        │
        ├── ProjectDetail (detail/)
        │   ├── ProjectHeader
        │   │     Props: title, category, timeline, status, role, teamSize
        │   ├── ProjectDescription
        │   │     Props: fullDescription, features, challenges, solutions, results
        │   ├── ProjectTechStack
        │   │     Props: techStack
        │   └── ProjectLinks
        │         Props: githubUrl, liveUrl, onOpenInBrowser
        │
        └── ProjectReelViewer (reel/)
              Props: reels (NormalizedReel[]), autoPlay?
              │
              ├── [v2 only, when reels.length > 1]
              │   └── ReelSelector
              │         Props: reels, activeReelId, onSelect
              │
              └── [for active reel]
                  ├── ReelSlidePlayer
                  │     Props: slide (NormalizedSlide), isActive
                  │     Renders: <img> or <video> based on slide type
                  │
                  ├── ReelSlideCaption
                  │     Props: title, description, cta
                  │
                  └── ReelControls
                        Props: totalSlides, currentIndex, onPrev, onNext, onDotClick
```

### 5.2 State Architecture

The Projects App is a **pure client-side component**. No Next.js routing or URL state is involved — navigation happens entirely within the floating window.

```typescript
// ProjectsApp internal state
type ProjectsAppState = {
  // Explorer state
  selectedProjectId: string | null;
  searchQuery: string;
  activeFilter: ProjectFilter;

  // Detail state (per-selected project)
  activeReelId: string | null; // null = first reel
  activeSlideIndex: number; // 0-indexed within active reel

  // UI mode
  detailTab: "overview" | "reel"; // whether detail shows metadata or reel
};

type ProjectFilter = {
  category: string | null; // null = all
  status: Project["status"] | null; // null = all
  tags: string[]; // empty = all (AND logic)
  featured: boolean; // false = show all
};
```

**State ownership**:

- All state lives in `ProjectsApp` (root). No external store.
- Child components are pure — they receive state via props and emit changes via callbacks.
- `selectedProjectId` reset triggers `activeReelId = null` and `activeSlideIndex = 0`.
- `searchQuery` change does NOT reset `selectedProjectId` (preserves focus).

---

## 6. Explorer Mode

Explorer Mode is the default view when the Projects App opens. It is the project list — a scannable, filterable, searchable sidebar.

### 6.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  WindowChrome: "Projects"                                       │
├─────────────────────────────────────────────────────────────────┤
│  [🔍 Search projects...]          [Filters ▾]   (header bar)   │
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                          │
│  SIDEBAR             │  DETAIL PANEL                            │
│  (240px fixed)       │  (fills remaining width)                 │
│                      │                                          │
│  ALL PROJECTS (N)    │  [ProjectEmptyState or ProjectDetail]    │
│  ┌────────────────┐  │                                          │
│  │ 🖼 Project A  │  │                                          │
│  │   Web App      │  │                                          │
│  │   ● completed  │  │                                          │
│  └────────────────┘  │                                          │
│  ┌────────────────┐  │                                          │
│  │ 🖼 Project B  │  │   (← selected: highlighted)              │
│  │   Mobile       │  │                                          │
│  │   ⟳ active    │  │                                          │
│  └────────────────┘  │                                          │
│  ...                 │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

### 6.2 Sidebar Section

**Section label**: `"ALL PROJECTS (N)"` where N is the filtered count — 11px, uppercase, `var(--color-text-label)`.

**Project item** (`ProjectSidebarItem`):

```
┌─────────────────────────────────────────────────────┐
│  [40×40 thumb]  Project Title                        │
│                 category • timeline        [● badge] │
└─────────────────────────────────────────────────────┘
```

- Item height: `64px` (taller than standard 40px items, accommodates 2-line layout)
- Thumbnail: `40×40px`, `border-radius: 8px`, `object-fit: cover`
- Title: 13px, weight 600, `var(--color-text-primary)`, single line (ellipsis)
- Subtitle: 11px, `var(--color-text-muted)` — category + " • " + timeline
- Status badge: right-aligned, 8px dot or `AppTagBadge variant="status"`
- Selected: `background: var(--color-bg-sidebar-active)`, all text white
- Hover: `background: var(--color-surface-1)`
- Padding: `8px 12px`
- Gap between items: `2px`

**Status dot colors**:

| Status        | Color                        |
| ------------- | ---------------------------- |
| `completed`   | `var(--color-accent)` (teal) |
| `in-progress` | `#fbbf24` (amber)            |
| `planned`     | `#64748b` (slate-500 muted)  |
| `archived`    | `#475569` (slate-600 dimmed) |

### 6.3 Sidebar Empty State

When search returns 0 results:

```
┌─────────────────────────────────────────┐
│                                         │
│          🔍                             │
│   No projects match "your query"        │
│   Clear search to see all projects      │
│                                         │
└─────────────────────────────────────────┘
```

- Center-aligned in sidebar
- 13px, `var(--color-text-muted)`
- "Clear search" is a clickable text link in `var(--color-accent)`

---

## 7. Search

### 7.1 Search Input (`ProjectsSearch`)

Rendered in the sidebar header area, above the project list.

**Design** (OS-style, from `DESIGN_SYSTEM.md § 6 Inputs`):

- Background: `rgba(255,255,255,0.04)`
- Border: `1px solid var(--color-border)`
- Border-radius: `8px`
- Focus border: `var(--color-accent)`
- Height: `32px`
- Padding: `0 12px 0 32px` (icon on left)
- Placeholder: `"Search projects..."` — `var(--color-text-muted)`
- Left icon: 🔍 magnifier, 14px, muted

**Behavior**:

- Instant search — no debounce required (data is static and small)
- Search term stored in `ProjectsApp` state, not URL
- Clears on `Escape` key
- Does not auto-select a project when results change

### 7.2 Search Fields

The search function in `src/data/projects/index.ts` matches against all of:

```
priority 1: title            (exact prefix match scores highest)
priority 2: tags[]           (any tag contains query)
priority 3: shortDescription (contains query)
priority 4: techStack[]      (any tech contains query)
priority 5: category         (contains query)
priority 6: fullDescription  (contains query, lowest priority)
```

**Algorithm**: Simple case-insensitive `string.includes()` — no fuzzy matching required. Priority is implemented by checking fields in order and deduplicating results.

```typescript
export function searchProjects(query: string): Project[] {
  if (!query.trim()) return getProjects();
  const q = query.toLowerCase().trim();
  const seen = new Set<string>();
  const results: Project[] = [];

  const add = (p: Project) => {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      results.push(p);
    }
  };

  const projects = getProjects();
  // Ordered by match priority
  projects.filter((p) => p.title.toLowerCase().startsWith(q)).forEach(add);
  projects.filter((p) => p.tags.some((t) => t.toLowerCase().includes(q))).forEach(add);
  projects.filter((p) => p.shortDescription.toLowerCase().includes(q)).forEach(add);
  projects.filter((p) => p.techStack.some((t) => t.toLowerCase().includes(q))).forEach(add);
  projects.filter((p) => p.category.toLowerCase().includes(q)).forEach(add);
  projects.filter((p) => p.fullDescription.toLowerCase().includes(q)).forEach(add);

  return results;
}
```

---

## 8. Filters

### 8.1 Filter Bar (`ProjectsFilterBar`)

Rendered below the search input, above the project list. Horizontally scrollable row of filter chips.

```
[All] [Web App] [Mobile] [Completed] [Featured]
```

**Chip design** (`AppTagBadge` with interaction):

- Default: `background: var(--color-surface-1)`, text `var(--color-text-secondary)`
- Active: `background: rgba(16,185,129,0.15)`, text `var(--color-accent)`, border `1px solid rgba(16,185,129,0.3)`
- Height: `24px`, padding: `0 10px`, border-radius: `12px`
- Font: 11px, weight 500

**Filter categories** (tabs / chips):

| Filter Label | Filter Logic                | Source                          |
| ------------ | --------------------------- | ------------------------------- |
| All          | No filter                   | —                               |
| Web App      | `category === "Web App"`    | Derived from categories in data |
| Mobile       | `category === "Mobile App"` | Derived from data               |
| Featured     | `featured === true`         | `project.featured` flag         |
| Completed    | `status === "completed"`    | `project.status`                |
| In Progress  | `status === "in-progress"`  | `project.status`                |

**Dynamic category chips**: The filter bar generates `category`-based chips automatically from `getAllCategories()`. This means as new projects are added with new categories, new filter chips appear with no code change.

**Filter state**: `activeFilter` in `ProjectsApp` state. Multiple category filters cannot be active simultaneously (single-select). The `tags` field supports multi-select (AND logic) but is not exposed in the Phase 3 filter bar UI — reserved for Phase 4.

### 8.2 Filter + Search Combination Logic

Both filter and search apply simultaneously. A project appears in the list only when it satisfies BOTH:

```
visibleProjects = searchProjects(query).filter(p => matchesFilter(p, activeFilter))
```

When filters reduce results to 0 and the `selectedProjectId` is no longer in `visibleProjects`, the selection is retained but shown with a "This project is hidden by current filters. [Clear filters]" notice in the detail panel.

---

## 9. Project Detail Panel

The right-side panel shows full project detail when a project is selected from the sidebar.

### 9.1 Detail Layout

```
┌────────────────────────────────────────────────────────────────┐
│  [Cover Image — full width, max-height: 200px, object-fit]     │
├────────────────────────────────────────────────────────────────┤
│  DETAIL TABS: [Overview]  [Reel →]                             │  ← tab row
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  PROJECT TITLE                     [● Completed]  [GitHub ↗]  │
│  Mobile App  •  Jan 2024–Jun 2024  •  Sole Engineer  •  1 dev │
│                                                                │
│  Full description paragraph...                                 │
│                                                                │
│  ── KEY FEATURES ──────────────────────────────────────────── │
│  • Feature one                                                 │
│  • Feature two                                                 │
│                                                                │
│  ── TECH STACK ─────────────────────────────────────────────  │
│  [React Native] [TypeScript] [Expo] [Redux]                    │
│                                                                │
│  ── RESULTS ────────────────────────────────────────────────  │
│  • Result one                                                  │
│                                                                │
│  [GitHub ↗]   [Live Demo ↗]                                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 9.2 Detail Tab Bar

Two tabs switch between the detail views:

| Tab        | Content                                  | Default |
| ---------- | ---------------------------------------- | ------- |
| `Overview` | Full project metadata (see above layout) | ✅ Yes  |
| `Reel ▶`   | Reel player (see § 10)                   | —       |

**Tab design** (from `DESIGN_SYSTEM.md § 6 Navigation`):

- Horizontal row, `height: 40px`
- Background: `var(--color-bg-sidebar)` (slightly dark separator line)
- Active tab: white text + `border-bottom: 2px solid var(--color-accent)`
- Inactive: `var(--color-text-muted)`, no border
- Font: 13px, weight 500

### 9.3 `ProjectHeader` Component

```
[Project Title — 22px, 700]               [● status badge]
[category] • [timeline] • [role] • [N devs]
```

- Title: 22px, weight 700, `var(--color-text-primary)`
- Meta line: 12px, `var(--color-text-muted)`, `•` separator
- Status badge: `AppTagBadge variant="status"`

### 9.4 `ProjectDescription` Component

Sections rendered in order, each with an 11px uppercase label:

| Section Label      | Data Field        | Condition                    |
| ------------------ | ----------------- | ---------------------------- |
| `DESCRIPTION`      | `fullDescription` | Always                       |
| `KEY FEATURES`     | `features[]`      | When `features.length > 0`   |
| `CHALLENGES`       | `challenges[]`    | When `challenges.length > 0` |
| `SOLUTIONS`        | `solutions[]`     | When `solutions.length > 0`  |
| `RESULTS & IMPACT` | `results[]`       | When `results.length > 0`    |

Each section:

- Label: 11px, uppercase, `var(--color-text-label)`, `letter-spacing: 0.08em`
- Horizontal rule after label: `border-bottom: 1px solid var(--color-border)`, `margin-bottom: 8px`
- List items: `•` bullet, 13px, `var(--color-text-secondary)`, `line-height: 1.6`

### 9.5 `ProjectTechStack` Component

Flex-wrap row of `AppTagBadge variant="neutral"` badges.

- Gap: `6px`
- Overflow: wraps to next line
- Max visible without scroll: ~8 badges depending on label length

### 9.6 `ProjectLinks` Component

```
[← GitHub]    [Live Demo →]
```

- GitHub: secondary/ghost button style, opens in Browser App
- Live Demo: primary accent button style, opens in Browser App
- Both hidden when URL fields are absent
- When only one URL is present, render only that button

**Opening external links** (OS contract): Links MUST open in the Browser App, not in the browser tab. Implementation:

```typescript
// In ProjectLinks
const handleOpenLink = (url: string) => {
  openWindow({
    id: `browser-${Date.now()}`,
    title: "Browser",
    appId: "browser",
    focused: true,
    minimized: false,
    maximized: false,
    initialProps: { url }, // requires WindowState.initialProps extension
  });
};
```

### 9.7 Cover Image

- Rendered above the tab bar, full width, `max-height: 200px`
- `object-fit: cover`, `object-position: center top`
- Fallback: dark gradient placeholder when `coverImage` asset is missing
- `border-radius: 0` — flush with the window chrome content area edge

### 9.8 Empty State (`ProjectEmptyState`)

Shown when no project is selected:

```
          📁

  Select a project from the list
  to view its details and reel.
```

- Vertically centered in the content area
- Icon: 32px
- Text: 14px, `var(--color-text-muted)`, centered

---

## 10. Reel Mode

Reel Mode is activated by clicking the `Reel ▶` tab in the detail panel. It replaces the overview content with the interactive reel player.

### 10.1 Reel Layout (v1 — single reel per project)

```
┌────────────────────────────────────────────────────────────────┐
│  [Cover / slide 0 media — full content width, constrained H]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ← [prev]    Slide Title                    [next] →           │
│              Slide description text                            │
│                                                                │
│              ●  ○  ○  ○   (dot indicators)                     │
│                                                                │
│              [2 / 5]                                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 10.2 Reel Layout (v2 — multiple reels per project)

```
┌────────────────────────────────────────────────────────────────┐
│  REELS:  [Product Overview]  [Engineering]  [Results]          │  ← ReelSelector
├────────────────────────────────────────────────────────────────┤
│  [Active reel media — full width]                              │
├────────────────────────────────────────────────────────────────┤
│  ← [prev]    Slide Title                    [next] →           │
│              Slide description                                 │
│              ●  ○  ○   (dots)     [2 / 3]                      │
└────────────────────────────────────────────────────────────────┘
```

The `ReelSelector` is only rendered when `reels.length > 1`.

### 10.3 `ProjectReelViewer` Component

This is the container that bridges the Projects App to `src/features/reels/`. It is responsible for:

1. Calling `normalizeProjectReels(project)` to get `NormalizedReel[]`
2. Tracking `activeReelId` and `activeSlideIndex`
3. Rendering `ReelSelector` when multiple reels exist
4. Passing the active reel's slides to the reel engine

```typescript
// ProjectReelViewer props
type ProjectReelViewerProps = {
  project: Project;
  // State lifted from ProjectsApp
  activeReelId: string | null;
  activeSlideIndex: number;
  onReelChange: (reelId: string) => void;
  onSlideChange: (index: number) => void;
};
```

### 10.4 `ReelSlidePlayer` Component

Renders one slide at a time. The media type is determined at render time:

```typescript
// Slide type resolution
const slideType = (slide: NormalizedSlide): "video" | "image" | "text-only" => {
  if (slide.video) return "video";
  if (slide.image) return "image";
  return "text-only";
};
```

**Video slides**:

- `<video>` element with `autoPlay`, `muted`, `loop`, `playsInline`
- Controls hidden — navigation is via `ReelControls` only
- Aspect ratio maintained via `aspect-ratio: 16/9` container
- Fallback: poster frame = `slide.image` if present

**Image slides**:

- `<img>` with `object-fit: contain` inside a fixed-height container
- No zoom or lightbox in Phase 3

**Text-only slides** (v2 future):

- Full-width panel with title (24px) and description (16px)
- Background: `var(--color-bg-card)`

**Container spec**:

- Width: 100%
- Max-height: `340px` (leaves room for controls below)
- Background: `#000000` (letterbox for images/video)
- `border-radius: 8px`

### 10.5 `ReelControls` Component

**Prev/Next buttons**:

- Arrow icon buttons, `40px × 40px`
- Background: `rgba(255,255,255,0.08)`, hover: `rgba(255,255,255,0.12)`
- `border-radius: 50%`
- Disabled state (at start/end): `opacity: 0.3`, `cursor: not-allowed`
- No wrap-around by default (no infinite loop)

**Dot indicators**:

- Active dot: `8px` circle, `var(--color-accent)` fill
- Inactive dot: `6px` circle, `rgba(255,255,255,0.3)` fill
- Gap: `6px`
- Max 8 dots shown; beyond 8 slides, switch to counter-only mode

**Slide counter** (`"N / Total"`):

- 12px, `var(--color-text-muted)`
- Always visible when there are more than 1 slides

**Keyboard navigation** (when reel is focused):

- `←` / `→`: prev/next slide
- `1`–`9`: jump to slide N (when ≤ 9 slides)
- `Escape`: return to Overview tab

**Touch/swipe** (Phase 3 stretch, not blocking):

- `touchstart` + `touchend` horizontal delta detection
- Threshold: 50px minimum swipe distance

### 10.6 `ReelSlideCaption` Component

Below the media, above the controls:

```
Slide Title                                                [CTA button?]
Slide description text (up to 2 lines, then ellipsis)
```

- Title: 14px, weight 600, `var(--color-text-primary)`
- Description: 13px, `var(--color-text-secondary)`, max 2 lines
- CTA: `AppTagBadge`-sized button, `var(--color-accent)`, only when `slide.cta` is set
- Container padding: `12px 0`

### 10.7 `ReelSelector` Component (v2 only)

Horizontal tab row above the media. Only rendered when `normalizedReels.length > 1`.

```
[Product Overview]   [Engineering Deep Dive]   [Results & Impact]
```

- Style: same as detail tab bar
- Active: white text + accent underline
- Inactive: muted text
- Overflow: horizontally scrollable when too many reels
- Switching reel resets `activeSlideIndex` to `0`

---

## 11. Project Metadata Display

This table defines exactly how each field from the project schema is displayed in the UI and where:

| Field                      |    Sidebar     | Detail Header |   Detail Body   |       Reel        | Notes                          |
| -------------------------- | :------------: | :-----------: | :-------------: | :---------------: | ------------------------------ |
| `title`                    |  ✅ (primary)  |    ✅ (H1)    |        —        |         —         |                                |
| `shortDescription`         | ✅ (subtitle)  |       —       |        —        |         —         | 1-line truncated               |
| `fullDescription`          |       —        |       —       | ✅ DESCRIPTION  |         —         |                                |
| `category`                 |   ✅ (meta)    |   ✅ (meta)   |        —        |         —         |                                |
| `timeline`                 |   ✅ (meta)    |   ✅ (meta)   |        —        |         —         |                                |
| `status`                   | ✅ (badge dot) |  ✅ (badge)   |        —        |         —         |                                |
| `role`                     |       —        |   ✅ (meta)   |        —        |         —         |                                |
| `teamSize`                 |       —        |   ✅ (meta)   |        —        |         —         | `"1 dev"` or `"N devs"`        |
| `techStack`                |       —        |       —       |  ✅ TECH STACK  |         —         | Badge row                      |
| `featured`                 |       —        |       —       |        —        |         —         | Used by About App only         |
| `features`                 |       —        |       —       | ✅ KEY FEATURES |         —         | Hidden when empty              |
| `challenges`               |       —        |       —       |  ✅ CHALLENGES  |         —         | Hidden when empty              |
| `solutions`                |       —        |       —       |  ✅ SOLUTIONS   |         —         | Hidden when empty              |
| `results`                  |       —        |       —       |   ✅ RESULTS    |         —         | Hidden when empty              |
| `tags`                     |       —        |       —       |        —        |         —         | Used for filtering only        |
| `thumbnail`                |   ✅ (40×40)   |       —       |        —        |         —         |                                |
| `coverImage`               |       —        |  ✅ (header)  |        —        | ✅ (reel default) |                                |
| `screenshots`              |       —        |       —       |        —        |         —         | Phase 4: gallery within detail |
| `demoVideo`                |       —        |       —       |        —        |         —         | Phase 4: separate video player |
| `githubUrl`                |       —        |       —       |    ✅ LINKS     |         —         |                                |
| `liveUrl`                  |       —        |       —       |    ✅ LINKS     |         —         |                                |
| `reelSlides`               |       —        |       —       |        —        |    ✅ (slides)    | v1 default reel                |
| `reelSlides[].title`       |       —        |       —       |        —        |    ✅ caption     |                                |
| `reelSlides[].description` |       —        |       —       |        —        |    ✅ caption     |                                |
| `reelSlides[].image`       |       —        |       —       |        —        |  ✅ slide media   |                                |
| `reelSlides[].video`       |       —        |       —       |        —        |  ✅ slide media   |                                |
| `reelSlides[].cta`         |       —        |       —       |        —        |   ✅ CTA button   | Phase 3 stretch                |
| `createdAt`                |       —        |       —       |        —        |         —         | Not displayed                  |
| `updatedAt`                |       —        |       —       |        —        |         —         | Not displayed                  |

---

## 12. Screenshots and Video Assets

### 12.1 Asset Directory Structure

```
public/
└── media/
    └── projects/
        └── [project-slug]/
            ├── thumbnail.jpg          ← 40×40px or 80×80px @2x, WebP preferred
            ├── cover.jpg              ← 960×400px, full-width detail header
            ├── screenshots/
            │   ├── 01.jpg
            │   ├── 02.jpg
            │   └── ...
            └── reel/
                ├── slide-01.jpg       ← Reel slide images
                ├── slide-02.jpg
                └── demo.mp4           ← Optional: reel slide video
```

**Asset path convention in `projects.json`**:

```json
{
  "thumbnail": "/media/projects/my-project/thumbnail.jpg",
  "coverImage": "/media/projects/my-project/cover.jpg",
  "screenshots": ["/media/projects/my-project/screenshots/01.jpg"],
  "reelSlides": [
    {
      "image": "/media/projects/my-project/reel/slide-01.jpg"
    }
  ]
}
```

All asset paths must be absolute from `/public/` root and must start with `/`. This is enforced by `assetPathSchema`.

### 12.2 Image Specifications

| Asset            | Dimensions       | Format     | Max Size |
| ---------------- | ---------------- | ---------- | -------- |
| `thumbnail`      | 80×80px          | WebP / JPG | 20KB     |
| `coverImage`     | 960×400px        | WebP / JPG | 150KB    |
| `screenshots[]`  | 1280×720px       | WebP / JPG | 200KB    |
| Reel slide image | 960×540px (16:9) | WebP / JPG | 150KB    |

### 12.3 Video Specifications

| Asset            | Resolution | Format      | Max Size | Notes                 |
| ---------------- | ---------- | ----------- | -------- | --------------------- |
| Reel slide video | 960×540px  | MP4 (H.264) | 5MB      | Loop, muted, no audio |
| `demoVideo`      | 1280×720px | MP4 (H.264) | 20MB     | Phase 4 feature       |

**Phase 3 constraint**: Image-only slides are sufficient. Video in reel slides is architecture-supported but not required.

### 12.4 Missing Asset Fallbacks

Every image rendered in the Projects App must have a graceful fallback:

| Asset            | Fallback                                            |
| ---------------- | --------------------------------------------------- |
| `thumbnail`      | Dark gradient square with project initial letter    |
| `coverImage`     | Dark gradient: `var(--wp-bg)` pattern               |
| Reel slide image | Centered "No preview available" text on dark bg     |
| Reel slide video | Static fallback image from `slide.image` if present |

Fallback implementation: CSS `background-image` with `onerror` on `<img>` to add a `.broken` class that activates the gradient fallback via CSS.

---

## 13. Reel Player — Portable Feature Module

The Projects App contains `src/apps/projects/reel/ProjectReelViewer.tsx` which wraps the portable reel engine from `src/features/reels/index.tsx`. This separation is intentional.

### Portability Contract

`src/features/reels/index.tsx` must:

- Accept `NormalizedReel | NormalizedReel[]` as its primary prop
- Know nothing about the `Project` type
- Have no imports from `src/apps/*` or `src/data/projects`
- Be usable by any future app that needs a slide player

```typescript
// src/features/reels/index.tsx — public API
export type { NormalizedReel, NormalizedSlide } from "@data/projects"; // or local types

export type ReelPlayerProps = {
  reels: NormalizedReel[]; // always an array (even if length === 1)
  initialReelId?: string; // which reel to start on
  initialSlideIndex?: number; // which slide to start on
  onSlideChange?: (reelId: string, slideIndex: number) => void;
  showReelSelector?: boolean; // false = hide ReelSelector even if multiple reels
  autoPlay?: boolean; // auto-advance video slides
};

export default function ReelPlayer(props: ReelPlayerProps): JSX.Element;
```

---

## 14. v1 → v2 Migration Path

This section defines exactly how the schema and component evolve when the multi-reel feature is added. No code must be written now — only constraints are defined.

### Schema Migration: Non-Breaking Addition

```diff
// project.schema.ts changes (v2)
  projectSchema = z.object({
    // --- all existing v1 fields unchanged ---
    id, slug, title, ..., reelSlides, createdAt, updatedAt,

+   // v2 additions (all optional — v1 data remains valid)
+   reels: z.array(projectNamedReelSchema).optional(),
+   storyChapters: z.array(storyChapterSchema).optional(),
+   platform: z.enum([...]).optional(),
+   displayOrder: z.number().int().nonnegative().optional(),
  })
```

No existing field is removed, renamed, or made required.

### Data Migration: None Required

A project with only `reelSlides` is valid in perpetuity. `normalizeProjectReels()` handles both:

- If `reels` is present and non-empty → use named reels
- If `reels` is absent or empty → wrap `reelSlides` as the default reel

### Component Migration: Conditional Rendering

`ProjectReelViewer` already passes `NormalizedReel[]` to the reel engine. The only v2 change is that `normalizeProjectReels()` returns more than one item, which activates `ReelSelector`:

```tsx
// ProjectReelViewer — no structural change in v2
const normalizedReels = normalizeProjectReels(project);
// v1: normalizedReels.length === 1 → ReelSelector hidden
// v2: normalizedReels.length > 1  → ReelSelector shown
```

### UI Migration: Zero Breakage

No existing UI state, props interface, or rendered output changes in v2. The `ReelSelector` is purely additive — it renders above the existing player when conditions are met.

---

## 15. Future Storytelling Support

The story chapter concept (`storyChapters[]`) is a Phase 4+ feature. The architecture anticipates it without implementing it.

### What "Storytelling Case Study" Means

A storytelling case study is a long-form project narrative organized into chapters, each linked to a specific reel. It turns a project from a "facts list" into a narrative:

```
Chapter 1: "The Problem"       → links to Reel: "Product Overview"
Chapter 2: "The Engineering"   → links to Reel: "Engineering Deep Dive"
Chapter 3: "The Impact"        → links to Reel: "Results & Impact"
```

### Future Tab: `Story`

The detail panel gains a third tab in Phase 4:

```
[Overview]  [Reel ▶]  [Story]   ← Phase 4 addition
```

The `Story` tab renders `storyChapters[]` as a scrollable long-form narrative with inline media and jump-to-reel CTAs.

### Constraints to Preserve Now

1. The `detailTab` state must be extensible to include `"story"` — use a string union, not boolean
2. `ProjectDetail.tsx` must render tabs from a configuration array, not hardcoded JSX
3. `storyChapterSchema` must be defined in `project.schema.ts` even if unused in Phase 3 (Zod `.optional()` field, validated but not rendered)
4. `reelId` on `storyChapterSchema` must match a `reels[].id` — this cross-reference validation goes in `superRefine`

---

## 16. App Registry Integration

When registered, the Projects App entry must include the following fields:

```typescript
{
  id: "projects",
  title: "Projects",
  description: "Portfolio projects and case studies",
  icon: "/icons/projects.svg",
  component: ProjectsApp,
  defaultSize: { width: 960, height: 640 },
  pinned: true,    // visible in taskbar
}
```

The `defaultSize` is critical — the Projects App requires 960×640 minimum to display the sidebar + detail panel without cramping.

---

## 17. Implementation Checklist

When building the Projects App, the following order must be respected:

```
Phase 3 Prerequisites (from PHASE_3_ARCHITECTURE.md Stage 0):
  ☐ CSS tokens defined in globals.css
  ☐ Inter font loaded
  ☐ AppMeta.defaultSize wired through WindowChrome

Data prerequisites:
  ☐ 3–4 real project entries added to projects.json
  ☐ Real thumbnail, cover, and reel slide assets in /public/media/projects/
  ☐ normalizeProjectReels() implemented in src/data/projects/index.ts

Shared UI prerequisites (from PHASE_3_ARCHITECTURE.md Stage 1):
  ☐ AppSidebar, AppContentArea built
  ☐ AppTagBadge built

Feature prerequisites:
  ☐ src/features/reels/index.tsx implemented (ReelPlayer portable engine)

Projects App implementation order:
  ☐ ProjectsApp.tsx — state, layout shell
  ☐ ProjectsSidebar + ProjectSidebarItem — list with selection
  ☐ ProjectEmptyState — placeholder
  ☐ ProjectDetail — overview tab (ProjectHeader, ProjectDescription, ProjectTechStack, ProjectLinks)
  ☐ ProjectReelViewer — wraps ReelPlayer with normalization
  ☐ ProjectsSearch — search input
  ☐ ProjectsFilterBar — filter chips
  ☐ ReelSelector — v2 multi-reel tabs (build now, renders only when needed)

Registry:
  ☐ Register ProjectsApp in src/features/app-registry with defaultSize and pinned: true

Verification:
  ☐ Sidebar renders all projects
  ☐ Selecting a project shows detail panel
  ☐ Overview tab shows all metadata sections
  ☐ Reel tab shows slide player with controls
  ☐ Keyboard navigation works (← → in reel)
  ☐ Search filters the sidebar list
  ☐ Filter chips work and combine with search
  ☐ External links open via Browser App (not browser tab)
  ☐ Missing assets show fallbacks (no broken image icons)
  ☐ No inline styles with hardcoded hex colors (all var(--color-*))
```

---

## 18. Design Governance Constraints

All constraints from `DESIGN_SYSTEM.md` and `AGENT_RULES.md` apply. Project-App-specific reminders:

- ❌ **No progress bars** for tech proficiency — skills are displayed as badges only
- ❌ **No gradient project cards** in the sidebar — items are list rows, not colored showcase cards
- ❌ **No website-style portfolio grid** — this is a master-detail OS app, not a card grid website
- ❌ **No external navigation** — GitHub and Live Demo links must go through Browser App
- ❌ **No hardcoded colors** — every color value must reference a `var(--color-*)` token
- ✅ **Cover image above tabs** — maintain the visual hierarchy defined in § 9.1
- ✅ **Sidebar shows filtered count** — `"ALL PROJECTS (N)"` section label updates with filter state
- ✅ **Status dots in sidebar** — provides visual scanning cue without opening detail

---

_Document created: 2026-06-14._
_Update this document when schema fields are added, component structure changes, or the v2 reel model is activated._
_Schema changes must be backward compatible — never remove or rename existing fields._
