import { Loader } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white focus:ring-primary-500 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 border-2 border-primary-400/50",
    secondary: "bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white focus:ring-secondary-500 shadow-lg shadow-secondary-500/25 hover:shadow-xl hover:shadow-secondary-500/30 hover:-translate-y-0.5",
    outline: "border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 hover:text-white dark:hover:text-white focus:ring-primary-500 hover:-translate-y-0.5",
    ghost: "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:ring-slate-300 dark:focus:ring-slate-600",
    danger: "bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white focus:ring-danger-500 shadow-lg shadow-danger-500/25 hover:shadow-xl hover:shadow-danger-500/30 hover:-translate-y-0.5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-5 py-2.5 text-base gap-2",
    lg: "px-7 py-3.5 text-lg gap-2.5",
    xl: "px-8 py-4 text-xl gap-3",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
