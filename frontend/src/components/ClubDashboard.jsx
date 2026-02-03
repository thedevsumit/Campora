import React, { useState, useEffect } from 'react';
import EditClubModal from './EditClubModal';

export default function ClubDashboard() {
  const [clubData, setClubData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
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
    setClubData({ ...clubData, ...updatedData });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your club...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">

          <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white shadow-lg border">
            <img src={clubData.icon} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1">
            <span className="inline-block bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Active Club
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {clubData.clubName}
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl">
              {clubData.description}
            </p>

            <div className="flex gap-10">
              <Stat label="Members" value={clubData.members} />
              <Stat label="Events" value={clubData.events} />
              <Stat label="Status" value="Active" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold shadow">
              Create Event
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-8 py-3 rounded-lg font-semibold shadow"
            >
              Edit Club
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex space-x-8">
          {['overview', 'members', 'events', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 border-b-2 font-semibold ${
                activeTab === tab
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-600 hover:text-green-700'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <Card title="Recent Activity" />
            <Card title="Quick Actions" />
          </div>
        )}

        {activeTab === 'members' && <Card title="Members" />}
        {activeTab === 'events' && <Card title="Events" />}
        {activeTab === 'settings' && <Card title="Settings" />}
      </div>

      <EditClubModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        clubData={clubData}
        onSave={handleSaveEdit}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="text-center">
    <p className="text-3xl font-bold text-green-700">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const Card = ({ title }) => (
  <div className="bg-white rounded-xl shadow p-6 border">
    <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-gray-600">Content goes here</p>
  </div>
);
