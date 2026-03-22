import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: userService.me,
    });
}
