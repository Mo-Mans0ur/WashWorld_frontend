// TypeScript-typer der matcher den faktiske MariaDB-database (init.sql)

export type User = {
  user_id: string;            // char(32) UUID
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_phone: string;
  user_created_at: string;
  user_updated_at: string;
  user_deleted_at: string | null;
  user_verified_at: string | null;
};

// `cars` tabellen — country_code, nickname, is_ev, is_active er ikke i DB endnu
export type Car = {
  car_id: string;             // char(32) UUID
  user_id: string;
  car_license_plate: string;
};

export type Product = {
  product_id: string;
  product_name: string;
  product_price: number;
  product_category: string;
};

export type Subscription = {
  subscription_id: string;
  product_id: string;
  car_id: string;
  subscriptions_name: string;
  subscriptions_price: number;
  subscriptions_status: string;
  subscriptions_start_date: string;
  subscriptions_end_date: string;
  subscriptions_next_billing_date: string;
};

export type WashLog = {
  wash_log_id: string;
  car_id: string;
  product_id: string;
  location_id: string;
  wash_log_start_time: string;
};

export type Location = {
  location_id: string;
  location_name: string;
  location_address: string;
  location_zipcode: string;
  location_coordinate_x: number;
  location_coordinate_y: number;
  location_open_hours: string;
};

export type Badge = {
  badges_id: string;
  badge_label: string;
  badge_description: string;
  badge_icon: string;
};

export type UserBadge = {
  user_badges_id: string;
  user_fk: string;
  badges_fk: string;
  achieved: boolean;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApiError = {
  error: string;
  message?: string;
};
