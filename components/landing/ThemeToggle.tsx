'use client';

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/hooks/useTheme";
import { useRef, useCallback } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    
    // Get toggle button position for the animation origin
    const button = buttonRef.current;
    if (!button) {
      setTheme(newTheme);
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate the maximum radius needed to cover the entire screen
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Check if View Transition API is supported
    if (document.startViewTransition) {
      // Set custom properties for the animation origin
      document.documentElement.style.setProperty("--toggle-x", `${x}px`);
      document.documentElement.style.setProperty("--toggle-y", `${y}px`);
      document.documentElement.style.setProperty("--toggle-radius", `${maxRadius}px`);

      const transition = document.startViewTransition(() => {
        setTheme(newTheme);
      });

      await transition.ready;
    } else {
      // Fallback: Use CSS animation for browsers without View Transition API
      const overlay = document.createElement("div");
      overlay.className = "theme-transition-overlay";
      overlay.style.setProperty("--x", `${x}px`);
      overlay.style.setProperty("--y", `${y}px`);
      overlay.style.setProperty("--radius", `${maxRadius}px`);
      overlay.style.backgroundColor = newTheme === "dark" 
        ? "hsl(222 47% 8%)" 
        : "hsl(40 33% 97%)";
      
      document.body.appendChild(overlay);

      // Trigger animation
      requestAnimationFrame(() => {
        overlay.classList.add("expanding");
      });

      // Change theme at the middle of animation
      setTimeout(() => {
        setTheme(newTheme);
      }, 200);

      // Remove overlay after animation
      setTimeout(() => {
        overlay.remove();
      }, 500);
    }
  }, [theme, setTheme]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-all duration-200 hover:bg-secondary hover:border-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
      title={theme === "light" ? "Modo oscuro" : "Modo claro"}
    >
      {/* Sun icon - visible in light mode */}
      <Sun 
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === "light" 
            ? "rotate-0 scale-100 opacity-100" 
            : "rotate-90 scale-0 opacity-0"
        }`}
        strokeWidth={1.5}
      />
      
      {/* Moon icon - visible in dark mode */}
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
