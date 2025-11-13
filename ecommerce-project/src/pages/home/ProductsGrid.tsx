import { Product } from "./Product";
import type { ProductType } from "../../types";

interface ProductsGridProps  {
  products: ProductType[];
  loadCart: () => Promise<void> | void;
};

export function ProductsGrid({ products, loadCart }: ProductsGridProps) {
  return (
    <div className="products-grid">
      {products.map((product: ProductType) => {
        return (
          <Product key={product.id} product={product} loadCart={loadCart} />
        );
      })}
    </div>
  );
}
