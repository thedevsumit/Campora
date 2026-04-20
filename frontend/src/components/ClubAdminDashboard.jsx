import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useClubAdminStore } from "../store/useClubAdminStore";
import { getImageUrl } from "../lib/utils";
import Navbar from "./Navbar";
import EditClubModal from "./EditClubModal";
import ClubAdminEventsManager from "./ClubAdminEventsManager";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import { axiosInstance } from "../lib/axios";
import { userAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import { Settings, Users, Calendar, Megaphone, Crown, Shield, Trash2, UserPlus, ArrowRight, Image, X, Upload, Eye, UserCheck, UserX } from "lucide-react";
import Loader from "./ui/Loader";

export default function ClubAdminDashboard() {
  const { clubId } = useParams();
  const [searchParams] = useSearchParams();
  const { adminClub, loading, fetchAdminClub, addMember, removeMember, changeRole, createAnnouncement, fetchAnnouncements, deleteAnnouncement, fetchJoinRequests, acceptJoinRequest, rejectJoinRequest, joinRequests = [] } = useClubAdminStore();
  const { authUser } = userAuthStore();
  const [clubData, setClubData] = useState(null);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRequestForReject, setSelectedRequestForReject] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const clubIdRef = useRef(clubId);
  useEffect(() => { clubIdRef.current = clubId; }, [clubId]);

  const [announcementData, setAnnouncementData] = useState({ title: "", message: "", image: "", audience: "members", duration: 60 });
  const [newMember, setNewMember] = useState({ email: "", role: "member" });
  const [members, setMembers] = useState([]);
  const [announcementImagePreview, setAnnouncementImagePreview] = useState(null);
  const announcementImageRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      if (!clubId) return;
      setIsLoading(true);
      try {
        await fetchAdminClub(clubId);
      } catch {
        // handled in store
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [clubId, fetchAdminClub]);

  useEffect(() => {
    if (!adminClub) return;
    try {
      setClubData({
        clubName: adminClub.clubName,
        description: adminClub.description,
        icon: adminClub.clubIcon,
        members: adminClub.members?.length || 0,
        followers: adminClub.followers?.length || 0,
      });
      setMembers((adminClub.members || []).map((m) => ({
        id: m.user?._id,
        name: m.user?.fullName,
        email: m.user?.email,
        role: m.role || "member",
        department: "N/A",
        joinedAt: m.joinedAt ? new Date(m.joinedAt).toISOString().split("T")[0] : "",
      })));
    } catch (e) {
      console.error("Error mapping admin club data:", e);
    }
    setIsLoading(false);
  }, [adminClub]);

  useEffect(() => {
    if (activeTab === "requests" && clubIdRef.current) {
      fetchJoinRequests(clubIdRef.current);
    }
  }, [activeTab, fetchJoinRequests]);

  const currentUserRole = adminClub?.members?.find((m) => m.user._id?.toString() === authUser?._id?.toString())?.role;
  const isClubCreator = adminClub?.createdBy?.toString() === authUser?._id?.toString();
  const isModerator = currentUserRole === "moderator";
  const isAdmin = currentUserRole === "admin";
  const canManageClub = isClubCreator || isAdmin || isModerator;

  const displayRole = isClubCreator ? "Owner" : (currentUserRole === "admin" ? "Owner" : (currentUserRole === "moderator" ? "Moderator" : (currentUserRole || "Member")));

  // Check if a member is the club owner
  const isMemberOwner = (memberId) => adminClub?.createdBy?.toString() === memberId;

  // Permission checks - moderators can access dashboard and create events but cannot promote to admin
  const canCreateAnnouncement = isClubCreator || isAdmin;
  const canManageMembers = isClubCreator || isAdmin || isModerator; // All admin roles can manage members
  const canPromoteToAdmin = isClubCreator || isAdmin; // Only owner/admin can promote to admin
  const canCreateEvents = isClubCreator || isAdmin || isModerator;

  const handleAnnouncementSubmit = async () => {
    if (sending) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("title", announcementData.title);
      formData.append("message", announcementData.message);
      formData.append("audience", announcementData.audience);
      formData.append("duration", announcementData.duration);
      if (announcementData.image) {
        formData.append("image", announcementData.image);
      }

      await axiosInstance.post(`/clubs/${clubId}/admin/announcements`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchAdminClub(clubId);
      setShowAnnouncementModal(false);
      setAnnouncementData({ title: "", message: "", image: "", audience: "members", duration: 60 });
      setAnnouncementImagePreview(null);
      toast.success("Announcement published!");
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleAnnouncementImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnnouncementData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setAnnouncementImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeAnnouncementImage = () => {
    setAnnouncementData((prev) => ({ ...prev, image: "" }));
    setAnnouncementImagePreview(null);
    if (announcementImageRef.current) announcementImageRef.current.value = "";
  };

  const handleAddMember = async () => {
    if (!newMember.email) return;
    try {
      await addMember(clubId, newMember);
      await fetchAdminClub(clubId);
      setShowAddMemberModal(false);
      setNewMember({ email: "", role: "member" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(clubId, memberId);
      await fetchAdminClub(clubId);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove member");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Settings },
    { id: "members", label: "Members", icon: Users },
    { id: "requests", label: "Requests", icon: UserCheck },
    { id: "events", label: "Events", icon: Calendar },
    { id: "announcements", label: "Announcements", icon: Megaphone },
  ];

  if (isLoading || !clubData) {
    return (
      <>
        <Navbar />
        <Loader
          variant="page"
          text="Loading club admin dashboard..."
          className="!relative !bg-slate-50 dark:!bg-slate-950 !min-h-[calc(100vh-64px)]"
        />
      </>
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
                  <img src={getImageUrl(clubData.icon)} className="w-full h-full object-cover" alt={clubData.clubName} />
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
                  <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">{displayRole || "Owner"}</p>
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
                    {canManageMembers && !isMemberOwner(member.id) ? (
                      <select
                        value={member.role}
                        onChange={async (e) => {
                          try {
                            await changeRole(clubId, member.id, e.target.value);
                            await fetchAdminClub(clubId);
                            toast.success("Role updated");
                          } catch (error) {
                            toast.error(error?.response?.data?.message || "Failed to update role");
                          }
                        }}
                        className="px-3 py-1.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary-500"
                      >
                        <option value="member">Member</option>
                        <option value="moderator">Moderator</option>
                        {canPromoteToAdmin && <option value="admin">Admin</option>}
                      </select>
                    ) : (
                      <Badge variant={(member.role === "owner" || member.role === "admin") ? "warning" : member.role === "moderator" ? "info" : "default"}>
                        {member.role === "admin" ? "Owner" : member.role === "moderator" ? "Moderator" : member.role}
                      </Badge>
                    )}
                    {!isMemberOwner(member.id) && (
                      <button onClick={() => handleRemoveMember(member.id)} className="p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4 text-danger-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary-500" />
                Join Requests
              </h2>
            </div>
            {joinRequests.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No join requests at the moment.</p>
            ) : (
              <div className="space-y-3">
                {joinRequests.map((req) => (
                  <div key={req._id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                        {req.user?.fullName?.[0] || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{req.user?.fullName || "Unknown"}</p>
                        <p className="text-sm text-slate-500">{req.user?.email || ""}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </div>
                    {req.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            await acceptJoinRequest(clubId, req._id);
                            await fetchJoinRequests(clubId);
                            await fetchAdminClub(clubId);
                          }}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedRequestForReject(req); setRejectReason(""); }}
                          className="text-danger-500 border-danger-200 dark:border-danger-800 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    ) : (
                      <Badge variant={req.status === "accepted" ? "success" : "danger"}>
                        {req.status === "accepted" ? "Accepted" : "Declined"}
                        {req.rejectionReason && <span className="ml-1 text-xs">— {req.rejectionReason}</span>}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="animate-fade-in-up">
            <ClubAdminEventsManager clubId={clubId} canCreateEvents={canCreateEvents} />
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
              {canCreateAnnouncement && (
                <Button size="sm" onClick={() => setShowAnnouncementModal(true)}>
                  <Megaphone className="w-4 h-4 mr-1.5" />
                  New Announcement
                </Button>
              )}
            </div>
            {!adminClub?.announcements || adminClub.announcements.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No announcements yet. Create one to notify your club members.</p>
            ) : (
              <div className="space-y-4">
                {adminClub.announcements.slice().reverse().map((ann) => (
                  <div key={ann._id} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{ann.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{ann.message}</p>
                        {ann.image && (
                          <img
                            src={getImageUrl(ann.image)}
                            alt={ann.title}
                            className="mt-3 rounded-lg max-h-48 object-cover"
                          />
                        )}
                        <p className="text-xs text-slate-400 mt-2">
                          {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : ""}
                        </p>
                      </div>
                      {canCreateAnnouncement && (
                        <button
                          onClick={async () => {
                            if (!window.confirm("Delete this announcement?")) return;
                            await deleteAnnouncement(clubId, ann._id);
                            await fetchAdminClub(clubId);
                          }}
                          className="p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg text-danger-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Club Modal */}
      {showEditModal && (
        <EditClubModal
          show={showEditModal}
          clubData={adminClub}
          clubId={clubId}
          onUpdated={() => fetchAdminClub(clubId)}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Add Member Modal */}
      <Modal isOpen={showAddMemberModal} onClose={() => setShowAddMemberModal(false)} title="Add Member" size="sm">
        <div className="space-y-4">
          <Input label="Email Address" type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} placeholder="member@email.com" />
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Role</label>
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
            >
              <option value="member">Member</option>
              <option value="moderator">Moderator</option>
              {canPromoteToAdmin && <option value="admin">Admin</option>}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowAddMemberModal(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </div>
        </div>
      </Modal>

      {/* Announcement Modal */}
      <Modal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} title="Create Announcement" size="lg">
        <div className="space-y-5">
          {/* Info Banner */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl px-4 py-3 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <Megaphone className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Announce to your club</p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Your announcement will be visible to members and followers in their feed.</p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Cover Image (Optional)</label>
            {announcementImagePreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={announcementImagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  onClick={removeAnnouncementImage}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => announcementImageRef.current?.click()}
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <Image className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Click to upload image</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                <input
                  ref={announcementImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAnnouncementImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <Input
            label="Title"
            value={announcementData.title}
            onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
            placeholder="Important update, upcoming event..."
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
            <textarea
              rows={4}
              value={announcementData.message}
              onChange={(e) => setAnnouncementData({ ...announcementData, message: e.target.value })}
              placeholder="Share what's happening with your club..."
              className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Audience</label>
              <select
                value={announcementData.audience}
                onChange={(e) => setAnnouncementData({ ...announcementData, audience: e.target.value })}
                className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="members">Members Only</option>
                <option value="followers">Followers</option>
                <option value="all">Everyone</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Duration</label>
              <select
                value={announcementData.duration}
                onChange={(e) => setAnnouncementData({ ...announcementData, duration: Number(e.target.value) })}
                className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value={60}>1 Hour</option>
                <option value={1440}>1 Day</option>
                <option value={4320}>3 Days</option>
                <option value={10080}>1 Week</option>
                <option value={0}>Forever</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => { setShowAnnouncementModal(false); setAnnouncementImagePreview(null); }}>Cancel</Button>
            <Button
              onClick={handleAnnouncementSubmit}
              isLoading={sending}
              disabled={!announcementData.title || !announcementData.message}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Megaphone className="w-4 h-4 mr-2" />
              Publish Announcement
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        isOpen={!!selectedRequestForReject}
        onClose={() => { setSelectedRequestForReject(null); setRejectReason(""); }}
        title="Decline Join Request"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Optionally provide a reason for declining. This will be shared with the user.
          </p>
          <textarea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason (optional)"
            className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => { setSelectedRequestForReject(null); setRejectReason(""); }}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!selectedRequestForReject) return;
                await rejectJoinRequest(clubId, selectedRequestForReject._id, rejectReason);
                await fetchJoinRequests(clubId);
                setSelectedRequestForReject(null);
                setRejectReason("");
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Decline Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
