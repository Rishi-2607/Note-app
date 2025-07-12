import { useEffect, useState, useCallback } from "react";
import API from "../api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { socket } from "../socket";
import { jwtDecode } from "jwt-decode";

export default function MyNotesPage() {
  const [notes, setNotes] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasRedirected, setHasRedirected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const fetchNotes = useCallback(() => {
    API.get("/notes/mine", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("📥 Notes received from backend:", res.data);
        setNotes(res.data);
      })
      .catch((err) => console.error("Fetch error:", err.message || err));
  }, [token]);

  useEffect(() => {
    if (!token && !hasRedirected) {
      alert("Login first to see notes");
      setHasRedirected(true);
      navigate("/login");
      return;
    }

    if (token) {
      fetchNotes();
    }

    if (location.state?.refresh) {
      fetchNotes();
      navigate("/my-notes", { replace: true }); 
    }
  }, [token, navigate, location.state, fetchNotes, hasRedirected]);

  useEffect(() => {
    if (!token) return;

    try {
      const { userId, name } = jwtDecode(token); 
      socket.emit("user_connected", { id: userId, name });

      socket.on("active_user_panel", (members) => {
        setMemberList(members);
      });

      return () => {
        socket.off("active_user_panel");
      };
    } catch (err) {
      console.error("Token decode error:", err.message);
    }
  }, [token]);

  useEffect(() => {
    API.get("/auth/count")
      .then((res) => {
        if (res.data?.totalUsers) {
          setTotalUsers(res.data.totalUsers);
        }
      })
      .catch((err) => {
        console.error("User count error:", err.message || err);
        setTotalUsers("?");
      });
  }, []);

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">🧠 My Notes</h2>
          {notes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">You haven’t created any notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note._id} className="border-b pb-2">
                  <Link
                    to={`/note/${note._id}`}
                    className="text-lg text-indigo-500 dark:text-indigo-300 hover:underline"
                  >
                    {note.title || "Untitled Note"}
                  </Link>
                  <div className="text-sm text-gray-400 dark:text-gray-300">
                    Last updated: {new Date(note.updatedAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">👥 Member Status</h3>
          <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
            Total Members: <span className="font-bold">{totalUsers}</span>
          </p>
          {memberList.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No members found.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {memberList.map((user, i) => (
                <li key={i} className="flex justify-between items-center text-gray-700 dark:text-gray-100">
                  <span>{user.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      user.online
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {user.online ? "Online" : "Offline"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}