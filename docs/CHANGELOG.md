# CHANGELOG

## Unreleased

### Product Blueprint (2026-06-27)

- **Created `docs/PRODUCT_BLUEPRINT.md`**: New highest-level product specification document. Answers "What should My OS Portfolio become when it is finished?" in full. Covers: Product Vision, Product Principles (P-1 through P-7), complete Recruiter Journey (Boot → Terminal), full Product Map with specs for all 11 apps (About, Projects, Skills, Resume, Contact, Settings, Files, Browser, Gallery, Achievements, Terminal + AI Assistant), Application Relationships diagram, Global UX (windows, animations, notifications, command palette, keyboard shortcuts, context menus, accessibility, error handling), Design Philosophy (Samsung DeX inspiration, glassmorphism discipline, dark-native UI), Content Strategy (projects, resume, certificates, images, downloads, case studies, future blog), all 11 Wow Moments with implementation status, complete Success Criteria checklist, and Phase 4/5 Future Vision.
- **Updated `docs/AGENT_GUIDE.md`**: Added `PRODUCT_BLUEPRINT.md` as the first document in the agent onboarding reading order.
- **Updated `docs/AGENT_RULES.md`**: Added `PRODUCT_BLUEPRINT.md` as item 1 in the mandatory session start reading order.
- **Updated `docs/HANDOFF.md`**: Added `PRODUCT_BLUEPRINT.md` as the first item in the core reference documents for next agent.

### UI/UX Convergence Pass (Production Ready)

- **Vector SVG App Icons**: Generated high-fidelity SVG icon assets for `about.svg`, `projects.svg`, `resume.svg`, `contact.svg`, and `settings.svg` in `public/icons/` to resolve broken image rendering and eliminate 404/500 resource loading errors.
- **Taskbar Pinned App Filtering**: Refactored center app list in the desktop taskbar to show only pinned applications (`app.pinned === true`) or applications with active open windows, matching desktop shell user expectations.
- **Adaptive Badges & Search Border Shadows**: Adapted shared UI `AppTagBadge` component and `ProjectsSearch` component focus states to use modern CSS `color-mix` functions against `--color-accent` variables, enabling theme elements to adapt instantly to selected settings theme accents.
- **Desktop Context Menu Handlers**: Wired context menu items to operational code: clicking "Refresh" reloads the page window, and clicking "Display Settings" launches the Settings App.
- **Welcome Page Alignment**: Bound "Explore Projects" welcome button layout to the standard system `--color-accent` theme.
- **Forced Dark OS Mode**: Forced dark mode rendering across all components by injecting the `data-theme="dark"` attribute on the root layout html element, and set the body background to `var(--color-bg-base)` to prevent initial white/gray styling flashes.

### Skills App Ecosystem Launch (Production Ready)

- **Static Skills Data Layer**: Created `src/data/skills.ts` containing categorized skill structures, experience levels, years of experience, and highlights descriptions.
- **Master-Detail Layout B Sidebar UI**: Constructed client application component `SkillsApp` inside `src/apps/skills/` using the system's sidebar and content panel layout.
- **Teal SVG Icon**: Created a clean brand-aligned teal square background with a centered white code SVG icon at `/public/icons/skills.svg`.
- **Custom Hover Transitions**: Designed sliding translateX sidebar animations and card-lifting translateY transition shadow elevations.
- **Standard Layout Badges**: Styled and rendered skill levels (expert, proficient) using the system-defined shared `<AppTagBadge>` component without arbitrary visual indicators/progress bars.
- **Focus-Gated Keyboard Categories Selection**: Bound keyboard listeners to categories (`ArrowUp`/`ArrowDown`) restricted strictly to when the Skills window is focused in the OS runtime environment to prevent system keystroke leaks.

### Projects App V2 Flagship Experience (Production Ready)

- **Backward-Compatible Schema Expansion**: Added `architectureHighlights` array field to `projectSchema` with Zod default validation.
- **Multiple Named Reels (V2 Foundation)**: Extended database structure inside `projects.json` with named `reels` configuration for `apex-os` (containing "Product Overview" and "Engineering Deep Dive" named reels).
- **Interactive Reels Tab Controls**: Switched to scoped event handlers and container auto-focus in `ReelPlayer` to eliminate global keyboard hijacking when the Projects App is not focused. Renders `ReelSelector` tabs for multi-reel navigation.
- **Visual Cover Gradient Blending**: Enhanced project header media cover image in `ProjectDetail.tsx` with a bottom linear gradient blend into `--color-bg-surface` background and a dark overlay.
- **Case Study Typesetting**: Added dedicated `ARCHITECTURE HIGHLIGHTS` render group, cleaned up features/challenges/solutions bullets spacing, and enforced screaming labels.
- **List Arrow Keyboard Navigation**: Added `ArrowUp`/`ArrowDown` listener in `ProjectsApp` to scroll sidebar selections when focused, and `Escape` to blur/clear searches.
- **Project Switching Transitions**: Integrated client-side pending loaders with an OS-style spinner overlay during project selections.
- **Clear Search & Filters**: Rebound the sidebar's escape clearing button to reset both search query and filter chips synchronously.
- **Interactive Badges**: Added mouse state event transitions (translateY hover lift, background overlays) to shared `AppTagBadge` component.

### Design Convergence Pass (Production Ready)

- **Default Wallpaper Alignment**: Updated `defaultWallpaper` value in `src/core/wallpaper/index.ts` to matches the Deep Slate Waves gradient.
- **Window Chrome Redesign & Resize**: Relocated traffic light window controls to the left, centered the title/icon, added right-side overflow button, and implemented native mouse drag resizing on all window borders.
- **Desktop Shell Column Icon Flow**: Aligned desktop icon grid to display in vertical column flow starting top-left.
- **Taskbar Refinement**: Restyled taskbar with DeX-aligned height (52px), glass blur (20px), system tray status icons (WiFi, Battery), stacked clock dates/times, and center icon app links with active indicator dots.
- **Settings Layout B Refactor**: Overhauled the Settings App layout using the Master-Detail sidebar architecture, adding accent color swatches with dynamic CSS root variable updates, wallpaper previews, and system specs.

### Phase 3 Flagship Apps Implementation (Production Ready)

- **Window Chrome Controls Alignment**: Reordered title bar control buttons to Close (Red) → Minimize (Yellow) → Maximize (Green) from left to right.
- **Static Resume Data Layer**: Created `src/data/resume.ts` storing work experience, education, skills, and certifications.
- **About App Rewrite**: Redesigned to follow Layout A profile dashboard, including active project details and programmatically linked CTAs.
- **Resume App**: Built master-detail Document Viewer matching Layout B with document statistics and PDF downloading triggers.
- **Contact App**: Utility form layout with client input validation, success transitions, and quick-action direct links.
- **Settings App Consistency**: Refactored Settings App spacing, font scaling, and custom switch styling.
- **Files App (Stage 4.3)**: Implemented 745-line file explorer with sidebar sections (LOCATIONS, FOLDERS), breadcrumb navigation, grid/list view toggle, folder/file grid with icons, and bottom status bar. Registered with `pinned: true`, `defaultSize { width: 1100, height: 700 }`.
- **Browser App (Stage 4.2)**: Implemented 593-line tabbed browser with address bar (back/forward/refresh buttons, URL input), iframe content renderer with sandbox, navigation history, and keyboard shortcuts (⌘+T new tab, ⌘+L focus address, ⌘+R reload, ⌘+W close tab). Registered with `pinned: true`, `defaultSize { width: 1000, height: 700 }`.
- **Gallery App (Stage 5.1)**: Implemented 443-line image gallery with 4-column responsive thumbnail grid, hover metadata overlays, click-to-open lightbox viewer, and keyboard navigation (←/→ arrows, Escape). Registered with `pinned: true`, `defaultSize { width: 900, height: 640 }`.
- **Terminal App (Stage 5.2)**: Implemented 479-line simulated shell with monospaced dark terminal, commands (help, whoami, ls projects, cat resume, open <app>, clear, neofetch), character-by-character typing animation, command history (ArrowUp/Down), and tab completion. Registered with `pinned: false`, `defaultSize { width: 760, height: 480 }`.
- **Achievements App (Stage 5.3)**: Implemented 286-line achievement cards grid with 2-3 column responsive layout, category filtering (Project, Certification, Contribution, Recognition), and verification links. Registered with `pinned: false`, `defaultSize { width: 720, height: 560 }`.

### Phase 3 Projects App Foundational Architecture (Production Ready)

- **Global Typography and Design Tokens**: Imported Google Inter and JetBrains Mono fonts and mapped all CSS design tokens inside `src/app/globals.css`.
- **Registry Sizing & Pinned State**: Extended `AppMeta` registry configuration with `defaultSize` and `pinned` status, updating `WindowChrome` to scale to sizes specified by apps.
- **Layout B Shared UI Primitives**: Scaffolds `AppSidebar` (240px width), `AppContentArea` (flex scrollable panel), and `AppTagBadge` (interactive/static category and status dot markers) in `src/shared/ui/`.
- **Standalone Reels Engine**: Created a portable slide and video player carousel component `ReelPlayer` supporting touch gestures, keyboard arrows, and v2 named reels tabs selector.
- **Projects App Layout B Architecture**: Completely rewrote the flagship Projects App. Integrates search, filter combination bar, sidebar project rows, details metadata section, cover image, and external link hooks that run via Browser App.
- **TypeScript & Eslint Fixes**: Resolved all TS warnings and compiler errors under `exactOptionalPropertyTypes: true` and escaped unescaped JSX quotes.

### Phase 2 Completion Pass (Production Ready)

- **Wallpaper & Settings Integration**: Subscribed `src/core/wallpaper` to settings store changes to automatically update CSS variables (`--wp-bg`, etc.) when settings change.
- **Lock Screen Gating**: Configured `completeBoot()` in `src/core/os-runtime` to read `lockScreenEnabled` from settings to bypass the lock screen when disabled.
- **Window Management Fixes**: Changed `minimizeWindow()` to use explicit minimize behavior, and fixed window ID uniqueness by appending a random suffix when opening windows.
- **Desktop Shell Sidebar Cleanup**: Removed the vertical icon sidebar in `src/shells/desktop` to eliminate duplication and align with the Samsung DeX layout.
- **Translucent Tablet & Mobile Shells**: Added wallpaper support (`--wp-bg`) and glassmorphic headers/nav bars to mobile and tablet shells, and supported rendering component-based apps.
- **Memoized Launchers**: Wrapped launch handlers in tablet shell in `useCallback` for optimized performance.
- **Window Dragging & Maximize Fixes**: Moved `WindowChrome` dragging to global listeners (`window`) to prevent stuttering/sticking when cursor leaves window boundaries. Corrected maximized window coordinates to (0,0) top-left.
- **WindowChrome Code Cleanup**: Renamed timer variable inside `useEffect` to `animId` to fix variable shadow warning.
- **TypeScript & ESLint Fixes**: Resolved all TS warnings/errors including unescaped apostrophes, anonymous default exports, and synchronous setState inside effects in `CommandPalette`.

### Phase 2b — OS Runtime Services (complete)

- Implemented command palette (`src/features/command-palette/index.tsx`): `CommandPalette` component with full-screen overlay, centered search panel (540px max-width, glass-morphism backdrop), real-time app filtering by title/description, keyboard navigation (arrow keys, Enter to launch, Escape to close), and app launch integration via `setActiveApp` / `openWindow` / `focusWindow`. Wire into `src/shells/desktop/index.tsx` with global `useEffect` keydown listener for Ctrl+K / Cmd+K toggle and conditional rendering.
- Implemented core notifications (`src/core/notifications/index.ts`): `Notification` type with id, title, message, type (info/success/warning/error), timestamp, read state. Module-level queue with `MAX_NOTIFICATIONS` cap (50). Subscriber API (`subscribeToNotifications`, `getNotifications`). Queue management (`addNotification`, `dismissNotification`, `markAsRead`, `markAllAsRead`, `clearAllNotifications`). Badge API (`getUnreadCount`). localStorage persistence.
- Wired notifications into desktop shell taskbar (`src/shells/desktop/index.tsx`): added `NotificationTray` component with bell SVG icon, unread count badge (red circle indicator), click-to-open dropdown popover with scrollable notification list, per-notification type icon, dismiss button, mark-all-read button, and timestamp display.
- Implemented corrected window content model: replaced page-route mapping with dynamic registry-driven Component mapping (`src/features/app-registry/index.ts`). Open windows now load client-side React Components concurrently inside draggable WindowChrome shells without depending on active page navigation.
- Created standalone, independent application components under `src/apps`: AboutApp, ProjectsApp, and SettingsApp (wired directly to core settings state and localStorage persistence).
- Redesigned root path page `/` with welcome desktop state offering quick start launch triggers.
- Implemented core settings (`src/core/settings/index.ts`): `SettingsState` type with wallpaper, wallpaperVariant, theme, lockScreenEnabled fields. Module-level state with subscriber API (`subscribeToSettings`, `getSettings`, `updateSettings`, `resetSettings`). localStorage persistence (`my-os-portfolio-settings` key) with SSR-safe access. Partial update via `updateSettings()` merges into current state. Exports `ThemeMode` type.

### Phase 2a — OS Shell Foundation

- Implemented boot sequence (`src/features/boot/index.tsx`): full-screen dark gradient overlay, CSS-animated loading bar ("Loading system components..."), auto-transition after ~2.2s calling `completeBoot()`.
- Modified `src/core/os-runtime/index.ts` to default `booted` to `false`, added `completeBoot()` function.
- Integrated boot screen into `src/shells/index.tsx` via runtime state subscription — boot gates all shell rendering.
- Implemented lock screen (`src/features/lock-screen/index.tsx`): full-screen lock overlay with live-updating 12h clock, formatted date, dark gradient wallpaper fallback (`--ls-bg` CSS var), fade-in animation, ambient clock glow, pulse unlock hint, and unlock via click/touch/key (Space/Enter/Escape).
- Extended `src/core/os-runtime/index.ts` with `locked` state, `unlock()`, and `lock()` functions.
- Integrated lock screen into `src/shells/index.tsx` — boot → lock → desktop flow is fully operational.
- Implemented wallpaper system (`src/core/wallpaper/index.ts`): core module with subscriber API, `WallpaperConfig` state (type, value, variant), `getWallpaper()`, `setWallpaper()`, `subscribeToWallpaper()`, `resetWallpaper()`. CSS custom property side-effect sets `--wp-bg`, `--wp-type`, `--wp-variant` on `document.documentElement`. Default dark gradient fallback.
- Updated `src/features/lock-screen/index.tsx` to consume `--wp-bg` CSS var instead of `--ls-bg` — wallpaper system now controls lock screen background.
- Updated `src/shells/desktop/index.tsx` to consume `--wp-bg` CSS var — desktop surface now shows wallpaper.
- Rewrote `src/shells/desktop/index.tsx`: replaced sidebar+content layout with full OS desktop. Fixed viewport layout, `--wp-bg` wallpaper background, left icon sidebar with app launcher (hover/active states), bottom glass taskbar (`backdrop-filter: blur(12px)`) with live `TaskbarClock`, running-window indicators with focus highlight, system tray placeholder, scrollable content area.
- Implemented window chrome (`src/features/window-chrome/index.tsx`): floating window container with draggable title bar (app icon + title), macOS-style control buttons (close/minimize/maximize with red/yellow/green circles), glass-morphism background (`backdrop-filter: blur(16px)`), 12px rounded corners, focus-differentiated box-shadow. Position state via `useState` + mouse drag handlers with `useRef`-based offset tracking.
- Added `minimizeWindow` and `maximizeWindow` to `src/core/window-manager/index.ts` — toggle functions for `WindowState.minimized`/`maximized` properties.
- Updated `src/shells/desktop/index.tsx`: replaced simple content area with floating window surface; open windows render as `WindowChrome` with cascaded positioning (30px offset per window); focused window receives router `{children}` content; unfocused windows show title placeholder.
- Implemented window controls & animations (`src/features/window-chrome/index.tsx`): CSS-animated open (scale(0.95)→1 + opacity 0→1), close (scale→0.95 + opacity→0, 250ms, `pointerEvents: none`), minimize (translateY(200px) + scale(0.5) + opacity 0.5), maximize (width/height/border-radius transition), focus dimming (non-focused windows opacity 0.85). Taskbar toggle: click focused → minimize, click unfocused → focus.
- Implemented desktop icons (`src/shells/desktop/index.tsx`): added `DesktopIcon` component with double-click detection (300ms timer), single-click select, click-elsewhere deselect. Added `DesktopContextMenu` component with positioned popup, placeholder items (Refresh, Paste, Display Settings), dismiss on click outside or Escape. Icon grid renders on wallpaper surface behind windows.

### Shell Integration

- Extended tablet shell (`src/shells/tablet/index.tsx`) with full runtime state subscription, window manager integration, bottom-dock app launcher, touch-friendly controls, and active app/window display.
- Extended mobile shell (`src/shells/mobile/index.tsx`) with full runtime state subscription, window manager integration, bottom-tab app launcher, path-aware back navigation, safe-area-aware bottom nav padding, and full-screen dark-themed content presentation.
- Fixed Next.js `Route` type casts across all three shells (desktop, tablet, mobile) to use `as Route` instead of `as any`.

### Documentation

- Updated `docs/TASK_BOARD.md`: boot sequence moved to Completed (item 19), lock screen set as In Progress, Phase 2 completion revised to ~30%.
- Updated `docs/PROJECT_STATUS.md`: Phase 2 revised to 30%, overall ~28%, boot sequence listed in implemented and recent changes.
- Updated `docs/HANDOFF.md` with session state for boot sequence completion.
- Updated `docs/CHANGELOG.md` with boot sequence implementation.

---

### Core Runtime & Window Management

- Implemented `src/core/os-runtime/index.ts` with runtime state, app activation, and subscriber pattern.
- Implemented `src/core/window-manager/index.ts` with window lifecycle management and subscription API.
- Fixed `exactOptionalPropertyTypes` TypeScript constraint by making `activeAppId` property explicit.

### Shell Integration

- Integrated OS runtime and window manager into `src/shells/desktop/index.tsx`.
- Added app launcher behavior that sets active app, opens/focuses windows, and navigates to app entry point.
- Fixed `useSyncExternalStore` to include server snapshot function for SSR compatibility.

### Project Content & Data

- Populated `src/data/projects/projects.json` with initial sample project data.
- Fixed project data aggregation in `src/data/projects/index.ts` to use `process.cwd()` for Turbopack compatibility.
- Verified project schema validation works with aggregated JSON collection.

### Build System

- Resolved all TypeScript compilation errors.
- Fixed Next.js router type constraints in desktop shell app launcher.
- Verified production build passes all checks (TypeScript, static generation, image optimization).

### Documentation

- Updated `docs/TASK_BOARD.md` to reflect completed runtime and window manager scaffolding.
- Updated `docs/PROJECT_STATUS.md` with revised phase progress (48% overall, 85% Foundation Phase).
- Updated `docs/CHANGELOG.md` with runtime and shell integration work.

---

### Previous Unreleased

- `docs/AGENT_GUIDE.md` created for multi-agent onboarding and rules.
- `docs/HANDOFF.md` created for session handoffs and context preservation.
- `docs/PROJECT_STATUS.md` created for progress tracking.
- `docs/DECISIONS.md` created for architectural decision recording.
- `docs/ARCHITECTURE_OVERVIEW.md` created to summarize current architecture.
- `docs/ARCHITECTURE_REVIEW.md` created to review and validate architecture assumptions.
- `docs/DEVELOPMENT_ROADMAP.md` created to define future implementation phases.
- `docs/FUTURE_VISION.md` created to define long-term AI and product goals.
- `docs/TASK_BOARD.md` created as the authoritative execution queue.
- Added adaptive shell host support in `src/shells/index.tsx` and placeholder mobile/tablet shells.
- Implemented desktop shell layout composition and app launcher behavior in `src/shells/desktop`.
- Enhanced `src/app/apps/projects/page.tsx` to render richer validated project content.
- Added project detail routing in `src/app/apps/projects/[slug]/page.tsx` and list navigation links.
- Baseline project documentation and agent collaboration system established.
- Added `src/features/app-registry/index.ts` to expose app metadata for shells and launchers.
- Added `src/data/projects/sample-project.json` as a validated sample project for testing and UI development.

## Notes

This changelog is intentionally lightweight and intended to be updated after major project milestones.
