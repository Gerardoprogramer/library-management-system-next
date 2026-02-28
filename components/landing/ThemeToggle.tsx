'use client';

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useRef, useCallback } from "react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(async () => {
    const button = buttonRef.current;

    if (!button) {
      toggleTheme();
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    if (document.startViewTransition) {
      document.documentElement.style.setProperty("--toggle-x", `${x}px`);
      document.documentElement.style.setProperty("--toggle-y", `${y}px`);
      document.documentElement.style.setProperty("--toggle-radius", `${maxRadius}px`);

      const transition = document.startViewTransition(() => {
        toggleTheme();
      });

      await transition.ready;
    } else {
      const overlay = document.createElement("div");
      overlay.className = "theme-transition-overlay";
      overlay.style.setProperty("--x", `${x}px`);
      overlay.style.setProperty("--y", `${y}px`);
      overlay.style.setProperty("--radius", `${maxRadius}px`);
      overlay.style.backgroundColor =
        theme === "dark"
          ? "hsl(40 33% 97%)"
          : "hsl(222 47% 8%)";

      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        overlay.classList.add("expanding");
      });

      setTimeout(() => {
        toggleTheme();
      }, 400);

      setTimeout(() => {
        overlay.remove();
      }, 700);
    }
  }, [theme, toggleTheme]);

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-all duration-200 hover:bg-secondary hover:border-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
      title={theme === "light" ? "Modo oscuro" : "Modo claro"}
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
        strokeWidth={1.5}
      />

      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        strokeWidth={1.5}
      />
    </button>
  );
};

export default ThemeToggle;
