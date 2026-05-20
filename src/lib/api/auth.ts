import { apiRequest } from "@/lib/apiClient";
import type { AuthResponse, User } from "@/types/api";

function normalizeAuthResponse(data: AuthResponse): AuthResponse {
  if (!data?.token || !data?.user?.user_id) {
    throw new Error("Uventet svar fra serveren");
  }
  return data;
}

export async function loginUser(
  user_email: string,
  user_password: string,
): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { user_email, user_password },
    skipAuthRedirect: true,
  });
  return normalizeAuthResponse(data);
}

export async function registerUser(data: {
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_password: string;
  user_phone?: string;
}): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: data,
    skipAuthRedirect: true,
  });
  return normalizeAuthResponse(response);
}

export async function updateAuthUser(
  userId: string,
  data: { user_firstname: string; user_lastname: string; user_email: string; user_phone: string; user_password?: string },
): Promise<User> {
  return apiRequest<User>(`/api/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: data,
  });
}

/** Henter bruger fra databasen (`GET /api/users/<user_id>`). */
export async function fetchAuthUser(userId: string): Promise<User> {
  const data = await apiRequest<{ user: User } | User>(
    `/api/users/${encodeURIComponent(userId)}`,
  );
  if (data && typeof data === "object" && "user" in data && data.user) {
    return data.user;
  }
  return data as User;
}
