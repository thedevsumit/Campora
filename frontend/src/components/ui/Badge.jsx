const Badge = ({ children, variant = "default", size = "md", className = "" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    primary: "bg-gradient-to-r from-primary-500/10 to-primary-600/10 text-primary-600 dark:from-primary-500/20 dark:to-primary-600/20 dark:text-primary-400",
    secondary: "bg-gradient-to-r from-secondary-500/10 to-secondary-600/10 text-secondary-600 dark:from-secondary-500/20 dark:to-secondary-600/20 dark:text-secondary-400",
    success: "bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-600 dark:from-emerald-500/20 dark:to-emerald-600/20 dark:text-emerald-400",
    warning: "bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-600 dark:from-amber-500/20 dark:to-amber-600/20 dark:text-amber-400",
    danger: "bg-gradient-to-r from-danger-500/10 to-danger-600/10 text-danger-600 dark:from-danger-500/20 dark:to-danger-600/20 dark:text-danger-400",
    info: "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 dark:from-blue-500/20 dark:to-blue-600/20 dark:text-blue-400",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
