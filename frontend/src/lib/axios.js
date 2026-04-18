import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach token from localStorage to every request as fallback
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("campora_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On response error, check if cookie auth failed and clear token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.config && !error.config._retry) {
      error.config._retry = true;
      // Try with localStorage token if cookie failed
      const token = localStorage.getItem("campora_token");
      if (token) {
        error.config.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(error.config);
      }
    }
    return Promise.reject(error);
  }
);
