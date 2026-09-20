import { useSyncExternalStore } from "react";
import { PiFunnel } from "react-icons/pi";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Option = {
  id: string;
  name: string;
};

interface SelectItemProps {
  options: Option[];
  headline: string;
  selectedItem: string;
  setSelectedItem: (item: string) => void;
}

const subscribe = () => () => {};

export const CustomSelect = ({ options, headline, selectedItem, setSelectedItem }: SelectItemProps) => {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!mounted) return null;

  return (
    <Select value={selectedItem} onValueChange={setSelectedItem}>
      <SelectTrigger className="h-11 w-full min-w-44 rounded-xl">
        <PiFunnel className="mr-2 size-4.5 shrink-0 text-muted-foreground" />
        <SelectValue placeholder={headline} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">{headline}</SelectItem>

        {options.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
