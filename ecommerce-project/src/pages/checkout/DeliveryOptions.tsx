import { formatMoney } from "../../utils/money";
import dayjs from "dayjs";
import axios from "axios";
import type { CartItem } from "../../types";

/**
 * 该组件用于展示多个配送选项，并允许用户为购物车中的某个商品选择一个配送方式。
 * 用户选择配送选项后，会发送请求更新购物车中对应商品的配送方式，并刷新购物车数据以反映最新状态。
 */

 /**
  * DeliveryOption 类型定义了一个配送选项的结构，
  * 包含配送选项的唯一标识 id，价格（以分为单位），以及预计配送时间的时间戳（毫秒）。
  */
type DeliveryOption = {
  id: string;
  priceCents: number;
  estimatedDeliveryTimeMs: number;
};

/**
 * DeliveryOptionsProps 类型定义了 DeliveryOptions 组件所需的 props，
 * 包括配送选项数组 deliveryOptions，当前购物车项 cartItem，以及刷新购物车的函数 loadCart。
 */
interface DeliveryOptionsProps  {
  deliveryOptions: DeliveryOption[];
  cartItem: CartItem;
  loadCart: () => Promise<void> | void;
};

export function DeliveryOptions({ deliveryOptions, cartItem, loadCart }: DeliveryOptionsProps) {
  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>

      {/* 
        使用 map 方法遍历所有传入的配送选项 deliveryOptions，
        为每个配送选项渲染一个对应的 UI 元素，供用户选择。
      */}
      {deliveryOptions.map((deliveryOption) => {
        // 根据配送选项价格决定显示的价格字符串，如果价格为0则显示“免费配送”
        let priceString = "FREE Shipping";

        if (deliveryOption.priceCents > 0) {
          priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
        }

        /**
         * updateDeliveryOption 是一个异步函数，
         * 当用户点击某个配送选项时调用。
         * 它会向后端发送 PUT 请求，更新购物车中该商品的配送选项，
         * 然后调用 loadCart 函数刷新购物车数据，确保界面显示最新状态。
         */
        const updateDeliveryOption = async () => {
          await axios.put(`/api/cart-items/${cartItem.productId}`, {
            deliveryOptionId: deliveryOption.id,
          });
          await loadCart();
        };

        return (
          <div
            key={deliveryOption.id}
            className="delivery-option"
            onClick={updateDeliveryOption}
            data-testid="delivery-option"
          >
            {/* 
              单选框用于展示当前配送选项是否被选中。
              checked 属性判断当前配送选项 id 是否等于购物车项中已选的配送选项 id。
              onChange 为空函数是为了避免 React 警告，实际选择逻辑绑定在外层 div 的 onClick 上。
              name 属性保证同一商品的配送选项单选框属于同一组。
            */}
            <input
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              onChange={() => {}}
              className="delivery-option-input"
              data-testid="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`}
            />
            <div>
              {/* 
                显示配送的预计到达日期，
                使用 dayjs 将时间戳格式化为“星期几，月份 日期”的形式，提升用户体验。
              */}
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D"
                )}
              </div>
              {/* 显示配送价格或免费配送提示 */}
              <div className="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
