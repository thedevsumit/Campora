import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useClubAdminStore } from '../store/useClubAdminStore';
import Navbar from './Navbar';
import EditClubModal from './EditClubModal';

export default function ClubAdminDashboard() {
  const { clubId } = useParams();


    const {
    adminClub,
    loading,
    fetchAdminClub,
    addMember,
    removeMember,
    changeRole,
    } = useClubAdminStore();

  const [clubData, setClubData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    message: '',
    audience: 'members' // members or all
  });

  const [newMember, setNewMember] = useState({
    email: '',
    role: 'member' // member, moderator
  });

  const [members, setMembers] = useState([]);

/* ================= FETCH REAL DATA ================= */
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
    events: 0,
    announcements: 0,
    createdAt: adminClub.createdAt,
    });


    setMembers(
    adminClub.members.map((m) => ({
    id: m.user._id,
    name: m.user.fullName,
    email: m.user.email,
    role: m.role,
    department: 'N/A',
    joinedAt: new Date(m.joinedAt).toISOString().split('T')[0],
    }))
    );


    setIsLoading(false);
    }, [adminClub]);

  const handleSaveEdit = (updatedData) => {
    setClubData({
      ...clubData,
      ...updatedData
    });
  };

const handleAnnouncementSubmit = async () => {
alert('Announcements backend not connected yet');
};


const handleAddMember = async () => {
if (!newMember.email) return alert('Enter email');


await addMember(clubId, newMember);
setShowAddMemberModal(false);
setNewMember({ email: '', role: 'Member' });
await fetchAdminClub(clubId);
};


const handleRemoveMember = async (memberId) => {
await removeMember(clubId, memberId);
await fetchAdminClub(clubId);
};


const handleChangeRole = async (memberId, role) => {
await changeRole(clubId, memberId, role);
await fetchAdminClub(clubId);
};

  if (isLoading) {
    return (
        <>
        <Navbar/>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-semibold text-sm">⚡ Admin Dashboard</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white shadow-xl ring-4 ring-white/30 shrink-0">
              <img 
              
                src={`http://localhost:5000${clubData?.icon}`} 
                alt={clubData?.clubName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                {clubData?.clubName}
              </h1>
              <p className="text-lg text-green-100 mb-6 max-w-2xl leading-relaxed">
                {clubData?.description}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{clubData?.members}</p>
                  <p className="text-sm text-green-100">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{clubData?.followers}</p>
                  <p className="text-sm text-green-100">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{clubData?.events}</p>
                  <p className="text-sm text-green-100">Events</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{clubData?.announcements}</p>
                  <p className="text-sm text-green-100">Announcements</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowAnnouncementModal(true)}
                className="bg-white hover:bg-gray-100 text-green-700 px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Announce
              </button>
              <button 
                onClick={() => setShowEditModal(true)}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold border border-white/30 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Club
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {['overview', 'members', 'announcements', 'events', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-green-700 text-green-700'
                    : 'border-transparent text-gray-600 hover:text-green-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">+12</p>
                      <p className="text-sm text-gray-600">New Followers This Week</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">1.2k</p>
                      <p className="text-sm text-gray-600">Profile Views</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {[
                    { action: 'New member joined', user: 'Sarah Williams', time: '2 hours ago', icon: '👤' },
                    { action: 'Event created', user: 'You', time: '5 hours ago', icon: '📅' },
                    { action: 'Announcement sent', user: 'You', time: '1 day ago', icon: '📢' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowAnnouncementModal(true)}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all duration-200 border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    <span className="text-gray-900 font-semibold">Make Announcement</span>
                  </div>
                </button>
                <button 
                  onClick={() => setShowAddMemberModal(true)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="text-gray-900 font-semibold">Add Member</span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-gray-900 font-semibold">Create Event</span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-gray-900 font-semibold">View Analytics</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Manage Members</h2>
                <p className="text-sm text-gray-600 mt-1">{members.length} total members</p>
              </div>
              <button 
                onClick={() => setShowAddMemberModal(true)}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Member
              </button>
            </div>

            <div className="overflow-x-auto">
                {console.log("ADMIN MEMBERS:", adminClub?.members)}
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(member.id, e.target.value)}
                          className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-900 border-0 focus:ring-2 focus:ring-green-500"
                        >
                          <option value="member">Member</option>
                          <option value="moderator">Moderator</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.joinedAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
              <button 
                onClick={() => setShowAnnouncementModal(true)}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                New Announcement
              </button>
            </div>

          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Member Growth</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>Chart visualization would go here</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Attendance</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Club Settings</h2>
            <div className="space-y-6">
              <div className="p-5 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Club Information</h3>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="text-green-700 hover:text-green-800 font-semibold hover:underline"
                >
                  Edit Club Details
                </button>
              </div>
              <hr className="border-gray-200" />
              <div className="p-5 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-green-700 rounded focus:ring-green-500" defaultChecked />
                    <span className="text-gray-900">Allow new member requests</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-green-700 rounded focus:ring-green-500" defaultChecked />
                    <span className="text-gray-900">Public club profile</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-green-700 rounded focus:ring-green-500" />
                    <span className="text-gray-900">Require approval for events</span>
                  </label>
                </div>
              </div>
              <hr className="border-gray-200" />
              <div className="p-5 bg-red-50 rounded-xl border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Danger Zone</h3>
                <button className="text-red-600 hover:text-red-700 font-semibold hover:underline">
                  Delete Club
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAnnouncementModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">New Announcement</h2>
                <button 
                  onClick={() => setShowAnnouncementModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={announcementData.title}
                    onChange={(e) => setAnnouncementData({...announcementData, title: e.target.value})}
                    placeholder="Announcement title"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={announcementData.message}
                    onChange={(e) => setAnnouncementData({...announcementData, message: e.target.value})}
                    placeholder="Your announcement message..."
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send to
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="audience"
                        value="members"
                        checked={announcementData.audience === 'members'}
                        onChange={(e) => setAnnouncementData({...announcementData, audience: e.target.value})}
                        className="w-4 h-4 text-green-700"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">Members Only</p>
                        <p className="text-sm text-gray-500">Send to {clubData?.members} members</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="audience"
                        value="all"
                        checked={announcementData.audience === 'all'}
                        onChange={(e) => setAnnouncementData({...announcementData, audience: e.target.value})}
                        className="w-4 h-4 text-green-700"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">All Followers</p>
                        <p className="text-sm text-gray-500">Send to {clubData?.followers} followers (including members)</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAnnouncementSubmit}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Send Announcement
                  </button>
                  <button
                    onClick={() => setShowAnnouncementModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddMemberModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Member</h2>
                <button 
                  onClick={() => setShowAddMemberModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    placeholder="member@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                  >
                    <option value="member">Member</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 An invitation will be sent to this email address
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddMember}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Send Invitation
                  </button>
                  <button
                    onClick={() => setShowAddMemberModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      /* Edit Modal Component */
      <EditClubModal 
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        clubData={clubData}
        clubId={clubId}
        onSave={handleSaveEdit}
        onUpdated={() => fetchAdminClub(clubId)}
      /> 

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
    </>
  );
}