# Content Architecture Specification

This document defines the complete content and information architecture (IA) for **ApexOS** applications. It establishes the required data schemas, structural hierarchies, and recruiter-first presentation strategies to ensure all future content is structured correctly prior to app implementation.

---

## 1. About App

### Recruiter-First Presentation Strategy

- **Speed to Value**: Recruiters spend 2–5 minutes on a portfolio. The About App is the entry point. It must deliver an immediate elevator pitch, show active focus, and present prominent Call-To-Action (CTA) buttons ("View Resume", "Get in Touch").
- **Layout Structure**: **Layout A (Profile / Dashboard)**. Clean, card-based grid. No vertical scrolling should be required on a standard screen ($720 \times 560\text{px}$).
- **Visual Hierarchy**:
  1. **Primary Hero Card**: Left-hand side or full-width top block. Circular avatar, full name, subtitle, high-impact short bio, and CTAs.
  2. **Connect Card**: Structured list of key contact metadata (email, location, GitHub, LinkedIn).
  3. **Current Focus Card**: Highlights the main project currently under development to show active engineering commitment.

### Content Hierarchy & Data Fields

1. **Hero Header**: Full Name (`fullName`), Primary Role Title (`title`), Location (`location`).
2. **Elevator Pitch**: Short professional bio (`bio`) highlighting expertise in React, Next.js, and React Native.
3. **Core Action Buttons**: Primary CTA link (`primaryCta`), Secondary CTA link (`secondaryCta`).
4. **Current Focus**: Featured project details (`currentFocus` - title, category, role, description).
5. **Connection Details**: Raw contact links and handles.

### Required vs. Optional Data

- **Required**: `fullName`, `title`, `bio`, `avatarUrl`, `contactInfo` (email, github), `primaryCta`, `currentFocus`.
- **Optional**: `linkedinUrl`, `twitterUrl`, `secondaryCta`, `currentFocus.timeline`.

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AboutAppContent",
  "type": "object",
  "properties": {
    "fullName": { "type": "string" },
    "title": { "type": "string" },
    "bio": { "type": "string" },
    "avatarUrl": { "type": "string" },
    "primaryCta": {
      "type": "object",
      "properties": {
        "label": { "type": "string" },
        "targetAppId": { "type": "string" }
      },
      "required": ["label", "targetAppId"]
    },
    "secondaryCta": {
      "type": "object",
      "properties": {
        "label": { "type": "string" },
        "targetAppId": { "type": "string" }
      },
      "required": ["label", "targetAppId"]
    },
    "contactInfo": {
      "type": "object",
      "properties": {
        "email": { "type": "string", "format": "email" },
        "github": { "type": "string", "format": "uri" },
        "linkedin": { "type": "string", "format": "uri" },
        "location": { "type": "string" }
      },
      "required": ["email", "github", "location"]
    },
    "currentFocus": {
      "type": "object",
      "properties": {
        "projectId": { "type": "string" },
        "title": { "type": "string" },
        "category": { "type": "string" },
        "role": { "type": "string" },
        "description": { "type": "string" },
        "timeline": { "type": "string" }
      },
      "required": ["projectId", "title", "category", "role", "description"]
    }
  },
  "required": ["fullName", "title", "bio", "avatarUrl", "primaryCta", "contactInfo", "currentFocus"]
}
```

### Future Extensibility

- Add an `availabilityStatus` enum (e.g., `"open-for-roles"`, `"consulting"`, `"busy"`) to display a live status dot next to the avatar.
- Support localized/multi-lingual profile fields (`bio_es`, `bio_de`, etc.).

---

## 2. Skills App

### Recruiter-First Presentation Strategy

- **Anti-Pattern Avoidance**: No generic percentage bars or visual skill dials (e.g., "React: 90%"). They are arbitrary and frustrate technical recruiters.
- **Layout Structure**: **Layout B (Master-Detail with Sidebar)**.
  - **Sidebar**: High-level skill categories (e.g., Frontend, Backend, Mobile, Tools).
  - **Content Panel**: A structured, scannable grid of skill cards for the active category.
- **Proficiency Labeling**: Categorize skills by clear, industry-accepted levels: `expert` (core daily stack) and `proficient` (comfortable/used in production).
- **Scan Optimization**: Sort skills by relevance and proficiency level. Include years of experience or a short highlight explaining _how_ the skill was applied.

### Content Hierarchy & Data Fields

1. **Category Sidebar**: List of skill categories (`categories` - name, icon).
2. **Skill Detail Grid**: Individual skill cards containing name (`name`), proficiency level (`level`), years of experience (`yearsOfExperience`), and a brief highlights description (`highlights`).

### Required vs. Optional Data

- **Required**: `categories` (array of objects containing `id`, `label`, `icon`, `skills` (array of skills containing `name`, `level`)).
- **Optional**: `skills.yearsOfExperience`, `skills.highlights` (1-phrase description of project context, e.g., _"Used in production for 2 large-scale SaaS apps"_).

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "SkillsAppContent",
  "type": "object",
  "properties": {
    "categories": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "label": { "type": "string" },
          "icon": { "type": "string" },
          "skills": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "level": { "type": "string", "enum": ["expert", "proficient", "learning"] },
                "yearsOfExperience": { "type": "number", "minimum": 0 },
                "highlights": { "type": "string" }
              },
              "required": ["name", "level"]
            }
          }
        },
        "required": ["id", "label", "icon", "skills"]
      }
    }
  },
  "required": ["categories"]
}
```

### Future Extensibility

- **Project Reference Linking**: Include an optional `relatedProjectIds` array of string IDs. Clicking a skill could highlight or link directly to projects built with that technology.
- **Endorsement Validation**: Add an optional `endorsements` field containing client/colleague validation quotes.

---

## 3. Projects App

### Recruiter-First Presentation Strategy

- **Multimodal Engagement**:
  1. **Explorer Mode (Default)**: Sidebar project list allowing quick scanning of title, category, and completion status.
  2. **Reel Mode (Visual)**: A slide-based interactive reel containing screenshots, demo videos, and high-impact captions for recruiters who want a visual summary in under 30 seconds.
  3. **Case Study Mode (Detailed)**: Structural detail page addressing the core software engineering narrative: Context → Challenges → Solutions → Results.
- **Layout Structure**: **Layout B (Master-Detail with Sidebar)**.
- **Authentication of Capability**: Include clear primary links for GitHub repositories and Live Demos, which must open inside the system's Browser App to maintain the desktop operating system illusion.

### Content Hierarchy & Data Fields

1. **Metadata Header**: Title, category, development timeline, project role, team size.
2. **Visual Showcase**: Reel slides (images or videos) with contextual captions.
3. **Project Summary**: 1-sentence short description, followed by a multi-sentence full description.
4. **Narrative Breakdown**: Bullet points detailing key features, technical challenges, implemented solutions, and measurable results.
5. **Action Targets**: Repositories (`githubUrl`) and deployment links (`liveUrl`).

### Required vs. Optional Data

- **Required**: `id`, `slug`, `title`, `shortDescription`, `fullDescription`, `category`, `techStack`, `thumbnail`, `coverImage`, `status`, `timeline`, `role`, `teamSize`, `features`, `reelSlides` (v1 compatibility format).
- **Optional**: `githubUrl`, `liveUrl`, `demoVideo`, `challenges`, `solutions`, `results`, `tags`, `reels` (v2 multi-reel named array), `storyChapters` (v2 structured chapters).

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ProjectsAppContent",
  "type": "object",
  "properties": {
    "projects": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "slug": { "type": "string" },
          "title": { "type": "string" },
          "shortDescription": { "type": "string" },
          "fullDescription": { "type": "string" },
          "category": { "type": "string" },
          "techStack": { "type": "array", "items": { "type": "string" } },
          "githubUrl": { "type": "string", "format": "uri" },
          "liveUrl": { "type": "string", "format": "uri" },
          "thumbnail": { "type": "string" },
          "coverImage": { "type": "string" },
          "screenshots": { "type": "array", "items": { "type": "string" } },
          "demoVideo": { "type": "string" },
          "featured": { "type": "boolean" },
          "status": {
            "type": "string",
            "enum": ["planned", "in-progress", "completed", "archived"]
          },
          "timeline": { "type": "string" },
          "role": { "type": "string" },
          "teamSize": { "type": "number" },
          "features": { "type": "array", "items": { "type": "string" } },
          "challenges": { "type": "array", "items": { "type": "string" } },
          "solutions": { "type": "array", "items": { "type": "string" } },
          "results": { "type": "array", "items": { "type": "string" } },
          "tags": { "type": "array", "items": { "type": "string" } },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" },
          "platform": {
            "type": "string",
            "enum": ["web", "mobile", "desktop", "cli", "library", "other"]
          },
          "displayOrder": { "type": "integer" },
          "reelSlides": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "projectId": { "type": "string" },
                "title": { "type": "string" },
                "description": { "type": "string" },
                "video": { "type": "string" },
                "image": { "type": "string" },
                "cta": { "type": "string" },
                "order": { "type": "integer" },
                "type": { "type": "string", "enum": ["image", "video", "split", "text-only"] }
              },
              "required": ["id", "projectId", "title", "description", "order"]
            }
          },
          "reels": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "projectId": { "type": "string" },
                "title": { "type": "string" },
                "description": { "type": "string" },
                "coverImage": { "type": "string" },
                "order": { "type": "integer" },
                "slides": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "string" },
                      "projectId": { "type": "string" },
                      "title": { "type": "string" },
                      "description": { "type": "string" },
                      "video": { "type": "string" },
                      "image": { "type": "string" },
                      "cta": { "type": "string" },
                      "order": { "type": "integer" },
                      "type": { "type": "string", "enum": ["image", "video", "split", "text-only"] }
                    },
                    "required": ["id", "projectId", "title", "description", "order"]
                  }
                }
              },
              "required": ["id", "projectId", "title", "order", "slides"]
            }
          },
          "storyChapters": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "title": { "type": "string" },
                "body": { "type": "string" },
                "order": { "type": "integer" },
                "media": { "type": "array", "items": { "type": "string" } },
                "reelId": { "type": "string" }
              },
              "required": ["id", "title", "body", "order"]
            }
          }
        },
        "required": [
          "id",
          "slug",
          "title",
          "shortDescription",
          "fullDescription",
          "category",
          "techStack",
          "thumbnail",
          "coverImage",
          "status",
          "timeline",
          "role",
          "teamSize",
          "features",
          "reelSlides",
          "createdAt",
          "updatedAt"
        ]
      }
    }
  },
  "required": ["projects"]
}
```

### Future Extensibility

- **Interactive Architecture Diagrams**: Integrate an optional SVG architecture map with interactive tooltips within the project detail tabs.
- **Performance Metrics Tracker**: Add fields for lighthouse scores, bundle sizes, or API response latencies to showcase optimization expertise.

---

## 4. Resume App

### Recruiter-First Presentation Strategy

- **Authentic Experience**: Avoid rebuilding a scrolling web page layout. Instead, render a clean, print-quality typeset document displayed inside a document viewer container.
- **Frictionless Extraction**: Provide highly visible, top-level actions for "Download PDF", "Print Document", and "Share".
- **Structure & Readability**: Chronological work experience must be prioritized, featuring high-impact bullet points utilizing action verbs and clear metric success indicators.

### Content Hierarchy & Data Fields

1. **Action Bar**: Document control triggers (`pdfDownloadUrl`, print action, copy link).
2. **Resume Header**: Owner name, title, contact meta (email, location, GitHub, LinkedIn).
3. **Experience Section**: List of work roles (company name, role title, duration, location, bullets).
4. **Education Section**: List of academic history (school name, degree, duration).
5. **Skills Section**: Structured summary of technical competencies.
6. **Certifications Section**: List of official credentials.

### Required vs. Optional Data

- **Required**: `personalInfo` (name, title, contact), `experience` (array of roles containing `company`, `role`, `period`, `location`, `highlights`), `education` (array containing `institution`, `degree`, `period`), `skills` (categorized object matching the resume visual layout), `pdfDownloadUrl`.
- **Optional**: `certifications` (array containing `name`, `issuer`, `date`, `credentialId`).

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ResumeAppContent",
  "type": "object",
  "properties": {
    "personalInfo": {
      "type": "object",
      "properties": {
        "fullName": { "type": "string" },
        "title": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "github": { "type": "string" },
        "linkedin": { "type": "string" },
        "location": { "type": "string" }
      },
      "required": ["fullName", "title", "email", "github", "location"]
    },
    "pdfDownloadUrl": { "type": "string" },
    "experience": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "company": { "type": "string" },
          "role": { "type": "string" },
          "period": { "type": "string" },
          "location": { "type": "string" },
          "highlights": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["company", "role", "period", "location", "highlights"]
      }
    },
    "education": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "institution": { "type": "string" },
          "degree": { "type": "string" },
          "period": { "type": "string" },
          "location": { "type": "string" }
        },
        "required": ["institution", "degree", "period"]
      }
    },
    "skillsSummary": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "certifications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "issuer": { "type": "string" },
          "date": { "type": "string" },
          "credentialId": { "type": "string" }
        },
        "required": ["name", "issuer", "date"]
      }
    }
  },
  "required": ["personalInfo", "pdfDownloadUrl", "experience", "education", "skillsSummary"]
}
```

### Future Extensibility

- **ATS-Parser Checklist**: Add an optional metadata tracker or keyword scanner to let the recruiter see exactly which common applicant tracking system keywords match this resume.

---

## 5. Contact App

### Recruiter-First Presentation Strategy

- **Minimal Friction**: Keep the contact form simple and fast. Limit input fields to Name, Email, and Message.
- **OS-Fidelity Design**: Use OS-styled glassmorphic inputs instead of generic website forms.
- **Fail-safe Paths**: Technical recruiters are often in a hurry and may prefer direct channels. Display direct, actionable contact details (email address and GitHub handle) adjacent to the form.
- **Feedback States**: Implement positive, clear success overlays (e.g., _"Message sent successfully!"_) and inline validation error notices that follow system design colors.

### Content Hierarchy & Data Fields

1. **Form Header**: High-level title (`headerText`) and subtitle/invitation (`subHeaderText`).
2. **Form Fields**: Name input, Email input, Message text area.
3. **Primary Action**: Send button (`submitLabel`).
4. **Alternative Contact Panel**: Structured list of secondary direct channels.

### Required vs. Optional Data

- **Required**: `headerText`, `subHeaderText`, `submitLabel`, `directChannels` (email, github).
- **Optional**: `submissionServiceUrl` (endpoint for Formspree/Web3Forms), `linkedinUrl`.

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ContactAppContent",
  "type": "object",
  "properties": {
    "headerText": { "type": "string" },
    "subHeaderText": { "type": "string" },
    "submitLabel": { "type": "string" },
    "submissionServiceUrl": { "type": "string", "format": "uri" },
    "directChannels": {
      "type": "object",
      "properties": {
        "email": { "type": "string", "format": "email" },
        "github": { "type": "string" },
        "linkedin": { "type": "string" }
      },
      "required": ["email", "github"]
    }
  },
  "required": ["headerText", "subHeaderText", "submitLabel", "directChannels"]
}
```

### Future Extensibility

- **Quick-Select Subject Prompts**: Offer click-to-select template subjects (e.g., `"Hiring Inquiry"`, `"Contract Project"`, `"General Chat"`) to pre-fill the message structure for the recruiter.
- **Cal.com / Calendly Integration**: Add an optional scheduler link for recruiters to directly book a brief introductory call.

---

## 6. Gallery App

### Recruiter-First Presentation Strategy

- **Visual Verification**: A gallery app provides immediate proof of Jainil’s eye for UI/UX, product design, and implementation fidelity.
- **Layout Structure**: **Full Grid Layout**. Uniform aspect-ratio thumbnails with absolute sizing.
- **Contextual Association**: Do not display random images. Every image must be cataloged with clear metadata and a direct link to the corresponding project within the OS Projects App.
- **Interactive Lightbox**: Hovering on a card displays filename, date, and project tags. Clicking launches an interactive lightbox display within the application window.

### Content Hierarchy & Data Fields

1. **Gallery Grid**: Layout of item cards.
2. **Gallery Item**: Image asset path (`url`), thumbnail path (`thumbnailUrl`), label (`title`), description (`description`), screenshot date (`date`), associated project slug (`projectSlug`).

### Required vs. Optional Data

- **Required**: `items` (array of objects containing `id`, `url`, `thumbnailUrl`, `title`, `description`, `date`).
- **Optional**: `items.projectSlug` (linking to Projects App), `items.tags`.

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "GalleryAppContent",
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "url": { "type": "string" },
          "thumbnailUrl": { "type": "string" },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "date": { "type": "string", "format": "date" },
          "projectSlug": { "type": "string" },
          "tags": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["id", "url", "thumbnailUrl", "title", "description", "date"]
      }
    }
  },
  "required": ["items"]
}
```

### Future Extensibility

- **Interactive Canvas**: Add a zoom-and-pan canvas mode for high-resolution mockups or UI blueprints.
- **Categorized Folders**: Support structured sub-folders within the Gallery App corresponding to specific domains (e.g., `Mobile UI`, `Web Apps`, `Vector Assets`).

---

## 7. Achievements App

### Recruiter-First Presentation Strategy

- **Aesthetic Consistency**: Prevent this from looking like a basic website badge list. Present achievements as clean, system-level notification cards or official credentials.
- **Layout Structure**: **Layout A (Profile / Dashboard)**.
- **Credibility Verification**: Every achievement card must support external proof verification links (e.g., credential verification, Hackathon submission link, GitHub release tag).
- **High-Value Filtering**: Keep achievements focused on professional excellence, notable open-source contributions, hackathons, and certifications.

### Content Hierarchy & Data Fields

1. **Hero Achievement**: Highlights the most significant professional achievement or certification at the top.
2. **Chronological Grid**: Grid of achievement cards displaying icon/badge (`icon`), title (`title`), issuer/organization (`issuer`), date achieved (`date`), description (`description`), and verification URL (`verifyUrl`).

### Required vs. Optional Data

- **Required**: `achievements` (array containing `id`, `title`, `issuer`, `date`, `description`, `icon`, `category`).
- **Optional**: `achievements.verifyUrl`, `achievements.featured`.

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AchievementsAppContent",
  "type": "object",
  "properties": {
    "achievements": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "issuer": { "type": "string" },
          "date": { "type": "string", "format": "date" },
          "description": { "type": "string" },
          "icon": { "type": "string" },
          "category": {
            "type": "string",
            "enum": ["certification", "hackathon", "open-source", "recognition"]
          },
          "verifyUrl": { "type": "string", "format": "uri" },
          "featured": { "type": "boolean" }
        },
        "required": ["id", "title", "issuer", "date", "description", "icon", "category"]
      }
    }
  },
  "required": ["achievements"]
}
```

### Future Extensibility

- **Skill Tags Correlation**: Map achievements directly to specific skills within the Skills App. Clicking an achievement highlights the related skill tags.
- **Dynamic Badges**: Render interactive SVGs or 3D cards that respond dynamically to mouse hover gestures.
