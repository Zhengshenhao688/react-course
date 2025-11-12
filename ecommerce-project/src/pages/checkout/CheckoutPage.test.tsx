import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import axios from "axios";
import { CheckoutPage } from "./CheckoutPage";
import type { CartItem } from "../../types";
import type { PaymentSummaryData } from "./PaymentSummary";

vi.mock("axios");
/**
 * 👇 说明：
 * 1. `vi.mock("axios")` 会在运行时把 axios 模块替换成 mock 对象，
 *    但 TypeScript 类型系统并不知道它被 mock 了；
 *    所以直接写 `axios.get.mockImplementation()` 会报错。
 *
 * 2. `typeof axios` 取出 axios 模块的类型。
 *
 * 3. `import("vitest").Mocked<T>` 是 Vitest 提供的类型工具，
 *    能让类型系统知道对象的所有方法都是可 mock 的函数（带 .mockImplementation / .mockResolvedValue）。
 *
 * 4. `as unknown as ...` 是双重断言技巧：
 *    - 先 `as unknown` 抹去旧类型；
 *    - 再 `as import("vitest").Mocked<typeof axios>` 声明成 mock 类型；
 *    这样 TypeScript 就不会报错。
 *
 * ✅ 效果：让 TypeScript 理解 axios 已被 mock，
 *    并允许在测试中安全使用 mockedAxios.get.mockImplementation()。
 */
const mockedAxios = axios as unknown as import("vitest").Mocked<typeof axios>;

describe("CheckoutPage component", () => {
  let loadCart: ReturnType<typeof vi.fn>;
  let cart: CartItem[];
  let deliveryOptions: {
    id: string;
    deliveryDays: number;
    priceCents: number;
    estimatedDeliveryTimeMs: number;
  }[];
  let paymentSummary: PaymentSummaryData;

  beforeEach(() => {
    loadCart = vi.fn();

    cart = [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: "1",
        product: {
          id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          image: "images/products/athletic-cotton-socks-6-pairs.jpg",
          name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
          rating: {
            stars: 4.5,
            count: 87,
          },
          priceCents: 1090,
          keywords: ["socks", "sports", "apparel"],
        },
      },
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: "2",
        product: {
          id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          image: "images/products/intermediate-composite-basketball.jpg",
          name: "Intermediate Size Basketball",
          rating: {
            stars: 4,
            count: 127,
          },
          priceCents: 2095,
          keywords: ["sports", "basketballs"],
        },
      },
    ];

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

    paymentSummary = {
      totalItems: 3,
      productCostCents: 4275,
      shippingCostCents: 499,
      totalCostBeforeTaxCents: 4774,
      taxCents: 477,
      totalCostCents: 5251,
    };


    mockedAxios.get.mockImplementation(async (url: string) => {
      if (url === "/api/delivery-options?expand=estimatedDeliveryTime") {
        return { data: deliveryOptions };
      }
      if (url === "/api/payment-summary") {
        return { data: paymentSummary };
      }
      return { data: {} };
    });
  });

  it("displays the page correctly", async () => {
    render(
      <MemoryRouter>
        <CheckoutPage cart={cart} loadCart={loadCart} />
      </MemoryRouter>
    );

    const paymentSummaryElem = await screen.findByTestId(
      "payment-summary-product-cost"
    );

    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      "/api/delivery-options?expand=estimatedDeliveryTime"
    );
    expect(axios.get).toHaveBeenNthCalledWith(2, "/api/payment-summary");

    expect(screen.getByText("Review your order")).toBeInTheDocument();
    expect(
      screen.getByText("Black and Gray Athletic Cotton Socks - 6 Pairs")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Intermediate Size Basketball")
    ).toBeInTheDocument();

    expect(paymentSummaryElem).toBeInTheDocument();
    expect(screen.getByText("Payment Summary")).toBeInTheDocument();
    expect(
      screen.getByTestId("payment-summary-product-cost")
    ).toHaveTextContent("Items (3):");
    expect(
      screen.getByTestId("payment-summary-shipping-cost")
    ).toHaveTextContent("$4.99");
  });
});
