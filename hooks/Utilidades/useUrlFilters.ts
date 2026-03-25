import { useSearchParams, useRouter } from "next/navigation";

export const useUrlFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const get = (key: string, defaultValue = "") =>
        searchParams.get(key) ?? defaultValue;

    const set = (params: Record<string, string | boolean | undefined>) => {
        const newParams = new URLSearchParams(searchParams.toString());

        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === "" || value === "all") {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }
        });

        router.replace(`?${newParams.toString()}`);
    };

    return {
        get,
        set,
    };
};