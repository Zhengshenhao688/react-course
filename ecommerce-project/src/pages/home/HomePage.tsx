import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import type { ProductType } from "../../types";
import "./HomePage.css";
import { useSearchParams } from "react-router";
import type { CartItem } from "../../types";

interface HomePageProps {
  cart: CartItem[];
  loadCart: () => Promise<void> | void;
}

// use the ProductType defined by the Product component
// so all components agree on the product shape

export function HomePage({ cart, loadCart }: HomePageProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || null;

  useEffect(() => {
    const getHomeData = async () => {
      const urlPath = search
        ? `/api/products?search=${search}`
        : "/api/products";
      const response = await axios.get<ProductType[]>(urlPath);
      setProducts(response.data || []);
    };

    getHomeData();
  }, [search]);

  return (
    <>
      <title>Ecommerce Project</title>
      <link rel="icon" type="image/svg+xml" href="home-favicon.png" />

      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}
