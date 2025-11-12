import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { DeliveryOptions } from "./DeliveryOptions";
import type { CartItem } from "../../types";

vi.mock("axios");

describe("DeliveryOptions component", () => {
  let deliveryOptions: {
    id: string;
    deliveryDays: number;
    priceCents: number;
    estimatedDeliveryTimeMs: number;
  }[];
  let cartItem: CartItem;
  let loadCart: ReturnType<typeof vi.fn>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    cartItem = {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: "2",
      product: {
        id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        name: "Test Product",
        image: "test-product.jpg",
        rating: { stars: 5, count: 100 },
        priceCents: 1999,
      },
    };

    deliveryOptions = [
      {
        id: "1",
        deliveryDays: 7,
        priceCents: 0,
        estimatedDeliveryTimeMs: 1747597994451,
      },
      {
        id: "2",
        deliveryDays: 3,
        priceCents: 499,
        estimatedDeliveryTimeMs: 1747252394451,
      },
      {
        id: "3",
        deliveryDays: 1,
        priceCents: 999,
        estimatedDeliveryTimeMs: 1747079594451,
      },
    ];

    loadCart = vi.fn();
    user = userEvent.setup();
  });

  it("renders delivery options correctly", () => {
    render(
      <DeliveryOptions
        cartItem={cartItem}
        deliveryOptions={deliveryOptions}
        loadCart={loadCart}
      />
    );

    expect(screen.getByText("Choose a delivery option:")).toBeInTheDocument();

    const deliveryOptionElems = screen.getAllByTestId("delivery-option");
    expect(deliveryOptionElems.length).toBe(3);

    expect(deliveryOptionElems[0]).toHaveTextContent("Monday, May 19");
    expect(deliveryOptionElems[0]).toHaveTextContent("FREE Shipping");
    const input0 = within(deliveryOptionElems[0]).getByTestId(
      "delivery-option-input"
    ) as HTMLInputElement;
    expect(input0.checked).toBe(false);

    expect(deliveryOptionElems[1]).toHaveTextContent("Thursday, May 15");
    expect(deliveryOptionElems[1]).toHaveTextContent("$4.99 - Shipping");
    const input1 = within(deliveryOptionElems[1]).getByTestId(
      "delivery-option-input"
    ) as HTMLInputElement;
    expect(input1.checked).toBe(true);

    expect(deliveryOptionElems[2]).toHaveTextContent("Tuesday, May 13");
    expect(deliveryOptionElems[2]).toHaveTextContent("$9.99 - Shipping");
    const input2 = within(deliveryOptionElems[2]).getByTestId(
      "delivery-option-input"
    ) as HTMLInputElement;
    expect(input2.checked).toBe(false);
  });

  it("updates the delivery option", async () => {
    render(
      <DeliveryOptions
        cartItem={cartItem}
        deliveryOptions={deliveryOptions}
        loadCart={loadCart}
      />
    );

    const deliveryOptionElems = screen.getAllByTestId("delivery-option");

    await user.click(deliveryOptionElems[2]);
    expect(axios.put).toHaveBeenCalledWith(
      "/api/cart-items/e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      { deliveryOptionId: "3" }
    );
    expect(loadCart).toBeCalledTimes(1);

    await user.click(deliveryOptionElems[0]);
    expect(axios.put).toHaveBeenCalledWith(
      "/api/cart-items/e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      { deliveryOptionId: "1" }
    );
    expect(loadCart).toBeCalledTimes(2);
  });
});
