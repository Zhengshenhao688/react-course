import "./NotFoundPage.css";
import { Header } from "../../components/Header.jsx";
import type { CartItem } from "../../types";

interface NotFoundPageProps {
  cart: CartItem[];
}

export function NotFoundPage({cart}: NotFoundPageProps) {
  return (
    <>
      <title>404 Page Not Found</title>
      <link rel="icon" type="image/svg+xml" href="home-favicon.png" />
      <Header cart={cart}/>

      <div className="not-found-message">Page not found</div>
    </>
  );
}
