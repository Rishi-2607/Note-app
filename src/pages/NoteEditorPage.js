import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { socket } from "../socket";
import axios from "../api";

const NoteEditorPage = () => {
  const { noteId } = useParams();
  const [content, setContent] = useState("");
  const [activeUsers, setActiveUsers] = useState(1);
  const [updatedAt, setUpdatedAt] = useState("");
  const contentRef = useRef("");

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Setup socket listeners and autosave
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setContent(res.data.content);
        setUpdatedAt(new Date(res.data.updatedAt).toLocaleTimeString());
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    };

    fetchNote();
    socket.emit("join_note", noteId);

    socket.on("note_update", setContent);
    socket.on("active_users", setActiveUsers);

 const autosaveInterval = setInterval(() => {
  axios.put(
    `/notes/${noteId}`,
    { content: contentRef.current },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  )
  .then((res) => {
    setUpdatedAt(new Date(res.data.updatedAt).toLocaleTimeString());
  })
  .catch((err) => {
    console.error("Autosave failed:", err.response?.status, err.response?.data);
  });
}, 5000);

    return () => {
      socket.off("note_update");
      socket.off("active_users");
      clearInterval(autosaveInterval);
    };
  }, [noteId]);

  const handleChange = (val) => {
    setContent(val);
    socket.emit("note_update", { noteId, content: val });
  };

  const handleAddToMyNotes = async () => {
    try {
      await axios.post(
        "/notes/save",
        {
          noteId,
          content: contentRef.current,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("📥 Note successfully added to your My Notes page!");
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-3xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-4">
          📝 Collaborative Note
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          Last updated: {updatedAt} | 👥 {activeUsers} active
        </p>
        <TextareaAutosize
          className="w-full border border-gray-300 dark:border-gray-600 p-4 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-gray-700 dark:text-gray-100 transition"
          minRows={10}
          value={content}
          onChange={(e) => handleChange(e.target.value)}
        />
        <button
          onClick={handleAddToMyNotes}
          className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded transition"
        >
          📥 Save to My Notes
        </button>
      </div>
    </div>
  );
};

export default NoteEditorPage;