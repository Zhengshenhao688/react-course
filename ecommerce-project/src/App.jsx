import { Routes, Route } from "react-router";
import { Homepage } from "./pages/HomePage";
import { CheckoutPage } from "./pages/CheckoutPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="checkout" element={<CheckoutPage />} />
    </Routes>
  );
}

export default App;
