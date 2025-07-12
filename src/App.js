import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoteCreationPage from "./pages/NoteCreationPage";
import NoteEditorPage from "./pages/NoteEditorPage";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MyNotesPage from "./pages/MyNotesPage";
import Logout from "./pages/Logout";


function App() {
  return (
     <div className="bg-indigo-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<NoteCreationPage />} />
        <Route path="/note/:noteId" element={<NoteEditorPage />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/register" element={<RegisterPage />} />
<Route path="/login" element={<LoginPage />} />

<Route path="/notes/mine" element={<MyNotesPage />} />

      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;