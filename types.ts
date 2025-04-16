export interface ItemPayload {
  user_id: number;
  title: string;
  category_id: number;
  description?: string;
  condition: string;
  location: string;
  status?: string;
  trade_type?: "itemForItem" | "itemForService" | "openToAll";
  accept_cash?: boolean;
  brand?: string;
  model?: string;
  year?: number;
  specifications?: Record<string, any>;
  images?: {
    url: string;
    is_main?: boolean;
  }[];
  category?: string;
  subcategory?: string;
  hasImages?: boolean;
  hideExactAddress?: boolean;
}

export interface ServicePayload {
  user_id: number;
  title: string;
  category_id: number;
  description?: string;
  hourly_rate?: number;
  location: string;
  status?: string;
  trade_type?: "serviceForItem" | "serviceForService" | "openToAll";
  time_estimation?: number;
  time_unit?: "hours" | "days" | "weeks" | "months";
  cancellation_policy?: "flexible" | "moderate" | "strict" | "nonRefundable";
  images?: {
    url: string;
    is_main?: boolean;
  }[];
}
