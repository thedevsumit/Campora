import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { axiosInstance } from "../lib/axios";
import { Shield, Users, CheckCircle2, XCircle, Clock, Sparkles, ArrowRight } from "lucide-react";

const AdminDashboard = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingClubs();
  }, []);

  const fetchPendingClubs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/pending-clubs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClubs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveClub = async (id) => {
    try {
      await axiosInstance.put(`/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClubs((prev) => prev.filter((club) => club._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const rejectClub = async (id) => {
    try {
      await axiosInstance.put(`/admin/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClubs((prev) => prev.filter((club) => club._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold animate-fade-in-up">
                Admin Dashboard
              </h1>
              <p className="text-amber-100 text-lg animate-fade-in-up stagger-1">Manage club approvals and platform settings</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-800 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{clubs.length}</p>
                <p className="text-sm text-slate-500">Pending Requests</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-800 animate-fade-in-up stagger-1">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">-</p>
                <p className="text-sm text-slate-500">Approved Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-800 animate-fade-in-up stagger-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-danger-100 dark:bg-danger-900/30 rounded-xl">
                <XCircle className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">-</p>
                <p className="text-sm text-slate-500">Rejected Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Clubs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-up">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pending Club Requests</h2>
            </div>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
            )}

            {!loading && clubs.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-secondary-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All caught up!</h3>
                <p className="text-slate-500">No pending club requests</p>
              </div>
            )}

            <div className="space-y-4">
              {clubs.map((club) => (
                <div
                  key={club._id}
                  className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                        {club.clubIcon ? (
                          <img src={`http://localhost:5000${club.clubIcon}`} className="w-full h-full object-cover" alt={club.clubName} />
                        ) : (
                          <span className="text-white text-2xl font-bold">{club.clubName?.[0]}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{club.clubName}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{club.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-400">Requested by: {club.createdBy?.fullName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => approveClub(club._id)}
                        className="shadow-lg shadow-secondary-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => rejectClub(club._id)}
                        className="shadow-lg shadow-danger-500/20"
                      >
                        <XCircle className="w-4 h-4 mr-1.5" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
