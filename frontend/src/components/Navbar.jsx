import React, { useState } from 'react';
import { userAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const { logout, authUser } = userAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-green-700">
            ClubHub
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-800 dark:text-gray-800 hover:text-green-700 dark:hover:text-green-500 font-medium transition-colors">
              Home
            </a>
            <a href="/clubs" className="text-gray-700 dark:text-gray-800 hover:text-green-700 dark:hover:text-green-500 font-medium transition-colors">
              Clubs
            </a>
            <a href="/events" className="text-gray-700 dark:text-gray-800 hover:text-green-700 dark:hover:text-green-500 font-medium transition-colors">
              Events
            </a>
            <a href="/about" className="text-gray-700 dark:text-gray-800 hover:text-green-700 dark:hover:text-green-500 font-medium transition-colors">
              About
            </a>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-semibold">
                  {authUser?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>

                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {authUser?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {authUser?.dept || 'Student'}
                  </p>
                </div>

                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Profile
                  </a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </a>
                  <hr />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-4">
              {["Home", "Clubs", "Events", "About"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-green-700 font-medium"
                >
                  {item}
                </a>
              ))}
              <hr />
              <button
                onClick={handleLogout}
                className="text-left text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
