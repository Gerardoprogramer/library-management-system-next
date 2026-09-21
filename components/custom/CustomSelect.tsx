"use client";

import { PiFunnel } from "react-icons/pi";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Option {
  id: string;
  name: string;
}

interface CustomSelectProps {
  options: Option[];
  headline: string;
  selectedItem: string;
  setSelectedItem: (item: string) => void;
}

export const CustomSelect = ({ options, headline, selectedItem, setSelectedItem }: CustomSelectProps) => {
  return (
    <Select value={selectedItem} onValueChange={setSelectedItem}>
      <SelectTrigger aria-label={headline} className="h-11 w-full min-w-44 rounded-xl">
        <PiFunnel className="mr-2 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

        <SelectValue placeholder={headline} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">{headline}</SelectItem>

        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
