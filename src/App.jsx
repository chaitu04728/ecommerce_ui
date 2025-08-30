import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProductsPage = lazy(() => import("./pages/ProductPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage"));
const ProductEditPage = lazy(() => import("./pages/ProductEditPage"));
const ProductCreatePage = lazy(() => import("./pages/ProductCreatePage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const PlaceOrderPage = lazy(() => import("./pages/PlaceOrderPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<div>Loading...</div>}>
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
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
