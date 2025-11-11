import { Product } from "./Product";
import type { ProductType } from "./Product";

type Props = {
  products: ProductType[];
  loadCart: () => Promise<void> | void;
};

export function ProductsGrid({ products, loadCart }: Props) {
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
