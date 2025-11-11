import type { CartItem } from "./cart";

export type OrderType = {
  id: string;
  items: CartItem[];
  totalCents: number;
  createdAt: string;
  status: "pending" | "paid" | "delivered";
};