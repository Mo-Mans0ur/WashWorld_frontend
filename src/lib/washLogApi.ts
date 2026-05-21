import { apiRequest } from "@/lib/apiClient";
import type { WashLogEntry, Subscription } from "@/types/api";

export async function createWashLog(input: {
  car_id: string;
  product_id?: string;
  location_id?: string;
  wash_log_price?: number;
}): Promise<{ wash_log_id: string }> {
  return apiRequest("/api/wash_log", { method: "POST", body: input });
}

export async function fetchWashLog(userId: string): Promise<WashLogEntry[]> {
  const data = await apiRequest<{ wash_log: WashLogEntry[] }>(
    `/api/wash_log?user_id=${encodeURIComponent(userId)}`,
  );
  return data.wash_log;
}

export type ReceiptItem =
  | { kind: "wash"; entry: WashLogEntry }
  | { kind: "subscription"; entry: Subscription & { car_license_plate: string } };

export function buildReceiptList(
  washLog: WashLogEntry[],
  subscriptions: Subscription[],
  cars: { car_id: string; car_license_plate: string }[],
): ReceiptItem[] {
  const plateByCarId = Object.fromEntries(cars.map((c) => [c.car_id, c.car_license_plate]));

  const washItems: ReceiptItem[] = washLog.map((entry) => ({
    kind: "wash",
    entry,
  }));

  const subItems: ReceiptItem[] = subscriptions.map((sub) => ({
    kind: "subscription",
    entry: { ...sub, car_license_plate: plateByCarId[sub.car_id] ?? "—" },
  }));

  return [...washItems, ...subItems].sort((a, b) => {
    const dateA = a.kind === "wash"
      ? a.entry.wash_log_start_time
      : a.entry.subscriptions_start_date;
    const dateB = b.kind === "wash"
      ? b.entry.wash_log_start_time
      : b.entry.subscriptions_start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}

export function formatWashDate(isoString: string): string {
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoString));
}

export function formatWashTime(isoString: string): string {
  return new Intl.DateTimeFormat("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

export function washLogIcon(productName: string | null): string {
  const lower = (productName ?? "").toLowerCase();
  if (lower.includes("selv")) return "/icons/VaskSelvIcon.png";
  return "/icons/EnkeltVaskIcon.png";
}

export function formatPrice(price: number | string | null): string {
  if (price === null || price === undefined) return "—";
  return `${Number(price).toFixed(0)} kr.`;
}
