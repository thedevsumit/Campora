import { useState,useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { userAuthStore } from "./store/useAuthStore";
import SignUpPage from "./components/SignUp";
import { ToastContainer } from "react-toastify";
import { Loader } from "lucide-react";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import ClubDashboard from "./components/ClubDashboard";
import ClubsPage from "./components/ClubPage";
import ClubDetailsModal from "./components/ClubDetailsModal";


function App() {
  const { checkAuth, authUser, isCheckingAuth,onlineUsers } = userAuthStore();
  // console.log(onlineUsers)
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
    <>
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
            element = < ClubsPage />  
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
