// frontend/src/pages/ProductCreatePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductForm from "../components/ProductForm";
import { useUser } from "../Context/UserContext";

const ProductCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const { userInfo } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const createProductHandler = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Make POST request to your backend to create a product
      const { data } = await axios.post(`${apiUrl}/products`, formData, config);

      alert("Product created successfully!");
      setLoading(false);
      navigate("/admin/products"); // Redirect back to product list
    } catch (err) {
      console.error(
        "Product creation error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
    }
  };

  // If not admin, the useEffect above will redirect. This is a fallback.
  if (!userInfo || !userInfo.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p className="text-xl text-red-500">
          Access Denied. You must be an admin to create products.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-128px)] bg-gray-50 p-4">
      <ProductForm
        onSubmit={createProductHandler}
        loading={loading}
        error={error}
        isEditMode={false}
      />
    </div>
  );
};

export default ProductCreatePage;
