
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

type Option  = {
    id: string
    name: string
}

interface SelectItemProps {
    options: Option [];
    headline: string;
    selectedItem: string;
    setSelectedItem: (Item: string) => void;
}

export const CustomSelect = ({
    options,
    headline,
    selectedItem,
    setSelectedItem,
}: SelectItemProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Select
            value={selectedItem}
            onValueChange={(value) => setSelectedItem(value)}
        >
            <SelectTrigger className="w-40 sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
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