// 该组件用于显示购物车中商品的预计送达日期，根据选择的配送选项展示对应的送达时间。

import dayjs from "dayjs";
import type { CartItem } from "../../types";

// DeliveryDataProps 定义了组件接收的 props 结构，包含配送选项列表和购物车中的单个商品信息。
// deliveryOptions 是一个数组，包含多个配送选项，每个选项有唯一 id 和预计送达时间的时间戳。
// cartItem 表示购物车中的商品，包含所选的配送选项 id。
interface DeliveryDataProps  {
  deliveryOptions: {
    id: string;
    estimatedDeliveryTimeMs: number;
  }[];
  cartItem: CartItem;
};

export function DeliveryData({ deliveryOptions, cartItem }: DeliveryDataProps) {
  // 根据购物车商品的配送选项 id，从配送选项列表中查找对应的配送选项对象。
  const selectedDeliveryOption = deliveryOptions.find((deliveryOption) => {
    return deliveryOption.id === cartItem.deliveryOptionId;
  });

  // 渲染逻辑：如果找到了对应的配送选项，则格式化并显示预计送达日期；否则显示 "N/A"。
  return (
    <div className="delivery-date">
      Delivery date:
      {selectedDeliveryOption
        ? dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format(
            "dddd, MMMM D"
          )
        : "N/A"}
    </div>
  );
}
