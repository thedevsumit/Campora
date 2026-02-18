import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If backend returns array directly
      setClubs(res.data);

      // If backend returns { clubs: [...] }
      // setClubs(res.data.clubs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveClub = async (id) => {
    try {
      await axiosInstance.put(
        `/admin/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Remove instantly from UI
      setClubs((prev) => prev.filter((club) => club._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const rejectClub = async (id) => {
    try {
      await axiosInstance.put(
        `/admin/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setClubs((prev) => prev.filter((club) => club._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Admin Panel – Pending Club Requests
      </h2>

      {loading && <div className="text-gray-600 mb-4">Loading requests...</div>}

      {!loading && clubs.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-600">
          No pending club requests 🎉
        </div>
      )}

      <div className="grid gap-6">
        {clubs.map((club) => (
          <div
            key={club._id}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex justify-between items-start"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {club.clubName}
              </h3>

              <p className="text-gray-600 mt-2">{club.description}</p>

              <p className="text-sm text-gray-500 mt-3">
                Requested by: {club.createdBy?.fullName}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => approveClub(club._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Approve
              </button>

              <button
                onClick={() => rejectClub(club._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
