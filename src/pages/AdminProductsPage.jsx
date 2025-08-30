// frontend/src/pages/AdminProductsPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Context/UserContext";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false); // New state for delete feedback

  const { userInfo } = useUser();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_BE_URI;

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  // Function to fetch products (can be reused)
  const fetchProducts = async () => {
    if (!userInfo || !userInfo.isAdmin) return; // Don't fetch if not admin

    try {
      setLoading(true);
      setError(null);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`${apiUrl}/api/products/admin`, config); // Assuming this is also protected
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(
        "Error fetching products for admin:",
        err.response ? err.response.data : err.message
      );
      setError(
        "Failed to fetch products for admin. You might not have access."
      );
      setLoading(false);
    }
  };

  // Fetch products on component mount or if user info changes
  useEffect(() => {
    fetchProducts();
  }, [userInfo, deleteSuccess]); // Add deleteSuccess as dependency to re-fetch after deletion

  const deleteProductHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true); // Can set loading state to show progress
        setError(null);

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        await axios.delete(`${apiUrl}/api/products/${id}`, config);

        setDeleteSuccess((prev) => !prev); // Toggle to trigger re-fetch
        alert("Product deleted successfully!");
      } catch (err) {
        console.error(
          "Product deletion error:",
          err.response ? err.response.data : err.message
        );
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : "Failed to delete product."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const createProductHandler = () => {
    navigate("/admin/product/create"); // Navigate to the new create product page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-gray-700">
          Loading Products for Admin Panel...
        </p>
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

  if (!userInfo || !userInfo.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-red-500">
          Access Denied. You must be an admin to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Product List (Admin)
        </h1>
        <button
          onClick={createProductHandler}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Create Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No products found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.countInStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/product/${product._id}/edit`} // Link to edit page
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProductHandler(product._id)} // Call delete handler
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
