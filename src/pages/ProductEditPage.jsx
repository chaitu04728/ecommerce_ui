// frontend/src/pages/ProductEditPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductForm from "../components/ProductForm";
import { useUser } from "../Context/UserContext";

const ProductEditPage = () => {
  const { id: productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorProduct, setErrorProduct] = useState(null);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const { userInfo } = useUser();
  const navigate = useNavigate();

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  // Fetch product data when component mounts or product ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (!userInfo || !userInfo.isAdmin) return; // Don't fetch if not admin

      try {
        setLoadingProduct(true);
        setErrorProduct(null);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(
          `${apiUrl}/api/products/${productId}`,
          config
        );
        setProduct(data);
        setLoadingProduct(false);
      } catch (err) {
        console.error(
          "Product fetch error:",
          err.response ? err.response.data : err.message
        );
        setErrorProduct(
          err.response && err.response.data.message
            ? err.response.data.message
            : "Failed to fetch product details."
        );
        setLoadingProduct(false);
      }
    };

    if (productId && (!product || product._id !== productId)) {
      fetchProduct();
    }
  }, [productId, userInfo, product]);

  const updateProductHandler = async (formData) => {
    try {
      setLoadingUpdate(true);
      setErrorUpdate(null);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Make PUT request to your backend to update a product
      const { data } = await axios.put(
        `${apiUrl}/api/products/${productId}`,
        formData,
        config
      );

      alert("Product updated successfully!");
      setLoadingUpdate(false);
      navigate("/admin/products"); // Redirect back to product list
    } catch (err) {
      console.error(
        "Product update error:",
        err.response ? err.response.data : err.message
      );
      setErrorUpdate(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoadingUpdate(false);
    }
  };

  // If not admin, the useEffect above will redirect.
  if (!userInfo || !userInfo.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-red-500">
          Access Denied. You must be an admin to edit products.
        </p>
      </div>
    );
  }

  // Show loading for initial product fetch
  if (loadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-gray-700">
          Loading Product Data for Edit...
        </p>
      </div>
    );
  }

  // Show error for initial product fetch
  if (errorProduct) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-red-500 mb-4">{errorProduct}</p>
        <Link
          to="/admin/products"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Go Back to Admin Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-128px)] bg-gray-50 p-4">
      {product && ( // Only render form if product data is available
        <ProductForm
          product={product}
          onSubmit={updateProductHandler}
          loading={loadingUpdate}
          error={errorUpdate}
          isEditMode={true}
        />
      )}
    </div>
  );
};

export default ProductEditPage;
