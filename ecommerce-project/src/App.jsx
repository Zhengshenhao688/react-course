import { Routes, Route } from "react-router";
import { Homepage } from "./pages/HomePage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="checkout" element={<div>tset</div>} />
    </Routes>
  );
}

export default App;
