import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import { userAuthStore } from "./store/useAuthStore";
import SignUpPage from "./components/SignUp";
import { ToastContainer } from "react-toastify";
import { Loader } from "lucide-react";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import ClubsPage from "./components/ClubPage";
import ClubDetailsPage from "./components/ClubDetailsPage";
import ProfilePage from "./components/Profile";

function App() {
  const { checkAuth, authUser, isCheckingAuth } = userAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-17 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/signup" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/clubs"
            element={authUser ? <ClubsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/clubs/:clubId"
            element={authUser ? <ClubDetailsPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
