import { Header } from "../../components/Header";
import axios from "axios";
import dayjs from "dayjs";
import "./TrackingPage.css";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { CartItem } from "../../types";
import type { ProductType } from "../../types";

type OrderProduct = {
  productId: string;
  quantity: number;
  product: ProductType;
  estimatedDeliveryTimeMs: number;
};

type OrderType = {
  id: string;
  orderTimeMs: number;
  products: OrderProduct[];
};

interface TrackingPageProps  {
  cart: CartItem[];
}

export function TrackingPage({ cart }: TrackingPageProps) {
  const { orderId, productId } = useParams();
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      const response = await axios.get(
        `/api/orders/${orderId}?expand=products`
      );
      setOrder(response.data);
    };
    fetchTrackingData();
  }, [orderId]);

  if (!order) {
    return null;
  }

  const orderProduct = order.products.find((orderProduct: OrderProduct) => {
    return orderProduct.productId === productId;
  });
  if (!orderProduct) {
    return null;
  }

  const totalDeliveryTimeMs =
    orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
  const timePassedMs = dayjs().valueOf() - order.orderTimeMs;

  let deliveryPercent = (timePassedMs / totalDeliveryTimeMs) * 100;
  if (deliveryPercent > 100) {
    deliveryPercent = 100;
  }

  const isPreparing = deliveryPercent < 33;
  const isShipped = deliveryPercent >= 33 && deliveryPercent < 100;
  const isDelivered = deliveryPercent === 100;

  console.log(isPreparing, isShipped, isDelivered);


  return (
    <>
      <title>Tracking</title>
      <link rel="icon" type="image/svg+xml" href="tracking-favicon.png" />

      <Header cart={cart} />

      <div className="tracking-page">
        <div className="order-tracking">
          <a className="back-to-orders-link link-primary" href="/orders">
            View all orders
          </a>

          <div className="delivery-date">
            {deliveryPercent >= 100 ? "Delivered on" : "Arriving on"}
            {dayjs(orderProduct.estimatedDeliveryTimeMs).format("dddd, MMMM D")}
          </div>

          <div className="product-info">{orderProduct.product.name}</div>

          <div className="product-info">Quantity: {orderProduct.quantity}</div>

          <img className="product-image" src={orderProduct.product.image} />

          <div className="progress-labels-container">
            <div
              className={`progress-label ${isPreparing && "current-status"}`}
            >
              Preparing
            </div>
            <div className={`progress-label ${isShipped && "current-status"}`}>
              Shipped
            </div>
            <div
              className={`progress-label ${isDelivered && "current-status"}`}
            >
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${deliveryPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
