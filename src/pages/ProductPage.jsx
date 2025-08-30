import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  const apiUrl = process.env.REACT_BE_URI;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${apiUrl}/products`);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching products:",
          err.response ? err.response.data : err.message
        );
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1); // Add 1 quantity of the product
    alert(`${product.name} added to cart!`); // Simple feedback
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-gray-700">Loading Products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Latest Products
      </h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={
                    product.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <div className="p-4 flex-grow flex flex-col">
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-3 flex-grow">
                  {product.description.substring(0, 70)}...
                </p>{" "}
                {/* Truncate description */}
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-200">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)} // Added onClick handler
                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 ${
                      product.countInStock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={product.countInStock === 0}
                  >
                    {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
