"use client";

import React, { useState } from "react";
import { resumeData } from "../../data/resume";

export default function ContactApp() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = { name: "", email: "", message: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "var(--color-bg-surface)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-sans)",
        padding: "24px 28px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Title */}
      <div>
        <h1
          style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}
        >
          📬 Contact Center
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0 0" }}>
          Send a direct system message or use quick action shortcuts.
        </p>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Left Side: Form */}
        <div style={{ flex: 1, minWidth: 280 }}>
          {isSubmitted ? (
            <div
              style={{
                background: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                border: "1px solid var(--color-accent)",
                borderRadius: "var(--radius-card)",
                padding: "24px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 32 }}>✅</span>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: 0,
                  color: "var(--color-text-primary)",
                }}
              >
                Message Sent Successfully!
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Thank you for reaching out. Jainil will review your message and get back to you
                shortly.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                style={{
                  marginTop: 8,
                  padding: "6px 16px",
                  borderRadius: "var(--radius-button)",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {/* Name field */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--color-text-label)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: `1px solid ${errors.name ? "var(--color-win-close)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-button)",
                    padding: "8px 12px",
                    color: "var(--color-text-primary)",
                    fontSize: 13,
                    outline: "none",
                    transition: "border-color var(--duration-fast)",
                  }}
                  onFocus={(e) => {
                    if (!errors.name) e.currentTarget.style.borderColor = "var(--color-accent)";
                  }}
                  onBlur={(e) => {
                    if (!errors.name) e.currentTarget.style.borderColor = "var(--color-border)";
                  }}
                />
                {errors.name && (
                  <span style={{ fontSize: 11, color: "#f87171" }}>{errors.name}</span>
                )}
              </div>

              {/* Email field */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--color-text-label)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: `1px solid ${errors.email ? "var(--color-win-close)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-button)",
                    padding: "8px 12px",
                    color: "var(--color-text-primary)",
                    fontSize: 13,
                    outline: "none",
                    transition: "border-color var(--duration-fast)",
                  }}
                  onFocus={(e) => {
                    if (!errors.email) e.currentTarget.style.borderColor = "var(--color-accent)";
                  }}
                  onBlur={(e) => {
                    if (!errors.email) e.currentTarget.style.borderColor = "var(--color-border)";
                  }}
                />
                {errors.email && (
                  <span style={{ fontSize: 11, color: "#f87171" }}>{errors.email}</span>
                )}
              </div>

              {/* Message field */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--color-text-label)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your inquiry..."
                  rows={4}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: `1px solid ${errors.message ? "var(--color-win-close)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-button)",
                    padding: "8px 12px",
                    color: "var(--color-text-primary)",
                    fontSize: 13,
                    outline: "none",
                    resize: "none",
                    transition: "border-color var(--duration-fast)",
                    fontFamily: "var(--font-sans)",
                  }}
                  onFocus={(e) => {
                    if (!errors.message) e.currentTarget.style.borderColor = "var(--color-accent)";
                  }}
                  onBlur={(e) => {
                    if (!errors.message) e.currentTarget.style.borderColor = "var(--color-border)";
                  }}
                />
                {errors.message && (
                  <span style={{ fontSize: 11, color: "#f87171" }}>{errors.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  height: 38,
                  borderRadius: "var(--radius-button)",
                  background: "var(--color-accent)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background var(--duration-fast)",
                  marginTop: 4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-accent-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-accent)";
                }}
              >
                {isSubmitting ? "Sending..." : "Send Message →"}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Quick Action Links & Metadata */}
        <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h3
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--color-text-label)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              Direct Channels
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href={`mailto:${resumeData.personalInfo.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                }}
              >
                <span>✉️</span> Email Client
              </a>
              <a
                href={resumeData.personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                }}
              >
                <span>💼</span> LinkedIn
              </a>
              <a
                href={resumeData.personalInfo.github}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                }}
              >
                <span>🐙</span> GitHub
              </a>
            </div>
          </div>

          <div
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <h3
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--color-text-label)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              Location Info
            </h3>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
              📍 Toronto, ON, Canada
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
              Available for remote and hybrid roles.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
