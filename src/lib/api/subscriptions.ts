import { apiRequest } from "@/lib/apiClient";
import type { Subscription } from "@/types/api";

export async function getSubscriptions(userId: string): Promise<Subscription[]> {
  const data = await apiRequest<{ subscriptions: Subscription[] }>(
    `/api/users/${userId}/subscriptions`,
  );
  return data.subscriptions;
}
