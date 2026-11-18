"use client";

import React from "react";
import AppSidebar from "../../shared/ui/AppSidebar";
import AppContentArea from "../../shared/ui/AppContentArea";
import AppTagBadge from "../../shared/ui/AppTagBadge";
import { resumeData } from "../../data/resume";

export default function ResumeApp() {
  const handleDownload = () => {
    // In a production environment, this would download the resume PDF file.
    // For local portfolio simulation, we trigger a standard file download action.
    const link = document.createElement("a");
    link.href = resumeData.pdfDownloadUrl;
    link.download = "Jainil_Pandya_Resume.pdf";
    link.target = "_blank";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + resumeData.pdfDownloadUrl);
    alert("Resume link copied to clipboard!");
  };

  const stats = [
    { label: "Experience", value: "3+ Years" },
    { label: "Completed Projects", value: "8+ Built" },
    { label: "Tech Stack Stacked", value: "12+ Tools" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        width: "100%",
        background: "var(--color-bg-surface)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-sans)",
        overflow: "hidden",
      }}
    >
      {/* Sidebar - Doc Controls & Stats */}
      <AppSidebar style={{ padding: "20px 16px", gap: 20 }}>
        {/* Document section */}
        <div>
          <h3
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-text-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "0 0 12px 0",
            }}
          >
            Document Actions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              type="button"
              onClick={handleDownload}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: "var(--radius-button)",
                background: "var(--color-accent)",
                color: "#ffffff",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-accent)";
              }}
            >
              <span>📥</span> Download PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: "var(--radius-button)",
                background: "var(--color-surface-1)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "background var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-surface-2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-surface-1)";
              }}
            >
              <span>🖨️</span> Print Document
            </button>
            <button
              type="button"
              onClick={handleShare}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: "var(--radius-button)",
                background: "var(--color-surface-1)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "background var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-surface-2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-surface-1)";
              }}
            >
              <span>🔗</span> Copy Share Link
            </button>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--color-border)" }} />

        {/* Quick Stats section */}
        <div>
          <h3
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-text-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "0 0 12px 0",
            }}
          >
            Quick Statistics
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{stat.label}</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginTop: 2,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppSidebar>

      {/* Main Document Frame */}
      <AppContentArea style={{ padding: 24, display: "flex", justifyContent: "center" }}>
        {/* Document Sheet */}
        <div
          style={{
            width: "100%",
            maxWidth: 700,
            background: "rgba(30, 41, 59, 0.4)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: "32px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          }}
        >
          {/* Header */}
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  margin: 0,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                {resumeData.personalInfo.fullName}
              </h1>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--color-accent)",
                  margin: "4px 0 0 0",
                }}
              >
                {resumeData.personalInfo.title}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 4,
                fontSize: 12,
                color: "var(--color-text-secondary)",
              }}
            >
              <span>{resumeData.personalInfo.location}</span>
              <span>{resumeData.personalInfo.email}</span>
            </div>
          </div>

          <div style={{ height: 1, background: "var(--color-border)" }} />

          {/* Experience */}
          <div>
            <h2
              style={{
                fontSize: 11,
                color: "var(--color-text-label)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 14px 0",
              }}
            >
              Work Experience
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {resumeData.experience.map((exp) => (
                <div key={exp.company + exp.role}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        margin: 0,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {exp.role}{" "}
                      <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>
                        at {exp.company}
                      </span>
                    </h3>
                    <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                      {exp.period}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>
                    📍 {exp.location}
                  </div>
                  <ul
                    style={{
                      margin: "8px 0 0 0",
                      paddingLeft: 18,
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {exp.highlights.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--color-border)" }} />

          {/* Education */}
          <div>
            <h2
              style={{
                fontSize: 11,
                color: "var(--color-text-label)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 14px 0",
              }}
            >
              Education
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {resumeData.education.map((edu) => (
                <div key={edu.institution}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        margin: 0,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {edu.degree}
                    </h3>
                    <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                      {edu.period}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
                    {edu.institution} • {edu.location}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--color-border)" }} />

          {/* Skills summary */}
          <div>
            <h2
              style={{
                fontSize: 11,
                color: "var(--color-text-label)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 14px 0",
              }}
            >
              Skills Overview
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(resumeData.skillsSummary).map(([category, list]) => (
                <div key={category} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--color-text-secondary)",
                      width: 130,
                      minWidth: 130,
                    }}
                  >
                    {category}
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {list.map((skill) => (
                      <AppTagBadge key={skill} variant="tech">
                        {skill}
                      </AppTagBadge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: "var(--color-border)" }} />

          {/* Certifications */}
          <div>
            <h2
              style={{
                fontSize: 11,
                color: "var(--color-text-label)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 14px 0",
              }}
            >
              Certifications
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {resumeData.certifications.map((cert) => (
                <div
                  key={cert.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                    <strong>{cert.name}</strong> — {cert.issuer}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    {cert.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppContentArea>
    </div>
  );
}
