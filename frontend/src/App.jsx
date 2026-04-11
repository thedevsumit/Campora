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
import UserProfilePage from "./components/UserProfilePage";
import ChatRequestsPage from "./pages/ChatRequestsPage";
import ChatInboxPage from "./pages/ChatInboxPage";
import PrivateChatPage from "./pages/PrivateChatPage";
import ClubAdminDashboard from "./components/ClubAdminDashboard";
import ClubGroupChatPage from "./pages/ClubGroupChatPage";
import EventsPage from "./components/EventsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ResourceBookingPage from "./pages/ResourceBookingPage";
import NotificationsPage from "./pages/NotificationsPage";


function App() {
  const { checkAuth, authUser, isCheckingAuth } = userAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading Campora...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route
            path="/home"
            element={authUser ? <HomePage /> : <Navigate to="/signup" />}
          />
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/signup" />}
          />
          <Route
            path="/events"
            element={authUser ? <EventsPage /> : <Navigate to="/signup" />}
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
            path="/clubs/:clubId/admin"
            element={
              authUser ? <ClubAdminDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/clubs/:clubId"
            element={authUser ? <ClubDetailsPage /> : <Navigate to="/login" />}
          />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/chat/requests" element={<ChatRequestsPage />} />
          <Route path="/chat" element={<ChatInboxPage />} />
          <Route path="/chat/:userId" element={<PrivateChatPage />} />
          <Route path="/clubs/:clubId/chat" element={<ClubGroupChatPage />} />
          <Route
            path="/admin/dashboard"
            element={
              authUser?.role === "superAdmin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/analytics"
            element={
              authUser?.role === "superAdmin" || authUser?.userRole === "admin" ? (
                <AnalyticsDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/resources"
            element={authUser ? <ResourceBookingPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationsPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
