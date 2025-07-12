import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("storage")); 
      alert("You have been logged out.");
    }

    navigate("/login");
  }, [navigate]);

  return null;
}