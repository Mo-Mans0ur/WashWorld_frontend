import { apiRequest } from "@/lib/apiClient";
import type { Subscription } from "@/types/api";

export async function fetchSubscriptions(): Promise<Subscription[]> {
  const data = await apiRequest<{ subscriptions: Subscription[] }>("/api/subscriptions");
  return data.subscriptions;
}

export async function fetchUserSubscriptions(userId: string): Promise<Subscription[]> {
  const data = await apiRequest<{ subscriptions: Subscription[] }>(
    `/api/users/${encodeURIComponent(userId)}/subscriptions`,
  );
  return data.subscriptions;
}

export type CreateSubscriptionInput = {
  product_id?: string;
  car_id?: string;
  subscription_name: string;
  subscription_price: number;
  subscription_status: string;
  subscription_start_date: string;
  subscription_end_date: string;
  subscription_next_billing_date: string;
};

export async function createSubscription(
  input: CreateSubscriptionInput,
): Promise<{ message: string; subscription_id: string }> {
  return apiRequest("/api/subscriptions", { method: "POST", body: input });
}

export type UpdateSubscriptionInput = {
  subscription_status: string;
  subscription_end_date: string;
  subscription_next_billing_date: string;
};

export async function updateSubscription(
  subscriptionId: string,
  input: UpdateSubscriptionInput,
): Promise<{ message: string }> {
  return apiRequest(`/api/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    method: "PUT",
    body: input,
  });
}

export async function deleteSubscription(
  subscriptionId: string,
): Promise<{ message: string }> {
  return apiRequest(`/api/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    method: "DELETE",
  });
}
