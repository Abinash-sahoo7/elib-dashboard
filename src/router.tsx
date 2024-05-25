import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layout/DashboardLayout";
import BookPage from "./pages/BookPage";
import AuthLayout from "./layout/AuthLayout";

export const router = createBrowserRouter([
    {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
            {
                path: 'home',
                element: <HomePage />,
            },
            // {
            //     path: 'books',
            //     element: <BookPage />,
            // }
        ]
    },
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: 'register',
                element: <RegisterPage />
            }
        ]
    },
    
])