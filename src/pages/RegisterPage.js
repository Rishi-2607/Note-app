import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter a valid email.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/notes/mine");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      alert("Registration failed: " + errorMsg);
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}