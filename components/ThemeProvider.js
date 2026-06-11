"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeCtx = createContext(null);

export function useTheme() {
  return useContext(ThemeCtx) || { theme: "light", accent: null, setTheme: () => {}, toggle: () => {}, setAccent: () => {} };
}

const STORAGE_THEME = "eos-theme";
const STORAGE_ACCENT = "eos-accent";

// hex "#6366f1" -> "99 102 241"
function hexToTriplet(hex) {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

function applyAccent(hex) {
  const root = document.documentElement;
  if (!hex) {
    root.style.removeProperty("--brand");
    root.style.removeProperty("--brand-soft");
    return;
  }
  const t = hexToTriplet(hex);
  root.style.setProperty("--brand", t);
  root.style.setProperty("--brand-soft", t);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [accent, setAccentState] = useState(null);

  // Sync React state with whatever the no-flash script + storage already set.
  useEffect(() => {
    let t = "light";
    let a = null;
    try {
      t = localStorage.getItem(STORAGE_THEME) || "light";
      a = localStorage.getItem(STORAGE_ACCENT) || null;
    } catch (e) {}
    setThemeState(t);
    setAccentState(a);
    applyTheme(t);
    if (a) applyAccent(a);
  }, []);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem(STORAGE_THEME, t);
    } catch (e) {}
  }, []);

  const toggle = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  const setAccent = useCallback((hex) => {
    setAccentState(hex);
    applyAccent(hex);
    try {
      if (hex) localStorage.setItem(STORAGE_ACCENT, hex);
      else localStorage.removeItem(STORAGE_ACCENT);
    } catch (e) {}
  }, []);

  return <ThemeCtx.Provider value={{ theme, accent, setTheme, toggle, setAccent }}>{children}</ThemeCtx.Provider>;
}
