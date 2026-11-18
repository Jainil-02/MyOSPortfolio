export type WorkExperience = {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
};

export type Education = {
  institution: string;
  degree: string;
  period: string;
  location: string;
};

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
};

export type ResumeData = {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    github: string;
    linkedin: string;
    location: string;
  };
  pdfDownloadUrl: string;
  experience: WorkExperience[];
  education: Education[];
  skillsSummary: {
    [category: string]: string[];
  };
  certifications: Certification[];
};

export const resumeData: ResumeData = {
  personalInfo: {
    fullName: "Jainil Pandya",
    title: "Software Developer",
    email: "jainil.pandya.dev@gmail.com",
    github: "https://github.com/Jainil-02",
    linkedin: "https://linkedin.com/in/jainil-pandya",
    location: "Toronto, ON, Canada",
  },
  pdfDownloadUrl: "/assets/Jainil_Pandya_Resume.pdf",
  experience: [
    {
      company: "Apex Tech Labs",
      role: "Full Stack Engineer",
      period: "May 2024 - Present",
      location: "Toronto, ON",
      highlights: [
        "Architected and implemented a high-fidelity web operating system portfolio (ApexOS) using Next.js 14 and TypeScript.",
        "Optimized client-side rendering pipeline to reduce initial interaction latency (FID) by 35%.",
        "Configured robust Zod schema validation workflows ensuring 100% data integrity for dynamic content catalogs.",
        "Collaborated with UI/UX designers to implement premium glassmorphic components conforming strictly to design systems.",
      ],
    },
    {
      company: "Innovation Systems",
      role: "Frontend Developer",
      period: "Sep 2022 - Apr 2024",
      location: "Toronto, ON",
      highlights: [
        "Built responsive, accessible web portals using React, Tailwind CSS, and RESTful API integrations.",
        "Developed cross-platform mobile companions with React Native, improving play store ratings to 4.7 stars.",
        "Reduced JS bundle sizes by 28% through code splitting, tree shaking, and image lazy-loading pipelines.",
      ],
    },
  ],
  education: [
    {
      institution: "Sheridan College",
      degree: "Advanced Diploma in Software Development and Network Engineering",
      period: "Sep 2020 - Apr 2023",
      location: "Oakville, ON",
    },
  ],
  skillsSummary: {
    Languages: ["TypeScript", "JavaScript", "SQL", "HTML5/CSS3"],
    Frameworks: ["React", "Next.js", "React Native", "Expo", "Express"],
    "Libraries & Tools": ["Zod", "Tailwind CSS", "Git", "SQLite", "PostgreSQL", "Webpack"],
  },
  certifications: [
    {
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera / Meta",
      date: "Dec 2023",
    },
    {
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      date: "Jul 2024",
    },
  ],
};
