/** Future B2B ordering types — Phase 2 stub */
export type OrderStatus =
  | "draft"
  | "submitted"
  | "confirmed"
  | "dispatched"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  retailer_id: string;
  status: OrderStatus;
  external_id?: string;
  created_at: string;
};
