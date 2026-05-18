// Fælles TypeScript-typer der matcher Flask-backendets database-modeller

export type User = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  member_since: string;
};

export type Vehicle = {
  vehicle_id: number;
  user_id: number;
  license_plate: string;
  country_code: string;
  nickname: string | null;
  is_ev: boolean;
  is_active: boolean;
};

export type Subscription = {
  subscription_id: number;
  user_id: number;
  plan_name: string;
  status: "active" | "inactive" | "cancelled";
  renewal_date: string;
};

export type WashHistory = {
  wash_id: number;
  user_id: number;
  location_id: string;
  location_name: string;
  location_address: string;
  license_plate: string;
  wash_type: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  washed_at: string;
};

export type Location = {
  location_id: string;
  location_address: string;
  location_zipcode: string;
  location_coordinate_x: number;
  location_coordinate_y: number;
  location_open_hours: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApiError = {
  error: string;
  message?: string;
};
