import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsHighlights from "./Pages/ProductsHighlights";
import ProductsPage from "./Pages/Products";
import NavbarCom from "./Layout/Navbar";
import { CartProvider } from "./Context/CartContext";
import PaymentPage from "./Pages/PaymentPage";
import CartPage from "./Pages/CartPage";
import OrderTracking1 from "./Pages/OrderPage";
import Checkout1 from "./Pages/Checkoutpage";
import Footer from "./Layout/Footer";

const App = () => {
  return (
    <div>
      <CartProvider>
        <Router>
          <NavbarCom />
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductsHighlights />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout1 />} />
            <Route path="/orders" element={<OrderTracking1 />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </div>
  );
};

export default App;
