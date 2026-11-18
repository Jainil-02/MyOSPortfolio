"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { getSettings, subscribeToSettings } from "@core/settings";
import { subscribeToWindows, listWindows } from "@core/window-manager";
import { useSyncExternalStore } from "react";

type BrowserTab = {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
};

const DEFAULT_HOME_URL = "about:blank";
const SEARCH_ENGINE = "https://duckduckgo.com/?q=";

export default function BrowserApp({ initialUrl }: { initialUrl?: string }) {
  const [tabs, setTabs] = useState<BrowserTab[]>(() => {
    const url = initialUrl || DEFAULT_HOME_URL;
    return [{
      id: crypto.randomUUID(),
      url,
      title: "New Tab",
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
    }];
  });
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [addressBarValue, setAddressBarValue] = useState(() =>
    initialUrl && initialUrl !== "about:blank" ? initialUrl : ""
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const settings = useSyncExternalStore(subscribeToSettings, getSettings, () => ({
    wallpaper: "linear-gradient(135deg, #0d1b2a 0%, #0a3040 40%, #062030 100%)",
    wallpaperVariant: "dark" as const,
    theme: "dark" as const,
    lockScreenEnabled: true,
    accentColor: "#10b981",
  }));

  const windows = useSyncExternalStore(subscribeToWindows, listWindows, () => []);
  const isFocused = windows.find((w) => w.appId === "browser")?.focused && !windows.find((w) => w.appId === "browser")?.minimized;

  const activeTab = tabs[activeTabIndex];

  const navigate = useCallback((url: string, tabIndex?: number) => {
    const targetIndex = tabIndex ?? activeTabIndex;
    const targetUrl = url.startsWith("http") || url.startsWith("about:") || url.startsWith("data:")
      ? url
      : url.includes(".") && !url.includes(" ")
        ? `https://${url}`
        : `${SEARCH_ENGINE}${encodeURIComponent(url)}`;

    setTabs(prev => prev.map((tab, i) =>
      i === targetIndex
        ? { ...tab, url: targetUrl, title: "Loading...", isLoading: true }
        : tab
    ));
    setAddressBarValue(targetUrl);
    iframeRef.current?.contentWindow?.location.replace(targetUrl);
  }, [activeTabIndex]);

  const handleAddressBarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressBarValue.trim()) {
      navigate(addressBarValue.trim());
    }
  };

  const addNewTab = () => {
    const newTab: BrowserTab = {
      id: crypto.randomUUID(),
      url: DEFAULT_HOME_URL,
      title: "New Tab",
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabIndex(prev => prev + 1);
    setAddressBarValue("");
  };

  const closeTab = (index: number) => {
    if (tabs.length <= 1) return;
    setTabs(prev => prev.filter((_, i) => i !== index));
    setActiveTabIndex(prev => {
      if (index < prev) return prev - 1;
      if (index === prev && prev > 0) return prev - 1;
      return prev;
    });
  };

  const switchTab = (index: number) => {
    setActiveTabIndex(index);
    const tab = tabs[index];
    if (tab) {
      setAddressBarValue(tab.url === "about:blank" ? "" : tab.url);
    }
  };

  const goBack = (index: number) => {
    const tab = tabs[index];
    if (tab?.canGoBack && iframeRef.current) {
      iframeRef.current.contentWindow?.history.back();
    }
  };

  const goForward = (index: number) => {
    const tab = tabs[index];
    if (tab?.canGoForward && iframeRef.current) {
      iframeRef.current.contentWindow?.history.forward();
    }
  };

  const reloadTab = (index: number) => {
    const tab = tabs[index];
    if (iframeRef.current && tab && tab.url !== "about:blank") {
      setTabs(prev => prev.map((tab, i) =>
        i === index ? { ...tab, isLoading: true } : tab
      ));
      iframeRef.current.contentWindow?.location.reload();
    }
  };

  const handleIframeLoad = (index: number) => {
    setTabs(prev => prev.map((tab, i) =>
      i === index ? { ...tab, isLoading: false } : tab
    ));
    // Try to get title from iframe (may fail due to CORS)
    try {
      const title = iframeRef.current?.contentDocument?.title;
      if (title) {
        setTabs(prev => prev.map((tab, i) =>
          i === index ? { ...tab, title } : tab
        ));
      }
    } catch {
      // Cross-origin, can't read title
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isFocused) return;

    const target = e.target as HTMLElement;
    if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
      if (e.key === "Escape") {
        target.blur();
        e.preventDefault();
      }
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "l") {
      e.preventDefault();
      const input = document.querySelector('.browser-address-input') as HTMLInputElement;
      input?.focus();
      input?.select();
    } else if ((e.metaKey || e.ctrlKey) && e.key === "t") {
      e.preventDefault();
      addNewTab();
    } else if ((e.metaKey || e.ctrlKey) && e.key === "w") {
      e.preventDefault();
      closeTab(activeTabIndex);
    } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "t") {
      e.preventDefault();
      // Reopen last closed tab - not implemented
    } else if ((e.metaKey || e.ctrlKey) && e.key === "r") {
      e.preventDefault();
      reloadTab(activeTabIndex);
    } else if ((e.metaKey || e.ctrlKey) && e.key === "[") {
      e.preventDefault();
      goBack(activeTabIndex);
    } else if ((e.metaKey || e.ctrlKey) && e.key === "]") {
      e.preventDefault();
      goForward(activeTabIndex);
    }
  }, [isFocused, activeTabIndex, addNewTab, closeTab, reloadTab, goBack, goForward]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleIframeMessage = useCallback((e: MessageEvent) => {
    // Handle postMessage from iframe for navigation updates
    if (e.data?.type === "browser-navigate") {
      const newUrl = e.data.url;
      const newTitle = e.data.title;
      const canGoBack = e.data.canGoBack;
      const canGoForward = e.data.canGoForward;

      setTabs(prev => prev.map((tab, i) =>
        i === activeTabIndex
          ? { ...tab, url: newUrl, title: newTitle, canGoBack, canGoForward }
          : tab
      ));
      setAddressBarValue(newUrl);
    }
  }, [activeTabIndex]);

  useEffect(() => {
    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, [handleIframeMessage]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        color: "var(--color-text-primary)",
        background: "var(--color-bg-base)",
        overflow: "hidden",
      }}
    >
      <style jsx>{`
        .browser-toolbar {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 12px;
          background: var(--color-bg-sidebar);
          border-bottom: 1px solid var(--color-border);
        }
        .browser-nav-buttons {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .browser-nav-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--duration-fast) var(--ease-spring);
          flex-shrink: 0;
        }
        .browser-nav-btn:hover:not(:disabled) {
          background: var(--color-surface-1);
          border-color: var(--color-border-focus);
        }
        .browser-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .browser-address-form {
          flex: 1;
          display: flex;
          align-items: center;
          margin: 0 8px;
        }
        .browser-address-input {
          flex: 1;
          height: 32px;
          padding: 0 12px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          font-size: 13px;
          font-family: var(--font-sans), system-ui, sans-serif;
          outline: none;
          transition: all var(--duration-fast) var(--ease-spring);
        }
        .browser-address-input:focus {
          border-color: var(--color-border-focus);
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }
        .browser-address-input::placeholder {
          color: var(--color-text-muted);
        }
        .browser-refresh-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--duration-fast) var(--ease-spring);
        }
        .browser-refresh-btn:hover {
          background: var(--color-surface-1);
          border-color: var(--color-border-focus);
        }
        .browser-refresh-btn.spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .browser-new-tab-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--duration-fast) var(--ease-spring);
          flex-shrink: 0;
        }
        .browser-new-tab-btn:hover {
          background: var(--color-surface-1);
          border-color: var(--color-border-focus);
        }
        .browser-tab-bar {
          display: flex;
          align-items: flex-end;
          height: 32px;
          padding: 0 8px 0 12px;
          background: var(--color-bg-sidebar);
          border-bottom: 1px solid var(--color-border);
          overflow-x: auto;
        }
        .browser-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 160px;
          max-width: 240px;
          height: 28px;
          padding: 0 12px;
          border-radius: 6px 6px 0 0;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-bottom: none;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-spring);
          position: relative;
          margin-right: 4px;
        }
        .browser-tab:hover {
          background: var(--color-surface-1);
        }
        .browser-tab.active {
          background: var(--color-bg-surface);
          z-index: 1;
        }
        .browser-tab.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--color-bg-surface);
        }
        .browser-tab-title {
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
        .browser-tab-close {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          opacity: 0;
          transition: all var(--duration-fast);
        }
        .browser-tab:hover .browser-tab-close,
        .browser-tab.active .browser-tab-close {
          opacity: 1;
        }
        .browser-tab-close:hover {
          background: var(--color-win-close);
          color: white;
        }
        .browser-content-area {
          flex: 1;
          position: relative;
          background: #000;
        }
        .browser-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: #000;
        }
        .browser-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 15, 26, 0.8);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .browser-loading-spinner {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--color-accent);
          animation: spin 0.8s linear infinite;
        }
        .browser-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--color-text-secondary);
          padding: 24px;
          text-align: center;
        }
        .browser-empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .browser-empty-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 8px;
        }
        .browser-empty-hint {
          font-size: 12px;
          line-height: 1.6;
        }
        .browser-empty-hint kbd {
          display: inline-block;
          padding: 2px 6px;
          margin: 0 2px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: var(--color-text-primary);
        }
      `}</style>

      {/* Toolbar */}
      <div className="browser-toolbar">
        <div className="browser-nav-buttons">
          <button
            className="browser-nav-btn"
            onClick={() => goBack(activeTabIndex)}
            disabled={!activeTab?.canGoBack}
            title="Back (⌘+[)"
            aria-label="Back"
          >
            <span style={{ fontSize: 14 }}>←</span>
          </button>
          <button
            className="browser-nav-btn"
            onClick={() => goForward(activeTabIndex)}
            disabled={!activeTab?.canGoForward}
            title="Forward (⌘+])"
            aria-label="Forward"
          >
            <span style={{ fontSize: 14 }}>→</span>
          </button>
        </div>

        <form className="browser-address-form" onSubmit={handleAddressBarSubmit}>
          <input
            ref={(el) => { if (el) (el as HTMLInputElement).classList.add('browser-address-input'); }}
            className="browser-address-input"
            type="text"
            value={addressBarValue}
            onChange={(e) => setAddressBarValue(e.target.value)}
            placeholder="Enter URL or search..."
            spellCheck={false}
            autoComplete="off"
          />
        </form>

        <button
          className={`browser-refresh-btn ${activeTab?.isLoading ? 'spinning' : ''}`}
          onClick={() => reloadTab(activeTabIndex)}
          title="Reload (⌘+R)"
          aria-label="Reload"
        >
          <span style={{ fontSize: 14 }}>⟳</span>
        </button>

        <button
          className="browser-new-tab-btn"
          onClick={addNewTab}
          title="New Tab (⌘+T)"
          aria-label="New Tab"
        >
          <span style={{ fontSize: 16 }}>+</span>
        </button>
      </div>

      {/* Tab Bar */}
      <div className="browser-tab-bar" role="tablist">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`browser-tab ${index === activeTabIndex ? 'active' : ''}`}
            role="tab"
            aria-selected={index === activeTabIndex}
            onClick={() => switchTab(index)}
            onMouseDown={(e) => {
              if (e.button === 1) {
                e.preventDefault();
                closeTab(index);
              }
            }}
          >
            <span
              className="browser-tab-title"
              title={tab.title}
            >
              {tab.favicon && <span style={{ fontSize: 14, marginRight: 4 }}>{tab.favicon}</span>}
              {tab.title || "New Tab"}
            </span>
            {tabs.length > 1 && (
              <button
                className="browser-tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(index);
                }}
                aria-label="Close tab"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="browser-content-area">
        {activeTab ? (
          <>
            <iframe
              ref={iframeRef}
              className="browser-iframe"
              src={activeTab.url === "about:blank" ? undefined : activeTab.url}
              title={activeTab.title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-top-navigation-by-user-activation"
              onLoad={() => handleIframeLoad(activeTabIndex)}
            />
            {activeTab.isLoading && activeTab.url !== "about:blank" && (
              <div className="browser-loading-overlay">
                <div className="browser-loading-spinner" />
              </div>
            )}
          </>
        ) : (
          <div className="browser-empty-state">
            <div className="browser-empty-icon">🌐</div>
            <div className="browser-empty-title">Welcome to Browser</div>
            <div className="browser-empty-hint">
              Type a URL or search term in the address bar<br/>
              Press <kbd>⌘</kbd>+<kbd>T</kbd> for new tab, <kbd>⌘</kbd>+<kbd>L</kbd> to focus address bar
            </div>
          </div>
        )}
      </div>
    </div>
  );
}