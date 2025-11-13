import axios from "axios";
import {
  Fragment,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { formatMoney } from "../../utils/money";
import type { CartItem } from "../../types";

interface CartItemDetailsProps  {
  cartItem: CartItem;
  loadCart: () => Promise<void> | void;
};

export function CartItemDetails({ cartItem, loadCart }: CartItemDetailsProps) {
  // 是否处于更新数量的编辑状态，控制输入框的显示与隐藏
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  // 当前数量输入框的值，初始为购物车中该商品的数量
  const [quantity, setQuantity] = useState<string>(String(cartItem.quantity));

  // 删除购物车中的该商品，调用接口后重新加载购物车数据
  const deleteCartItem = async () => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  };

  // 处理数量输入框的变化事件，更新本地状态 quantity
  const updateQuantityInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  // 更新商品数量的逻辑：
  // 如果当前处于编辑状态，调用接口更新数量并退出编辑状态，刷新购物车
  // 否则进入编辑状态，显示输入框
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

  // 处理数量输入框的键盘事件：
  // 按下 Enter 键时提交更新数量
  // 按下 Escape 键时取消编辑，恢复原数量并退出编辑状态
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
