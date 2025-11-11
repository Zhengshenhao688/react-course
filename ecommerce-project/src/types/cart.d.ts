import type { ProductType } from "./product";

export type CartItem = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
  product: ProductType;
};

export type CartType = CartItem[];