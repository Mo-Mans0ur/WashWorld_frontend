import { apiRequest } from "@/lib/apiClient";
import type { WashLog } from "@/types/api";

export async function getWashLog(userId: string): Promise<WashLog[]> {
  const data = await apiRequest<{ wash_log: WashLog[] }>(
    `/api/users/${userId}/wash-log`,
  );
  return data.wash_log;
}
