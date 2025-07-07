// frontend/src/pages/CartPage.jsx
import React from "react";
import { useCart } from "../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart();
  const { userInfo } = useUser();
  const navigate = useNavigate();

  // Calculate total price of items in cart
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  const checkoutHandler = () => {
    // CONDITIONAL REDIRECTION BASED ON LOGIN STATUS
    if (userInfo) {
      // If user is already logged in
      navigate("/shipping"); // Go directly to shipping page
    } else {
      // If user is not logged in
      navigate("/login?redirect=/shipping"); // Redirect to login, then back to shipping
    }
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          Your cart is empty.{" "}
          <Link to="/products" className="text-blue-600 hover:underline">
            Go shopping!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center p-4 border-b border-gray-200 last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md mr-6"
                />
                <div className="flex-grow">
                  <Link
                    to={`/products/${item._id}`}
                    className="text-xl font-semibold text-gray-800 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      updateCartQuantity(item, Number(e.target.value))
                    }
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Order Summary
            </h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                items):
              </span>
              <span className="text-xl font-bold text-blue-600">
                ${totalPrice}
              </span>
            </div>
            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 ${
                cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
