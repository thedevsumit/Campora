import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAnalyticsStore } from "../store/useAnalyticsStore";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  LineController,
  BarController,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Download, TrendingUp, Users, Calendar, DollarSign, BarChart3, Activity, PieChart, Sparkles, ArrowRight } from "lucide-react";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend, DoughnutController, LineController, BarController
);

const AnalyticsDashboard = () => {
  const {
    dashboard, eventAnalytics, clubAnalytics, resourceAnalytics, budgetAnalytics,
    fetchDashboard, fetchEventAnalytics, fetchClubAnalytics, fetchResourceAnalytics,
    fetchBudgetAnalytics, isLoading
  } = useAnalyticsStore();
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    fetchDashboard();
    fetchEventAnalytics(period);
    fetchClubAnalytics();
    fetchResourceAnalytics();
    fetchBudgetAnalytics();
  }, [fetchDashboard, fetchEventAnalytics, fetchClubAnalytics, fetchResourceAnalytics, fetchBudgetAnalytics, period]);

  const handleExport = (type) => {
    let data = [];
    let filename = "";
    switch (type) {
      case "events": data = eventAnalytics?.events || []; filename = "event_analytics.csv"; break;
      case "clubs": data = clubAnalytics?.clubs || []; filename = "club_analytics.csv"; break;
      case "resources": data = resourceAnalytics?.resources || []; filename = "resource_analytics.csv"; break;
      default: data = dashboard?.eventStats || []; filename = "analytics.csv";
    }
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => Object.values(row).map(v => `"${v ?? ""}"`).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const lineChartData = {
    labels: eventAnalytics?.events?.slice(-10).map(e => e.title?.substring(0, 15) || "Event") || [],
    datasets: [{
      label: "Registrations",
      data: eventAnalytics?.events?.slice(-10).map(e => e.registrations || 0) || [],
      borderColor: "#7c3aed",
      backgroundColor: "rgba(124, 58, 237, 0.1)",
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#7c3aed",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  const barChartData = {
    labels: clubAnalytics?.clubs?.slice(0, 8).map(c => c.name?.substring(0, 12) || "Club") || [],
    datasets: [
      { label: "Members", data: clubAnalytics?.clubs?.slice(0, 8).map(c => c.members || 0) || [], backgroundColor: "rgba(124, 58, 237, 0.8)", borderRadius: 8, borderSkipped: false },
      { label: "Followers", data: clubAnalytics?.clubs?.slice(0, 8).map(c => c.followers || 0) || [], backgroundColor: "rgba(5, 150, 105, 0.8)", borderRadius: 8, borderSkipped: false },
    ],
  };

  const doughnutChartData = {
    labels: resourceAnalytics?.resources?.slice(0, 6).map(r => r.name || "Resource") || [],
    datasets: [{
      data: resourceAnalytics?.resources?.slice(0, 6).map(r => r.totalBookings || 0) || [],
      backgroundColor: ["#7c3aed", "#059669", "#d97706", "#e11d48", "#6366f1", "#0891b2"],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { padding: 20, usePointStyle: true, pointStyle: "circle", font: { family: "Inter" } } },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" }, ticks: { stepSize: 1 } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-200" />
                <span className="text-primary-200 font-medium">Insights & Metrics</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 animate-fade-in-up">
                Analytics <span className="bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-primary-100 text-lg animate-fade-in-up stagger-1">Track your campus platform performance</p>
            </div>
            <div className="flex items-center gap-3 animate-fade-in-up stagger-2">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="7" className="text-slate-900">Last 7 days</option>
                <option value="30" className="text-slate-900">Last 30 days</option>
                <option value="90" className="text-slate-900">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-6 pb-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Users" value={dashboard?.overview?.totalUsers || 0} icon={Users} trend="up" trendValue="12%" className="animate-fade-in-up stagger-1" />
          <StatCard title="Total Clubs" value={dashboard?.overview?.totalClubs || 0} icon={Activity} trend="up" trendValue="8%" className="animate-fade-in-up stagger-2" />
          <StatCard title="Total Events" value={dashboard?.overview?.totalEvents || 0} icon={Calendar} className="animate-fade-in-up stagger-3" />
          <StatCard title="Total Bookings" value={dashboard?.overview?.totalBookings || 0} icon={DollarSign} className="animate-fade-in-up stagger-4" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Event Registrations</h2>
                  <p className="text-sm text-slate-500">Recent sign-ups</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={Download} onClick={() => handleExport("events")}>Export</Button>
            </div>
            <div className="h-72"><Line data={lineChartData} options={chartOptions} /></div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Club Activity</h2>
                  <p className="text-sm text-slate-500">Members & followers</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={Download} onClick={() => handleExport("clubs")}>Export</Button>
            </div>
            <div className="h-72"><Bar data={barChartData} options={chartOptions} /></div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-xl">
                  <PieChart className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resource Usage</h2>
                  <p className="text-sm text-slate-500">Booking distribution</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" icon={Download} onClick={() => handleExport("resources")}>Export</Button>
            </div>
            <div className="h-64 flex items-center justify-center"><Doughnut data={doughnutChartData} options={{ ...chartOptions, scales: {} }} /></div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Budget Overview</h2>
                <p className="text-sm text-slate-500">Event budget tracking</p>
              </div>
            </div>
            {budgetAnalytics?.totals && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-500 mb-1">Estimated</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">₹{budgetAnalytics.totals.estimated.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
                  <p className="text-sm text-primary-600 mb-1">Approved</p>
                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400">₹{budgetAnalytics.totals.approved.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-2xl border border-secondary-100 dark:border-secondary-800">
                  <p className="text-sm text-secondary-600 mb-1">Spent</p>
                  <p className="text-xl font-bold text-secondary-600 dark:text-secondary-400">₹{budgetAnalytics.totals.spent.toLocaleString()}</p>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left py-3 px-2 text-slate-500 font-medium">Event</th>
                    <th className="text-left py-3 px-2 text-slate-500 font-medium">Club</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-medium">Est.</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-medium">Approved</th>
                    <th className="text-right py-3 px-2 text-slate-500 font-medium">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetAnalytics?.budgetData?.slice(0, 5).map((b, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-2 truncate max-w-[150px] text-slate-900 dark:text-white">{b.title}</td>
                      <td className="py-3 px-2 text-slate-500">{b.club}</td>
                      <td className="text-right py-3 px-2 text-slate-500">₹{b.estimated.toLocaleString()}</td>
                      <td className="text-right py-3 px-2 text-primary-600">₹{b.approved.toLocaleString()}</td>
                      <td className="text-right py-3 px-2 text-secondary-600">₹{b.spent.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
