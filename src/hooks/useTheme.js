import { useCallback, useEffect, useState } from "react";

const current = () => document.documentElement.getAttribute("data-theme") || "light";

export const useTheme = () => {
  const [theme, setTheme] = useState(current);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e) => {
      let stored = null;
      try {
        stored = localStorage.getItem("theme");
      } catch {
        /* storage unavailable */
      }
      if (!stored) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
};
