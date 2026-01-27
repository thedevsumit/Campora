import React, { useState, useEffect } from 'react';
import EditClubModal from './EditClubModal';

export default function ClubDashboard() {
  const [clubData, setClubData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch club data
  useEffect(() => {
    // Simulated data for demo
    setTimeout(() => {
      setClubData({
        clubName: 'Tech Club',
        description: 'A community for tech enthusiasts to learn, share, and grow together.',
        icon: 'https://via.placeholder.com/150',
        members: 156,
        events: 12,
        createdAt: '2024-01-15'
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSaveEdit = (updatedData) => {
    setClubData({
      ...clubData,
      ...updatedData
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your club...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Enhanced */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Club Icon - Enhanced */}
            <div className="relative group">
              <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white dark:bg-gray-700 shadow-xl ring-4 ring-white dark:ring-gray-600 flex-shrink-0 transform transition-transform group-hover:scale-105">
                <img 
                  src={clubData?.icon} 
                  alt={clubData?.clubName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Club Info - Enhanced */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Active Club
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                {clubData?.clubName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl leading-relaxed">
                {clubData?.description}
              </p>
              
              {/* Stats - Enhanced */}
              <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
                <div className="text-center transform transition-transform hover:scale-110">
                  <div className="flex items-center justify-center mb-1">
                    <svg className="w-5 h-5 text-green-700 dark:text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-500">{clubData?.members}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Members</p>
                </div>
                <div className="text-center transform transition-transform hover:scale-110">
                  <div className="flex items-center justify-center mb-1">
                    <svg className="w-5 h-5 text-green-700 dark:text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-500">{clubData?.events}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Events</p>
                </div>
                <div className="text-center transform transition-transform hover:scale-110">
                  <div className="flex items-center justify-center mb-1">
                    <svg className="w-5 h-5 text-green-700 dark:text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-500">Active</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Status</p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="flex flex-col gap-3">
              <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Event
              </button>
              <button 
                onClick={() => setShowEditModal(true)}
                className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-8 py-3 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 border border-gray-200 dark:border-gray-600"
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

      {/* Tabs - Enhanced */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {['overview', 'members', 'events', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-green-700 text-green-700 dark:text-green-500'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-500 hover:border-green-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Recent Activity - Enhanced */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-700 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  { initials: 'JD', name: 'John Doe joined the club', time: '2 hours ago', color: 'bg-green-700' },
                  { initials: '📅', name: 'New event "Tech Talk" created', time: '5 hours ago', color: 'bg-blue-700' },
                  { initials: 'AS', name: 'Alice Smith joined the club', time: '1 day ago', color: 'bg-green-700' }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-750 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-600">
                    <div className={`w-12 h-12 ${activity.color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-md`}>
                      {activity.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-semibold">{activity.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions - Enhanced */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { icon: 'M12 4v16m8-8H4', label: 'Create Event' },
                  { icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', label: 'Invite Members' },
                  { icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', label: 'Make Announcement' }
                ].map((action, idx) => (
                  <button key={idx} className="w-full text-left px-5 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-750 hover:from-green-50 hover:to-green-100 dark:hover:from-gray-600 dark:hover:to-gray-650 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-600 group">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-700 dark:text-green-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                      </svg>
                      <span className="text-gray-900 dark:text-white font-semibold">{action.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Members ({clubData?.members})</h2>
              <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Invite Members
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((member) => (
                <div key={member} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-750 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-600">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    M{member}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Member {member}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Computer Science</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
              <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Create Event
              </button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((event) => (
                <div key={event} className="p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-750 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Tech Talk {event}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">A discussion on latest tech trends</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Feb {event + 10}, 2024
                        </span>
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          45 Registered
                        </span>
                      </div>
                    </div>
                    <button className="text-green-700 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400 text-sm font-semibold bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Club Settings</h2>
            <div className="space-y-6">
              <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Club Information</h3>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="text-green-700 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400 font-semibold hover:underline"
                >
                  Edit Club Details
                </button>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-3">Danger Zone</h3>
                <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold hover:underline">
                  Delete Club
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal Component */}
      <EditClubModal 
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        clubData={clubData}
        onSave={handleSaveEdit}
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}