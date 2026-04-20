import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import Button from "./ui/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-900/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-200/10 dark:bg-accent-900/5 rounded-full blur-3xl animate-pulse" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Number with Effects */}
        <div className="relative mb-8">
          <div className="text-[150px] sm:text-[200px] font-black leading-none bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 bg-clip-text text-transparent select-none animate-gradient bg-[length:200%_200%]">
            404
          </div>
          {/* Glow Effect Behind Number */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/20 dark:bg-primary-500/30 rounded-full blur-3xl -z-10" />
        </div>

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 shadow-lg shadow-primary-500/20 animate-bounce-in">
          <AlertTriangle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>

        {/* Text Content */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up">
          Page Not Found
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Oops! The page you're looking for seems to have wandered off into the digital wilderness.
          It might have been moved, deleted, or never existed in the first place.
        </p>

        {/* Suggestions */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-soft border border-gray-100 dark:border-slate-700 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300">
            <Search className="w-5 h-5 text-primary-500" />
            <span className="font-semibold">You might want to try:</span>
          </div>
          <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2 pl-7">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Double-checking the URL for any typos
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
              Going back to the previous page
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              Returning to the homepage and navigating from there
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button
            variant="primary"
            size="lg"
            icon={Home}
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            Back to Home
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
        </div>

        {/* Footer Text */}
        <p className="mt-12 text-sm text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          If you believe this is a mistake, please contact support or try again later.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
