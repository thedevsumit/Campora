import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  placeholder,
  error,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3.5 ${Icon ? "pl-12" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"}
            bg-white dark:bg-slate-800
            border-2 border-slate-200 dark:border-slate-700
            rounded-2xl
            text-slate-900 dark:text-white
            placeholder-slate-400 dark:placeholder-slate-500
            transition-all duration-300
            focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/10" : ""}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-danger-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
