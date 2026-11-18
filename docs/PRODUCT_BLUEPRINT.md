# PRODUCT BLUEPRINT

> **Authority**: This document is the highest-level product specification for My OS Portfolio (ApexOS).
> It answers one question: *"What should My OS Portfolio become when it is finished?"*
> Every future AI agent, contributor, or collaborator should be able to read only this document and fully understand the vision, UX philosophy, every application, every interaction, and the expected user experience.
>
> **This document does not replace any existing document.** It connects them into one coherent product vision and provides the "why" behind the "what." For technical implementation details, see the cross-references in each section.
>
> **Version**: 1.0 — created 2026-06-27
> **Owner**: Jainil Pandya
> **Product Name**: ApexOS (My OS Portfolio)

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Product Principles](#2-product-principles)
3. [Recruiter Journey](#3-recruiter-journey)
4. [Complete Product Map](#4-complete-product-map)
5. [Application Relationships](#5-application-relationships)
6. [Global User Experience](#6-global-user-experience)
7. [Design Philosophy](#7-design-philosophy)
8. [Content Strategy](#8-content-strategy)
9. [Wow Moments](#9-wow-moments)
10. [Success Criteria](#10-success-criteria)
11. [Future Vision](#11-future-vision)

---

## 1. Product Vision

### What It Is

My OS Portfolio — branded as **ApexOS** — is a browser-based personal operating system that serves as the primary portfolio for **Jainil Pandya**, a Software Developer specializing in React, Next.js, and React Native.

It is not a website. It is not a website that looks like an OS. It is an actual simulated desktop operating system, built entirely in the browser using Next.js, React, and TypeScript, that happens to contain a portfolio inside it.

When a recruiter visits the URL, they do not land on a hero section. They watch a boot animation. They are greeted by a lock screen. They click to unlock and arrive at a desktop — with a wallpaper, a taskbar, desktop icons, and floating app windows. Everything a recruiter needs to evaluate Jainil is inside an application window. Nothing exists outside of one.

### Why It Exists

Traditional portfolios are anonymous. Every engineer has a GitHub link, a contact form, and a list of projects on a page. The format is identical across hundreds of thousands of portfolios. None of them are remembered.

ApexOS exists because Jainil believes that *how* you present your work is itself a signal of what you can build. A recruiter who visits ApexOS does not read about a developer who understands UX and product thinking — they *experience* it. The portfolio is the proof of skill, not a description of it.

### Why It Is Different

| Traditional Portfolio | ApexOS |
|---|---|
| Single scrollable page | Fully interactive OS desktop |
| Static layout | Floating, draggable, resizable windows |
| Generic card components | Purpose-built applications with real UX |
| HTML navigation | Window manager + app registry |
| One visit, one view | Multiple apps = multiple experiences |
| Forgettable | Memorable: *"I used Jainil's OS"* |

### The Recruiter-First Philosophy

Every product decision is filtered through one question: *"Does this help a recruiter evaluate Jainil within 2–5 minutes?"*

The recruiter is the primary user. Recruiters are busy, they are assessing dozens of candidates, and they will not discover hidden features. Every important piece of information must be surfaced immediately. The experience must delight without requiring effort.

ApexOS is optimized for the recruiter who:
- Has 3 minutes to spend on a portfolio
- Is looking for evidence of technical skill, product thinking, and attention to detail
- Has seen hundreds of traditional portfolios and will remember this one

### The Operating System Instead of Website Concept

The core product decision — building an OS instead of a website — unlocks three things simultaneously:

1. **Demonstration** — An OS is a complex, multi-layered software product. Building one proves frontend engineering skill, state management expertise, and component architecture discipline without needing to list it in a bio.

2. **Narrative** — The OS metaphor creates a coherent product story. "I built a full operating system experience in the browser" is a more compelling talking point than "I built a portfolio site."

3. **Differentiation** — There is no other portfolio on the market like this. It will be remembered and shared.

### Long-Term Vision

ApexOS is not a one-time project. It is a living platform.

Today it is a portfolio OS with 11 apps displaying professional work. In Phase 4, it gains AI integration — an assistant that can answer questions about Jainil, help recruiters navigate, and generate live summaries. In Phase 5, it becomes a fully managed knowledge base and content platform, where AI can help Jainil add case studies, update project reels, and maintain the OS in real time.

The long-term vision is a personal AI-native operating system that continuously represents Jainil's professional evolution.

---

## 2. Product Principles

These are the permanent, immutable product rules. They may not be overridden by any implementation decision, any AI agent, or any design iteration. They exist because every individual rule has been validated by experience — violating any one of them produces a product that looks or behaves like a traditional portfolio website.

### P-1: OS First, Website Never

Every element of the product must exist inside the OS metaphor. There are no standalone webpage sections. There are no HTML navigation bars at the top. There are no scrolling landing pages. There are no footer links. Everything — every piece of information, every interaction, every piece of content — lives inside an application window running on the desktop.

If a design choice would look at home on a typical portfolio website, it does not belong in ApexOS.

### P-2: Every Screen Belongs Inside an Application

There is no content that exists "between" apps. The desktop surface holds only: wallpaper, a grid of desktop icons, and floating app windows. The taskbar holds pinned icons and system controls. There is nothing else. No global header. No intro text. No floating contact card.

If information needs to be shown to a recruiter, it belongs inside the appropriate application.

### P-3: Desktop Behaves Like a Real Operating System

The desktop is not a layout. It is a system.

- Multiple windows can be open simultaneously.
- Windows can be dragged, resized, minimized, and maximized.
- A taskbar shows running and pinned applications.
- The system has a clock, a notification tray, and a command palette.
- Apps communicate with each other through a window manager, not props.
- Settings persist across sessions via localStorage.

If the desktop loses any of these behaviors, it is no longer an OS — it is a webpage with floating boxes.

### P-4: Every Interaction Demonstrates Engineering Quality

The polish is the message. A recruiter who experiences:
- Smooth window drag at 60fps
- Keyboard navigation across apps
- A command palette that finds apps instantly
- Notifications that appear, persist, and dismiss cleanly

...has seen evidence of frontend engineering craft without needing to read a single line of the CV.

Every interaction must be implemented completely. No placeholder behavior. No "TODO" states visible to users.

### P-5: Consistency Over Creativity

Individual apps may not introduce visual styles that are not in the Design System. This applies to:
- Color choices (only `var(--color-*)` tokens)
- Typography (only the documented type scale)
- Spacing (only the documented spacing scale)
- Component patterns (sidebar, card, badge — always shared components)

Consistency across 11 apps is harder than building one beautiful app. Consistency is the goal because it is what makes the product feel like a single system, not a collection of independent screens.

### P-6: Performance Over Visual Excess

Animations exist to communicate state changes, not to entertain. Every animation in ApexOS has a purpose:
- Window open/close communicates creation/destruction
- Window minimize communicates hide/retrieve
- Notification fade-in communicates new information
- Boot animation communicates system initialization

Animations that exist purely for aesthetics (infinite looping backgrounds, parallax effects, continuous transitions) are prohibited. They add visual noise and reduce performance.

### P-7: Real Usability Over Gimmicks

The OS metaphor must be functional, not theatrical. A feature that looks like an OS feature but does not work like one harms the product more than not having the feature at all.

Examples of gimmicks to avoid:
- A terminal that only shows a welcome message
- A browser that cannot actually navigate
- A file manager that shows folders but cannot open them
- A notification badge that never increments

If a feature is implemented, it must work correctly. If it cannot work correctly, it should not be visible to users.

---

## 3. Recruiter Journey

This is the ideal experience for a recruiter visiting ApexOS for the first time. Every step is a deliberate design decision.

```
BOOT SCREEN  (2–3 seconds)
     │
     │  What it shows: ApexOS isometric cube logo, "Initializing System...",
     │  progress bar, Jainil's name in small caps.
     │  What it communicates: This is a real OS. Something serious was built here.
     ▼

LOCK SCREEN  (immediate on unlock trigger)
     │
     │  What it shows: Live clock, full date, recruiter notification pill
     │  ("2 new messages from Recruiters"), "Unlock Device" button.
     │  What it communicates: The system expects you. You are the audience.
     │  The clock is real — it shows the recruiter's actual time.
     ▼

DESKTOP  (the OS home)
     │
     │  What it shows: Deep Slate Waves wallpaper, desktop icon grid (top-left),
     │  bottom glassmorphic taskbar, clock, notification tray.
     │  What it communicates: This looks like a computer, not a website.
     │  The recruiter can explore freely.
     ▼

ABOUT APP  (first recruiter action)
     │
     │  How reached: Double-clicking the "About" icon or via taskbar.
     │  What it shows: Profile card (name, title, bio, tech stack tags),
     │  Connect card (email, GitHub, LinkedIn, location),
     │  Current Focus card (active project with role and timeline).
     │  What it communicates: Name, role, tech stack, contact info —
     │  everything a recruiter needs in the first 30 seconds.
     │  CTA buttons: "View Resume" → opens Resume App,
     │               "Get in Touch" → opens Contact App.
     ▼

PROJECTS APP  (portfolio depth)
     │
     │  How reached: Via taskbar or "View Projects" in About.
     │  What it shows: Sidebar project list with search and filters.
     │  Detail area with cover image, description, tech stack, features,
     │  GitHub and Live Demo links, and the Reel Player tab.
     │  What it communicates: Here is my work, in detail, with visual proof.
     │  The Reel Player shows screenshots and videos like a product pitch.
     ▼

RESUME APP  (formal credentials)
     │
     │  How reached: Via "View Resume" CTA in About, or via taskbar.
     │  What it shows: A typeset document — experience, education,
     │  skills summary, certifications — with "Download PDF" and "Print" actions.
     │  What it communicates: Here is the formal record for your ATS.
     │  This is the same resume they would receive as a PDF attachment.
     ▼

CONTACT APP  (action)
     │
     │  How reached: Via "Get in Touch" CTA in About, or Command Palette.
     │  What it shows: OS-styled contact form with name, email, message fields.
     │  Direct channel links (email, GitHub, LinkedIn) for immediate action.
     │  What it communicates: Reaching out is easy. You have options.
     ▼

SKILLS APP  (technical depth)
     │
     │  How reached: Via taskbar or Command Palette.
     │  What it shows: Category sidebar (Frontend, Backend, Mobile, Tools),
     │  skill cards with Expert/Proficient/Learning level badges,
     │  years of experience, and context highlights.
     │  What it communicates: Here is the specific technology depth.
     │  No arbitrary percentages — honest, labeled proficiency levels.
     ▼

FILES APP  (OS authenticity anchor)
     │
     │  How reached: Via taskbar or Command Palette.
     │  What it shows: Full file explorer — sidebar with Locations and Folders,
     │  breadcrumb navigation, folder and file grid, bottom status bar.
     │  Portfolio content appears as files: Resume.pdf in Documents,
     │  project folders in Projects, images in Pictures.
     │  What it communicates: This is a real system. Content is organized.
     │  Double-clicking Resume.pdf opens the Resume App.
     ▼

TERMINAL  (power-user discovery)
     │
     │  How reached: Via Command Palette (Ctrl+K → "Terminal") or desktop icon.
     │  What it shows: Monospaced dark terminal. Commands: whoami, ls projects,
     │  cat resume, open about, neofetch. ASCII art easter egg.
     │  What it communicates: Attention to craft. Technical personality.
     │  A feature built for the engineer reviewing the portfolio, not just HR.
     ▼

COMMAND PALETTE  (system-level discovery)
     │
     │  How triggered: Ctrl+K / Cmd+K from anywhere on the desktop.
     │  What it shows: Full-screen overlay, search field, filtered app list.
     │  Keyboard-navigable, launches any app instantly.
     │  What it communicates: This system has keyboard-first power-user workflows.
     │  It behaves like macOS Spotlight or VS Code's command palette.
     ▼

END  — Recruiter closes the tab with a clear mental model:
     - Who Jainil is
     - What Jainil has built
     - What technologies Jainil knows
     - How to reach Jainil
     - That Jainil builds with exceptional craft
```

---

## 4. Complete Product Map

This section defines every application in the product. For technical layout details and data schemas, see [`PHASE_3_ARCHITECTURE.md`](./PHASE_3_ARCHITECTURE.md) and [`CONTENT_ARCHITECTURE.md`](./CONTENT_ARCHITECTURE.md).

---

### 4.1 About App

| Property | Value |
|---|---|
| **App ID** | `about` |
| **Status** | ✅ Implemented |
| **Recruiter Priority** | 🔴 CRITICAL |
| **Default Size** | 720 × 560 px |
| **Layout Pattern** | Layout A — Profile / Dashboard |
| **Pinned in Taskbar** | Yes |

**Purpose**: The primary recruiter entry point. Delivers the complete first impression within one app window.

**User Goal**: Within 30 seconds, a recruiter knows who Jainil is, what they do, what technologies they use, and how to contact them.

**Primary Content**:
- Profile card: avatar, name, title, bio, tech role tags, and CTA buttons ("View Resume", "Get in Touch")
- Connect card: email, GitHub, LinkedIn, location
- Current Focus card: active project with title, category, role, and timeline

**Interaction Model**:
- CTA buttons launch other apps (Resume App, Contact App) via the window manager
- No navigation — the window contains a single view
- External links (GitHub, LinkedIn) open in the Browser App

**Definition of Complete**:
- All profile data is real (name, bio, actual tech stack, real contact links)
- "View Resume" correctly opens the Resume App
- "Get in Touch" correctly opens the Contact App
- No placeholder text, no generic avatar initials (real photo or generated avatar)
- Fits at 720×560 without vertical scrolling

**Future Expansion**: Add an `availabilityStatus` indicator (e.g., "Open to Roles", "Consulting", "Busy") with a color dot next to the avatar, dynamically read from a data source.

---

### 4.2 Projects App

| Property | Value |
|---|---|
| **App ID** | `projects` |
| **Status** | ✅ Implemented (V2) |
| **Recruiter Priority** | 🔴 CRITICAL |
| **Default Size** | 960 × 640 px |
| **Layout Pattern** | Layout B — Master-Detail with Sidebar |
| **Pinned in Taskbar** | Yes |

**Purpose**: The flagship portfolio experience. Showcases every project with detail, visual proof, and direct links to work.

**User Goal**: A recruiter can browse projects, select one, read the case study, watch the reel (screenshots/video), and click GitHub or Live Demo — all without leaving the app window.

**Primary Content**:
- Sidebar: project list with thumbnail, title, category, and year — filterable by category (All, Featured, Mobile, Web, Library) and searchable by text
- Detail area: cover image/reel player (switchable tabs), full description, tech stack badges, features list, challenges, solutions, results, GitHub and Live Demo links
- Reel Player: slide-by-slide media viewer (keyboard, swipe, and click navigation)

**Interaction Model**:
- Single-click sidebar item → shows project detail in content area
- Keyboard arrow keys navigate sidebar when window is focused
- "GitHub" and "Live Demo" links open in the Browser App (not external tabs)
- Reel Player supports left/right keyboard arrows, touch swipe, and click buttons
- Search input clears with the × button

**Window Behavior**: Resizable. Default 960×640 provides comfortable space for sidebar + detail side by side.

**Definition of Complete**:
- At least 3 real projects with real descriptions, tech stacks, and architecture highlights
- At least 1 project has multiple named reel tabs with real images
- Search and filter both work correctly
- GitHub/Live Demo links correctly open in the Browser App
- No placeholder content, no broken images

**Future Expansion**: Case Study deep-dive mode with Story Chapters (v2 schema). Architecture diagram viewer. Performance metrics per project (Lighthouse scores, bundle sizes). One Project = Multiple Reels model.

---

### 4.3 Skills App

| Property | Value |
|---|---|
| **App ID** | `skills` |
| **Status** | ✅ Implemented |
| **Recruiter Priority** | 🟡 HIGH |
| **Default Size** | 840 × 580 px |
| **Layout Pattern** | Layout B — Master-Detail with Sidebar |
| **Pinned in Taskbar** | Yes |

**Purpose**: Presents technical skills in a format that is scannable, honest, and easy to validate.

**User Goal**: A recruiter or hiring engineer can quickly see which technologies Jainil uses, at what level of expertise, and with what context.

**Primary Content**:
- Sidebar: skill categories (Frontend, Backend, Mobile, Tools & Other)
- Content area: skill cards in a responsive grid — each card shows skill name, proficiency level badge (Expert/Proficient/Learning), years of experience, and a one-sentence context highlight

**Interaction Model**:
- Clicking a sidebar category shows its skill cards
- Arrow keys navigate sidebar when window is focused
- Hover on skill cards elevates with a subtle shadow

**Design Constraint**: No progress bars, no percentage dials. Proficiency is communicated through text labels only (Expert, Proficient, Learning). This is a deliberate anti-pattern avoidance — percentage bars are arbitrary and frustrate technical reviewers.

**Definition of Complete**:
- All 4 categories populated with real skills
- Every skill has a real proficiency level and years of experience
- Highlights are real sentences describing how the skill was applied in production

**Future Expansion**: Link skills to related projects (clicking "React" highlights projects that used it in the Projects App). Endorsement quotes from colleagues.

---

### 4.4 Resume App

| Property | Value |
|---|---|
| **App ID** | `resume` |
| **Status** | ✅ Implemented |
| **Recruiter Priority** | 🔴 CRITICAL |
| **Default Size** | 820 × 720 px |
| **Layout Pattern** | Layout A variant — Document Viewer |
| **Pinned in Taskbar** | No (accessed via About → "View Resume" or Command Palette) |

**Purpose**: Provides the formal, printable professional record — the same document a recruiter would receive as an email attachment — inside the OS environment.

**User Goal**: A recruiter can read Jainil's full resume, download the PDF, or print it, without needing to leave the OS.

**Primary Content**:
- Action bar (top): "Download PDF", "Print", "Share" actions
- Sidebar: document stats (years of experience, companies, skills count), quick metrics
- Document area: typeset resume document — header (name, title, contact), experience (company, role, period, highlights), education, skills summary, certifications

**Interaction Model**:
- "Download PDF" links to a static PDF in `/public/resume/`
- "Print" triggers `window.print()` (document-scoped)
- "Share" copies a direct link to the clipboard using the OS notification system (not `alert()`)

**Design Constraint**: The Resume App is a document viewer, not a web resume. The content area renders a contained document card with a paper-like background inside the dark OS window — not a scrolling webpage layout.

**Definition of Complete**:
- Real professional experience (at least 2 work roles with impact-driven bullet points)
- Real education history
- Real skills summary matching the Skills App categories
- Working PDF download linking to a real PDF file in `/public/`
- Share action uses `addNotification()` to confirm clipboard copy, not `alert()`

**Future Expansion**: ATS keyword scanner overlay — shows which common recruiter system keywords match the resume.

---

### 4.5 Contact App

| Property | Value |
|---|---|
| **App ID** | `contact` |
| **Status** | ✅ Implemented |
| **Recruiter Priority** | 🔴 CRITICAL |
| **Default Size** | 640 × 480 px |
| **Layout Pattern** | Layout A — Compact |
| **Pinned in Taskbar** | No (accessed via About or Command Palette) |

**Purpose**: The lowest-friction path for a recruiter to reach Jainil.

**User Goal**: A recruiter can send a message within 60 seconds, or copy Jainil's email/LinkedIn directly, without ever leaving the OS.

**Primary Content**:
- Form: Name, Email, Message fields with OS-styled inputs
- Submit button with loading and success states
- Direct channels panel: email address, GitHub handle, LinkedIn link

**Interaction Model**:
- Client-side form validation (name required, email format, message length)
- Submission: currently simulated — Phase 4 upgrades to real delivery via Formspree or Server Action
- Success state replaces form with a confirmation message
- Direct channel links open in the Browser App (email opens system mail client as exception)

**Definition of Complete**:
- All fields validate correctly
- Success and error states are fully styled (no raw text, no alert boxes)
- Direct channel links are real and working
- No placeholder email addresses

**Future Expansion**: Quick-select subject prompts (pre-filled "Hiring Inquiry", "Contract Project"). Cal.com integration for direct meeting scheduling.

---

### 4.6 Settings App

| Property | Value |
|---|---|
| **App ID** | `settings` |
| **Status** | ✅ Implemented |
| **Recruiter Priority** | 🟡 HIGH (OS authenticity) |
| **Default Size** | 960 × 720 px |
| **Layout Pattern** | Layout B — Master-Detail with Sidebar |
| **Pinned in Taskbar** | No (accessed via system tray or Command Palette) |

**Purpose**: Demonstrates that ApexOS is a real system with real configuration. Shows product thinking — the OS has preferences a user can customize.

**User Goal**: Any visitor can personalize their session: change the wallpaper, change the accent color, toggle the lock screen.

**Primary Content**:
- General tab: OS system information, developer bio
- Appearance tab: Wallpaper gallery (4 presets), Accent color picker (6 colors)
- Network tab: Mock network status (portfolio host connected)
- Security & Logon tab: Lock screen enable/disable toggle

**Interaction Model**:
- Wallpaper selection immediately changes the desktop background via CSS `--wp-bg` variable
- Accent color selection immediately updates all accent-colored elements systemwide via `--color-accent`
- Lock screen toggle persists across sessions (localStorage)

**Definition of Complete**:
- All 4 tabs have real content (no empty placeholder tab panels)
- Wallpaper change updates the desktop background in real time (no page reload)
- Accent color change updates all system elements that use `var(--color-accent)` in real time
- Settings persist across browser sessions

**Future Expansion**: Custom wallpaper upload. Light/dark/system theme toggle (full `src/core/theme` implementation). Font size accessibility setting. Persistent window positions.

---

### 4.7 Files App

| Property | Value |
|---|---|
| **App ID** | `files` |
| **Status** | 🔴 Not yet implemented |
| **Recruiter Priority** | 🟡 HIGH (OS authenticity anchor) |
| **Default Size** | 1100 × 700 px |
| **Layout Pattern** | Layout B — Master-Detail with Sidebar |
| **Pinned in Taskbar** | Yes (planned) |

**Purpose**: The highest OS-fidelity app in the entire system. A recruiter who sees a real file browser — with breadcrumbs, folder icons, a status bar, and a sidebar with Locations and Folders — completely believes they are using an operating system, not viewing a website.

**User Goal**: A recruiter can browse the OS file system, which is a curated map of Jainil's portfolio content, and open relevant items (Resume, Projects).

**Primary Content**:
- Sidebar: LOCATIONS section (Home, Recent, Starred), FOLDERS section (Documents, Downloads, Pictures, Projects)
- Content area: breadcrumb navigation, view toggle (grid/list), folder and file grid with icons, names, sizes, and dates
- Status bar (bottom): item count, selection count, sync status ("☁ Synced")

**Interaction Model**:
- Clicking a folder navigates into it (breadcrumb updates)
- Double-clicking `Resume.pdf` opens the Resume App
- Double-clicking a project folder opens the Projects App with that project selected
- View toggle switches between grid and list views

**Dependencies**: Browser App must be implemented first (Files may link to documents that open in Browser). See [`PHASE_3_ARCHITECTURE.md § 8.2`](./PHASE_3_ARCHITECTURE.md).

**Definition of Complete**:
- Matches `docs/design/file-app.png` layout as closely as possible
- At least 3 navigable folders with real content
- Status bar shows real item counts
- Opening `Resume.pdf` launches the Resume App

**Future Expansion**: File search within the app. Drag-and-drop rearrangement. Stars/favorites persistence.

---

### 4.8 Browser App

| Property | Value |
|---|---|
| **App ID** | `browser` |
| **Status** | 🔴 Not yet implemented |
| **Recruiter Priority** | 🟡 HIGH (OS contract requirement) |
| **Default Size** | 1000 × 700 px |
| **Layout Pattern** | Full content (no sidebar) — browser chrome at top |
| **Pinned in Taskbar** | Yes (planned) |

**Purpose**: Maintains the OS illusion when a user navigates to an external URL. Instead of opening a new browser tab and breaking the desktop experience, external links open in this Browser App inside a window.

**User Goal**: A recruiter can click "View on GitHub" from the Projects App and see the GitHub page without leaving the OS.

**Primary Content**:
- Browser address bar (back, forward, refresh buttons + URL input)
- Content area: iframe-based page renderer with fallback message for sites that block embedding
- Navigation history within the session

**Interaction Model**:
- Launched from other apps with an initial URL (via `initialProps` in `WindowState` extension)
- Address bar accepts manual URL input
- Back/forward navigation within browsing session
- Fallback: "This page cannot be embedded. Open in external browser →" for sites with `X-Frame-Options: DENY`

**Definition of Complete**:
- Address bar is functional (displays current URL, accepts new URLs)
- GitHub profile and repository pages render (most allow iframe embedding)
- Fallback message shown for sites that block embedding
- Links opened from Projects App, Files App, and About App correctly populate the Browser App

**Future Expansion**: Tab support (multiple pages in one Browser window). Bookmark panel. Print page from Browser App.

---

### 4.9 Gallery App

| Property | Value |
|---|---|
| **App ID** | `gallery` |
| **Status** | 🔴 Not yet implemented |
| **Recruiter Priority** | 🟢 MEDIUM |
| **Default Size** | 900 × 640 px |
| **Layout Pattern** | Full grid — no sidebar |
| **Pinned in Taskbar** | Yes (planned) |

**Purpose**: Visual proof of UI/UX and design capability. A grid of project screenshots, design assets, and UI mockups provides immediate visual evidence of Jainil's eye for quality.

**User Goal**: A recruiter can quickly scan what Jainil's work looks like visually, and click any image to see it in full.

**Primary Content**:
- Thumbnail grid: 4-column layout, uniform aspect ratio
- Hover state: overlay with filename, date, and project tag
- Lightbox: full-screen preview inside the window (not a modal overlay on the entire desktop)

**Interaction Model**:
- Hover on thumbnail shows metadata overlay
- Click opens lightbox viewer within the window
- Lightbox supports prev/next navigation and Escape to close

**Dependencies**: Real screenshots from projects must exist in `/public/media/` before Gallery can be built.

**Definition of Complete**:
- At least 8–10 real project screenshots
- Hover metadata overlay is functional
- Lightbox viewer works with keyboard navigation
- All images link to real files (no broken `<img>` tags)

**Future Expansion**: Zoom-and-pan canvas for high-resolution mockups. Categorized folders (Mobile UI, Web Apps, Vector Assets).

---

### 4.10 Achievements App

| Property | Value |
|---|---|
| **App ID** | `achievements` |
| **Status** | 🔴 Not yet implemented |
| **Recruiter Priority** | 🟢 MEDIUM |
| **Default Size** | 720 × 560 px |
| **Layout Pattern** | Layout A — Card Grid |
| **Pinned in Taskbar** | No |

**Purpose**: Establishes professional credibility beyond the resume. Certifications, hackathon wins, notable open-source contributions, and recognitions presented as system-level achievement cards.

**User Goal**: A recruiter can see verifiable professional accomplishments in a format that feels credible and organized, not self-promotional.

**Primary Content**:
- Achievement cards in a 2–3 column grid
- Each card: icon (32px), title, issuer/organization, date, description, category badge, verification link

**Interaction Model**:
- Clicking a verification link opens it in the Browser App
- Cards may be filtered by category (Certification, Hackathon, Open Source, Recognition)

**Design Constraint**: Achievement cards must look like OS notification cards, not gamification badges with stars and gradients. The aesthetic is professional and understated.

**Definition of Complete**:
- At least 6–8 real, verifiable achievements
- All verification links are real
- Category filtering works

**Future Expansion**: Skill tag correlation — clicking an achievement highlights related skills in the Skills App.

---

### 4.11 Terminal App

| Property | Value |
|---|---|
| **App ID** | `terminal` |
| **Status** | 🔴 Not yet implemented |
| **Recruiter Priority** | 🟢 MEDIUM (power-user delight) |
| **Default Size** | 760 × 480 px |
| **Layout Pattern** | Full content — terminal interface |
| **Pinned in Taskbar** | No (discovered via Command Palette) |

**Purpose**: A delight feature for technical audiences. Demonstrates engineering personality and attention to craft. Engineers who review portfolios will find this memorable.

**User Goal**: A technical recruiter or engineering hiring manager can explore the portfolio via a terminal interface and encounter thoughtful responses.

**Primary Content**:
- Monospaced dark terminal interface (`JetBrains Mono`, near-black background, teal-green prompt)
- Prompt: `apex@os:~$`
- Supported commands: `help`, `whoami`, `ls projects`, `cat resume`, `open about`, `open projects`, `open contact`, `clear`, `neofetch`
- `neofetch`: ASCII art system info block (fun easter egg with ApexOS art, OS version, "browser" hardware specs)

**Interaction Model**:
- Standard terminal UX: type command, press Enter, output appears
- `open [app]` launches the corresponding app via the window manager
- Output renders character-by-character for a typewriter effect
- `clear` wipes output history
- Up/down arrow keys for command history within the session

**Definition of Complete**:
- All listed commands produce real, intentional output (not placeholder strings)
- `open` commands correctly launch apps
- `neofetch` includes real system details in a fun format
- Keyboard interaction feels natural (no input lag, correct cursor behavior)

**Future Expansion**: A hidden Easter egg command (`sudo make me a sandwich`, `rm -rf /`, etc.) with a witty OS-themed response.

---

### 4.12 Future: AI Assistant App

| Property | Value |
|---|---|
| **App ID** | `ai-assistant` (reserved) |
| **Status** | 🔵 Phase 4/5 — Not started |
| **Recruiter Priority** | Future differentiator |
| **Default Size** | TBD |

**Purpose**: An AI-powered assistant that runs inside the OS and can answer questions about Jainil, help recruiters navigate the portfolio, generate summaries on demand, and eventually help Jainil maintain and update portfolio content.

**Reserved system identifiers** (per `AGENT_RULES.md`): `ai-assistant`, `mcp-hub`, `agent-workspace`, `knowledge-base`, `memory-center`, `prompt-library`, `tool-registry`. These may not be repurposed.

---

## 5. Application Relationships

No app in ApexOS should feel isolated. Every application is connected to others through intentional cross-app interactions. These relationships are what make the system feel coherent rather than a collection of independent screens.

```
ABOUT APP  ──────────────────────────────────────────────────────────────────
     │ "View Resume" →                                         RESUME APP
     │ "Get in Touch" →                                        CONTACT APP
     │ currentFocus project links to →                         PROJECTS APP
     │ Technologies listed match →                             SKILLS APP
     └──────────────────────────────────────────────────────────────────────

PROJECTS APP ────────────────────────────────────────────────────────────────
     │ "GitHub" / "Live Demo" links open in →                  BROWSER APP
     │ Project media (screenshots) appear in →                 GALLERY APP
     │ Featured projects referenced in →                       RESUME APP
     │ Featured project referenced in →                        ABOUT APP (currentFocus)
     └──────────────────────────────────────────────────────────────────────

RESUME APP ──────────────────────────────────────────────────────────────────
     │ "Download PDF" links to file in →                       FILES APP (Documents/)
     │ Skills section matches →                                SKILLS APP
     │ Experience projects link to →                           PROJECTS APP
     └──────────────────────────────────────────────────────────────────────

FILES APP ───────────────────────────────────────────────────────────────────
     │ "Resume.pdf" double-click opens →                       RESUME APP
     │ Project folders open →                                  PROJECTS APP
     │ Image files open in →                                   GALLERY APP
     │ External document links open in →                       BROWSER APP
     └──────────────────────────────────────────────────────────────────────

SKILLS APP ──────────────────────────────────────────────────────────────────
     │ Technologies match About App tags →                     ABOUT APP
     │ Future: clicking a skill links to →                     PROJECTS APP
     └──────────────────────────────────────────────────────────────────────

TERMINAL APP ────────────────────────────────────────────────────────────────
     │ "open about" command launches →                         ABOUT APP
     │ "open projects" command launches →                      PROJECTS APP
     │ "open contact" command launches →                       CONTACT APP
     │ "ls projects" reads from →                              projects.json data
     └──────────────────────────────────────────────────────────────────────

SETTINGS APP ────────────────────────────────────────────────────────────────
     │ Wallpaper change affects →                              DESKTOP + LOCK SCREEN
     │ Accent color change affects →                           ALL APPS (via CSS --color-accent)
     │ Lock screen toggle affects →                            LOCK SCREEN (os-runtime)
     └──────────────────────────────────────────────────────────────────────

BROWSER APP  ────────────────────────────────────────────────────────────────
     │ Receives launch URLs from →                             PROJECTS APP (GitHub/Demo)
     │ Receives launch URLs from →                             ABOUT APP (LinkedIn/GitHub)
     │ Receives launch URLs from →                             RESUME APP (external links)
     │ Receives launch URLs from →                             FILES APP (documents)
     └──────────────────────────────────────────────────────────────────────

ACHIEVEMENTS APP ────────────────────────────────────────────────────────────
     │ Certification links open in →                           BROWSER APP
     │ Future: skill tags link to →                            SKILLS APP
     └──────────────────────────────────────────────────────────────────────

GALLERY APP ─────────────────────────────────────────────────────────────────
     │ Image thumbnails sourced from →                         /public/media/projects/
     │ "View Project" links open →                             PROJECTS APP
     └──────────────────────────────────────────────────────────────────────
```

The cross-app integration pattern is enforced through the window manager API (`openWindow`, `focusWindow`, `setActiveApp`). Apps communicate by launching each other — they never reach into each other's internal state directly.

---

## 6. Global User Experience

This section defines the operating system experience that exists across and beneath all applications. These behaviors are not owned by any single app — they are the system.

### Window Behavior

Windows in ApexOS behave like windows in a real desktop OS:

- **Open**: Scale-in + fade animation from center (150ms, ease-out)
- **Close**: Fade-out + scale-down (150ms, ease-in)
- **Minimize**: Fly-to-taskbar animation (200ms)
- **Maximize**: Expand to fill desktop surface (150ms)
- **Drag**: Click-and-drag title bar to reposition (real-time, no lag)
- **Resize**: Drag right edge, bottom edge, or bottom-right corner
- **Focus**: Focused window has full-opacity shadow; unfocused windows are dimmed to 0.85 opacity
- **Z-order**: Focused window always renders above all others (topmost z-index)

### Animations

All animations serve a purpose. They are not decorative:

| Animation | Purpose | Duration |
|---|---|---|
| Boot progress bar | Communicates system initialization | 2.2s total |
| Lock screen fade-in | Signals system is ready | 0.6s |
| Window open (scale-in) | Communicates creation | 150ms |
| Window close (scale-out) | Communicates destruction | 150ms |
| Sidebar hover translate | Signals interactivity | 100ms |
| Skill card hover elevate | Signals clickability | 120ms |
| Notification glow pulse | Draws attention to unread items | 3s loop |
| Command palette fade-in | Signals overlay activation | 100ms |

### Notifications

The notification system (`src/core/notifications`) operates as a real OS notification queue:

- Notifications appear in the taskbar tray (bell icon with unread badge count)
- Clicking the tray icon opens a notification popover
- Per-notification dismiss and mark-as-read
- "Mark All Read" action
- Maximum 50 notifications stored (oldest discarded)
- Persisted in localStorage across sessions
- Apps emit notifications on key events (e.g., Contact form success, Share link copied)

### Command Palette

Triggered by **Ctrl+K** (or **Cmd+K** on Mac) from anywhere on the desktop.

- Full-screen dark overlay with centered search panel
- Searches app names and descriptions in real time
- Keyboard navigation: arrow keys to select, Enter to launch, Escape to close
- Launches apps via window manager (opens if not open, focuses if already open)
- Footer shows keyboard shortcut hints

### Search

Global search is exclusively handled by the Command Palette. There is no global search bar visible on the desktop. Apps may have internal search (Projects App's sidebar search) but those are scoped to app content, not cross-app.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+K` / `Cmd+K` | Open Command Palette |
| `Escape` | Close Command Palette |
| `Arrow keys` | Navigate sidebar items (in Projects, Skills) |
| `Arrow keys` | Navigate reel slides (in Projects App reel player) |
| `Arrow keys` | Navigate terminal history |
| `Enter` / `Space` | Unlock device (on Lock Screen) |
| `Enter` | Submit Command Palette selection |

### Context Menus

Right-clicking the desktop surface shows a context menu:
- **Refresh** — reloads the page
- **Display Settings** — launches the Settings App, Appearance tab
- (Future) **New Folder**, **Sort Icons**, **Paste**

Right-clicking desktop icons (future): **Open**, **Show in Files**, **Get Info**.

### Desktop Icons

- Grid: top-left placement, single-column flow (top to bottom, then right)
- Each icon: 48×48px icon image, label below (12px, centered, truncated at 2 lines)
- Single-click: selects icon (highlight state)
- Double-click: launches the application
- Click-elsewhere: deselects icon
- All registered apps appear as desktop icons

### Wallpaper

- Default: "Deep Slate Waves" — a dark teal-to-black ambient gradient
- System variable: `--wp-bg` on `document.documentElement`
- Used by: desktop background, lock screen background (blurred)
- Changed via: Settings App → Appearance → Desktop Wallpaper
- 4 presets available (extendable to image-based wallpapers in the future)
- Change applies in real time without page reload

### Taskbar

Structure: Left section | Center section | Right section

- **Left**: Grid toggle (⊞ apps button), Search icon (opens Command Palette)
- **Center**: Pinned apps (icon-only buttons, 40×40px, with active indicator dot for running apps)
- **Right**: System tray — WiFi indicator, Battery indicator, Notification bell with unread badge, stacked clock (time above, date below)
- Height: 52px, glass effect (`backdrop-filter: blur(20px)`, `rgba(15, 23, 42, 0.8)`)
- Only pinned apps or currently running non-pinned apps appear in the center

### Status Tray

- Notification bell icon with unread count badge
- Click opens notification popover (anchored above the tray)
- WiFi icon: decorative (always shows connected state — portfolio is always "online")
- Battery icon: decorative (shows full — the OS never runs out of battery)
- Clock: live-updating, 12h format, date below

### Accessibility

- All interactive elements have unique IDs
- Focus is managed when windows open and close
- Keyboard navigation supported in all sidebar lists
- Lock screen responds to `Enter`, `Space`, and `Escape`
- Command Palette is fully keyboard-navigable
- Color contrast ratios respect WCAG AA (dark mode tokens chosen for legibility)
- Future: ARIA live regions for notifications; screen reader labels for all icon buttons

### Loading States

- App launch: the window renders immediately; content loads within the component's own lifecycle
- Projects App: shows a subtle loading spinner overlay when switching projects (ProjectSwitchingLoader)
- Reel Player: shows a loading indicator while media loads
- No full-screen loading spinners outside of the boot sequence

### Error Handling

- Apps should be wrapped in React Error Boundaries to prevent a single app crash from taking down the desktop
- Error boundary fallback: a clean error card inside the window showing "This app encountered an error" with a Retry button
- Form validation errors: inline per-field, styled in system muted text color — no alert() boxes

### Empty States

- Projects sidebar with no search results: "No projects match your search" with a clear search button
- Notifications tray with no notifications: "No notifications" with a muted icon
- Gallery with no images: "No images yet" placeholder
- All empty states use muted icon + muted text pattern (never completely blank)

---

## 7. Design Philosophy

> For the complete token reference, spacing scale, typography scale, and component specifications, see [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md). This section explains *why* the design looks the way it does, not *what* the values are.

### The OS Illusion

The most important design goal is that visitors feel they are using a real computer, not browsing a website. Every visual decision is evaluated against this goal.

This is why:
- There is no scrolling hero section (websites have those)
- There is no HTML navigation bar (websites have those)
- Content lives inside windows with title bars and traffic light buttons (OS apps have those)
- The background is a wallpaper, not a page color (OS desktops have that)
- There is a taskbar with a clock (OS desktops have that)

The OS illusion breaks the moment any element looks like it was copied from a website template. The design system exists to prevent this.

### Samsung DeX Inspiration

The desktop layout is inspired by **Samsung DeX** — Samsung's desktop mode for Android phones. This was chosen over macOS or Windows conventions for three reasons:

1. DeX has a bottom taskbar with center-pinned apps — a modern, uncluttered design
2. DeX's floating window model is familiar but less expected than macOS
3. DeX represents a "mobile OS on desktop" metaphor that mirrors the web-to-desktop metaphor of ApexOS

The taskbar design (52px height, glass blur, center pinned apps, right clock and tray) directly reflects the DeX pattern visible in `docs/design/desktop-home.png`.

### Dark Native UI

ApexOS is dark mode only. There is no light mode. This is a deliberate product decision, not a technical limitation.

Dark mode was chosen because:
- It reads as "technical" and "professional" — the audience is developers and technical recruiters
- It allows glassmorphism to work elegantly (glass on dark is beautiful; glass on light is subtle)
- It creates visual consistency — every screenshot, every design reference, every implemented component is in the same dark palette
- It eliminates the engineering overhead of a dual-mode color system during initial build

### Glassmorphism Discipline

Glassmorphism (frosted glass backgrounds with `backdrop-filter: blur`) is used in three places only:
1. Window chrome — `backdrop-filter: blur(16px)` with dark translucent background
2. Taskbar — `backdrop-filter: blur(20px)` with dark translucent background
3. Lock screen notification pill — `backdrop-filter: blur(12px)`

Glassmorphism is not used for cards inside application content areas, for sidebar backgrounds, or for individual UI elements. Overuse destroys the effect. Discipline is what makes it feel premium.

### Consistency Rules

The design is enforced through CSS custom properties. Every color, every font size, every border radius, every spacing value is a token defined in `src/app/globals.css`. Components reference tokens, not hardcoded values.

This means:
- Changing the accent color from teal to blue updates every app simultaneously (via `--color-accent`)
- Changing the border radius changes every card simultaneously (via `--radius-card`)
- An agent who follows the token system cannot accidentally introduce a wrong color

The token system is the enforcement mechanism for the design system. It is not optional.

### Visual Hierarchy

Every app view has a clear visual hierarchy:

1. **Primary**: App title, selected item, main content — `var(--color-text-primary)`, `fontWeight: 600–700`
2. **Secondary**: Descriptions, details, supplementary info — `var(--color-text-secondary)`, `fontWeight: 400–500`
3. **Muted**: Labels, metadata, timestamps, hints — `var(--color-text-muted)`, `fontSize: 11–12px`
4. **Accent**: Interactive elements, active states, CTAs — `var(--color-accent)` (#10b981 teal, or user-selected)

Nothing uses a color outside this hierarchy without a documented reason.

---

## 8. Content Strategy

Everything in ApexOS must be real. No placeholder data, no lorem ipsum, no "Company Name" or "Project Title" entries are visible to recruiters.

### Projects

**Current state**: 3 projects in `src/data/projects/projects.json` (ApexOS Portfolio, FitTrack Pro, Zod Validator).

**Required for Phase 3 completion**: All projects must have:
- Real descriptions (short and full)
- Real tech stacks
- Real GitHub and/or live demo URLs
- At minimum 3 reel slides with real screenshot images in `/public/media/projects/[slug]/`
- Real features, challenges, and results (no placeholder bullets)

**Target state**: 4–6 featured projects representing the strongest work across different categories (Web App, Mobile App, Library, Open Source).

**Content philosophy**: Each project tells a story. The Projects App supports: Context (what was the problem), Challenge (what was hard), Solution (what was built), and Results (what was the outcome). Fill each of these honestly.

### Resume

The resume content in `src/data/resume.ts` must be real and current:
- Work experience: real companies, real roles, impact-driven bullet points using action verbs and metrics where possible
- Education: real institution, real degree, real period
- Skills: matching the Skills App categories (Frontend, Backend, Mobile, Tools)
- Certifications: only real, verifiable credentials

A real PDF version must be available at `/public/resume/Jainil_Pandya_Resume.pdf` for the "Download PDF" action.

### Certificates

Certificates belong in the Achievements App. Each must have:
- Real issuer (Coursera, Google, AWS, etc.)
- Real date
- A real verification URL

### Images & Visual Assets

- Project screenshots: real UI screenshots from actual deployed applications
- Gallery images: curated, high-quality screenshots (not random phone photos)
- App icons: SVG vector icons in `/public/icons/` (6 currently exist; expand as apps are added)
- Wallpapers: CSS gradient presets (Phase 3); image-based wallpapers can be added in Phase 4

**Critical**: All `<img>` tags in the system must reference files that exist on disk. Any broken image is visible to recruiters and directly damages credibility.

### Downloads

- **Resume PDF**: `/public/resume/Jainil_Pandya_Resume.pdf` — must exist before the Resume App's "Download PDF" action is functional
- **Future**: Project case study PDFs, architecture diagrams (PDF or SVG)

### Case Studies

Future content for Phase 4+:
- Architectural diagram SVGs (placed in `/public/media/projects/[slug]/architecture.svg`)
- Written case study documents (accessible via the Files App as markdown-rendered documents)
- Project performance metrics (Lighthouse scores, bundle sizes, API response latencies)

### Future Blog Posts

Phase 5 vision:
- Technical blog posts accessible via a dedicated "Blog" or "Notes" app inside ApexOS
- Topics: things built, architecture decisions made, lessons learned
- Format: markdown rendered inside an app window, not a separate website
- Content managed via an AI-assisted editing workflow

---

## 9. Wow Moments

These are the deliberate moments designed to make recruiters stop, remember, and share. Each one is either implemented or planned.

| Moment | Status | Description |
|---|---|---|
| **Boot Animation** | ✅ Implemented | The ApexOS isometric cube logo appears on a dark background with a "Initializing System..." progress bar. A recruiter's first impression: *this is something different.* |
| **Recruiter Notification on Lock Screen** | ✅ Implemented | "2 new messages from Recruiters" appears as a glowing notification pill on the lock screen. It is self-aware, meta, and immediately communicates: *I know who my audience is.* |
| **The Desktop** | ✅ Implemented | After unlocking: a wallpaper, desktop icons, a glass taskbar, a live clock. The recruiter is now inside an operating system. |
| **Window Opening Animation** | ✅ Implemented | Each app scales in from center with a smooth animation. Every window feels alive and intentional. |
| **Window Resize and Drag** | ✅ Implemented | Windows can be dragged around and resized. The desktop behaves like a real OS. |
| **Wallpaper Changes Live** | 🔶 Partially (bug exists) | Selecting a wallpaper in Settings immediately changes the desktop background. A live visual response to a system preference. |
| **Accent Color Ripple Effect** | ✅ Implemented | Changing the accent color in Settings immediately updates every teal-colored element in every open app — tags, borders, buttons, indicators. |
| **Command Palette** | ✅ Implemented | Ctrl+K opens a Spotlight-style overlay. A technical recruiter knows immediately: this developer has keyboard-first product thinking. |
| **Projects Reel Mode** | ✅ Implemented | Switching to Reel view in the Projects App shows screenshots with keyboard/swipe navigation — a visual pitch for each project. |
| **Notification Center** | ✅ Implemented | A real notification queue in the taskbar tray with dismiss, read, and clear interactions. |
| **Terminal App** | 🔴 Planned | `apex@os:~$ neofetch` prints a custom ASCII ApexOS logo with system specs. The `open about` command launches the About App. A technical recruiter who discovers this will mention it in their next conversation. |
| **Resume In-OS Download** | ✅ Implemented (PDF pending) | A resume you can read, print, and download without ever leaving the OS. The form factor adds gravity to the document. |
| **Files App Authenticity** | 🔴 Planned | A real file browser. Real breadcrumbs. Real folder icons. A status bar saying "5 items, 1 selected • ☁ Synced." Double-clicking `Resume.pdf` opens the Resume App. The strongest OS authenticity moment in the entire product. |
| **Future: AI Assistant** | 🔵 Phase 4 | A recruiter asks "What is Jainil's experience with React Native?" and a chat interface inside ApexOS answers. A portfolio that talks back is unforgettable. |

---

## 10. Success Criteria

ApexOS is "finished" when all of the following are true:

### Application Completeness
- [ ] All 11 apps are implemented: About, Projects, Skills, Resume, Contact, Settings, Files, Browser, Gallery, Terminal, Achievements
- [ ] All 11 apps follow Layout A or Layout B — no website-style layouts
- [ ] No empty state visible to users (no placeholder text, no broken images, no "TODO" comments)

### Design Consistency
- [ ] All apps use only `var(--color-*)` CSS tokens — no hardcoded hex values
- [ ] All apps use `var(--font-sans)` — no other font families introduced
- [ ] All apps use shared UI components where applicable (`AppSidebar`, `AppContentArea`, `AppTagBadge`)
- [ ] Visual comparison against all screenshots in `docs/design/` shows no significant drift
- [ ] All desktop icon, taskbar, window chrome, and sidebar proportions match the design system

### Content Completeness
- [ ] All project data is real: descriptions, tech stacks, GitHub links, screenshots
- [ ] At least 3 real projects have reel slides with real screenshot images
- [ ] Resume data is current: real work experience, real education, real skills
- [ ] Real PDF resume available at `/public/resume/`
- [ ] At least 6–8 real, verifiable achievements
- [ ] At least 8–10 real project screenshots in the Gallery
- [ ] All icons exist as SVG files in `/public/icons/` for every registered app
- [ ] `app-default.svg` fallback icon exists in `/public/icons/`

### Technical Quality
- [ ] No broken image references anywhere in the system
- [ ] No `alert()` calls visible to users (replaced with OS notification system)
- [ ] Error boundaries wrap all app components
- [ ] Z-index focus order is correct (focused window always on top)
- [ ] Wallpaper changes update desktop background in real time
- [ ] All settings persist across browser sessions

### Responsiveness
- [ ] Desktop experience is fully functional at 1280px+ viewport
- [ ] Tablet shell is functional at 768–1199px viewport
- [ ] Mobile shell is functional at 320–767px viewport

### Performance
- [ ] Boot-to-desktop in under 3 seconds of interaction
- [ ] Window open/close animations at ≥ 60fps
- [ ] No visible layout shift (CLS = 0) during page load
- [ ] Initial page load time < 2 seconds on a standard connection

### Accessibility
- [ ] All interactive elements have unique IDs and descriptive ARIA labels
- [ ] Keyboard navigation works across all sidebar components
- [ ] Focus management is correct when windows open, close, and switch focus
- [ ] Color contrast meets WCAG AA minimum for all text

### Recruiter Flow
- [ ] Boot → Lock Screen → Desktop → About → Projects → Resume → Contact in under 5 minutes with zero confusion
- [ ] Every app delivers value within 10 seconds of opening
- [ ] No dead-end states (every button does something; no unimplemented links are visible)

---

## 11. Future Vision

> This section describes the product's long-term trajectory at a high level. It is not an implementation plan. Details will be documented in future phase planning documents.

### Phase 4: Polish and AI Integration

Phase 4 refines what Phase 3 built and adds the first layer of AI capability.

The polish pass includes: full window animation refinement, app transition memory (windows remember their last position and size), taskbar pinned vs. running indicator visual distinction, real contact form delivery (via a form service), custom wallpaper uploads in Settings, and a full dark/light theme toggle.

The AI integration introduces the AI Assistant — an app window running a chat interface connected to a language model that knows Jainil's portfolio deeply. The assistant answers questions: *"What projects has Jainil shipped to production?"*, *"Does Jainil have mobile development experience?"*, *"Can I see the resume?"* — and responds with real, accurate information or launches the relevant app.

This transforms ApexOS from a portfolio you browse to a portfolio you can *talk to*.

### Phase 5: AI-Native Operating System

Phase 5 is the long-term vision: ApexOS becomes a self-maintaining, AI-native personal OS.

Jainil adds a new project by telling the AI assistant about it. The AI creates the project entry, generates the description, suggests reel slide content, and updates `projects.json`. A new certification is earned — Jainil mentions it; the AI adds it to the Achievements App with a verification link.

The OS gains a Knowledge Base app — a personal wiki that Jainil updates through conversation. Case studies, architecture decisions, lessons learned, and technical writing live here as structured content, rendered beautifully inside the OS.

The file system becomes dynamic — the Files App reflects real content updates as the AI manages the data layer. New blog posts appear in a Notes app. Architecture diagrams are generated from descriptions.

The end state of Phase 5 is an OS that is both the portfolio and the infrastructure for Jainil's professional knowledge — a living system that grows with his career without requiring him to touch HTML or JSON.

---

## Cross-Reference Index

| For... | See... |
|---|---|
| Visual tokens (colors, spacing, typography) | [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) |
| Design screenshots (visual source of truth) | [`docs/design/`](./design/) |
| App layout specs and window sizes | [`PHASE_3_ARCHITECTURE.md`](./PHASE_3_ARCHITECTURE.md) |
| Projects App reel model details | [`PROJECTS_APP_ARCHITECTURE.md`](./PROJECTS_APP_ARCHITECTURE.md) |
| Per-app data schemas | [`CONTENT_ARCHITECTURE.md`](./CONTENT_ARCHITECTURE.md) |
| Current task queue | [`TASK_BOARD.md`](./TASK_BOARD.md) |
| Current phase progress | [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) |
| Agent mandatory rules | [`AGENT_RULES.md`](./AGENT_RULES.md) |
| Agent onboarding procedure | [`AGENT_GUIDE.md`](./AGENT_GUIDE.md) |
| Architecture boundaries | [`ARCHITECTURE_OVERVIEW.md`](./ARCHITECTURE_OVERVIEW.md) |
| Phase roadmap | [`DEVELOPMENT_ROADMAP.md`](./DEVELOPMENT_ROADMAP.md) |
| Architectural decisions | [`DECISIONS.md`](./DECISIONS.md) |

---

_Document created: 2026-06-27. Authority level: Product Vision — highest-level specification for ApexOS._
_This document should be updated when the product vision evolves, new apps are finalized, or the success criteria change._
_It does not need to be updated for every implementation task — for that, see `TASK_BOARD.md`, `PROJECT_STATUS.md`, and `HANDOFF.md`._
