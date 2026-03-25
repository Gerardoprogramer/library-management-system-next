import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function useDebouncedSearchParam(paramName: string, delay = 500) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedValue, pathname, router, searchParams, paramName, paramValue]);

  return {
    value,
    setValue,
    debouncedValue,
  };
}