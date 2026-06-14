# DESIGN SYSTEM

> **This document is the visual source of truth for My OS Portfolio (ApexOS).**
> All implementation must follow this specification.
> Screenshots in `docs/design/` are the highest-authority design reference.
> This document overrides any AI model assumptions or prior conventions.

---

## 1. Visual Identity

### Product Name

**ApexOS** — displayed in the boot screen and status bar.

### Owner

**Jainil Pandya** — Software Developer specializing in React, Next.js, and React Native.

### Product Personality

| Dimension | Expression                                              |
| --------- | ------------------------------------------------------- |
| Tone      | Professional, technical, premium                        |
| Aesthetic | Dark OS — dark mode only, glassmorphic surfaces         |
| Mood      | Calm authority — no flashy colors, no gradient overload |
| Metaphor  | A personal OS, not a website                            |
| Energy    | Confident, deliberate, high-craft                       |

### Design Philosophy

1. **OS Illusion First** — Every screen must maintain the illusion that the user is operating a real desktop environment.
2. **Dark Mode Native** — The system is dark-mode only. No light mode surfaces exist in approved screens.
3. **Glassmorphism Discipline** — Frosted glass is used for window chrome, taskbar, and panels — never overused.
4. **Functional Beauty** — Decorative elements must serve functional roles (wallpaper sets mood, not distraction).
5. **Recruiter-First UX** — The experience is optimized for a technical recruiter spending 2–5 minutes exploring. Every app must deliver value immediately.
6. **Samsung DeX Inspiration** — The desktop mode follows Samsung DeX conventions: bottom taskbar, floating windows, desktop icons, no macOS-style top menu bar.

### UX Goals

- Visitors should feel like they launched an OS, not opened a webpage.
- Key portfolio information must be surfaced within the first app window a recruiter opens.
- Navigation must be purely app-driven — no website navigation bars, no browser-style routing UI inside apps.
- Window management must feel responsive and natural.

### Recruiter Experience Goals

- Boot → Lock → Desktop in under 3 seconds of interaction.
- About app should open by default or be prominently visible.
- Skills, Projects, Resume accessible within one click from the taskbar.
- The experience should be memorable: "I used Jainil's OS."

---

## 2. Layout System

### Desktop Structure

```
┌─────────────────────────────────────────────────┐
│  Status Bar (top, thin, ~20px)                  │  ← ApexOS branding, WiFi, Battery, Notification
├─────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│   Desktop Surface (wallpaper + icon grid)       │
│                                                 │
│   Floating Windows rendered here                │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│  Taskbar (bottom, ~52px)                        │  ← App grid toggle, Search, Pinned apps, Clock, Tray
└─────────────────────────────────────────────────┘
```

### Desktop Surface

- Occupies the entire viewport below the status bar and above the taskbar.
- **Wallpaper**: Full-viewport background, `background: var(--wp-bg)`. Default is the "Deep Slate Waves" gradient — a dark teal-to-black flowing wave pattern.
- **Desktop Icon Grid**: Top-left placement. 5 icons visible in the approved desktop-home screenshot: About, Skills, Projects, Files, Browser. Icons are arranged in a top-to-bottom, left-to-right grid.
- **No Sidebar**: The desktop does NOT have a persistent vertical icon sidebar. Icons sit directly on the wallpaper surface.

### Wallpaper Behavior

- Default wallpaper: "Deep Slate Waves" — a dark, ambient teal-colored flowing abstract gradient.
- The wallpaper also appears on the lock screen (same `--wp-bg` CSS variable).
- Settings app allows switching wallpapers (confirmed in `setting-app.png`).
- Wallpaper transition should be smooth (CSS variable transition).

### Taskbar Behavior

From `desktop-home.png` analysis:

| Section | Contents                                                                                    |
| ------- | ------------------------------------------------------------------------------------------- |
| Left    | Grid/Apps toggle button (⊞), Search icon                                                    |
| Center  | Pinned apps (About, Skills, Projects, Files, Browser, Gallery) — shown as icon-only buttons |
| Right   | System tray: WiFi, Battery, Notification bell with badge                                    |
| Right   | Clock: Time (e.g., "08:31 AM") + Date (e.g., "6/14/2026") stacked                           |

- Taskbar background: `rgba(15, 23, 42, 0.8)` with `backdrop-filter: blur(20px)` — glass effect.
- Taskbar height: ~52px (matches screenshots).
- Active app in taskbar: highlighted with an accent dot or pill indicator below the icon.
- Taskbar pinned app icons are larger than desktop icon labels — approximately 24px icon size.

### Notification Area

- Bell icon in the right-side system tray.
- Unread notifications shown with a red badge counter.
- Notification panel opens as a floating overlay from the tray (not a full-screen modal).
- Lock screen shows notifications as compact pill cards (confirmed in `lock-screen.png`): mail icon + text + rounded container with glass background.

### Search Area

- Search icon in taskbar left section.
- Command palette (Ctrl+K) provides full search overlay.
- Search should feel like a system-level feature, not an in-app search box.

### System Tray

Right side of taskbar:

1. WiFi indicator icon
2. Battery indicator icon
3. Notification bell with badge
4. Clock (time + date stacked)

---

## 3. Window Design Rules

### Window Chrome Specification

Extracted from `desktop-home.png`, `file-app.png`, and `setting-app.png`:

| Property                         | Value                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| Background                       | `rgba(30, 41, 59, 0.95)` with `backdrop-filter: blur(16px)`                        |
| Border radius                    | `12px` (windowed), `0px` (maximized)                                               |
| Border                           | `1px solid rgba(255,255,255,0.12)` (focused), `rgba(255,255,255,0.06)` (unfocused) |
| Box shadow (focused)             | `0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)`                            |
| Box shadow (unfocused)           | `0 4px 16px rgba(0,0,0,0.3)`                                                       |
| Title bar height                 | `36px`                                                                             |
| Title bar background (focused)   | `rgba(15, 23, 42, 0.6)`                                                            |
| Title bar background (unfocused) | `rgba(15, 23, 42, 0.3)`                                                            |
| Title bar separator              | `1px solid rgba(255,255,255,0.06)` bottom border                                   |
| Default window size              | `640px × 480px`                                                                    |

### Window Title Bar Layout

```
[Icon 16px] [App Title — 12px, font-weight 600, #f1f5f9]  [· · ·]  [●(yellow)] [●(green)] [●(red)]
```

Confirmed from screenshots:

- **macOS-style traffic lights**: The control buttons use macOS ordering — but **in the approved screenshots, the three dots (⋯) appear on the RIGHT side of the title**, opposite to the traffic light buttons on the LEFT.
- Control button order (left to right): close (red), minimize (yellow), maximize (green) — wait — see screenshot analysis below.

> **⚠️ IMPORTANT CONFLICT DETECTED**
> In `desktop-home.png`, the window control dots appear on the **LEFT** side of the title bar (macOS convention), but the approved window chrome code places yellow=minimize, green=maximize, red=close in that order. In `file-app.png` and `setting-app.png`, three dots appear on the LEFT. The title is centered. A "..." overflow menu button appears on the RIGHT of the Files window. The current implementation matches the screenshots correctly for the left-dot layout.

### Window Icon + Title

- Small 16px app icon in title bar, left of title text.
- Title text: font-size 12px, font-weight 600, color `#f1f5f9`.
- Title is center-aligned in some windows (`desktop-home.png`: "About App" appears centered with icon).
- Overflow menu (⋯) on the far right of the title bar (Files app).

### Focus States

- Focused window: full opacity (1.0), brighter border, heavier shadow.
- Unfocused window: opacity 0.85, dimmer border, lighter shadow.
- Focused window appears on top (z-index management).

### Minimized State

- Window slides down and scales to `translateY(200px) scale(0.5)` with `opacity: 0.5`.
- Minimized window represented in taskbar as a dimmed icon.
- Clicking minimized taskbar icon restores the window.

### Maximized State

- Window fills the entire desktop surface (not including taskbar).
- Position: `left: 0, top: 0, width: 100%, height: 100%`.
- Border radius: `0px` when maximized.
- Smooth CSS transition from windowed to maximized state.

### Window Spacing (Cascade)

- Each new window opens at a cascaded offset from the previous.
- Default cascade: `+30px x, +30px y` per new window.
- Minimum position: starts at approximately `(60, 40)` from top-left.

### Layering Behavior

- Windows use `z-index` for layering.
- Focused window has the highest `z-index`.
- Window manager tracks focus stack.
- Desktop icons appear behind all windows (lowest `z-index`).
- Taskbar appears above all windows (fixed bottom, high `z-index`).

---

## 4. Typography Rules

### Font Family

**Primary Font**: System sans-serif stack. The screenshots show a clean, geometric sans-serif typeface. Recommended: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

> **Note**: No Google Font is explicitly loaded in the current implementation. Inter or a similar humanist sans-serif should be adopted as the official typeface for Phase 3.

### Type Scale

| Role               | Size        | Weight         | Color                             | Usage                                             |
| ------------------ | ----------- | -------------- | --------------------------------- | ------------------------------------------------- |
| Display / Clock    | `64px–72px` | 300–400 (thin) | `#ffffff`                         | Lock screen clock                                 |
| App Title (window) | `12px`      | 600            | `#f1f5f9`                         | Window chrome title                               |
| Page Heading       | `28px–32px` | 700            | `#f1f5f9`                         | Inside app (e.g., "Jainil Pandya" in About)       |
| Section Label      | `11px`      | 600            | `rgba(255,255,255,0.5)` uppercase | "LOCATIONS", "FOLDERS", "SYSTEM THEME" (Settings) |
| Body Text          | `13px–14px` | 400            | `#94a3b8`                         | Descriptions, metadata                            |
| Caption / Date     | `12px`      | 400            | `rgba(255,255,255,0.6)`           | File size, dates, subtitles                       |
| Lock Screen Date   | `14px`      | 500            | `#ffffff` uppercase               | "SUNDAY, JUNE 14"                                 |
| Tag / Badge        | `11px–12px` | 500            | accent-on-dark                    | Role tags ("Software Developer")                  |
| Nav Tab            | `14px`      | 400–500        | active: white, inactive: muted    | Settings tab labels                               |

### Heading Hierarchy Inside Apps

```
H1 — Owner name ("Jainil Pandya") — 28–32px, 700
H2 — Section title ("Appearance", "Connect") — 20–24px, 600
H3 — Subsection ("System Theme", "Accent Color") — 11px uppercase label — NOT a heading element
Body — Descriptions, metadata — 13–14px, 400
```

### Labels

- SCREAMING_CAPS labels (e.g., "LOCATIONS", "FOLDERS", "ACCENT COLOR") are used as section dividers inside apps.
- Font size: 11px, letter-spacing: 0.08em, color: `rgba(255,255,255,0.45)`.

### Metadata

- File sizes, timestamps, item counts: 12px, `#64748b` (slate-500).
- Format: "2.4 MB • Today", "12 items".

### Card Content

- Card title: 14px, 600, `#f1f5f9`.
- Card description: 13px, 400, `#94a3b8`.
- Card meta: 12px, `#64748b`.

---

## 5. Color System

### Background Colors

| Token                       | Value                     | Usage                                           |
| --------------------------- | ------------------------- | ----------------------------------------------- |
| `--color-bg-base`           | `#0a0f1a`                 | Deepest background (behind windows, bootscreen) |
| `--color-bg-surface`        | `rgba(30, 41, 59, 0.95)`  | Window chrome background                        |
| `--color-bg-title-bar`      | `rgba(15, 23, 42, 0.6)`   | Focused title bar                               |
| `--color-bg-title-bar-dim`  | `rgba(15, 23, 42, 0.3)`   | Unfocused title bar                             |
| `--color-bg-taskbar`        | `rgba(15, 23, 42, 0.8)`   | Taskbar glass background                        |
| `--color-bg-card`           | `rgba(30, 41, 59, 0.8)`   | Inside-app cards                                |
| `--color-bg-sidebar`        | `rgba(20, 30, 48, 0.6)`   | App sidebar (Files, Settings)                   |
| `--color-bg-sidebar-active` | `rgba(59, 130, 246, 0.2)` | Active sidebar row highlight                    |
| `--color-bg-notification`   | `rgba(30, 41, 59, 0.8)`   | Lock screen notification pill                   |

### Surface Colors

| Token                  | Value                    | Usage                                |
| ---------------------- | ------------------------ | ------------------------------------ |
| `--color-surface-1`    | `rgba(255,255,255,0.05)` | Subtle card hover, settings row      |
| `--color-surface-2`    | `rgba(255,255,255,0.08)` | Active card, theme preview selection |
| `--color-border`       | `rgba(255,255,255,0.08)` | General separator lines              |
| `--color-border-focus` | `rgba(255,255,255,0.12)` | Focused window borders               |

### Accent Colors

From `setting-app.png` accent color selector (left to right): Blue, Purple, Deep Purple, Pink/Magenta, **Teal/Green (selected ✓)**, Bright Green, Amber/Yellow, Orange.

| Token                   | Value                            | Usage                                         |
| ----------------------- | -------------------------------- | --------------------------------------------- |
| `--color-accent`        | `#10b981` (teal-green, selected) | Primary accent — buttons, active states, tags |
| `--color-accent-blue`   | `#3b82f6`                        | Alternative accent — folder icons in Files    |
| `--color-accent-purple` | `#8b5cf6`                        | Alternative accent                            |
| `--color-accent-pink`   | `#ec4899`                        | Alternative accent                            |
| `--color-accent-amber`  | `#f59e0b`                        | Alternative accent                            |
| `--color-accent-orange` | `#f97316`                        | Alternative accent                            |

The default selected accent in the approved screenshots is **teal-green (`#10b981`)**.

### Text Colors

| Token                    | Value                    | Usage                            |
| ------------------------ | ------------------------ | -------------------------------- |
| `--color-text-primary`   | `#f1f5f9`                | Primary text on dark backgrounds |
| `--color-text-secondary` | `#94a3b8`                | Body text, descriptions          |
| `--color-text-muted`     | `#64748b`                | Metadata, timestamps             |
| `--color-text-label`     | `rgba(255,255,255,0.45)` | Section labels (uppercase)       |
| `--color-text-inverse`   | `#0f172a`                | Text on light/accent backgrounds |

### Hover States

- Surface hover: `background` transitions to `rgba(255,255,255,0.05)`.
- Sidebar row hover: blue-tinted `rgba(59, 130, 246, 0.15)`.
- Taskbar icon hover: scale-up `1.1` + subtle background `rgba(255,255,255,0.08)`.
- Desktop icon hover: text and icon lighten slightly.

### Active States

- Active sidebar item (Files, Settings): `rgba(59, 130, 246, 0.2)` background, bright text.
- Active taskbar app: indicator dot/underline in accent color.
- Active settings tab: bright underline in accent color (confirmed: "Appearance" tab in Settings has accent underline).

### Notification Colors

| Type                   | Color               | Usage                            |
| ---------------------- | ------------------- | -------------------------------- |
| Unread badge           | `#ef4444` (red)     | Notification bell count badge    |
| Info notification      | `#3b82f6` (blue)    | Informational messages           |
| Recruiter notification | White text on glass | "2 new messages from Recruiters" |

### Window Control Colors

| Button   | Color                     | Usage                       |
| -------- | ------------------------- | --------------------------- |
| Close    | `#ef4444` (red)           | macOS-style close button    |
| Minimize | `#fbbf24` (amber/yellow)  | macOS-style minimize button |
| Maximize | `#34d399` (emerald/green) | macOS-style maximize button |

---

## 6. Component Rules

### Buttons

**Primary Button**

- Background: `--color-accent` (teal-green)
- Text: white, 13px, font-weight 600
- Border radius: `8px`
- Padding: `8px 16px`
- Example: "View Resume" button in About app, "+ New" in Files

**Secondary / Ghost Button**

- Background: `rgba(255,255,255,0.08)`
- Border: `1px solid rgba(255,255,255,0.12)`
- Text: `#f1f5f9`, 13px
- Example: "+ New Project" in Settings sidebar

**Taskbar Icon Button**

- Background: transparent, hover: `rgba(255,255,255,0.08)`
- Icon size: 24px
- Border radius: `8px`
- No visible label on taskbar — icon only for pinned apps

**Unlock Button (Lock Screen)**

- Background: `rgba(255,255,255,0.15)` + blur
- Border: `1px solid rgba(255,255,255,0.2)`
- Text: white, centered, with lock icon
- Border radius: `24px` (pill shape)
- Example: "🔒 Unlock Device" button

### Cards

**Profile Card** (About App — top section)

- Background: `rgba(255,255,255,0.04)` or `rgba(30,41,59,0.6)`
- Border: `1px solid rgba(255,255,255,0.08)`
- Border radius: `12px`
- Padding: `20px 24px`
- Content: Avatar (circular, ~60px), Name (H1), Role tags, Bio text

**Info Card** (About App — Connect section, Current Focus section)

- Same background/border as Profile Card
- Smaller padding: `16px 20px`
- Content: Icon + label pairs

**File Card** (Files App — folder/file grid)

- Background: transparent, hover: `rgba(255,255,255,0.04)`
- Content: Colored icon (64px), label, metadata
- Border radius: `8px`
- Selected state: blue highlight border

**Settings Theme Preview Card**

- Background: dark or light preview thumbnail
- Border: `2px solid rgba(255,255,255,0.1)`, active: `2px solid var(--color-accent)`
- Border radius: `8px`
- Contains: a mini OS desktop preview image

### Lists

**Sidebar Navigation List** (Files App, Settings App)

- Section header: 11px, uppercase, muted — e.g., "LOCATIONS", "FOLDERS"
- List item height: `40px`
- List item padding: `0 12px`
- Active item: rounded accent background highlight
- Item layout: `[Icon 18px] [Label]` — icon tinted to match item role
- Bottom of sidebar: Storage widget (Files) or User profile + action button (Settings)

**Notification List** (Notification Panel)

- Each notification: icon + title + body + timestamp
- Dismiss button per notification
- "Mark all read" action at top of panel

### Inputs

**Search Input** (Command Palette)

- Background: `rgba(15, 23, 42, 0.9)` + blur
- Border: `1px solid rgba(255,255,255,0.12)`
- Border radius: `12px`
- Text: `#f1f5f9`, 16px
- Placeholder: muted text
- No visible search button — search on type

**Settings Row Input**

- Inline controls: radio buttons, toggle switches, color pickers
- Row background on hover: `rgba(255,255,255,0.04)`
- Row separator: subtle bottom border

### Search

- Global search is a system-level command palette (Ctrl+K or taskbar icon).
- Per-app search (Files) uses a magnifier icon in the window title bar area.
- The Files app shows a search icon in the upper-right corner of its window chrome.

### Navigation

**Inside Apps — Tab Navigation** (Settings App)

- Horizontal tabs at the top of the content area: "General", "Appearance", "Network", "Security"
- Active tab: white text with accent-colored underline indicator (border-bottom)
- Inactive tabs: muted text, no border
- Tab font: 14px, 500

**Inside Apps — Sidebar Navigation** (Files App, Settings App)

- Left panel, fixed width (~240–280px)
- Separated into labeled sections
- See Lists section above

### Panels

**Glass Panel** (Taskbar, Notification overlay, Lock screen notification)

- `background: rgba(15,23,42,0.8)`, `backdrop-filter: blur(20px)`
- Border: `1px solid rgba(255,255,255,0.08)`

**App Content Panel**

- `background: rgba(18,25,40,0.8)`
- Contains the main scrollable content area of an app
- No extra borders — the window chrome provides the frame

**Sidebar Panel** (Left panel in Files/Settings)

- `background: rgba(20,30,48,0.6)` or slightly darker than content area
- Right border: `1px solid rgba(255,255,255,0.06)`
- Width: ~240px fixed

### Settings Rows

From `setting-app.png`:

- Section label: 11px, uppercase, gray — e.g., "SYSTEM THEME", "ACCENT COLOR", "DESKTOP WALLPAPER"
- Section spacing: `24px` top margin between sections
- Each setting area is a labeled block, not a table row
- Accent color selector: horizontal row of colored circular swatches (40px diameter), active swatch has a checkmark overlay
- Theme selector: horizontal row of preview cards (card width ~170px)
- Wallpaper selector: grid of wallpaper thumbnail previews with "Browse" button

---

## 7. Application Rules

### Core OS Contract

Every application built for ApexOS MUST:

1. **Look like an installed OS application** — not a webpage, blog, or marketing landing page.
2. **Use the window chrome as its outer frame** — never render its own title bar or window frame.
3. **Never introduce a new navigation system** — use sidebar + tab navigation (as in Files/Settings) or flat content (as in About). Do not add browser-style back/forward buttons unless explicitly OS-appropriate (Files has these).
4. **Never break the taskbar model** — the taskbar is always present and always on top. Apps never overlap the taskbar.
5. **Never break the window model** — apps render inside `WindowChrome`. They are not full-page routes.
6. **Use the shared color system** — no ad-hoc color choices. All colors come from the CSS custom properties defined in this document.
7. **Use the shared typography scale** — no ad-hoc font sizes or weights outside the defined scale.
8. **Respect glassmorphism discipline** — frosted glass is used intentionally, not scattered.

### Internal App Layout Patterns

Two canonical layouts approved in screenshots:

**Layout A: Profile / Dashboard** (About App)

- Full-width content, no sidebar
- Large hero section (profile card)
- Secondary info cards in a 2-column grid below

**Layout B: Master-Detail with Sidebar** (Files App, Settings App)

- Left sidebar panel (~240px) with navigation list
- Right content area fills remaining space
- Content area may have horizontal tabs (Settings)

### Disallowed Patterns

- ❌ Website-style hero sections with full-page background images
- ❌ Scrolling landing pages with sections (e.g., "About Me", "My Work", "Contact" stacked vertically)
- ❌ Navbar with links at the top of app content
- ❌ Footer sections inside app windows
- ❌ Bright/light backgrounds inside app windows
- ❌ Rounded colorful cards that don't follow the card spec
- ❌ Font sizes larger than 32px inside app content areas
- ❌ External link behavior that exits the OS (use internal browser app)

---

## 8. Phase 3 Design Requirements

The following apps must be implemented for Phase 3. Each section specifies the approved layout pattern and key design constraints.

### About App ✅ (reference implementation)

- **Layout**: Profile / Dashboard (Layout A)
- **Window title**: "About App" with person icon
- **Required sections**: Profile card (avatar, name, role tags, bio), Connect card (email, GitHub, location), Current Focus card (active project with "View Resume" button)
- **Accent color usage**: Role tags use accent background; "View Resume" button uses accent color

### Skills App

- **Layout**: Master-Detail with Sidebar (Layout B) OR full-width card grid
- **Window title**: "Skills App" with `<>` code icon
- **Required sections**: Skill categories (Frontend, Backend, Mobile, etc.) as cards or sidebar navigation
- **Confirmed in desktop-home.png**: Two cards visible — "Frontend: React, Next.js, Tailwind CSS" and "Backend: Node.js, Express, PostgreSQL"
- **Design rule**: Skill cards must use the approved card spec. No skill meter/progress bars with bright gradient fills.

### Projects App

- **Layout**: Master-Detail with Sidebar (Layout B)
- **Window title**: "Projects App" with folder icon
- **Required sections**: Project list in sidebar or top, project detail in main area, reel/media viewer
- **Design rule**: Project cards must feel like file entries, not portfolio showcase cards with large gradients.

### Files App ✅ (reference implementation)

- **Layout**: Master-Detail with Sidebar (Layout B)
- **Sidebar sections**: LOCATIONS (Home, Recent, Starred), FOLDERS (Documents, Downloads, Pictures)
- **Content area**: Breadcrumb navigation, grid/list toggle, folder grid, recent files grid
- **Sidebar bottom**: Storage widget
- **Status bar bottom**: Item count, sync status

### Browser App

- **Layout**: Full window content (no sidebar for navigation)
- **Window title**: "Browser" with globe icon
- **Design rule**: Must look like an OS browser, not a `<iframe>` wrapper. Include address bar at the top of the content area styled like an OS browser bar.
- **Internal use**: Resume, case studies, project details

### Contact App

- **Layout**: Profile / Dashboard (Layout A) or minimal form layout
- **Window title**: "Contact" with mail or person icon
- **Design rule**: Contact form must use OS-style input fields, not web-form styling.

### Gallery App

- **Layout**: Full-width grid (no sidebar needed)
- **Window title**: "Gallery" with image icon
- **Design rule**: Image grid with consistent thumbnail sizes, hover to reveal metadata overlay.

### Resume App

- **Layout**: Full-window document viewer OR opens in Browser App
- **Window title**: "Resume" with document icon
- **Design rule**: Either render a styled resume document or open the PDF in the Browser App. Do not create a website-style resume page.

### Terminal App

- **Layout**: Full window, dark background
- **Window title**: "Terminal" with `>_` icon
- **Design rule**: Monospaced font (e.g., `'JetBrains Mono', 'Fira Code', monospace`), green or teal text on near-black background, genuine prompt behavior.

### Achievements App

- **Layout**: Profile / Dashboard (Layout A) — achievement card grid
- **Window title**: "Achievements" with trophy or star icon
- **Design rule**: Achievement cards should feel like OS notification cards, not badge/gamification UI from a web app.

---

## 9. Icon System

### Desktop Icons

From `desktop-home.png`:

- Icon container: Rounded square (`border-radius: 14–16px`), ~48px
- Icon background: Solid accent-tinted color (About = blue, Skills = teal, Projects = dark teal-green, Files = near-black with teal border, Browser = dark with globe)
- Icon image: White SVG icon centered, ~28px
- Label: White, 12px, centered below icon, 1-2 words max

### Taskbar Icons

- Icon only, no label
- Size: ~24px
- Active indicator: small accent dot below icon
- Hover: scale + background highlight

### App Title Bar Icons

- 16px, same style as desktop icon but smaller
- Appears left of window title text

---

## 10. Motion and Animation Rules

### System-Level Animations

| Event               | Animation                                               |
| ------------------- | ------------------------------------------------------- |
| Boot screen         | Progress bar fill, fade out                             |
| Lock screen appear  | Fade in                                                 |
| Lock screen dismiss | Slide up + fade out                                     |
| Window open         | `scale(0.95) → scale(1)` + `opacity: 0 → 1`, 250ms ease |
| Window close        | `scale(1) → scale(0.95)` + `opacity: 1 → 0`, 250ms ease |
| Window minimize     | `translateY(200px) scale(0.5)`, 250ms ease              |
| Window maximize     | Width/height/border-radius transition, 250ms ease       |
| Window focus        | `opacity: 0.85 → 1` on focus, 200ms ease                |

### Micro-Interactions

- Taskbar icon hover: `transform: scale(1.1)` on hover
- Desktop icon hover: Subtle brightness increase
- Button hover: Background color shift + slight scale
- Settings theme card selection: Border color change
- Notification badge: Pulse animation on new notification
- Lock screen clock: Live updates every second (no animation, just rerender)

### Duration Scale

| Name   | Duration | Usage                                           |
| ------ | -------- | ----------------------------------------------- |
| Fast   | 150ms    | Hover states, button presses                    |
| Normal | 250ms    | Window transitions, panel opens                 |
| Slow   | 400ms    | Boot/lock screen transitions, wallpaper changes |

### Easing

- Default: `ease` (CSS default)
- Window transitions: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like)
- Boot/lock: `ease-out`

---

## 11. Design Tokens Reference

All values below must be defined as CSS custom properties (`:root` level or theme scope):

```css
:root {
  /* Backgrounds */
  --color-bg-base: #0a0f1a;
  --color-bg-surface: rgba(30, 41, 59, 0.95);
  --color-bg-title-bar: rgba(15, 23, 42, 0.6);
  --color-bg-title-bar-dim: rgba(15, 23, 42, 0.3);
  --color-bg-taskbar: rgba(15, 23, 42, 0.8);
  --color-bg-card: rgba(30, 41, 59, 0.8);
  --color-bg-sidebar: rgba(20, 30, 48, 0.6);
  --color-bg-sidebar-active: rgba(59, 130, 246, 0.2);

  /* Surfaces */
  --color-surface-1: rgba(255, 255, 255, 0.05);
  --color-surface-2: rgba(255, 255, 255, 0.08);
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-focus: rgba(255, 255, 255, 0.12);

  /* Text */
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  --color-text-label: rgba(255, 255, 255, 0.45);

  /* Accent */
  --color-accent: #10b981;
  --color-accent-hover: #059669;
  --color-accent-blue: #3b82f6;
  --color-accent-purple: #8b5cf6;
  --color-accent-pink: #ec4899;
  --color-accent-amber: #f59e0b;
  --color-accent-orange: #f97316;

  /* Window Controls */
  --color-win-close: #ef4444;
  --color-win-minimize: #fbbf24;
  --color-win-maximize: #34d399;

  /* Blur */
  --blur-glass: blur(16px);
  --blur-taskbar: blur(20px);

  /* Border Radius */
  --radius-window: 12px;
  --radius-card: 12px;
  --radius-button: 8px;
  --radius-icon: 14px;
  --radius-pill: 24px;

  /* Shadows */
  --shadow-window-focused: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
  --shadow-window-blur: 0 4px 16px rgba(0, 0, 0, 0.3);

  /* Typography */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "Courier New", monospace;

  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);

  /* Wallpaper */
  --wp-bg: linear-gradient(135deg, #0d1b2a 0%, #0a3040 40%, #062030 100%);
}
```

---

## 12. Screenshot Reference Index

| File                           | Screen               | Authority                                                |
| ------------------------------ | -------------------- | -------------------------------------------------------- |
| `docs/design/boot-screen.png`  | Boot sequence        | ApexOS logo, name, loading bar                           |
| `docs/design/lock-screen.png`  | Lock screen          | Clock, date, notification pill, unlock button, wallpaper |
| `docs/design/desktop-home.png` | Desktop home         | Desktop icons, About/Skills windows, taskbar             |
| `docs/design/file-app.png`     | Files application    | Sidebar, folder grid, file grid, storage widget          |
| `docs/design/setting-app.png`  | Settings application | Tab navigation, theme selector, accent picker, wallpaper |

These screenshots are the **highest authority** for visual decisions. If code conflicts with a screenshot, the screenshot wins and the conflict must be documented.

---

_Last updated: 2026-06-14 — Phase 2 complete. Design System established for Phase 3._
