"use client";

import { useState } from "react";
import { PiEye, PiEyeSlash, PiLockKey } from "react-icons/pi";

import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  label?: string;
}

export function PasswordInput({ value, onChange, id = "password", label = "Contraseña" }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="relative">
        <PiLockKey className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="pl-10 pr-10"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />

        <button
          type="button"
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={showPassword}
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {showPassword ? <PiEyeSlash className="size-4" /> : <PiEye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
