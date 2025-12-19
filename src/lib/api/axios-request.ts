"use client";
import axios from "axios";
// i use react vite
const API_URL = import.meta.env.VITE_API_URL;
const apiUrl = `${API_URL}/api`;
const axiosRequest = axios.create({
  baseURL: apiUrl,
});

axiosRequest.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

axiosRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      console.log("Unauthorized, redirecting to login...");
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosRequest;
