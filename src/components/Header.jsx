// frontend/src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { useCart } from "../Context/CartContext";

const Header = () => {
  const { userInfo, logout } = useUser(); // Get userInfo and logout function
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout(); // Call the logout function from context
    navigate("/login"); // Redirect to login page after logout
  };

  const profileHandler = () => {
    navigate("/profile"); // Redirect to login page after logout
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          MyEcom
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-6 items-center">
            {" "}
            {/* Added items-center for better vertical alignment */}
            <li>
              <Link
                to="/products"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-gray-300 transition-colors duration-200 relative"
              >
                Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                )}
              </Link>
            </li>
            {userInfo ? ( // Conditionally render links based on login status
              <>
                {userInfo.isAdmin && ( // Conditionally render Admin link if user is admin
                  <li>
                    <Link
                      to="/admin/products"
                      className="hover:text-gray-300 transition-colors duration-200"
                    >
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={profileHandler}
                    className="bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-200"
                  >
                    {`${userInfo.name.split(" ")[0]}`}
                  </button>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors duration-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-gray-300 transition-colors duration-200"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-gray-300 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
