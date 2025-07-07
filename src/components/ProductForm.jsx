// frontend/src/components/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const ProductForm = ({
  product,
  onSubmit,
  loading,
  error,
  isEditMode = false,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  // Populate form fields if in edit mode and product data is provided
  useEffect(() => {
    if (isEditMode && product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [isEditMode, product]);

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      price: Number(price), // Ensure price is a number
      image,
      brand,
      category,
      countInStock: Number(countInStock), // Ensure countInStock is a number
      description,
    });
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isEditMode ? "Edit Product" : "Create Product"}
      </h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            htmlFor="price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-4 col-span-1 md:col-span-2">
          <label
            htmlFor="image"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image URL
          </label>
          <input
            type="text"
            id="image"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="brand"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Brand
          </label>
          <input
            type="text"
            id="brand"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="mb-6 col-span-1 md:col-span-2">
          <label
            htmlFor="countInStock"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Count In Stock
          </label>
          <input
            type="number"
            id="countInStock"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="mb-6 col-span-1 md:col-span-2">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        disabled={loading}
      >
        {loading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update Product"
          : "Create Product"}
      </button>

      <div className="mt-4 text-center">
        <Link
          to="/admin/products"
          className="text-blue-500 hover:text-blue-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};

export default ProductForm;
