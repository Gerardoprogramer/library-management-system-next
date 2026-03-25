import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import type { User } from "@/lib/definitions";

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: userService.me,
    staleTime: 1000 * 60 * 30,
    retry: false, 
  });
}