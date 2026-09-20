"use client";

import { useCallback, useRef } from "react";
import { PiMoon, PiSun } from "react-icons/pi";

import { useTheme } from "@/components/providers/ThemeProvider";

const LIGHT_BACKGROUND = "oklch(0.985 0.003 80)";
const DARK_BACKGROUND = "oklch(0.145 0.008 70)";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(async () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      toggleTheme();
      return;
    }

    const button = buttonRef.current;

    if (!button) {
      toggleTheme();
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const maxRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    if (document.startViewTransition) {
      document.documentElement.style.setProperty("--toggle-x", `${x}px`);
      document.documentElement.style.setProperty("--toggle-y", `${y}px`);
      document.documentElement.style.setProperty("--toggle-radius", `${maxRadius}px`);

      const transition = document.startViewTransition(() => {
        toggleTheme();
      });

      await transition.ready;

      return;
    }

    const overlay = document.createElement("div");

    overlay.className = "theme-transition-overlay";
    overlay.style.setProperty("--x", `${x}px`);
    overlay.style.setProperty("--y", `${y}px`);
    overlay.style.setProperty("--radius", `${maxRadius}px`);
    overlay.style.backgroundColor = theme === "dark" ? LIGHT_BACKGROUND : DARK_BACKGROUND;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("expanding");
    });

    window.setTimeout(() => {
      toggleTheme();
    }, 320);

    window.setTimeout(() => {
      overlay.remove();
    }, 500);
  }, [theme, toggleTheme]);

  const isLight = theme === "light";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      aria-label={isLight ? "Activar modo oscuro" : "Activar modo claro"}
      title={isLight ? "Modo oscuro" : "Modo claro"}
      className="relative flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <PiSun
        aria-hidden="true"
        className={`absolute size-4.75 transition-all duration-200 ${
          isLight ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-75 opacity-0"
        }`}
      />

      <PiMoon
        aria-hidden="true"
        className={`absolute size-4.75 transition-all duration-200 ${
          isLight ? "-rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
