export type Skill = {
  name: string;
  level: "expert" | "proficient" | "learning";
  yearsOfExperience?: number;
  highlights?: string;
};

export type SkillCategory = {
  id: string;
  label: string;
  icon: string;
  skills: Skill[];
};

export const skillsData: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    icon: "💻",
    skills: [
      {
        name: "React",
        level: "expert",
        yearsOfExperience: 4,
        highlights: "Core stack for complex reactive single-page applications.",
      },
      {
        name: "Next.js",
        level: "expert",
        yearsOfExperience: 3,
        highlights: "Preferred framework for optimized SEO and Server-Side Rendering setups.",
      },
      {
        name: "TypeScript",
        level: "expert",
        yearsOfExperience: 4,
        highlights: "Enforces robust compile-time types across large-scale files.",
      },
      {
        name: "Tailwind CSS",
        level: "proficient",
        yearsOfExperience: 3,
        highlights: "Rapid utility-first styling with responsive design configurations.",
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: "⚙️",
    skills: [
      {
        name: "Node.js",
        level: "expert",
        yearsOfExperience: 3,
        highlights: "Scalable backend microservices and efficient asynchronous runtime setups.",
      },
      {
        name: "Express",
        level: "proficient",
        yearsOfExperience: 3,
        highlights: "Clean API routing architectures and customizable middleware implementations.",
      },
      {
        name: "PostgreSQL",
        level: "proficient",
        yearsOfExperience: 2,
        highlights: "Structured relational tables, foreign key constraints, and query reviews.",
      },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: "📱",
    skills: [
      {
        name: "React Native",
        level: "expert",
        yearsOfExperience: 3,
        highlights: "Cross-platform mobile applications using Expo or bare React Native workflows.",
      },
    ],
  },
  {
    id: "tools",
    label: "Tools & Other",
    icon: "🛠️",
    skills: [
      {
        name: "Git",
        level: "expert",
        yearsOfExperience: 5,
        highlights: "Advanced branch rebasing, merge conflict resolutions, and repository rules.",
      },
      {
        name: "REST APIs",
        level: "expert",
        yearsOfExperience: 4,
        highlights: "Clean standard design interfaces, HTTP status mappings, and JSON models.",
      },
      {
        name: "GraphQL",
        level: "proficient",
        yearsOfExperience: 2,
        highlights: "Single endpoint query schemas and type resolvers.",
      },
      {
        name: "Zod",
        level: "expert",
        yearsOfExperience: 2,
        highlights: "High-craft runtime schema parsers and data sanitization suite validations.",
      },
    ],
  },
];

export function getSkillCategories(): SkillCategory[] {
  return skillsData;
}

export function getSkillCategoryById(id: string): SkillCategory | undefined {
  return skillsData.find((c) => c.id === id);
}
