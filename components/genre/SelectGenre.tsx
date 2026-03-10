
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Genre } from "@/lib/definitions";
import { Filter } from "lucide-react";

interface SelectGenreProps {
    genres: Genre[];
    selectedGenre: string;
    setSelectedGenre: (genreId: string) => void;
}

export const SelectGenre = ({
    genres,
    selectedGenre,
    setSelectedGenre,
}: SelectGenreProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Select
            value={selectedGenre}
            onValueChange={(value) => setSelectedGenre(value)}
        >
            <SelectTrigger className="w-40 sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Todos los Géneros</SelectItem>

                {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                        {genre.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};