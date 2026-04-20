import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAnalyticsStore } from "../store/useAnalyticsStore";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
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
import {
  Download, TrendingUp, Users, Calendar, DollarSign,
  BarChart3, Activity, PieChart, Sparkles, ArrowRight,
  Zap, Globe, Clock
} from "lucide-react";

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

  const chartFontColor = "#94a3b8";
  const gridColor = "rgba(148,163,184,0.1)";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: { family: "Inter", size: 12 },
          color: chartFontColor,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { stepSize: 1, color: chartFontColor, font: { family: "Inter" } },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: chartFontColor, font: { family: "Inter" } },
        border: { display: false },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: { family: "Inter", size: 12 },
          color: chartFontColor,
        },
      },
    },
    cutout: "65%",
  };

  const lineChartData = {
    labels: eventAnalytics?.events?.slice(-10).map(e => e.title?.substring(0, 15) || "Event") || [],
    datasets: [{
      label: "Registrations",
      data: eventAnalytics?.events?.slice(-10).map(e => e.registrations || 0) || [],
      borderColor: "#7c3aed",
      backgroundColor: "rgba(124,58,237,0.15)",
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#7c3aed",
      pointBorderColor: "#1e293b",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 8,
      borderWidth: 3,
    }],
  };

  const barChartData = {
    labels: clubAnalytics?.clubs?.slice(0, 8).map(c => c.name?.substring(0, 12) || "Club") || [],
    datasets: [
      {
        label: "Members",
        data: clubAnalytics?.clubs?.slice(0, 8).map(c => c.members || 0) || [],
        backgroundColor: "rgba(124,58,237,0.7)",
        borderRadius: 8,
        borderSkipped: false,
        borderWidth: 0,
      },
      {
        label: "Followers",
        data: clubAnalytics?.clubs?.slice(0, 8).map(c => c.followers || 0) || [],
        backgroundColor: "rgba(5,150,105,0.7)",
        borderRadius: 8,
        borderSkipped: false,
        borderWidth: 0,
      },
    ],
  };

  const doughnutChartData = {
    labels: resourceAnalytics?.resources?.slice(0, 6).map(r => r.name || "Resource") || [],
    datasets: [{
      data: resourceAnalytics?.resources?.slice(0, 6).map(r => r.totalBookings || 0) || [],
      backgroundColor: ["#7c3aed", "#059669", "#d97706", "#e11d48", "#6366f1", "#0891b2"],
      borderWidth: 0,
      hoverOffset: 10,
    }],
  };

  const Card = ({ children, className = "" }) => (
    <div className={`bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl ${className}`}>
      {children}
    </div>
  );

  const ChartCard = ({ children, className = "" }) => (
    <div className={`bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 ${className}`}>
      {children}
    </div>
  );

  if (isLoading || !dashboard) {
    return (
      <>
        <Navbar />
        <Loader
          variant="page"
          text="Loading analytics data..."
          className="!relative !bg-slate-950 !min-h-[calc(100vh-64px)]"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-20 w-32 h-32 border border-white/5 rounded-full" />
        <div className="absolute top-40 left-60 w-20 h-20 border border-white/5 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-primary-300 font-semibold text-sm uppercase tracking-wider">Platform Analytics</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
                Analytics <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-primary-200 text-lg">Comprehensive insights into your campus platform</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer hover:bg-white/15 transition-all"
                >
                  <option value="7" className="text-slate-900 bg-white">Last 7 days</option>
                  <option value="30" className="text-slate-900 bg-white">Last 30 days</option>
                  <option value="90" className="text-slate-900 bg-white">Last 90 days</option>
                </select>
                <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-slate-950" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-6 pb-10">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 animate-fade-in-up stagger-1">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-500/20 rounded-2xl">
                <Users className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{dashboard?.overview?.totalUsers || 0}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-medium">+12%</span> this month
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-5 animate-fade-in-up stagger-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary-500/20 rounded-2xl">
                <Activity className="w-6 h-6 text-secondary-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{dashboard?.overview?.totalClubs || 0}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-medium">+8%</span> this month
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-5 animate-fade-in-up stagger-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl">
                <Calendar className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{dashboard?.overview?.totalEvents || 0}</p>
                <p className="text-sm text-slate-400">Total events</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 animate-fade-in-up stagger-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-2xl">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{dashboard?.overview?.totalBookings || 0}</p>
                <p className="text-sm text-slate-400">Total bookings</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard className="p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Event Registrations</h2>
                  <p className="text-sm text-slate-400">Recent sign-ups over time</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleExport("events")} className="text-slate-400 hover:text-white">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-72">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </ChartCard>

          <ChartCard className="p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary-500/20 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-secondary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Club Activity</h2>
                  <p className="text-sm text-slate-400">Members & followers per club</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleExport("clubs")} className="text-slate-400 hover:text-white">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-72">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </ChartCard>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard className="p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-500/20 rounded-xl">
                  <PieChart className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Resource Usage</h2>
                  <p className="text-sm text-slate-400">Booking distribution</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleExport("resources")} className="text-slate-400 hover:text-white">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            </div>
          </ChartCard>

          <div className="lg:col-span-2 space-y-6">
            <ChartCard className="p-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Budget Overview</h2>
                  <p className="text-sm text-slate-400">Event budget tracking</p>
                </div>
              </div>
              {budgetAnalytics?.totals ? (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-slate-800/60 rounded-2xl border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Estimated</p>
                    <p className="text-xl font-bold text-white">₹{budgetAnalytics.totals.estimated?.toLocaleString() || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-primary-500/10 rounded-2xl border border-primary-500/20">
                    <p className="text-xs text-primary-400 mb-1 uppercase tracking-wide">Approved</p>
                    <p className="text-xl font-bold text-primary-400">₹{budgetAnalytics.totals.approved?.toLocaleString() || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary-500/10 rounded-2xl border border-secondary-500/20">
                    <p className="text-xs text-secondary-400 mb-1 uppercase tracking-wide">Spent</p>
                    <p className="text-xl font-bold text-secondary-400">₹{budgetAnalytics.totals.spent?.toLocaleString() || 0}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">No budget data available</div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-2 text-slate-400 font-medium text-xs uppercase tracking-wide">Event</th>
                      <th className="text-left py-3 px-2 text-slate-400 font-medium text-xs uppercase tracking-wide">Club</th>
                      <th className="text-right py-3 px-2 text-slate-400 font-medium text-xs uppercase tracking-wide">Est.</th>
                      <th className="text-right py-3 px-2 text-slate-400 font-medium text-xs uppercase tracking-wide">Approved</th>
                      <th className="text-right py-3 px-2 text-slate-400 font-medium text-xs uppercase tracking-wide">Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetAnalytics?.budgetData?.slice(0, 5).map((b, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-2 truncate max-w-[150px] text-slate-200 font-medium">{b.title || "—"}</td>
                        <td className="py-3 px-2 text-slate-400">{b.club || "—"}</td>
                        <td className="text-right py-3 px-2 text-slate-400">₹{(b.estimated || 0).toLocaleString()}</td>
                        <td className="text-right py-3 px-2 text-primary-400 font-medium">₹{(b.approved || 0).toLocaleString()}</td>
                        <td className="text-right py-3 px-2 text-secondary-400 font-medium">₹{(b.spent || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Platform Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Users, label: "Active Users", value: dashboard?.overview?.activeUsers || 0, color: "primary" },
            { icon: Globe, label: "Online Now", value: dashboard?.overview?.onlineUsers || 0, color: "green" },
            { icon: Zap, label: "Events This Week", value: dashboard?.overview?.eventsThisWeek || 0, color: "amber" },
            { icon: Clock, label: "Avg Session", value: dashboard?.overview?.avgSession || "—", color: "pink" },
          ].map((stat, i) => (
            <Card key={i} className={`p-5 animate-fade-in-up`} style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-${stat.color === "primary" ? "primary" : stat.color === "green" ? "green" : stat.color === "amber" ? "amber" : "pink"}-500/20`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color === "primary" ? "primary" : stat.color === "green" ? "green" : stat.color === "amber" ? "amber" : "pink"}-400`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
