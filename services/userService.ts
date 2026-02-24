import { api } from "@/lib/axios";
import { User } from "@/lib/definitions";

export const userService = {
  me: async (): Promise<User> => {
    const response = await api.get("/users/me");
    return response.data.data;
  },
};