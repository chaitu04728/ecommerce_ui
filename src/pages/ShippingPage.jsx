// frontend/src/pages/ShippingPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useUser();

  // Load initial state from localStorage if available
  const [address, setAddress] = useState(
    localStorage.getItem("shippingAddress_address") || ""
  );
  const [city, setCity] = useState(
    localStorage.getItem("shippingAddress_city") || ""
  );
  const [postalCode, setPostalCode] = useState(
    localStorage.getItem("shippingAddress_postalCode") || ""
  );
  const [country, setCountry] = useState(
    localStorage.getItem("shippingAddress_country") || ""
  );

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/shipping"); // Redirect to login, then back to shipping
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Save shipping address to localStorage
    localStorage.setItem("shippingAddress_address", address);
    localStorage.setItem("shippingAddress_city", city);
    localStorage.setItem("shippingAddress_postalCode", postalCode);
    localStorage.setItem("shippingAddress_country", country);

    navigate("/payment"); // Proceed to payment page
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <CheckoutSteps step1 /> {/* Highlight step 1 */}
      <div className="flex justify-center">
        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Shipping Address
          </h2>

          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="city"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="postalCode"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="country"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
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

export default ShippingPage;
