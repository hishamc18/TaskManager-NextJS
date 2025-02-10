import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://taskmanager-backend-tf6c.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
