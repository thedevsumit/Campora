import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, trendValue, className = "" }) => {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
            {value}
          </p>
          {trendValue && (
            <div className={`flex items-center gap-1.5 text-sm font-semibold ${
              trend === "up" ? "text-secondary-600" : "text-danger-500"
            }`}>
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trend === "up" ? "+" : "-"}{trendValue}</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-4 bg-gradient-to-br from-primary-500/10 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-600/20 rounded-2xl">
          <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
