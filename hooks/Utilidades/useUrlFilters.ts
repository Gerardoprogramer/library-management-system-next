import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useUrlFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const get = useCallback((key: string, defaultValue = "") => searchParams.get(key) ?? defaultValue, [searchParams]);

  const set = useCallback(
    (params: Record<string, string | boolean | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "all") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      const query = newParams.toString();

      router.replace(query ? `?${query}` : "?");
    },
    [router, searchParams]
  );

  return {
    get,
    set,
  };
};
