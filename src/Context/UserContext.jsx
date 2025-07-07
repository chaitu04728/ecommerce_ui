// frontend/src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
const UserContext = createContext();

// Create a custom hook to use the context easily
export const useUser = () => {
  return useContext(UserContext);
};

// Create the provider component
export const UserProvider = ({ children }) => {
  // Initialize user info from localStorage if available
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const storedUserInfo = localStorage.getItem("userInfo");
      return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    } catch (error) {
      console.error("Failed to parse userInfo from localStorage", error);
      return null;
    }
  });

  // Effect to update localStorage whenever userInfo changes
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [userInfo]);

  // Login function
  const login = (data) => {
    setUserInfo(data);
  };

  // Logout function
  const logout = () => {
    setUserInfo(null); // Clear user info from state
    // localStorage.removeItem('userInfo'); // Effect handles this
  };

  const value = {
    userInfo,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
