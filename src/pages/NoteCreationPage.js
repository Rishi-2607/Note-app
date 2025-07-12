import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";

const NoteCreationPage = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const createNote = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      const wantsToLogin = window.confirm(
        "You must be logged in to create a note. Do you have an account?"
      );
      navigate(wantsToLogin ? "/login" : "/register");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a note title.");
      return;
    }

    try {
      const res = await axios.post(
        "/notes",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate(`/note/${res.data._id}`);
    } catch (err) {
      console.error("Note creation error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      alert("Note creation failed: " + errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-center transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
          Create a New Note
        </h2>
        <input
          className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={createNote}
          className="w-full bg-indigo-500 text-white font-semibold py-2 rounded-md hover:bg-indigo-600 transition"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default NoteCreationPage;
