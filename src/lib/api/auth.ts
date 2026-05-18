import { apiRequest } from "@/lib/apiClient";
import type { AuthResponse } from "@/types/api";

export async function loginUser(
  user_email: string,
  user_password: string,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { user_email, user_password },
  });
}

export async function registerUser(data: {
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_password: string;
  user_phone?: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: data,
  });
}
