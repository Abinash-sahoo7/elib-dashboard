import { Navigate, createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layout/DashboardLayout";
import BookPage from "./pages/BookPage";
import AuthLayout from "./layout/AuthLayout";
import CreateBook from "./pages/CreateBook";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to={'/dashboard/home'} />
    },
    {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
            {
                path: 'home',
                element: <HomePage />,
            },
            {
                path: 'books',
                element: <BookPage />,
            },
            {
                path: 'books/create',
                element: <CreateBook />,
            }
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