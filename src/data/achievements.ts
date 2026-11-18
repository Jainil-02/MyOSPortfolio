export type Achievement = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date
  icon: string; // Emoji or asset path
  category: "project" | "certification" | "contribution" | "recognition";
};

export const achievementsData: Achievement[] = [
  {
    id: "apex-os-launch",
    title: "ApexOS Portfolio Launched",
    description: "Designed and built a fully interactive web-based operating system portfolio showcasing projects in an immersive desktop environment with window management, dynamic theming, and multi-device shells.",
    date: "2026-01-15",
    icon: "🖥️",
    category: "project",
  },
  {
    id: "aws-certified",
    title: "AWS Certified Developer – Associate",
    description: "Earned AWS Certified Developer Associate certification demonstrating proficiency in developing, deploying, and debugging cloud-based applications using AWS services.",
    date: "2024-07-20",
    icon: "☁️",
    category: "certification",
  },
  {
    id: "meta-cert",
    title: "Meta Front-End Developer Professional Certificate",
    description: "Completed the 9-course professional certificate program covering React, UI/UX principles, version control, testing, and coding interview preparation.",
    date: "2023-12-10",
    icon: "📜",
    category: "certification",
  },
  {
    id: "zod-validator-oss",
    title: "Zod Validator Open Source Release",
    description: "Published a lightweight Zod validation middleware library with 45% faster parse throughput, zero external dependencies, and drop-in Express/Hono support.",
    date: "2026-02-28",
    icon: "📦",
    category: "contribution",
  },
  {
    id: "fit-track-mobile",
    title: "FitTrack Pro Mobile App Shipped",
    description: "Delivered a cross-platform fitness tracking application with offline-first SQLite storage, real-time sensor visualization via Reanimated, and social leaderboards.",
    date: "2026-03-15",
    icon: "📱",
    category: "project",
  },
  {
    id: "sheridan-grad",
    title: "Software Development & Network Engineering Diploma",
    description: "Graduated with Advanced Diploma from Sheridan College, specializing in full-stack development, cloud infrastructure, and network systems engineering.",
    date: "2023-04-30",
    icon: "🎓",
    category: "recognition",
  },
  {
    id: "github-contributor",
    title: "Active Open Source Contributor",
    description: "Consistent contributor to multiple open source projects including Next.js ecosystem tools, React Native libraries, and TypeScript utility packages.",
    date: "2025-11-01",
    icon: "🌟",
    category: "contribution",
  },
  {
    id: "hackathon-winner",
    title: "Regional Hackathon Winner – FinTech Track",
    description: "First place at Toronto FinTech Hackathon 2024 for building a real-time portfolio rebalancing dashboard with WebSocket market data feeds.",
    date: "2024-09-22",
    icon: "🏆",
    category: "recognition",
  },
];

export function getAchievements(): Achievement[] {
  return achievementsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAchievementsByCategory(category: Achievement["category"]): Achievement[] {
  return achievementsData.filter((a) => a.category === category);
}