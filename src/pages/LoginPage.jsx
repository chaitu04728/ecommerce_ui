import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Context/UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useUser();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Send login request to your backend
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        config
      );

      login(data);

      // Store user info (including token) in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      console.log("Login successful:", data);
      navigate("/"); // Redirect to the home page after successful login
    } catch (err) {
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-128px)] bg-gray-50 p-4">
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

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

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>

        <div className="mt-4 text-center">
          New Customer?{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-800">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
