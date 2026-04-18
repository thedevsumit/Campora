import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userAuthStore } from '../store/useAuthStore';
import Button from './ui/Button';
import Input from './ui/Input';
import { Mail, Lock, ArrowRight, Users, Calendar, LayoutGrid, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loginAuth, isLoggingIn } = userAuthStore();

  const handleSubmit = () => {
    loginAuth(formData);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const features = [
    { icon: Users, text: "Join 50+ campus clubs" },
    { icon: Calendar, text: "Attend exclusive events" },
    { icon: LayoutGrid, text: "Book resources easily" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">Campora</span>
          </Link>

          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10">Sign in to continue to your campus community</p>

          <div className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-slate-200 dark:border-slate-700 text-primary-600 focus:ring-primary-500 bg-white dark:bg-slate-800"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">Forgot Password?</Link>
            </div>

            <Button onClick={handleSubmit} isLoading={isLoggingIn} className="w-full" size="xl">
              Sign In
              <ArrowRight className="w-5 h-5" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-slate-50 dark:bg-slate-950 text-slate-500">or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="text-center pt-4">
              <span className="text-sm text-slate-500">Don't have an account? </span>
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full" />

        <div className="max-w-md text-white relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-primary-300" />
            <span className="text-primary-200 font-medium">Campus Community</span>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            Connect with your campus community
          </h2>
          <p className="text-primary-100 text-lg mb-10">Join clubs, attend events, and make the most of your college life.</p>

          <div className="space-y-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-x-2"
              >
                <div className="p-3.5 bg-white/20 rounded-xl backdrop-blur-xl">
                  <f.icon className="w-6 h-6" />
                </div>
                <span className="text-lg font-semibold">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
