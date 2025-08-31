// frontend/src/pages/PlaceOrderPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useUser } from "../Context/UserContext";
import axios from "axios";
import CheckoutSteps from "../components/CheckoutSteps";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useUser();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false); // <-- NEW STATE: Flag to prevent immediate redirect

  // Get shipping address and payment method from localStorage
  const shippingAddress = {
    address: localStorage.getItem("shippingAddress_address"),
    city: localStorage.getItem("shippingAddress_city"),
    postalCode: localStorage.getItem("shippingAddress_postalCode"),
    country: localStorage.getItem("shippingAddress_country"),
  };
  const paymentMethod = localStorage.getItem("paymentMethod");

  // Redirect if not logged in or no shipping/payment info
  useEffect(() => {
    // If order was just placed, do NOT redirect based on missing info
    if (orderPlaced) {
      // <-- IMPORTANT: Check the flag
      return; // <-- Exit early if order is confirmed
    }

    if (!userInfo) {
      navigate("/login?redirect=/placeorder");
    } else if (!shippingAddress.address || !paymentMethod) {
      navigate("/shipping"); // Redirect to shipping if info is missing
    } else if (cartItems.length === 0) {
      navigate("/cart"); // Redirect to cart if empty
    }
    // Updated dependencies to be more specific to avoid unnecessary re-runs
  }, [
    userInfo,
    shippingAddress.address,
    paymentMethod,
    cartItems.length,
    navigate,
    orderPlaced,
  ]); // <-- Add orderPlaced to dependencies

  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100, otherwise $10
  const taxPrice = 0.15 * itemsPrice; // 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          _id: item._id, // Use _id from product for backend product reference
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await axios.post(`${apiUrl}/orders`, orderData, config);

      setOrderPlaced(true); // <-- NEW: Set flag immediately after successful API call
      alert("Order placed successfully!");
      clearCart(); // Clear cart after successful order
      // Clear shipping and payment info from localStorage
      localStorage.removeItem("shippingAddress_address");
      localStorage.removeItem("shippingAddress_city");
      localStorage.removeItem("shippingAddress_postalCode");
      localStorage.removeItem("shippingAddress_country");
      localStorage.removeItem("paymentMethod");

      navigate(`/order/${data._id}`); // Navigate to order details page
    } catch (err) {
      console.error(
        "Place order error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Failed to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <CheckoutSteps step1 step2 step3 /> {/* Highlight step 1, 2, 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Details Column */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Shipping</h2>
            <p className="text-gray-700 mb-2">
              <strong>Address:</strong> {shippingAddress.address},{" "}
              {shippingAddress.city}, {shippingAddress.postalCode},{" "}
              {shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Payment Method
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Method:</strong> {paymentMethod}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Order Items
            </h2>
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            ) : (
              <ul>
                {cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <Link
                        to={`/products/${item._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <span className="text-gray-700">
                      {item.qty} x ${item.price.toFixed(2)} = $
                      {(item.qty * item.price).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Items:</span>
              <span className="font-semibold">${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Shipping:</span>
              <span className="font-semibold">${shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Tax:</span>
              <span className="font-semibold">${taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-800 text-lg font-bold">Total:</span>
              <span className="text-blue-600 text-lg font-bold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              cartItems.length === 0 || loading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={placeOrderHandler}
            disabled={cartItems.length === 0 || loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
