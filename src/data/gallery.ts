export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  width?: number;
  height?: number;
};

export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "/gallery/desktop-home.png",
    alt: "ApexOS Desktop Home Screen",
    title: "Desktop Home",
    description: "Main desktop view with wallpaper, icons, and taskbar",
    date: "2026-06-14",
    tags: ["desktop", "wallpaper", "taskbar"],
  },
  {
    id: "2",
    src: "/gallery/file-app.png",
    alt: "ApexOS Files Application",
    title: "Files App",
    description: "File browser with sidebar navigation and grid view",
    date: "2026-06-14",
    tags: ["files", "sidebar", "grid"],
  },
  {
    id: "3",
    src: "/gallery/setting-app.png",
    alt: "ApexOS Settings Application",
    title: "Settings App",
    description: "System settings with theme, accent, and wallpaper controls",
    date: "2026-06-14",
    tags: ["settings", "theme", "customization"],
  },
  {
    id: "4",
    src: "/gallery/lock-screen.png",
    alt: "ApexOS Lock Screen",
    title: "Lock Screen",
    description: "Lock screen with clock, notifications, and unlock button",
    date: "2026-06-14",
    tags: ["lock", "notifications", "clock"],
  },
  {
    id: "5",
    src: "/gallery/boot-screen.png",
    alt: "ApexOS Boot Screen",
    title: "Boot Screen",
    description: "System boot sequence with ApexOS branding",
    date: "2026-06-14",
    tags: ["boot", "branding", "loading"],
  },
  {
    id: "6",
    src: "/gallery/projects-app.png",
    alt: "ApexOS Projects Application",
    title: "Projects App",
    description: "Portfolio projects with reel player and detail view",
    date: "2026-06-15",
    tags: ["projects", "reel", "portfolio"],
  },
  {
    id: "7",
    src: "/gallery/skills-app.png",
    alt: "ApexOS Skills Application",
    title: "Skills App",
    description: "Technical skills organized by category with proficiency badges",
    date: "2026-06-15",
    tags: ["skills", "categories", "badges"],
  },
  {
    id: "8",
    src: "/gallery/about-app.png",
    alt: "ApexOS About Application",
    title: "About App",
    description: "Profile dashboard with bio, connect links, and current focus",
    date: "2026-06-15",
    tags: ["about", "profile", "bio"],
  },
];

export function getGalleryImages(): GalleryImage[] {
  return galleryImages;
}

export function getGalleryImageById(id: string): GalleryImage | undefined {
  return galleryImages.find((img) => img.id === id);
}