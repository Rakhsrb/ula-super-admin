import axios from "axios";

const token = localStorage.getItem("token");

export const Fetch = axios.create({
  // baseURL: "https://ula-backend.onrender.com/api/",
  baseURL: "http://localhost:8000/api/",
  headers: {
    Authorization: token,
  },
});
