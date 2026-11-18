"use client";

import React, { useState, useMemo, useEffect } from "react";
import AppSidebar from "@shared/ui/AppSidebar";
import AppContentArea from "@shared/ui/AppContentArea";

type File = {
  id: string;
  name: string;
  size: string;
  type: "document" | "image" | "folder" | "project";
  date: string;
  icon: string;
};

type Folder = {
  id: string;
  name: string;
  icon: string;
  files: File[];
};

const FOLDERS: Folder[] = [
  {
    id: "documents",
    name: "Documents",
    icon: "📁",
    files: [
      { id: "1", name: "resume.pdf", size: "1.2 MB", type: "document", date: "Dec 20, 2024", icon: "📄" },
      { id: "2", name: "project-proposal.docx", size: "345 KB", type: "document", date: "Nov 5, 2024", icon: "📄" },
      { id: "3", name: "notes.txt", size: "12 KB", type: "document", date: "Oct 3, 2024", icon: "📄" },
    ],
  },
  {
    id: "downloads",
    name: "Downloads",
    icon: "⬇️",
    files: [
      { id: "4", name: "apex-os-installer.dmg", size: "1.8 GB", type: "image", date: "Nov 15, 2024", icon: "⬇️" },
      { id: "5", name: "setup.exe", size: "45 MB", type: "document", date: "Nov 10, 2024", icon: "⬇️" },
      { id: "6", name: "images.zip", size: "248 MB", type: "folder", date: "Nov 8, 2024", icon: "📁" },
    ],
  },
  {
    id: "pictures",
    name: "Pictures",
    icon: "🖼️",
    files: [
      { id: "7", name: "sunset.jpg", size: "4.2 MB", type: "image", date: "Nov 1, 2024", icon: "🌅" },
      { id: "8", name: "portrait.png", size: "2.1 MB", type: "image", date: "Oct 28, 2024", icon: "👤" },
      { id: "9", name: "apex-os-window.png", size: "756 KB", type: "image", date: "Oct 20, 2024", icon: "💻" },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    icon: "🚀",
    files: [
      { id: "10", name: "apex-os", size: "8.5 MB", type: "project", date: "Jun 14, 2024", icon: "🚀" },
      { id: "11", name: "fit-track", size: "2.3 MB", type: "project", date: "Mar 8, 2024", icon: "📱" },
      { id: "12", name: "zod-validator", size: "650 KB", type: "project", date: "Feb 12, 2024", icon: "📦" },
    ],
  },
];

export default function FilesApp() {
  const [activeFolder, setActiveFolder] = useState<Folder | null>(FOLDERS[0] as Folder);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return activeFolder?.files || [];
    const q = searchQuery.toLowerCase();
    return (activeFolder?.files || []).filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q) ||
        f.date.toLowerCase().includes(q),
    );
  }, [activeFolder, searchQuery]);

  // Keyboard navigation for sidebar sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSearchQuery("");
        setSelectedFile(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        color: "var(--color-text-primary)",
        background: "var(--color-bg-base)",
        overflow: "hidden",
      }}
    >
      <style jsx>{`
        /* Files app specific styles */
        .files-breadcrumb {
          font-size: 13px;
          color: var(--color-text-primary);
        }

        .view-toggle button {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-sidebar);
          color: var(--color-text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--duration-fast) var(--ease-spring);
          flex-shrink: 0;
          margin-left: 4px;
        }

        .view-toggle button:hover {
          background: var(--color-surface-1);
          border-color: var(--color-border-focus);
        }

        .view-toggle button.active {
          background: var(--color-bg-sidebar-active);
          color: #ffffff;
          border-color: var(--color-bg-sidebar-active);
        }

        .folder-item {
          height: 40px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-spring);
        }

        .folder-item:hover {
          background: var(--color-surface-1);
        }

        .folder-item.active {
          background: var(--color-bg-sidebar-active);
          color: #ffffff;
        }

        .folder-item .icon {
          font-size: 18px;
          width: 18px;
          text-align: center;
        }

        .folder-item .label {
          font-size: 13px;
          font-weight: 500;
        }

        .file-item {
          height: 40px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-spring);
        }

        .file-item:hover {
          background: var(--color-surface-1);
        }

        .file-item.active {
          background: var(--color-bg-sidebar-active);
          color: #ffffff;
        }

        .file-item .icon {
          font-size: 14px;
          width: 14px;
          text-align: center;
          flex-shrink: 0;
        }

        .file-item .name {
          font-size: 11px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-item .metadata {
          font-size: 10px;
          color: var(--color-text-muted);
          margin-left: auto;
        }

        /* Folder grid layout */
        .folder-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .folder-card {
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          transition: all var(--duration-fast) var(--ease-spring);
          cursor: pointer;
        }

        .folder-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-2px);
        }

        .folder-card.active {
          border-color: var(--color-bg-sidebar-active);
        }

        .folder-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .folder-label {
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .folder-count {
          font-size: 10px;
          color: var(--color-text-muted);
        }

        /* File grid layout */
        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .file-card {
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all var(--duration-fast) var(--ease-spring);
          cursor: pointer;
          height: 100%;
        }

        .file-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-2px);
        }

        .file-card.active {
          border-color: var(--color-bg-sidebar-active);
        }

        .file-icon {
          font-size: 20px;
          margin-bottom: 8px;
        }

        .file-name {
          font-size: 11px;
          font-weight: 500;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .file-size {
          font-size: 9px;
          color: var(--color-text-muted);
          margin-bottom: 4px;
        }

        .file-date {
          font-size: 9px;
          color: var(--color-text-muted);
        }

        /* Status bar */
        .status-bar {
          height: 28px;
          background: var(--color-bg-sidebar);
          border-top: 1px solid var(--color-border);
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: var(--color-text-muted);
        }

        .status-bar .item-count {
          flex: 1;
          text-align: left;
        }

        .status-bar .sync-status {
          flex: 1;
          text-align: right;
          font-size: 11px;
          color: var(--color-text-muted);
        }
      `}</style>

      {/* Sidebar */}
      <AppSidebar style={{
        width: 240,
        background: "var(--color-bg-sidebar)",
        borderRight: "1px solid var(--color-border)",
      }}>
        <div style={{
          padding: 16,
        }}>
          <h1
            style={{
              fontSize: 14,
              fontWeight: 700,
              margin: 0,
              color: "var(--color-text-primary)",
            }}
          >
            Files
          </h1>
        </div>

        {/* Section: LOCATIONS */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-text-label)",
            paddingLeft: 4,
            marginTop: 24,
            marginBottom: 12,
          }}
        >
          LOCATIONS
        </div>

        {/* Sidebar Items: Home, Recent, Starred */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "0 12px",
          }}
        >
          {/* Home item */}
          <div
            onClick={() => setActiveFolder(FOLDERS[0] as Folder)}
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "0 12px",
              borderRadius: 6,
              background: activeFolder?.id === "documents"
                ? "var(--color-bg-sidebar-active)"
                : "transparent",
              color: activeFolder?.id === "documents" ? "#ffffff" : "var(--color-text-primary)",
              cursor: "pointer",
              transition: "all var(--duration-fast) var(--ease-spring)",
            }}
          >
            <span style={{ fontSize: 16 }} role="img" aria-label="Home">
              🏠
            </span>
            <span>Home</span>
          </div>

          {/* Recent item */}
          <div
            onClick={() => setActiveFolder(FOLDERS[1] as Folder)}
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "0 12px",
              borderRadius: 6,
              background: activeFolder?.id === "downloads"
                ? "var(--color-bg-sidebar-active)"
                : "transparent",
              color: activeFolder?.id === "downloads" ? "#ffffff" : "var(--color-text-primary)",
              cursor: "pointer",
              transition: "all var(--duration-fast) var(--ease-spring)",
            }}
          >
            <span style={{ fontSize: 16 }} role="img" aria-label="Recent">
              ⏳
            </span>
            <span>Recent</span>
          </div>

          {/* Starred item */}
          <div
            onClick={() => setActiveFolder(FOLDERS[2] as Folder)}
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "0 12px",
              borderRadius: 6,
              background: activeFolder?.id === "pictures"
                ? "var(--color-bg-sidebar-active)"
                : "transparent",
              color: activeFolder?.id === "pictures" ? "#ffffff" : "var(--color-text-primary)",
              cursor: "pointer",
              transition: "all var(--duration-fast) var(--ease-spring)",
            }}
          >
            <span style={{ fontSize: 16 }} role="img" aria-label="Starred">
              ⭐
            </span>
            <span>Starred</span>
          </div>
        </div>

        {/* Section: FOLDERS */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-text-label)",
            paddingLeft: 4,
            marginTop: 24,
            marginBottom: 12,
          }}
        >
          FOLDERS
        </div>

        {/* Folder items */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "0 12px",
          }}
        >
          {FOLDERS.map((folder) => (
            <div
              key={folder.id}
              onClick={() => setActiveFolder(folder)}
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "0 12px",
                borderRadius: 6,
                background: activeFolder?.id === folder.id
                  ? "var(--color-bg-sidebar-active)"
                  : "transparent",
                color: activeFolder?.id === folder.id ? "#ffffff" : "var(--color-text-primary)",
                cursor: "pointer",
                transition: "all var(--duration-fast) var(--ease-spring)",
              }}
            >
              <span style={{ fontSize: 16 }} role="img" aria-label={folder.name}>
                {folder.icon}
              </span>
              <span>{folder.name}</span>
              {folder.files.length > 0 && (
                <span
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.4)",
                    marginLeft: 4,
                  }}
                >
                  {folder.files.length}
                </span>
              )}
            </div>
          ))}
        </div>
      </AppSidebar>

      {/* Content Area */}
      <AppContentArea style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        background: "rgba(18,25,40,0.8)",
        overflowY: "auto",
        flex: 1,
      }}>
        {/* Breadcrumb */}
        <div
          style={{
            fontSize: 13,
            color: "var(--color-text-primary)",
            marginBottom: 16,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          {"ApexOS > Home"}
        </div>

        {/* View Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => setViewMode("grid")}
            className="view-toggle"
            style={{
              ...(viewMode === "grid" && {
                background: "var(--color-bg-sidebar-active)",
                color: "#ffffff",
                borderColor: "var(--color-bg-sidebar-active)",
              }),
            }}
          >
            <span style={{ fontSize: 16 }}>📁</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className="view-toggle"
            style={{
              ...(viewMode === "list" && {
                background: "var(--color-bg-sidebar-active)",
                color: "#ffffff",
                borderColor: "var(--color-bg-sidebar-active)",
              }),
            }}
          >
            <span style={{ fontSize: 16 }}>📋</span>
          </button>
        </div>

        {/* Content based on view mode */}
        {viewMode === "grid" ? (
          <>
            {/* Folder Grid */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-label)", marginBottom: 8 }}>
                FOLDERS
              </div>
              <div className="folder-grid">
                {FOLDERS.map((folder) => (
                  <div
                    key={folder.id}
                    className="folder-card"
                    onClick={() => setActiveFolder(folder)}
                    style={{
                      ...(activeFolder?.id === folder.id && {
                        borderColor: "var(--color-bg-sidebar-active)",
                      }),
                    }}
                  >
                    <div className="folder-icon">
                      {folder.icon}
                    </div>
                    <div className="folder-label">{folder.name}</div>
                    <div className="folder-count">{folder.files.length} items</div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Grid */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-label)", marginBottom: 8 }}>
                FILES
              </div>
              <div className="file-grid">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="file-card"
                    onClick={() => setSelectedFile(file)}
                    style={{
                      ...(selectedFile?.id === file.id && {
                        borderColor: "var(--color-bg-sidebar-active)",
                      }),
                    }}
                  >
                    <div className="file-icon">
                      {file.icon}
                    </div>
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{file.size}</div>
                    <div className="file-date">{file.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* List View */
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-label)", marginBottom: 8 }}>
              FILES
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              marginTop: 8,
            }}>
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="file-item"
                  onClick={() => setSelectedFile(file)}
                  style={{
                    ...(selectedFile?.id === file.id && {
                      background: "var(--color-bg-sidebar-active)",
                      color: "#ffffff",
                    }),
                  }}
                >
                  <span className="icon" style={{ fontSize: 14 }} role="img" aria-label={file.name}>
                    {file.icon}
                  </span>
                  <span className="name">{file.name}</span>
                  <span className="metadata">
                    {file.size} • {file.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected file details (detail view) */}
        {selectedFile && (
          <div
            style={{
              marginTop: 24,
              padding: 24,
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 16 }}>
              {selectedFile.name}
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16, color: "var(--color-text-secondary)" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Size</div>
                <span style={{ fontSize: 12, color: "var(--color-text-primary)" }}>{selectedFile.size}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Date</div>
                <span style={{ fontSize: 12, color: "var(--color-text-primary)" }}>{selectedFile.date}</span>
              </div>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-secondary)",
                lineHeight: "1.5",
              }}
            >
              {selectedFile.type === "document" && "Document file - double-click to view"} ||
              {selectedFile.type === "image" && "Image file - preview available"} ||
              {selectedFile.type === "project" && "Open project in Projects App"} ||
              {selectedFile.type === "folder" && "Folder containing files"}
            </p>
          </div>
        )}
      </AppContentArea>

      {/* Bottom Status Bar */}
      <div
        style={{
          height: 28,
          background: "var(--color-bg-sidebar)",
          borderTop: "1px solid var(--color-border)",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          color: "var(--color-text-muted)",
        }}
      >
        <span className="item-count">
          {filteredFiles.length} items, {selectedFile ? "1 selected" : "0 selected"} •
          {/* ☁ Synced */}
        </span>
        <span style={{ flex: 1, textAlign: "right" }}>☁ Synced</span>
      </div>
    </div>
  );
}