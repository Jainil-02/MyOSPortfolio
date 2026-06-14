# PHASE 3 ARCHITECTURE

> **Document purpose**: Pre-implementation architecture plan for the Phase 3 App Ecosystem.
> **Status**: Planning — no code changes may be made until this document is reviewed.
> **Authority**: This document informs but does not override `docs/DESIGN_SYSTEM.md` or `docs/AGENT_RULES.md`.
> **Created**: 2026-06-14 — post-Phase-2 / post-Design-System-Governance

---

## 1. Scope

Phase 3 delivers the full application ecosystem for ApexOS. Every app listed below must behave as an authentic OS application rendered inside `WindowChrome`. None of these apps may use website-style layouts, browser-style navigation, or introduce colors and typography outside the design token system.

### Applications in Scope

| App ID         | Status                  | Recruiter Priority |
| -------------- | ----------------------- | ------------------ |
| `about`        | ⚠️ Stub (needs rewrite) | 🔴 CRITICAL        |
| `projects`     | ⚠️ Stub (needs rewrite) | 🔴 CRITICAL        |
| `resume`       | 🔴 Empty stub           | 🔴 CRITICAL        |
| `contact`      | 🔴 Empty stub           | 🔴 CRITICAL        |
| `skills`       | 🔴 Empty stub           | 🟡 HIGH            |
| `files`        | 🔴 Empty stub           | 🟡 HIGH            |
| `browser`      | 🔴 Empty stub           | 🟡 HIGH            |
| `gallery`      | 🔴 Empty stub           | 🟢 MEDIUM          |
| `terminal`     | 🔴 Empty stub           | 🟢 MEDIUM          |
| `achievements` | 🔴 Empty stub           | 🟢 MEDIUM          |

### Pre-Phase-3 Infrastructure Work (Blocking)

Before any app can be built, these infrastructure fixes MUST be completed in order:

1. **Load Inter font** — Add to `src/app/globals.css`. Required before first visual.
2. **Define all CSS custom property tokens** — `src/app/globals.css` must declare every token from `DESIGN_SYSTEM.md § 11`.
3. **Fix window control button order** — `src/features/window-chrome/index.tsx`: red=Close (left), yellow=Minimize (center), green=Maximize (right).
4. **Add `defaultSize` to `AppMeta`** — Extend `src/features/app-registry/index.ts` with `defaultSize: { width: number; height: number }` and wire it through `WindowChrome`.
5. **Add `pinned` flag to `AppMeta`** — Distinguish taskbar-pinned apps from registered-only apps. Prevents taskbar overflow.
6. **Implement the reel player** — `src/features/reels/index.tsx` is required before Projects App detail view can render.

---

## 2. Dependency Graph

The following diagram shows the directional dependencies between all Phase 3 deliverables. An arrow A → B means "A must exist before B can be built."

```
INFRASTRUCTURE LAYER
─────────────────────────────────────────────────────────────────
CSS Tokens (globals.css)
    → ALL Phase 3 apps (consume var(--color-*) tokens)

Inter Font (globals.css)
    → ALL Phase 3 apps (typography consistency)

AppMeta.defaultSize (app-registry)
    → ALL Phase 3 apps (correct window sizing)

AppMeta.pinned (app-registry)
    → Taskbar (prevents overflow when all apps registered)

SHARED UI LAYER
─────────────────────────────────────────────────────────────────
AppSidebar (src/shared/ui/AppSidebar.tsx)
    → Projects App
    → Skills App
    → Files App
    → Settings App

AppContentArea (src/shared/ui/AppContentArea.tsx)
    → Projects App
    → Skills App
    → Files App
    → Settings App

AppTagBadge (src/shared/ui/AppTagBadge.tsx)
    → About App
    → Projects App
    → Skills App
    → Resume App

AppInfoCard (src/shared/ui/AppInfoCard.tsx)
    → About App
    → Contact App

ReelPlayer (src/features/reels/index.tsx)
    → Projects App (detail view slide viewer)

DATA LAYER
─────────────────────────────────────────────────────────────────
src/data/projects/projects.json (real project entries)
    → Projects App
    → Resume App (featured projects section)
    → About App (current focus card)

src/data/skills.ts (new — static structured data)
    → Skills App

src/data/resume.ts (new — static structured data)
    → Resume App
    → About App (summary bio / timeline)

src/data/achievements.ts (new — static structured data)
    → Achievements App

APPLICATION LAYER
─────────────────────────────────────────────────────────────────
About App
    → (none — first leaf node, standalone)

Skills App
    → (none — static data only, no cross-app deps)

Contact App
    → (none — standalone form, no cross-app deps)

Resume App
    → src/data/resume.ts
    → src/data/projects/projects.json (featured projects)

Projects App
    → src/features/reels/index.tsx (reel player)
    → src/data/projects/projects.json (project content)

Files App
    → Browser App (opens resume PDF link in browser)
    → (static folder/file simulation data)

Browser App
    → (standalone, renders iframe or static content)

Gallery App
    → (static image asset data)

Terminal App
    → (standalone, self-contained simulation)

Achievements App
    → src/data/achievements.ts

REGISTRY LAYER
─────────────────────────────────────────────────────────────────
src/features/app-registry/index.ts
    → Must be updated AFTER each app is implemented
    → Must NOT register an app before it has real content
```

---

## 3. Shared UI Patterns

All Phase 3 apps consume from two canonical layout patterns defined in `DESIGN_SYSTEM.md § 7`.

### Layout A — Profile / Dashboard

Used by: **About**, **Contact**, **Achievements**, **Resume** (document variant)

```
┌─────────────────────────────────────────────────────┐
│  WindowChrome title bar                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Hero / Profile Card (full width)                  │
│                                                     │
│   ┌──────────────┐  ┌──────────────┐                │
│   │  Info Card   │  │  Info Card   │                │
│   └──────────────┘  └──────────────┘                │
│                                                     │
│   ┌──────────────┐  ┌──────────────┐                │
│   │  Info Card   │  │  Info Card   │                │
│   └──────────────┘  └──────────────┘                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Design constraints**:

- No left sidebar
- Hero card spans full content width
- Secondary cards in 2-column grid below hero
- Scrollable content area
- No sticky headers inside content

### Layout B — Master-Detail with Sidebar

Used by: **Projects**, **Skills**, **Files**, **Settings**

```
┌─────────────────────────────────────────────────────┐
│  WindowChrome title bar                             │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│   Sidebar    │   Content Area                       │
│   (~240px)   │   (tabs / detail / grid)             │
│              │                                      │
│   SECTION    │                                      │
│   > Item     │                                      │
│   > Item     │                                      │
│              │                                      │
│   SECTION    │                                      │
│   > Item     │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

**Design constraints**:

- Sidebar: `~240px` fixed width, `background: var(--color-bg-sidebar)`
- Sidebar has labeled sections (11px uppercase headers)
- Sidebar items: 40px height, icon + label
- Content area: fills remaining width
- Content area may use horizontal tabs at the top (Settings pattern)

---

## 4. Shared Window Layouts

### Window Size Assignments

Each app in the registry must declare a `defaultSize`. The following sizes are derived from the approved design screenshots and recruiter UX requirements:

| App ID         | Default Width | Default Height | Layout Pattern | Rationale                          |
| -------------- | ------------- | -------------- | -------------- | ---------------------------------- |
| `about`        | 720px         | 560px          | Layout A       | Profile + 2 info cards comfortably |
| `projects`     | 960px         | 640px          | Layout B       | Sidebar list + full project detail |
| `resume`       | 820px         | 720px          | Layout A (doc) | Document needs vertical space      |
| `contact`      | 640px         | 480px          | Layout A       | Compact form, minimal footprint    |
| `skills`       | 840px         | 580px          | Layout B       | Category sidebar + skill card grid |
| `files`        | 1100px        | 700px          | Layout B       | Matches approved file-app.png      |
| `browser`      | 1000px        | 700px          | Full content   | Browser address bar + content area |
| `gallery`      | 900px         | 640px          | Full grid      | Image grid needs horizontal space  |
| `terminal`     | 760px         | 480px          | Full content   | Classic terminal proportions       |
| `achievements` | 720px         | 560px          | Layout A       | Card grid with hero                |
| `settings`     | 960px         | 720px          | Layout B       | Matches approved setting-app.png   |

### Taskbar Pinned App Set

Not all registered apps should be pinned in the taskbar. The approved `desktop-home.png` shows 5–6 pinned icons. The following pinning strategy avoids overflow:

| App ID         | Pinned in Taskbar       | Rationale                                   |
| -------------- | ----------------------- | ------------------------------------------- |
| `about`        | ✅ Yes                  | Primary recruiter touchpoint                |
| `projects`     | ✅ Yes                  | Primary recruiter touchpoint                |
| `skills`       | ✅ Yes                  | Primary recruiter touchpoint                |
| `files`        | ✅ Yes                  | OS authenticity anchor                      |
| `browser`      | ✅ Yes                  | OS authenticity anchor                      |
| `gallery`      | ✅ Yes                  | Visual appeal, matches screenshot           |
| `resume`       | ❌ No (pinned to About) | Accessed via About or Files                 |
| `contact`      | ❌ No                   | Accessed via About or command palette       |
| `terminal`     | ❌ No                   | Power-user discovery via command palette    |
| `achievements` | ❌ No                   | Secondary content                           |
| `settings`     | ❌ No                   | Accessed via system tray or command palette |

---

## 5. Shared Data Models

### 5.1 Project Data (`src/data/projects/projects.json`)

Already has a validated Zod schema in `src/shared/schemas/project.schema.ts`. The schema is production-ready. **What is missing is real content.**

The following fields are consumed by which apps:

| Field              |   Projects App   | Resume App  |     About App      |
| ------------------ | :--------------: | :---------: | :----------------: |
| `title`            |        ✅        |     ✅      | ✅ (current focus) |
| `shortDescription` |   ✅ (sidebar)   |     ✅      |         ✅         |
| `fullDescription`  |   ✅ (detail)    |      —      |         —          |
| `techStack`        |        ✅        |     ✅      |         —          |
| `featured`         |        —         | ✅ (filter) |  ✅ (1 featured)   |
| `status`           |    ✅ (badge)    |     ✅      |         —          |
| `timeline`         |        ✅        |     ✅      |         —          |
| `role`             |        ✅        |     ✅      |         —          |
| `reelSlides`       | ✅ (reel player) |      —      |         —          |
| `githubUrl`        |        ✅        |     ✅      |         —          |
| `liveUrl`          |        ✅        |     ✅      |         —          |
| `thumbnail`        |   ✅ (sidebar)   |     ✅      |         —          |
| `tags`             |   ✅ (filters)   |     ✅      |         —          |

**Required action**: At minimum 3–4 real project entries with real reel slides must be added before the Projects App or Resume App can be built. The current single sample entry is insufficient for testing layout.

### 5.2 Skills Data (`src/data/skills.ts`) — NEW

No schema exists yet. Must be created before Skills App is built.

**Proposed structure**:

```typescript
export type SkillCategory = {
  id: string; // "frontend", "backend", "mobile", etc.
  label: string; // Display name: "Frontend", "Backend"
  icon: string; // Emoji or icon path
  skills: Skill[];
};

export type Skill = {
  name: string; // "React", "Next.js", "TypeScript"
  level: "expert" | "proficient" | "learning";
  years?: number; // Approximate years of experience
  tags?: string[]; // "framework", "language", "tool"
};
```

**Approved categories** (from `desktop-home.png` Skills window cards):

- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL
- Mobile: React Native
- Tools & Other: Git, REST APIs, GraphQL, Zod

**Design constraint**: Skill cards MUST NOT use progress bars or percentage fills. Level is indicated by badge text only.

### 5.3 Resume Data (`src/data/resume.ts`) — NEW

Required by Resume App. Separate from project data.

**Proposed structure**:

```typescript
export type ResumeData = {
  name: string;
  title: string;
  summary: string;
  contact: {
    email: string;
    github: string;
    linkedin?: string;
    location: string;
  };
  experience: WorkExperience[];
  education: Education[];
  certifications?: Certification[];
};

export type WorkExperience = {
  company: string;
  role: string;
  period: string; // "Jan 2023 – Present"
  location: string;
  highlights: string[]; // Bullet points
};
```

**Design constraint**: Resume App renders this as a styled OS document, not a website resume. It should look like a document viewer inside a window, not a scrolling webpage.

### 5.4 Achievements Data (`src/data/achievements.ts`) — NEW

**Proposed structure**:

```typescript
export type Achievement = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date
  icon: string; // Emoji or asset path
  category: "project" | "certification" | "contribution" | "recognition";
};
```

---

## 6. Reusable Components

The following shared UI components should be built in `src/shared/ui/` **before** app implementation begins. These components eliminate duplication and enforce design consistency across all Phase 3 apps.

### 6.1 `AppSidebar` (`src/shared/ui/AppSidebar.tsx`)

Used by: Projects, Skills, Files, Settings

**API**:

```tsx
<AppSidebar>
  <AppSidebarSection label="PROJECTS">
    <AppSidebarItem
      icon="📁"
      label="My OS Portfolio"
      active={true}
      onClick={...}
    />
  </AppSidebarSection>
</AppSidebar>
```

**Design spec**:

- Width: `240px` fixed
- Background: `var(--color-bg-sidebar)`
- Right border: `1px solid var(--color-border)`
- Section label: 11px, uppercase, `var(--color-text-label)`, `letter-spacing: 0.08em`
- Section label top margin: `24px` between sections
- Item height: `40px`, padding: `0 12px`
- Item layout: `[Icon 18px] [Label 13px]` with gap
- Active item: `background: var(--color-bg-sidebar-active)`, white text, `border-radius: 6px`
- Hover item: `background: var(--color-surface-1)`

### 6.2 `AppContentArea` (`src/shared/ui/AppContentArea.tsx`)

Used by: All Layout B apps

**API**:

```tsx
<AppContentArea>{children}</AppContentArea>
```

**Design spec**:

- Fills remaining width in a flex row
- `overflow-y: auto`
- Background: `rgba(18, 25, 40, 0.8)` (App Content Panel spec)
- Padding: `20px`
- No border (window chrome provides the outer frame)

### 6.3 `AppTagBadge` (`src/shared/ui/AppTagBadge.tsx`)

Used by: About, Projects, Skills, Resume

**API**:

```tsx
<AppTagBadge variant="accent" label="Software Developer" />
<AppTagBadge variant="neutral" label="React" />
<AppTagBadge variant="status" label="completed" />
```

**Design spec**:

- `accent`: `background: rgba(16, 185, 129, 0.2)`, text: `var(--color-accent)`, border: `1px solid rgba(16, 185, 129, 0.3)`
- `neutral`: `background: var(--color-surface-2)`, text: `var(--color-text-secondary)`
- `status`: color-coded by status value
- Height: `22px`, padding: `0 8px`, border-radius: `4px`
- Font: 11px–12px, weight 500

### 6.4 `AppInfoCard` (`src/shared/ui/AppInfoCard.tsx`)

Used by: About, Contact

**API**:

```tsx
<AppInfoCard title="Connect" icon="🔗">
  <AppInfoRow icon="✉️" label="Email" value="jainil@example.com" />
  <AppInfoRow icon="📍" label="Location" value="India" />
</AppInfoCard>
```

**Design spec**:

- Card: `background: var(--color-bg-card)`, border: `1px solid var(--color-border)`, `border-radius: var(--radius-card)`, padding `16px 20px`
- Row layout: icon (18px) + label (12px muted) + value (13px primary), `height: 36px`
- Row separator: `border-bottom: 1px solid var(--color-border)` (except last row)

### 6.5 `AppStatusBar` (`src/shared/ui/AppStatusBar.tsx`)

Used by: Files App (bottom bar showing item count, sync status)

**API**:

```tsx
<AppStatusBar left="5 items, 1 selected" right="☁ Synced" />
```

**Design spec**:

- Height: `28px`
- Background: `var(--color-bg-sidebar)` (slightly darker than content)
- Border-top: `1px solid var(--color-border)`
- Font: 11px, `var(--color-text-muted)`

---

## 7. Recruiter-Critical Applications — Detailed Specifications

These four apps directly affect a recruiter's perception of Jainil within the first 2–5 minutes of use. They must be built first and built correctly.

---

### 7.1 About App

**Current state**: Existing stub in `src/apps/about/index.tsx` — minimal placeholder. **Must be fully rewritten.**

**Window config**:

- `defaultSize: { width: 720, height: 560 }`
- Window title: `"About"` with person/info icon
- Layout: **Layout A (Profile / Dashboard)**

**Required sections** (per `DESIGN_SYSTEM.md § 8`):

```
┌─────────────────────────────────────────────────────┐
│  [Avatar 60px]  Jainil Pandya                       │
│                 Software Developer                   │  ← Profile Card (hero)
│                 [React] [Next.js] [React Native]     │
│                 Bio text (2–3 sentences)             │
│                 [View Resume →]  [Contact →]         │
├──────────────────────────┬──────────────────────────┤
│  Connect                 │  Current Focus            │  ← 2-column Info Cards
│  ✉ Email                 │  📁 [Active Project]      │
│  🐙 GitHub               │  Timeline: "2024–2025"   │
│  📍 Location             │  Status: In Progress      │
│  💼 LinkedIn             │                           │
└──────────────────────────┴──────────────────────────┘
```

**Data sources**:

- Static: owner name, title, bio, contact links (hardcoded in component or `src/data/resume.ts`)
- Dynamic: current focus project pulled from `projects.json` where `featured: true`

**Cross-app interactions**:

- "View Resume" button → opens Resume App via `openWindow()` + `setActiveApp()`
- "Contact" button → opens Contact App via `openWindow()` + `setActiveApp()`

**Design constraints**:

- Avatar is a circular image, ~60px diameter (generated or real photo)
- Role tags use `AppTagBadge` with `variant="accent"`
- No scrolling hero section — content fits without vertical scroll at 720×560
- Accent color on CTA buttons: `var(--color-accent)`

---

### 7.2 Projects App

**Current state**: Stub in `src/apps/projects/index.tsx` — Layout B skeleton exists but uses ad-hoc inline styles. **Must be rewritten** using shared UI components and real data.

**Window config**:

- `defaultSize: { width: 960, height: 640 }`
- Window title: `"Projects"` with folder icon
- Layout: **Layout B (Master-Detail with Sidebar)**

**Required sections**:

```
┌──────────────────────────────────────────────────────────────┐
│  [Filter: All | Featured | Mobile | Web]    [🔍 Search]      │  ← Top filter bar
├────────────────────┬─────────────────────────────────────────┤
│  SIDEBAR           │  DETAIL AREA                            │
│                    │                                         │
│  [Thumb] Title     │  [Cover Image or Reel Player]           │
│    Category • Year │                                         │
│                    │  Project Title                          │
│  [Thumb] Title     │  Category • Timeline • Role             │
│    Category • Year │                                         │
│  ...               │  Description (full)                     │
│                    │                                         │
│                    │  [Tech Stack badges]                    │
│                    │                                         │
│                    │  Key Features (bullet list)             │
│                    │                                         │
│                    │  [GitHub ↗]  [Live Demo ↗]              │
└────────────────────┴─────────────────────────────────────────┘
```

**Data sources**:

- `src/data/projects/projects.json` — **requires 3–4 real project entries**
- `src/features/reels/index.tsx` — reel player inside detail area

**Sub-component: Reel Player** (inside Projects App detail area):

- Navigation: prev/next arrow buttons
- Keyboard: left/right arrow keys when focused
- Touch: swipe left/right
- Slide count indicator: dots or "2 / 5" label
- Slide content: video (HTML5 `<video>`) or image (`<img>`)
- Slide caption: title + description below media

**Sidebar item design**:

- Thumbnail: 40×40px rounded image (project `thumbnail` field)
- Title: 13px, 600 weight
- Category + Year: 11px, muted
- Active: `var(--color-bg-sidebar-active)` highlight

**Cross-app interactions**:

- GitHub/Live links → open in Browser App (not a new browser tab, per OS contract)

**Filter bar**:

- Horizontal pill tabs: All, Featured, Mobile, Web
- Active filter highlights with accent color
- Search input: OS-style (see `DESIGN_SYSTEM.md § 6 Inputs`)

---

### 7.3 Resume App

**Current state**: `src/apps/resume/` — empty directory stub.

**Window config**:

- `defaultSize: { width: 820, height: 720 }`
- Window title: `"Resume"` with document icon
- Layout: **Layout A (document variant)** — full-width scrollable document

**Design approach**: OS document viewer, NOT a website resume page.

The Resume App renders a structured document that looks like it was opened in a document viewer application. Think: a clean, typeset document rendered inside a dark window — not a web page.

**Required sections**:

```
┌─────────────────────────────────────────────────────────────┐
│  [↓ Download PDF]  [Share]                 [Print]          │  ← Action bar (top)
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  JAINIL PANDYA                  Software Developer  │   │
│  │  email • github • location                          │   │
│  │                                                     │   │
│  │  ── EXPERIENCE ────────────────────────────────     │   │
│  │  Company Name                         Period        │   │
│  │  Role Title • Location                              │   │
│  │  • Highlight 1                                      │   │
│  │  • Highlight 2                                      │   │
│  │                                                     │   │
│  │  ── EDUCATION ─────────────────────────────────     │   │
│  │  ...                                                │   │
│  │                                                     │   │
│  │  ── SKILLS ────────────────────────────────────     │   │
│  │  Frontend: React, Next.js, TypeScript               │   │
│  │  ...                                                │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Document card styling**:

- Document container: `background: rgba(255,255,255,0.03)`, `border: 1px solid var(--color-border)`, `border-radius: 8px`, padding `32px 40px`
- Section headers: 11px, uppercase, `var(--color-text-label)`, with horizontal rule
- Body text: 13px, `var(--color-text-secondary)`
- Name/title: 24px, 700, `var(--color-text-primary)`

**Data source**: `src/data/resume.ts` (new)

**Cross-app interactions**:

- "Download PDF" → links to a static PDF asset in `/public/`
- None of the links inside the resume open external URLs directly (must route through Browser App or standard `target="_blank"` on PDF only)

---

### 7.4 Contact App

**Current state**: `src/apps/contact/` — empty directory stub.

**Window config**:

- `defaultSize: { width: 640, height: 480 }`
- Window title: `"Contact"` with envelope icon
- Layout: **Layout A (compact)** — hero + form below

**Required sections**:

```
┌────────────────────────────────────────────────────┐
│  📬 Get In Touch                                   │  ← Hero label (not full-width card)
│  "Open to new opportunities and collaborations"    │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  Name  ________________________              │  │
│  │  Email ________________________              │  │
│  │  Message ______________________              │  │
│  │          ______________________              │  │
│  │          ______________________              │  │
│  │                                              │  │
│  │  [Send Message →]                            │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  Or reach directly:                                │
│  ✉ jainil@example.com   🐙 github.com/Jainil-02   │
└────────────────────────────────────────────────────┘
```

**Form fields** (OS-style inputs):

- Background: `rgba(255,255,255,0.04)`
- Border: `1px solid var(--color-border)`
- Border-radius: `8px`
- Focus border: `var(--color-accent)` (teal glow)
- Label: 11px, uppercase, muted — above each input
- Placeholder: muted text color

**Form behavior**:

- Client-side validation only (no server action required for Phase 3)
- Success state: shows a confirmation message inside the window, replacing the form
- Error state: inline field validation messages in `var(--color-text-muted)`

**Submit implementation options** (decide before build):

- Option A: `mailto:` link — simplest, works without backend
- Option B: Static form service (Formspree, Web3Forms) — recommended for actual delivery
- Option C: Next.js Server Action — complex, not required for Phase 3

> **Open Question**: Which contact form submission method should be used? Recommendation is Option B (static form service) to ensure real message delivery without backend complexity.

---

## 8. Secondary Applications — Specifications

### 8.1 Skills App

**Window config**: `defaultSize: { width: 840, height: 580 }` — Layout B

**Sidebar**: Categories (Frontend, Backend, Mobile, Tools & Other)

**Content area**: Card grid of skills within selected category. Each skill card shows:

- Skill name (14px, 600)
- Level badge: `AppTagBadge` variant `accent` for expert, `neutral` for proficient
- Years indicator: 12px muted text

**Design constraint**: No progress bars. No gradient fills on skill indicators. Level shown as text badge only.

---

### 8.2 Files App

**Window config**: `defaultSize: { width: 1100, height: 700 }` — Layout B (matches `file-app.png`)

**This is the highest OS-fidelity app.** It must match `docs/design/file-app.png` as closely as possible.

**Sidebar sections**:

- LOCATIONS: Home, Recent, Starred
- FOLDERS: Documents, Downloads, Pictures, Projects

**Content area**:

- Breadcrumb navigation: `ApexOS > Home`
- View toggle: grid/list icons (top right)
- Folder grid: colored folder icons (40px), label, item count
- File grid: file type icon, name, size, date
- Bottom status bar: "5 items, 1 selected • ☁ Synced" (use `AppStatusBar`)

**Data**: Static simulation — hardcoded folder/file structure that maps to the portfolio content. e.g., "Projects" folder contains the actual project entries; "Documents" contains Resume PDF.

**Cross-app interactions**:

- Opening "Resume.pdf" → opens Resume App
- Opening a project folder → opens Projects App with that project selected

---

### 8.3 Browser App

**Window config**: `defaultSize: { width: 1000, height: 700 }` — Full content layout (no sidebar)

**Required**: Address bar at top of content area (OS browser chrome), not just an iframe.

```
┌────────────────────────────────────────────────────────────┐
│  ← → ↻   [ https://github.com/Jainil-02 ···············  ]│  ← Browser address bar
├────────────────────────────────────────────────────────────┤
│                                                            │
│   <iframe src={url} />                                     │
│   or static content renderer                               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Address bar design**:

- Background: `var(--color-surface-2)`
- Border-radius: `8px`
- Back/forward/refresh buttons: icon buttons with hover states
- URL text: 13px, `var(--color-text-primary)`

**Launch context**: The Browser App should accept an initial URL prop from the window manager. When opened from another app (e.g., Projects App's "Live Demo" button), it should open to that URL.

**Window state extension needed**: `AppMeta` or `WindowState` must support `initialProps` to pass URL context when opening the Browser App programmatically.

---

### 8.4 Gallery App

**Window config**: `defaultSize: { width: 900, height: 640 }` — Full grid layout

**Content**: Image grid of portfolio screenshots, project visuals, or design assets.

- Thumbnail grid: consistent sizes, 4-column layout
- Hover: overlay with filename + date
- Click: lightbox or full-screen preview overlay (within the window, not a modal)

**Data**: Static array of image paths in `src/data/gallery.ts`

---

### 8.5 Terminal App

**Window config**: `defaultSize: { width: 760, height: 480 }` — Full content, dark terminal

**Font**: `var(--font-mono)` (`JetBrains Mono`, `Fira Code`, monospace)

**Behavior**: Simulated terminal. Supports a fixed set of commands:

| Command         | Output                                       |
| --------------- | -------------------------------------------- |
| `help`          | Lists available commands                     |
| `whoami`        | Prints owner info                            |
| `ls projects`   | Lists project names                          |
| `cat resume`    | Prints text version of resume                |
| `open about`    | Launches About App via window manager        |
| `open projects` | Launches Projects App                        |
| `open contact`  | Launches Contact App                         |
| `clear`         | Clears terminal output                       |
| `neofetch`      | ASCII art system info block (fun easter egg) |

**Design**: Near-black background (`#0a0d12`), teal-green text (`var(--color-accent)`), prompt symbol `apex@os:~$`, typed output with simulated character-by-character rendering.

---

### 8.6 Achievements App

**Window config**: `defaultSize: { width: 720, height: 560 }` — Layout A (card grid)

**Content**: Achievement cards in a 2–3 column grid.

Each card:

- Icon (emoji or SVG): 32px
- Title: 14px, 600
- Description: 13px, muted
- Date: 12px, muted
- Category badge: `AppTagBadge variant="neutral"`

**Design constraint**: Cards must feel like OS notification cards, not gamification badges with stars and gradients.

---

## 9. Implementation Roadmap

### Stage 0 — Pre-Phase-3 Infrastructure (MUST COMPLETE FIRST)

All items are blocking. No app can be built until Stage 0 is complete.

| #   | Task                                                                         | File                                                                                                         | Priority    |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------- |
| 0.1 | Load Inter font globally                                                     | `src/app/globals.css`                                                                                        | 🔴 Blocking |
| 0.2 | Define all CSS custom property tokens                                        | `src/app/globals.css`                                                                                        | 🔴 Blocking |
| 0.3 | Fix window control button order (red=close, yellow=minimize, green=maximize) | `src/features/window-chrome/index.tsx`                                                                       | 🔴 Blocking |
| 0.4 | Add `defaultSize` to `AppMeta` and wire through `WindowChrome`               | `src/features/app-registry/index.ts`, `src/features/window-chrome/index.tsx`, `src/shells/desktop/index.tsx` | 🔴 Blocking |
| 0.5 | Add `pinned` flag to `AppMeta` and filter taskbar display                    | `src/features/app-registry/index.ts`, `src/shells/desktop/index.tsx`                                         | 🔴 Blocking |

---

### Stage 1 — Shared UI Components (Build before apps)

| #   | Component                                             | File                               | Used By                           |
| --- | ----------------------------------------------------- | ---------------------------------- | --------------------------------- |
| 1.1 | `AppSidebar` + `AppSidebarSection` + `AppSidebarItem` | `src/shared/ui/AppSidebar.tsx`     | Projects, Skills, Files, Settings |
| 1.2 | `AppContentArea`                                      | `src/shared/ui/AppContentArea.tsx` | All Layout B apps                 |
| 1.3 | `AppTagBadge`                                         | `src/shared/ui/AppTagBadge.tsx`    | About, Projects, Skills, Resume   |
| 1.4 | `AppInfoCard` + `AppInfoRow`                          | `src/shared/ui/AppInfoCard.tsx`    | About, Contact                    |
| 1.5 | `AppStatusBar`                                        | `src/shared/ui/AppStatusBar.tsx`   | Files                             |

---

### Stage 2 — Data Content (Build alongside or before apps)

| #   | Task                                               | File                              |
| --- | -------------------------------------------------- | --------------------------------- |
| 2.1 | Add 3–4 real project entries with real reel slides | `src/data/projects/projects.json` |
| 2.2 | Create skills static data                          | `src/data/skills.ts` (new)        |
| 2.3 | Create resume static data                          | `src/data/resume.ts` (new)        |
| 2.4 | Create achievements static data                    | `src/data/achievements.ts` (new)  |
| 2.5 | Create gallery image manifest                      | `src/data/gallery.ts` (new)       |

---

### Stage 3 — Recruiter-Critical Apps (Priority Wave 1)

Build these four apps in this exact order. Each depends on Stage 0, Stage 1, and Stage 2 being complete.

| #   | App                             | File                          | Window Size | Reason for Order                                          |
| --- | ------------------------------- | ----------------------------- | ----------- | --------------------------------------------------------- |
| 3.1 | **About App** (full rewrite)    | `src/apps/about/index.tsx`    | 720×560     | Simplest layout, no cross-app deps, recruiter entry point |
| 3.2 | **Contact App** (new)           | `src/apps/contact/index.tsx`  | 640×480     | Standalone form, no dependencies                          |
| 3.3 | **Resume App** (new)            | `src/apps/resume/index.tsx`   | 820×720     | Requires `resume.ts` data; About links to it              |
| 3.4 | **Projects App** (full rewrite) | `src/apps/projects/index.tsx` | 960×640     | Requires reel player + real project data                  |

**Reel Player** (`src/features/reels/index.tsx`) must be implemented before step 3.4. It can be built in parallel with step 3.1–3.3.

---

### Stage 4 — OS Authenticity Apps (Priority Wave 2)

| #   | App                   | File                         | Window Size | Reason for Order                           |
| --- | --------------------- | ---------------------------- | ----------- | ------------------------------------------ |
| 4.1 | **Skills App** (new)  | `src/apps/skills/index.tsx`  | 840×580     | Simple Layout B, static data               |
| 4.2 | **Browser App** (new) | `src/apps/browser/index.tsx` | 1000×700    | Enables Projects + Files cross-app linking |
| 4.3 | **Files App** (new)   | `src/apps/files/index.tsx`   | 1100×700    | Requires Browser App for document links    |

---

### Stage 5 — Secondary Apps (Priority Wave 3)

| #   | App                  | File                              | Window Size |
| --- | -------------------- | --------------------------------- | ----------- |
| 5.1 | **Gallery App**      | `src/apps/gallery/index.tsx`      | 900×640     |
| 5.2 | **Terminal App**     | `src/apps/terminal/index.tsx`     | 760×480     |
| 5.3 | **Achievements App** | `src/apps/achievements/index.tsx` | 720×560     |

---

### Stage 6 — Registry and Taskbar Integration

After each app is implemented, register it in `src/features/app-registry/index.ts` with correct `defaultSize` and `pinned` values. **Do not register an app before it has real content.**

---

### Stage 7 — Post-Implementation

| #   | Task                                                                                               |
| --- | -------------------------------------------------------------------------------------------------- |
| 7.1 | Full design consistency audit — compare all running apps against `docs/design/` screenshots        |
| 7.2 | Recruiter flow test: Boot → Lock → Desktop → About → Projects → Resume (3-minute path)             |
| 7.3 | Window resize handles added to `WindowChrome` (right edge, bottom edge, bottom-right corner)       |
| 7.4 | Settings App sidebar cleanup — remove "Home" and "Projects" sidebar items, use category navigation |
| 7.5 | Command palette app list updated to include all new apps                                           |
| 7.6 | Taskbar pinned vs. running indicator distinction implemented                                       |

---

## 10. Applications to Delay

The following decisions reflect what can be deferred without breaking the recruiter experience:

| App / Feature                  | Delay Reason                                                                                             | Minimum Viable Alternative                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Browser App (full iframe)      | iframe embedding is blocked by most major sites' `X-Frame-Options`; a full browser simulation is complex | Build Browser App as a static URL viewer with a styled address bar and a "this page cannot be embedded" fallback message |
| Terminal App                   | No recruiter-critical path runs through the terminal; it is a delight feature                            | Implement after Wave 2; accessible only via command palette                                                              |
| Achievements App               | Content depends on what achievements exist; risks looking sparse                                         | Implement last; curate 6–8 high-quality achievements before building                                                     |
| Window resize handles          | Drag-to-resize is complex and has edge case interactions with dragging                                   | Delay to Stage 7; maximizing is sufficient for Phase 3                                                                   |
| Real form submission (Contact) | Backend/third-party service integration adds scope                                                       | Use `mailto:` fallback in Phase 3; upgrade to Formspree in Phase 4                                                       |
| Reel player video support      | Video files add significant bundle weight and hosting complexity                                         | Start with image-only reel slides; add video support in Phase 4                                                          |

---

## 11. Design Governance Checklist (Per App)

Every agent implementing a Phase 3 app MUST verify all of the following before marking it complete:

- [ ] Read `docs/DESIGN_SYSTEM.md` before writing any UI code
- [ ] Uses only `var(--color-*)` tokens, no hardcoded hex values
- [ ] Uses `var(--font-sans)` — no other font families introduced
- [ ] Renders inside `WindowChrome` — no self-rendered title bar or frame
- [ ] Follows the correct layout pattern (Layout A or Layout B) for this app
- [ ] Window size matches the `defaultSize` specified in this document
- [ ] No website-style patterns: no navbars, footers, hero images, or scrolling landing pages inside the window
- [ ] No font sizes larger than 32px inside app content
- [ ] All interactive elements have unique, descriptive IDs
- [ ] No external links open in the same window — use Browser App or `target="_blank"` for PDF only
- [ ] Shared components (`AppSidebar`, `AppTagBadge`, etc.) used where applicable — no duplicated implementations
- [ ] App registered in `src/features/app-registry` after implementation with correct `defaultSize` and `pinned` flag

---

## 12. Open Questions

The following questions must be resolved before or during implementation:

| #   | Question                                                                                    | Decision Required By            |
| --- | ------------------------------------------------------------------------------------------- | ------------------------------- |
| Q1  | Which contact form submission method: `mailto:`, Formspree, or Server Action?               | Before Contact App (Stage 3.2)  |
| Q2  | Browser App approach: real iframe with fallback, or static URL renderer only?               | Before Browser App (Stage 4.2)  |
| Q3  | Resume delivery: PDF in `/public/` for download, or render-only from `resume.ts` data?      | Before Resume App (Stage 3.3)   |
| Q4  | Reel player video support: image-only for Phase 3, or include `<video>` support?            | Before Projects App (Stage 3.4) |
| Q5  | Avatar image for About App: real photo, generated avatar, or initials-based placeholder?    | Before About App (Stage 3.1)    |
| Q6  | Files App: static simulation only, or does it link to real OS file-system via browser APIs? | Before Files App (Stage 4.3)    |

---

_Document created: 2026-06-14. Authority level: Planning — does not override DESIGN_SYSTEM.md or AGENT_RULES.md._
_Update this document when open questions are resolved or when build order changes._
