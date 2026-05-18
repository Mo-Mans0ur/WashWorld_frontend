import { apiRequest } from "@/lib/apiClient";
import type { User } from "@/types/api";

export async function getUser(userId: string): Promise<User> {
  return apiRequest<User>(`/api/users/${userId}`);
}

export async function updateUser(
  userId: string,
  data: {
    user_firstname?: string;
    user_lastname?: string;
    user_email?: string;
    user_phone?: string;
  },
): Promise<User> {
  return apiRequest<User>(`/api/users/${userId}`, {
    method: "PUT",
    body: data,
  });
}
