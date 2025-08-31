// frontend/src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../Context/CartContext";

const ProductDetailsPage = () => {
  const { id } = useParams(); // Get product ID from URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, qty);
    alert(`${product.name} (x${qty}) added to cart!`);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        // Make API call to your backend to get a single product by ID
        const { data } = await axios.get(`${apiUrl}/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching product details:",
          err.response ? err.response.data : err.message
        );
        setError(
          "Failed to fetch product details. This product might not exist or there was a server error."
        );
        setLoading(false);
      }
    };

    if (id) {
      // Only fetch if ID exists
      fetchProduct();
    }
  }, [id]); // Re-run effect if ID changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-gray-700">Loading Product Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-red-500 mb-4">{error}</p>
        <Link
          to="/products"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Go Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    // This case should ideally be caught by 'error' if fetch fails,
    // but good for initial render if 'product' is null and not loading/error
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <Link
        to="/products"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        &larr; Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-lg">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={
              product.image ||
              "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-700 text-lg mb-4">{product.description}</p>

          <div className="flex items-center justify-between border-t border-b border-gray-200 py-3 mb-4">
            <span className="text-3xl font-extrabold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            <div className="text-gray-600">
              {product.countInStock > 0 ? (
                <span className="text-green-600 font-semibold">
                  In Stock ({product.countInStock})
                </span>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="text-gray-700 text-sm mb-2">
            <strong>Brand:</strong> {product.brand}
          </div>
          <div className="text-gray-700 text-sm mb-4">
            <strong>Category:</strong> {product.category}
          </div>

          <button
            className={`mt-auto w-full py-3 rounded-md text-white font-semibold transition-colors duration-200 ${
              product.countInStock > 0
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={product.countInStock === 0}
            onClick={handleAddToCart} // Added onClick handler
          >
            {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
