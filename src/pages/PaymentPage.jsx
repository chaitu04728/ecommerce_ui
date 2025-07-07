// frontend/src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useUser();

  // Check if shipping address is set, if not, redirect back to shipping
  useEffect(() => {
    if (!localStorage.getItem("shippingAddress_address")) {
      navigate("/shipping");
    }
    if (!userInfo) {
      // Also ensure user is logged in
      navigate("/login?redirect=/payment");
    }
  }, [navigate, userInfo]);

  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem("paymentMethod") || "PayPal"
  );

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem("paymentMethod", paymentMethod);
    navigate("/placeorder"); // Proceed to place order page
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <CheckoutSteps step1 step2 /> {/* Highlight step 1 and 2 */}
      <div className="flex justify-center">
        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Payment Method
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Method</h3>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === "PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <label htmlFor="paypal" className="ml-3 text-gray-700">
                PayPal or Credit Card
              </label>
            </div>
            {/* You can add more payment options here */}
            {/* <div className="flex items-center mb-4">
              <input
                type="radio"
                id="stripe"
                name="paymentMethod"
                value="Stripe"
                checked={paymentMethod === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <label htmlFor="stripe" className="ml-3 text-gray-700">
                Stripe
              </label>
            </div> */}
          </div>

          <button
            type="submit"
            onClick={submitHandler}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
