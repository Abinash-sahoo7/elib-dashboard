import useTokenStore from "@/store";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5513",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const login = async (data: { email: String; password: String }) => {
  return api.post("/api/users/login", data);
};

export const register = async (data: {
  name: String;
  email: String;
  password: String;
}) => {
  return api.post("/api/users/register", data);
};

export const getBooks = async () => {
  return api.get("/api/books");
};

export const createBook = async (data: FormData) => {
  return api.post("/api/books", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
