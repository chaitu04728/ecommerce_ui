// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for order details
import axios from "axios";
import { useUser } from "../Context/UserContext"; // Import user context

const ProfilePage = () => {
  // State for user profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null); // For general messages (e.g., password mismatch)
  const [success, setSuccess] = useState(false); // For successful profile update feedback

  // State for profile update API call
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // State for fetching user orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  const { userInfo, login, logout } = useUser(); // Get userInfo, login (to update context), and logout functions
  const navigate = useNavigate();

  // Effect to handle redirection and initial data fetch
  useEffect(() => {
    if (!userInfo) {
      // If user is not logged in, redirect to login page
      navigate("/login");
    } else {
      // If logged in, set initial form values from userInfo
      setName(userInfo.name);
      setEmail(userInfo.email);

      // Fetch user orders when component mounts or userInfo changes
      const fetchMyOrders = async () => {
        try {
          setLoadingOrders(true);
          setErrorOrders(null); // Clear previous errors

          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`, // Send token for authentication
            },
          };
          // Make API call to your backend to get user's orders
          const { data } = await axios.get(`${apiUrl}/orders/myorders`, config);
          setOrders(data);
          setLoadingOrders(false);
        } catch (err) {
          console.error(
            "Error fetching my orders:",
            err.response ? err.response.data : err.message
          );
          setErrorOrders("Failed to fetch orders. Please try again.");
          setLoadingOrders(false);
        }
      };
      fetchMyOrders();
    }
  }, [userInfo, navigate]); // Depend on userInfo to re-fetch if it changes (e.g., after login/logout)

  // Handler for profile update form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setErrorUpdate(null); // Clear previous errors
    setSuccess(false); // Reset success state

    // Client-side validation for password match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoadingUpdate(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`, // Send token for authentication
        },
      };

      // Make API call to update user profile
      const { data } = await axios.put(
        `${apiUrl}/users/profile`, // Backend endpoint for profile update
        { name, email, password }, // Send updated data (password is optional)
        config
      );

      // Update user info in context and local storage with the new data (especially if token changed)
      login(data); // Assuming your login context function handles updating userInfo
      setSuccess(true); // Indicate success
      setPassword(""); // Clear password fields after successful update
      setConfirmPassword("");
      alert("Profile updated successfully!"); // User friendly alert
    } catch (err) {
      console.error(
        "Profile update error:",
        err.response ? err.response.data : err.message
      );
      setErrorUpdate(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Failed to update profile."
      );
    } finally {
      setLoadingUpdate(false); // Reset loading state
    }
  };

  return (
    <div className="container mx-auto p-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Profile Update Form Column */}
      <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h2>

        {/* Display general messages, errors, or success */}
        {message && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {message}
          </div>
        )}
        {errorUpdate && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {errorUpdate}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            Profile Updated!
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password (leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loadingUpdate} // Disable button while updating
          >
            {loadingUpdate ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* My Orders Section Column */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

        {loadingOrders ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-xl text-gray-700">Loading Orders...</p>
          </div>
        ) : errorOrders ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {errorOrders}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            You have no orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {" "}
            {/* Added for responsive table scroll */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TOTAL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PAID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DELIVERED
                  </th>
                  <th className="px-6 py-3"></th>{" "}
                  {/* For View Details button */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {order.isPaid ? (
                        <span className="text-green-600">
                          {order.paidAt
                            ? new Date(order.paidAt).toLocaleDateString()
                            : "Paid"}
                        </span>
                      ) : (
                        // Red X icon for "Not Paid"
                        <svg
                          className="w-6 h-6 text-red-500 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 111 12a9 9 0 0118 0z"
                          ></path>
                        </svg>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {order.isDelivered ? (
                        <span className="text-green-600">
                          {order.deliveredAt
                            ? new Date(order.deliveredAt).toLocaleDateString()
                            : "Delivered"}
                        </span>
                      ) : (
                        // Red X icon for "Not Delivered"
                        <svg
                          className="w-6 h-6 text-red-500 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 111 12a9 9 0 0118 0z"
                          ></path>
                        </svg>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
