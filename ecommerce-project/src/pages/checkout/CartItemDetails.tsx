import axios from "axios";
import {
  Fragment,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { formatMoney } from "../../utils/money";
import type { ProductType } from "../home/Product";

type CartItem = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
  product: ProductType;
};

type CartItemDetailsProps = {
  cartItem: CartItem;
  loadCart: () => Promise<void> | void;
};

export function CartItemDetails({ cartItem, loadCart }: CartItemDetailsProps) {
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [quantity, setQuantity] = useState<string>(String(cartItem.quantity));

  const deleteCartItem = async () => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  };

  const updateQuantityInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const updateQuantity = async () => {
    if (isUpdatingQuantity) {
      await axios.put(`/api/cart-items/${cartItem.productId}`, {
        quantity: Number(quantity),
      });
      setIsUpdatingQuantity(false);
      await loadCart();
    } else {
      setIsUpdatingQuantity(true);
    }
  };

  const handleQuantityKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const keyPressed = event.key;

    if (keyPressed === "Enter") {
      updateQuantity();
    } else if (keyPressed === "Escape") {
      setQuantity(String(cartItem.quantity));
      setIsUpdatingQuantity(false);
    }
  };

  return (
    <Fragment>
      <img
        className="product-image"
        src={cartItem.product.image}
        data-testid="cart-item-image"
      />

      <div className="cart-item-details">
        <div className="product-name" data-testid="cart-item-name">
          {cartItem.product.name}
        </div>
        <div className="product-price" data-testid="cart-item-price">
          {formatMoney(cartItem.product.priceCents)}
        </div>
        <div className="product-quantity">
          <span data-testid="cart-item-quantity">
            Quantity: {isUpdatingQuantity ? (
              <input
                type="text"
                className="quantity-textbox"
                value={quantity}
                onChange={updateQuantityInput}
                onKeyDown={handleQuantityKeyDown}
              />
            ) : (
              <span className="quantity-label">{cartItem.quantity}</span>
            )}
          </span>
          <span
            className="update-quantity-link link-primary"
            onClick={updateQuantity}
          >
            Update
          </span>
          <span
            className="delete-quantity-link link-primary"
            data-testid="cart-item-delete-quantity-link"
            onClick={deleteCartItem}
          >
            Delete
          </span>
        </div>
      </div>
    </Fragment>
  );
}
