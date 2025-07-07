// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../Context/CartContext"; // Needed for Add to Cart on Home Page

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart(); // Get addToCart function

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch products, maybe limit for home page if your backend supports it
        const { data } = await axios.get("http://localhost:5000/api/products");
        // For the home page, we'll just display a few (e.g., first 8)
        setProducts(data.slice(0, 8)); // Displaying only the first 8 for 'Latest Products'
        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching products for home page:",
          err.response ? err.response.data : err.message
        );
        setError(
          "Failed to load products for homepage. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 text-center shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">
            Shop Smarter, Live Better
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">
            Discover amazing deals on your favorite electronics, fashion, and
            more!
          </p>
          <Link
            to="/products"
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Explore Products
          </Link>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="container mx-auto p-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Featured Products
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-xl text-gray-700">
              Loading Featured Products...
            </p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            No featured products available.
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
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-200">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 ${
                        product.countInStock === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={product.countInStock === 0}
                    >
                      {product.countInStock > 0
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link
            to="/products"
            className="bg-blue-500 text-white hover:bg-blue-600 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 inline-block"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
