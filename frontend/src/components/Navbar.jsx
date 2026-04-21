import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userAuthStore } from "../store/useAuthStore";
import { getImageUrl } from "../lib/utils";
import NotificationBell from "./NotificationBell";
import { Home, Users, Calendar, LayoutGrid, MessageCircle, BarChart3, Shield, Menu, X, LogOut, User, Settings, ChevronDown, Rss, ArrowRight } from "lucide-react";

export default function Navbar() {
  const { logout, authUser } = userAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const isAdminOrSuperAdmin = authUser?.role === "superAdmin" || authUser?.userRole === "admin";

  const navItems = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Clubs", href: "/clubs", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Resources", href: "/resources", icon: LayoutGrid },
    { name: "Chat", href: "/chat", icon: MessageCircle },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-4">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all group-hover:scale-105">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent hidden sm:block">
              Campora
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-primary-500/10 to-primary-600/10 text-primary-600 dark:from-primary-500/20 dark:to-primary-600/20 dark:text-primary-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
            {isAdminOrSuperAdmin && (
              <Link
                to="/analytics"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive("/analytics")
                    ? "bg-gradient-to-r from-primary-500/10 to-primary-600/10 text-primary-600 dark:from-primary-500/20 dark:to-primary-600/20 dark:text-primary-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
            )}

            {/* My Clubs - Direct to Feed */}
            {authUser && (
              <Link
                to="/feed"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive("/feed")
                    ? "bg-gradient-to-r from-primary-500/10 to-primary-600/10 text-primary-600 dark:from-primary-500/20 dark:to-primary-600/20 dark:text-primary-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Rss className="w-4 h-4" />
                My Clubs
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
                        <NotificationBell />

            {authUser.role === "superAdmin" && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:-translate-y-0.5"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {authUser?.profilePic ? (
                    <img src={getImageUrl(authUser.profilePic)} alt={authUser.fullName} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span>{authUser?.fullName?.[0]}</span>
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{authUser?.fullName}</p>
                  <p className="text-xs text-slate-500 capitalize">{authUser?.userRole || authUser?.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 z-50 animate-scale-in overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
                      <p className="font-bold text-slate-900 dark:text-white">{authUser?.fullName}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{authUser?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-5 h-5 text-primary-500" />
                        My Profile
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-5 h-5 text-primary-500" />
                        Notifications
                      </Link>
                    </div>
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors font-medium"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
                        <NotificationBell />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-900 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-primary-500/10 to-primary-600/10 text-primary-600 dark:from-primary-500/20 dark:to-primary-600/20 dark:text-primary-400"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/feed"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-colors ${
                  isActive("/feed")
                    ? "bg-gradient-to-r from-primary-500/10 to-primary-600/10 text-primary-600 dark:from-primary-500/20 dark:to-primary-600/20 dark:text-primary-400"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                <Rss className="w-5 h-5" />
                My Clubs
              </Link>
              {isAdminOrSuperAdmin && (
                <Link
                  to="/analytics"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </Link>
              )}
              {authUser.role === "superAdmin" && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-amber-600"
                >
                  <Shield className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}
              <hr className="my-3 border-slate-100 dark:border-slate-700" />
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                <User className="w-5 h-5" />
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-danger-600"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
