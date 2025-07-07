// frontend/src/pages/OrderDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Context/UserContext";
import CheckoutSteps from "../components/CheckoutSteps";

const OrderDetailsPage = () => {
  const { id: orderId } = useParams(); // Get order ID from URL
  const navigate = useNavigate();
  const { userInfo } = useUser();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          config
        );
        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching order details:",
          err.response ? err.response.data : err.message
        );
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : "Failed to fetch order details."
        );
        setLoading(false);
      }
    };

    if (userInfo && orderId) {
      // Only fetch if user is logged in and orderId exists
      fetchOrder();
    }
  }, [orderId, userInfo]); // Re-fetch if orderId or userInfo changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-gray-700">Loading Order Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-red-500 mb-4">{error}</p>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Go Home
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-gray-700">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <CheckoutSteps step1 step2 step3 step4 />{" "}
      {/* Highlight all steps as order is placed */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Order : {order._id}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Details Column */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Shipping</h2>
            <p className="text-gray-700 mb-2">
              <strong>Name:</strong> {order.user.name}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${order.user.email}`}
                className="text-blue-600 hover:underline"
              >
                {order.user.email}
              </a>
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Address:</strong> {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                Not Delivered
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Payment Method
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
                Paid on {new Date(order.paidAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                Not Paid
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Order Items
            </h2>
            {order.orderItems.length === 0 ? (
              <p className="text-center text-gray-600">Order has no items.</p>
            ) : (
              <ul>
                {order.orderItems.map((item) => (
                  <li
                    key={item.product._id}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <Link
                        to={`/products/${item.product._id}`}
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
              <span className="font-semibold">
                ${order.itemsPrice?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Shipping:</span>
              <span className="font-semibold">
                ${order.shippingPrice?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Tax:</span>
              <span className="font-semibold">
                ${order.taxPrice?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-800 text-lg font-bold">Total:</span>
              <span className="text-blue-600 text-lg font-bold">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment/Delivery buttons for Admin (optional for now) */}
          {/* Example:
          {userInfo && userInfo.isAdmin && !order.isPaid && (
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mb-2">Mark As Paid</button>
          )}
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full">Mark As Delivered</button>
          )}
          */}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
