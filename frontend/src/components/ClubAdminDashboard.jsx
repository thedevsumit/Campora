import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClubAdminStore } from "../store/useClubAdminStore";
import Navbar from "./Navbar";
import EditClubModal from "./EditClubModal";
import ClubAdminEventsManager from "./ClubAdminEventsManager";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import { axiosInstance } from "../lib/axios";
import { userAuthStore } from "../store/useAuthStore";
import { Settings, Users, Calendar, Megaphone, Crown, Shield, Trash2, UserPlus, ArrowRight } from "lucide-react";

export default function ClubAdminDashboard() {
  const { clubId } = useParams();
  const { adminClub, loading, fetchAdminClub, addMember, removeMember, changeRole, createAnnouncement, fetchAnnouncements, deleteAnnouncement } = useClubAdminStore();
  const { authUser } = userAuthStore();
  const [clubData, setClubData] = useState(null);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [announcementData, setAnnouncementData] = useState({ title: "", message: "", audience: "members", duration: 60 });
  const [newMember, setNewMember] = useState({ email: "", role: "member" });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!clubId) return;
      await fetchAdminClub(clubId);
    };
    load();
  }, [clubId, fetchAdminClub]);

  useEffect(() => {
    if (!adminClub) return;
    setClubData({
      clubName: adminClub.clubName,
      description: adminClub.description,
      icon: adminClub.clubIcon,
      members: adminClub.members.length,
      followers: adminClub.followers.length,
    });
    setMembers(adminClub.members.map((m) => ({
      id: m.user._id,
      name: m.user.fullName,
      email: m.user.email,
      role: m.role || "member",
      department: "N/A",
      joinedAt: new Date(m.joinedAt).toISOString().split("T")[0],
    })));
    setIsLoading(false);
  }, [adminClub]);

  const currentUserRole = adminClub?.members?.find((m) => m.user._id === authUser?._id)?.role;

  const handleAnnouncementSubmit = async () => {
    if (sending) return;
    setSending(true);
    try {
      await createAnnouncement(announcementData);
      setShowAnnouncementModal(false);
      setAnnouncementData({ title: "", message: "", audience: "members", duration: 60 });
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.email) return;
    try {
      await addMember(newMember);
      setShowAddMemberModal(false);
      setNewMember({ email: "", role: "member" });
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Settings },
    { id: "members", label: "Members", icon: Users },
    { id: "events", label: "Events", icon: Calendar },
    { id: "announcements", label: "Announcements", icon: Megaphone },
  ];

  if (isLoading || !clubData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl overflow-hidden ring-4 ring-white/30 shadow-2xl">
                {clubData.icon ? (
                  <img src={`http://localhost:5000${clubData.icon}`} className="w-full h-full object-cover" alt={clubData.clubName} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-4xl font-bold">
                    {clubData.clubName?.[0]}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-5 h-5 text-primary-200" />
                  <span className="text-primary-200 text-sm font-medium">Club Admin</span>
                </div>
                <h1 className="text-3xl font-extrabold">{clubData.clubName}</h1>
                <p className="text-primary-100 mt-1">{clubData.description}</p>
              </div>
            </div>
            <Button variant="outline" className="border-white/50 text-white hover:bg-white/20" onClick={() => setShowEditModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Edit Club
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{clubData.members}</p>
                  <p className="text-sm text-slate-500">Members</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up stagger-1">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-secondary-100 dark:bg-secondary-900/30 rounded-2xl">
                  <Users className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{clubData.followers}</p>
                  <p className="text-sm text-slate-500">Followers</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up stagger-2">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
                  <Crown className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">{currentUserRole}</p>
                  <p className="text-sm text-slate-500">Your Role</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                Club Members ({members.length})
              </h2>
              <Button size="sm" onClick={() => setShowAddMemberModal(true)}>
                <UserPlus className="w-4 h-4 mr-1.5" />
                Add Member
              </Button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                      {member.name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={member.role === "owner" ? "warning" : member.role === "moderator" ? "info" : "default"}>
                      {member.role}
                    </Badge>
                    {member.role !== "owner" && (
                      <button onClick={() => removeMember(member.id)} className="p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4 text-danger-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="animate-fade-in-up">
            <ClubAdminEventsManager />
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary-500" />
                Announcements
              </h2>
              <Button size="sm" onClick={() => setShowAnnouncementModal(true)}>
                <Megaphone className="w-4 h-4 mr-1.5" />
                New Announcement
              </Button>
            </div>
            <p className="text-slate-500 text-center py-8">Create announcements to notify your club members.</p>
          </div>
        )}
      </div>

      {/* Edit Club Modal */}
      {showEditModal && <EditClubModal club={adminClub} onClose={() => setShowEditModal(false)} />}

      {/* Add Member Modal */}
      <Modal isOpen={showAddMemberModal} onClose={() => setShowAddMemberModal(false)} title="Add Member" size="sm">
        <div className="space-y-4">
          <Input label="Email Address" type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} placeholder="member@email.com" />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowAddMemberModal(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </div>
        </div>
      </Modal>

      {/* Announcement Modal */}
      <Modal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} title="Create Announcement" size="md">
        <div className="space-y-4">
          <Input label="Title" value={announcementData.title} onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })} placeholder="Important update..." />
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
            <textarea rows={4} value={announcementData.message} onChange={(e) => setAnnouncementData({ ...announcementData, message: e.target.value })} placeholder="Write your announcement..." className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowAnnouncementModal(false)}>Cancel</Button>
            <Button onClick={handleAnnouncementSubmit} isLoading={sending}>Publish</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
