import type { ApiError } from "@/types/api";

function getBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base?.trim()) throw new Error("NEXT_PUBLIC_API_BASE_URL er ikke sat");
  return base.replace(/\/$/, "");
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function saveToken(token: string): void {
  if (typeof window !== "undefined") localStorage.setItem("token", token);
}

export function clearToken(): void {
  if (typeof window !== "undefined") localStorage.removeItem("token");
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${getBase()}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Ikke autoriseret — log ind igen");
  }

  if (!res.ok) {
    let errorMsg = `Fejl ${res.status}`;
    try {
      const data = (await res.json()) as ApiError;
      errorMsg = data.message ?? data.error ?? errorMsg;
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMsg);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
