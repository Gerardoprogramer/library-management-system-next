import { useRouter, useSearchParams } from "next/navigation";

export const useBookNavigation = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleBack = () => {
        const from = searchParams.get("from");
        if (from) {
            router.push(decodeURIComponent(from));
        } else {
            router.push("/dashboard/catalog");
        }
    };

    return { handleBack };
};