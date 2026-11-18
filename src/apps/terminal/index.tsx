"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { getProjects } from "@data/projects";
import { resumeData } from "@data/resume";

type TerminalLine = {
  id: string;
  type: "input" | "output" | "prompt";
  content: string;
  isTyping?: boolean;
};

const COMMANDS = {
  help: `Available commands:
  help           - Show this help message
  whoami         - Display current user info
  ls projects    - List portfolio projects
  cat resume     - Display resume summary
  open <app>     - Launch an application (about, projects, contact, skills, files, browser, gallery, resume, settings)
  clear          - Clear terminal output
  neofetch       - Display system information`,

  whoami: `apex@os
-------------
User: Jainil Pandya
Role: Software Developer
Location: Toronto, ON, Canada
Specialization: React, Next.js, React Native, TypeScript`,

  neofetch: `       ████████████████████████
      ████████████████████████
     ██████████████████████████
    ████████████████████████████
   ██████████████████████████████
  ████████████████████████████████
 ██████████████████████████████████
████████████████████████████████████
████████████████████████████████████
████████████████████████████████████
████████████████████████████████████
████████████████████████████████████
████████████████████████████████████
 ██████████████████████████████████
  ████████████████████████████████
   ██████████████████████████████
    ████████████████████████████
     ██████████████████████████
      ████████████████████████
       ████████████████████████

apex@os
-------------
OS: ApexOS 1.0.0
Kernel: Next.js 15.5.2
Shell: ApexShell
Uptime: 2h 34m
Packages: 12 (apps)
Resolution: 1920x1080
Theme: Dark (Teal Accent)
Terminal: ApexTerminal
CPU: Apple M2 / Intel i7
Memory: 16GB / 32GB
Disk: 512GB SSD`,
};

function getProjectsList(): string {
  const projects = getProjects();
  if (projects.length === 0) return "No projects found.";

  return projects
    .map((p) => `  ${p.title.padEnd(30)} ${p.shortDescription}`)
    .join("\n");
}

function getResumeSummary(): string {
  const exp = resumeData.experience[0];
  if (!exp) {
    return `Jainil Pandya - Software Developer
${resumeData.personalInfo.email} | ${resumeData.personalInfo.github} | ${resumeData.personalInfo.location}

EXPERIENCE
No experience data available

EDUCATION
${resumeData.education[0]?.institution || "N/A"} | ${resumeData.education[0]?.degree || "N/A"}
${resumeData.education[0]?.period || "N/A"} | ${resumeData.education[0]?.location || "N/A"}

SKILLS
${Object.entries(resumeData.skillsSummary)
  .map(([cat, skills]) => `  ${cat}: ${skills.join(", ")}`)
  .join("\n")}

CERTIFICATIONS
${resumeData.certifications.map((c) => `  ${c.name} (${c.issuer}, ${c.date})`).join("\n")}`;
  }
  return `Jainil Pandya - Software Developer
${resumeData.personalInfo.email} | ${resumeData.personalInfo.github} | ${resumeData.personalInfo.location}

EXPERIENCE
${exp.company} | ${exp.role}
${exp.period} | ${exp.location}
${exp.highlights.map((h) => `  • ${h}`).join("\n")}

EDUCATION
${resumeData.education[0]?.institution || "N/A"} | ${resumeData.education[0]?.degree || "N/A"}
${resumeData.education[0]?.period || "N/A"} | ${resumeData.education[0]?.location || "N/A"}

SKILLS
${Object.entries(resumeData.skillsSummary)
  .map(([cat, skills]) => `  ${cat}: ${skills.join(", ")}`)
  .join("\n")}

CERTIFICATIONS
${resumeData.certifications.map((c) => `  ${c.name} (${c.issuer}, ${c.date})`).join("\n")}`;
}

const WELCOME_MESSAGE = `Welcome to ApexOS Terminal v1.0.0
Type 'help' for available commands.

apex@os:~$ `;

export default function TerminalApp() {
  const [lines, setLines] = useState<TerminalLine[]>(() =>
    WELCOME_MESSAGE.split("\n").map((content, i) => ({
      id: `welcome-${i}`,
      type: "output" as const,
      content,
    }))
  );
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on mount and when window is focused
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const typeLine = useCallback(
    (content: string, type: TerminalLine["type"] = "output", delay = 10): Promise<void> => {
      return new Promise((resolve) => {
        let index = 0;
        const lineId = `line-${Date.now()}-${Math.random()}`;

        const addChar = () => {
          if (index <= content.length) {
            setLines((prev) => {
              const newLines = [...prev];
              const existingIndex = newLines.findIndex((l) => l.id === lineId);
              if (existingIndex >= 0) {
                const existingLine = newLines[existingIndex];
                if (existingLine) {
                  newLines[existingIndex] = {
                    id: existingLine.id,
                    type: existingLine.type,
                    content: content.slice(0, index),
                    isTyping: index < content.length,
                  };
                }
              } else {
                newLines.push({
                  id: lineId,
                  type,
                  content: content.slice(0, index),
                  isTyping: index < content.length,
                });
              }
              return newLines;
            });
            index++;
            setTimeout(addChar, delay);
          } else {
            setLines((prev) =>
              prev.map((l) =>
                l.id === lineId ? { ...l, isTyping: false } : l
              )
            );
            resolve();
          }
        };
        addChar();
      });
    },
    []
  );

  const executeCommand = useCallback(
    async (command: string) => {
      const trimmed = command.trim();
      if (!trimmed) return;

      // Add to history
      setHistory((prev) => [...prev.slice(-49), trimmed]);
      setHistoryIndex(-1);

      // Process command
      const parts = trimmed.split(" ");
      const cmd = parts[0]?.toLowerCase() ?? "";
      const args = parts.slice(1);

      let output = "";

      switch (cmd) {
        case "help":
          output = COMMANDS.help;
          break;
        case "whoami":
          output = COMMANDS.whoami;
          break;
        case "ls":
          if (args[0] === "projects") {
            output = getProjectsList();
          } else {
            output = `Usage: ls projects`;
          }
          break;
        case "cat":
          if (args[0] === "resume") {
            output = getResumeSummary();
          } else {
            output = `Usage: cat resume`;
          }
          break;
        case "open":
          if (args[0]) {
            const appMap: Record<string, string> = {
              about: "About",
              projects: "Projects",
              contact: "Contact",
              skills: "Skills",
              files: "Files",
              browser: "Browser",
              gallery: "Gallery",
              resume: "Resume",
              settings: "Settings",
            };
            const appName = appMap[args[0].toLowerCase()];
            if (appName) {
              output = `Opening ${appName}... (This would launch the ${appName} app via WindowManager)`;
            } else {
              output = `Unknown application: ${args[0]}. Available: ${Object.keys(appMap).join(", ")}`;
            }
          } else {
            output = `Usage: open <app>`;
          }
          break;
        case "clear":
          setLines([]);
          return;
        case "neofetch":
          output = COMMANDS.neofetch;
          break;
        default:
          output = `Command not found: ${cmd}. Type 'help' for available commands.`;
      }

      // Type out the output
      if (output) {
        await typeLine(output);
      }
    },
    [typeLine]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || !inputValue.trim()) return;

    const command = inputValue.trim();
    setIsProcessing(true);

    // Add the input line with prompt
    setLines((prev) => [
      ...prev,
      {
        id: `input-${Date.now()}`,
        type: "input",
        content: `apex@os:~$ ${command}`,
      },
    ]);

    setInputValue("");
    await executeCommand(command);
    setIsProcessing(false);

    // Add new prompt line
    setLines((prev) => [
      ...prev,
      {
        id: `prompt-${Date.now()}`,
        type: "prompt",
        content: "apex@os:~$ ",
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        const historyItem = history[history.length - 1 - newIndex];
        if (historyItem !== undefined) {
          setInputValue(historyItem);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const historyItem = history[history.length - 1 - newIndex];
        if (historyItem !== undefined) {
          setInputValue(historyItem);
        }
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple tab completion for known commands
      const commands = [
        "help",
        "whoami",
        "ls projects",
        "cat resume",
        "open ",
        "clear",
        "neofetch",
      ];
      const matches = commands.filter((c) => c.startsWith(inputValue.toLowerCase()));
      if (matches.length === 1) {
        const match = matches[0];
        if (match !== undefined) {
          setInputValue(match);
        }
      } else if (matches.length > 1) {
        // Show completions
        setLines((prev) => [
          ...prev,
          { id: `tab-${Date.now()}`, type: "output", content: matches.join("  ") },
          { id: `prompt-${Date.now()}`, type: "prompt", content: "apex@os:~$ " + inputValue },
        ]);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        fontFamily: "var(--font-mono), monospace",
        color: "var(--color-accent)",
        background: "#0a0d12",
        overflow: "hidden",
      }}
    >
      <style jsx>{`
        .terminal-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 16px;
        }
        .terminal-output {
          flex: 1;
          overflow-y: auto;
          font-size: 13px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .terminal-line {
          margin: 0;
          padding: 0;
        }
        .terminal-line.input {
          color: var(--color-accent);
        }
        .terminal-line.output {
          color: var(--color-text-secondary);
        }
        .terminal-line.prompt {
          color: var(--color-accent);
        }
        .terminal-line.typing::after {
          content: "█";
          animation: blink 1s infinite;
          color: var(--color-accent);
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .terminal-input-row {
          display: flex;
          align-items: center;
          margin-top: 8px;
        }
        .terminal-prompt {
          color: var(--color-accent);
          margin-right: 8px;
          user-select: none;
        }
        .terminal-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--color-accent);
          font-family: var(--font-mono), monospace;
          font-size: 13px;
          line-height: 1.6;
        }
        .terminal-input::placeholder {
          color: rgba(16, 185, 129, 0.4);
        }
        .cursor {
          display: inline-block;
          width: 8px;
          height: 1.2em;
          background: var(--color-accent);
          animation: cursor-blink 1s infinite;
          vertical-align: text-bottom;
          margin-left: 2px;
        }
        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      <div className="terminal-container" ref={containerRef}>
        <div className="terminal-output">
          {lines.map((line) => (
            <div
              key={line.id}
              className={`terminal-line ${line.type} ${line.isTyping ? "typing" : ""}`}
            >
              {line.content}
            </div>
          ))}
        </div>

        <form className="terminal-input-row" onSubmit={handleSubmit}>
          <span className="terminal-prompt">apex@os:~$</span>
          <input
            ref={inputRef}
            className="terminal-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder={isProcessing ? "Processing..." : ""}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="cursor" aria-hidden="true" />
        </form>
      </div>
    </div>
  );
}