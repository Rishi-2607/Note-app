import axios from "axios";

const API = axios.create({
  baseURL: "https://note-app-nein.onrender.com", 
});

export default API;