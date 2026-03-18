import { usePathname, useSearchParams } from "next/navigation";

export function useCurrentUrl() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentUrl = `${pathname}?${searchParams.toString()}`;

    return currentUrl;
}