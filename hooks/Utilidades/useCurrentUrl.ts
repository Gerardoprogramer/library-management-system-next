import { usePathname, useSearchParams } from "next/navigation";

export function useCurrentUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  
  const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;

  return currentUrl;
}