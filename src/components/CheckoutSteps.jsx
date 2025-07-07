// frontend/src/components/CheckoutSteps.jsx
import React from "react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {step1 ? (
          <Link
            to="/shipping"
            className="text-blue-600 font-semibold px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
          >
            Shipping
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed px-4 py-2">
            Shipping
          </span>
        )}

        {step2 ? (
          <Link
            to="/payment"
            className="text-blue-600 font-semibold px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
          >
            Payment
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed px-4 py-2">
            Payment
          </span>
        )}

        {step3 ? (
          <Link
            to="/placeorder"
            className="text-blue-600 font-semibold px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
          >
            Place Order
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed px-4 py-2">
            Place Order
          </span>
        )}

        {step4 ? (
          <Link
            to="/order"
            className="text-blue-600 font-semibold px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
          >
            Order Details
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed px-4 py-2">
            Order Details
          </span>
        )}
      </div>
    </nav>
  );
};

export default CheckoutSteps;
