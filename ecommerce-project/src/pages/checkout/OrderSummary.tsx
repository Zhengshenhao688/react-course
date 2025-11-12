import type { CartItem } from "../../types";
import { DeliveryOptions } from "./DeliveryOptions";
import { CartItemDetails } from "./CartItemDetails";
import { DeliveryData } from "./DeliveryData";

export type DeliveryOption = {
  id: string;
  deliveryDays: number;
  priceCents: number;
  estimatedDeliveryTimeMs: number;
};

type OrderSummaryProps = {
  cart: CartItem[];
  deliveryOptions: DeliveryOption[];
  loadCart: () => Promise<void> | void;
};

export function OrderSummary({ cart, deliveryOptions, loadCart }: OrderSummaryProps) {
  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => {
          return (
            <div
              key={cartItem.productId}
              className="cart-item-container"
              data-testid="cart-item-container"
            >
              <DeliveryData
                deliveryOptions={deliveryOptions}
                cartItem={cartItem}
              />

              <div className="cart-item-details-grid">
                <CartItemDetails cartItem={cartItem} loadCart={loadCart} />

                <DeliveryOptions
                  deliveryOptions={deliveryOptions}
                  cartItem={cartItem}
                  loadCart={loadCart}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
