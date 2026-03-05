import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function useDebouncedSearchParam(
    paramName: string,
    delay = 500
) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const paramValue = searchParams.get(paramName) ?? "";

    const [value, setValue] = useState(paramValue);
    const [debouncedValue, setDebouncedValue] = useState(paramValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    useEffect(() => {
        if (debouncedValue === paramValue) return;

        const params = new URLSearchParams(searchParams.toString());

        if (!debouncedValue) {
            params.delete(paramName);
        } else {
            params.set(paramName, debouncedValue);
        }

        params.delete("CatalogPage");

        router.replace(`?${params.toString()}`);
    }, [debouncedValue]);

    return {
        value,
        setValue,
        debouncedValue,
    };
}