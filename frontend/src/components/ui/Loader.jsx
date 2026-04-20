import { useEffect, useState } from "react";

/**
 * Premium Loader Component with multiple variants
 * Usage:
 * - <Loader /> - Default spinner
 * - <Loader variant="pulse" />
 * - <Loader variant="dots" />
 * - <Loader variant="ring" />
 * - <Loader variant="page" /> - Full page loader
 * - <Loader variant="skeleton" lines={3} /> - Skeleton loader
 */

const Loader = ({
  variant = "spinner",
  size = "md",
  color = "primary",
  text,
  className = "",
  lines = 3,
  fullPage = false,
  blur = false,
  minHeight,
}) => {
  const [progress, setProgress] = useState(0);

  // Progress animation for page loader
  useEffect(() => {
    if (variant !== "page") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [variant]);

  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-24 h-24",
  };

  const colorClasses = {
    primary: "text-primary-600 dark:text-primary-400",
    secondary: "text-secondary-600 dark:text-secondary-400",
    accent: "text-accent-600 dark:text-accent-400",
    white: "text-white",
    gray: "text-gray-400 dark:text-gray-500",
  };

  const renderSpinner = () => (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const renderPulse = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <span
        className={`absolute inset-0 rounded-full ${
          color === "white" ? "bg-white" : "bg-current"
        } opacity-75 animate-ping`}
      />
      <span
        className={`relative inline-flex rounded-full ${sizeClasses[size]} ${
          color === "white" ? "bg-white" : "bg-current"
        }`}
      />
    </div>
  );

  const renderDots = () => (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`${
            size === "xs"
              ? "w-1.5 h-1.5"
              : size === "sm"
              ? "w-2 h-2"
              : "w-2.5 h-2.5"
          } rounded-full ${colorClasses[color]} animate-bounce`}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );

  const renderRing = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div
        className={`absolute inset-0 rounded-full border-2 ${
          color === "white"
            ? "border-white/30"
            : "border-primary-200 dark:border-primary-800"
        }`}
      />
      <div
        className={`absolute inset-0 rounded-full border-2 border-t-transparent border-b-transparent ${
          color === "white" ? "border-white" : colorClasses[color]
        } animate-spin`}
        style={{ animationDuration: "1s" }}
      />
    </div>
  );

  const renderPageLoader = () => (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
        blur ? "backdrop-blur-md bg-white/60 dark:bg-slate-900/60" : "bg-white dark:bg-slate-900"
      } ${className}`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary-200/20 dark:bg-secondary-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Logo Animation */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow animate-bounce-in">
          <span className="text-3xl font-bold text-white">C</span>
        </div>
        <div className="absolute -inset-4 bg-primary-500/20 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Spinner */}
      <div className="relative mb-6">
        <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 rounded-full" />
        <div className="absolute inset-0 border-4 border-primary-600 dark:border-primary-400 rounded-full border-t-transparent animate-spin" />
      </div>

      {/* Text */}
      {text && (
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-fade-in">
          {text}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mt-6 w-64 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Loading Text */}
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Loading amazing things...
      </p>
    </div>
  );

  const renderSkeleton = () => (
    <div className={`space-y-3 ${className}`} style={{ minHeight }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
          style={{
            width: i === lines - 1 ? "60%" : "100%",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  const renderCardSkeleton = () => (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-3 w-1/4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    </div>
  );

  const variants = {
    spinner: renderSpinner,
    pulse: renderPulse,
    dots: renderDots,
    ring: renderRing,
    page: renderPageLoader,
    skeleton: renderSkeleton,
    "skeleton-card": renderCardSkeleton,
  };

  const SelectedLoader = variants[variant] || renderSpinner;

  if (fullPage && variant !== "page") {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          blur ? "backdrop-blur-sm bg-white/50 dark:bg-slate-900/50" : "bg-white dark:bg-slate-900"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <SelectedLoader />
          {text && (
            <p className="text-gray-600 dark:text-gray-400 font-medium">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return <SelectedLoader />;
};

// Specialized Full Page Loader
export const PageLoader = ({ text = "Loading...", blur = false }) => (
  <Loader variant="page" text={text} blur={blur} />
);

// Skeleton Loader Components
export const Skeleton = ({ lines = 3, className = "" }) => (
  <Loader variant="skeleton" lines={lines} className={className} />
);

export const CardSkeleton = ({ className = "" }) => (
  <Loader variant="skeleton-card" className={className} />
);

// Button Loader
export const ButtonLoader = ({ size = "sm", color = "white" }) => (
  <Loader variant="spinner" size={size} color={color} />
);

// Content Loading Wrapper
export const LoadingWrapper = ({
  isLoading,
  children,
  text = "Loading...",
  blur = false,
  minHeight = "200px",
  skeleton = false,
  skeletonLines = 3,
}) => {
  if (!isLoading) return children;

  if (skeleton) {
    return (
      <div style={{ minHeight }} className="p-4">
        <Loader variant="skeleton" lines={skeletonLines} />
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ minHeight }}
    >
      {blur && <div className="absolute inset-0 backdrop-blur-sm bg-white/30 dark:bg-slate-900/30" />}
      <div className="flex flex-col items-center gap-3 z-10">
        <Loader variant="spinner" size="lg" />
        {text && <p className="text-gray-600 dark:text-gray-400">{text}</p>}
      </div>
    </div>
  );
};

export default Loader;
