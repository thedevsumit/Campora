import React, { useState } from "react";
import { Link } from "react-router-dom";
import { userAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { Mail, Lock, User, GraduationCap, Calendar, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();
  const { signupAuth, isSigningUp } = userAuthStore();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleGetOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email address");
      return;
    }

    try {
      setIsLoadingOtp(true);
      const resp = await axiosInstance.post("/auth/sendOtp", {
        email: formData.email,
      });
      console.log(resp.data);
      setIsOtpSent(true);
      alert("OTP sent to your email!");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const payload = {
        ...formData,
        otp: otp,
        dept,
        year,
      };
      signupAuth(payload);
      setIsOtpVerified(true);
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Invalid OTP / Signup Failed");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = () => {
    if (!isOtpVerified) {
      alert("Please verify your email with OTP first");
      return;
    }
    navigate("/");
  };

  const years = ["1", "2", "3", "4"];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8 animate-fade-in-up">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              Campora
            </span>
          </Link>

          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="text-primary-600 font-semibold text-sm">Create Your Account</span>
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            Get Started Now
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10">
            Join the campus community and start your journey
          </p>

          <div className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              icon={User}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
            />

            {/* Email Address */}
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              disabled={isOtpVerified}
            />

            {/* OTP Verification - shows after OTP sent */}
            {isOtpSent && !isOtpVerified && (
              <div className="space-y-3 p-5 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
                <Input
                  label="Enter OTP"
                  type="text"
                  icon={CheckCircle2}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  maxLength={6}
                />
                <Button onClick={handleVerifyOtp} isLoading={isVerifyingOtp} size="sm" className="w-full">
                  {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            )}

            {isOtpVerified && (
              <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-2xl border border-secondary-100 dark:border-secondary-800">
                <CheckCircle2 className="w-5 h-5 text-secondary-600" />
                <span className="text-secondary-700 dark:text-secondary-300 font-medium">
                  Email verified successfully!
                </span>
              </div>
            )}

            {/* Password */}
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a strong password"
            />

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Department
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  name="dept"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Year
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  name="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Year</option>
                  {years.map((yr) => (
                    <option key={yr} value={yr}>
                      Year {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToPolicy}
                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                className="w-5 h-5 rounded border-slate-200 dark:border-slate-700 text-primary-600 focus:ring-primary-500 bg-white dark:bg-slate-800 cursor-pointer"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                I agree to the{" "}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                  terms & policy
                </a>
              </span>
            </label>

            <Button
              onClick={isOtpSent ? (isOtpVerified ? handleSubmit : handleVerifyOtp) : handleGetOtp}
              disabled={!isOtpVerified && (!formData.email || (!isOtpSent && agreedToPolicy === false))}
              isLoading={isOtpSent && isOtpVerified ? isSigningUp : isLoadingOtp}
              className="w-full"
              size="xl"
            >
              {!isOtpSent ? (isLoadingOtp ? "Sending OTP..." : "Send OTP") : isOtpVerified ? (isSigningUp ? "Creating Account..." : "Create Account") : (isVerifyingOtp ? "Verifying..." : "Verify Email")}
              <ArrowRight className="w-5 h-5" />
            </Button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-50 dark:bg-slate-950 text-slate-400">or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <button
              onClick={() => window.location.href = `${API_URL}/auth/google`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-slate-700 dark:text-slate-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <span className="text-sm text-slate-500">Already have an account? </span>
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-12 items-start mt-30 justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-100 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full" />

        <div className="max-w-md text-white relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-primary-300" />
            <span className="text-primary-200 font-medium">Join Campora</span>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            Your campus community awaits
          </h2>
          <p className="text-primary-100 text-lg mb-10">
            Create an account to join clubs, attend events, and connect with students across campus.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <div className="p-3.5 bg-white/20 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-semibold">50+ Campus Clubs</span>
                <p className="text-primary-200 text-sm">Find your community</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <div className="p-3.5 bg-white/20 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-semibold">Exclusive Events</span>
                <p className="text-primary-200 text-sm">Never miss out</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <div className="p-3.5 bg-white/20 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-semibold">Resource Booking</span>
                <p className="text-primary-200 text-sm">Book rooms & equipment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
