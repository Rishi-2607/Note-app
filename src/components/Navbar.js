import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Re-check token on initial load and whenever localStorage changes
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken(); // initial check

    window.addEventListener("storage", checkToken); // react to login/logout

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  // Apply/remove dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-md p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-700 dark:text-indigo-300"
        >
          NoteCollab
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link
            to="/notes/mine"
            className="text-indigo-500 dark:text-indigo-300 hover:underline"
          >
            My Notes
          </Link>

          {!isLoggedIn && (
            <>
              <Link
                to="/register"
                className="text-indigo-500 dark:text-indigo-300 hover:underline"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-indigo-500 dark:text-indigo-300 hover:underline"
              >
                Login
              </Link>
            </>
          )}

          {isLoggedIn && (
            <Link
              to="/logout"
              className="text-indigo-500 dark:text-indigo-300 hover:underline"
            >
              Logout
            </Link>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark((prev) => !prev)}
            className="ml-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>
    </header>
  );
}