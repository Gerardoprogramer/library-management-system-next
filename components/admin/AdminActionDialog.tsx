"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (value: string) => void;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputType?: "text" | "number";
  defaultValue?: string;
  validate?: (value: string) => boolean;
}

export function AdminActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  inputLabel,
  inputPlaceholder,
  inputType = "text",
  defaultValue = "",
  validate,
}: AdminActionDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const isValid = validate ? validate(value) : true;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValue(defaultValue);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {inputLabel && (
          <div className="space-y-2">
            <Label htmlFor="admin-action-value">{inputLabel}</Label>
            <Input
              id="admin-action-value"
              type={inputType}
              placeholder={inputPlaceholder}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoFocus
            />
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!isValid}
            onClick={() => {
              onConfirm(value);
              handleOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
