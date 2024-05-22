import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/Login";
import HomePage from "./pages/Home";

export const router = createBrowserRouter([
    {
        path: '/home',
        element: <HomePage />
    },
    {
        path: '/login',
        element: <LoginPage />
    }
])