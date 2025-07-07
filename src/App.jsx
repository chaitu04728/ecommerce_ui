import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import AdminProductsPage from "./pages/AdminProductsPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProductCreatePage from "./pages/ProductCreatePage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import ProfilePage from "./pages/ProfilePage";
import OrderDetailsPage from "./pages/OrderDetailsPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/placeorder" element={<PlaceOrderPage />} />
            <Route path="/order/:id" element={<OrderDetailsPage />} />
            <Route
              path="/admin/product/create"
              element={<ProductCreatePage />}
            />
            <Route
              path="/admin/product/:id/edit"
              element={<ProductEditPage />}
            />
            <Route
              path="*"
              element={
                <div className="container mx-auto p-4 text-center text-2xl text-red-500">
                  404 - Page Not Found
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
