import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
const CartContext = createContext();

// Create a custom hook to use the context easily
export const useCart = () => {
  return useContext(CartContext);
};

// Create the provider component
export const CartProvider = ({ children }) => {
  // Initialize cart items from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCartItems = localStorage.getItem("cartItems");
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    } catch (error) {
      console.error("Failed to parse cartItems from localStorage", error);
      return [];
    }
  });

  // Effect to update localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to add an item to the cart
  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      // If item already exists, update its quantity
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id
            ? { ...existItem, qty: existItem.qty + qty }
            : x
        )
      );
    } else {
      // If item is new, add it to the cart
      setCartItems([...cartItems, { ...product, qty }]);
    }
  };

  const clearCart = () => {
    setCartItems([]); // Clear state
    localStorage.removeItem("cartItems"); // Clear localStorage
  };

  // Function to remove an item from the cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  // Function to update item quantity (for CartPage controls)
  const updateCartItemQty = (id, qty) => {
    setCartItems(
      cartItems.map((x) => (x._id === id ? { ...x, qty: Number(qty) } : x))
    );
  };

  const value = {
    cartItems,
    addToCart,
    clearCart,
    removeFromCart,
    updateCartItemQty,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
