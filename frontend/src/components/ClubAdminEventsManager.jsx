import React, { useState } from "react";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios";


export default function ClubAdminEventsManager({ onCreate }) {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      console.log("FETCHING EVENTS FOR:", clubId);

      const res = await axiosInstance.get(`/events/club/${clubId}`);

      console.log("EVENTS RESPONSE:", res.data);

      setEvents(res.data.events);
    } catch (err) {
      console.error("FETCH EVENTS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ THIS WAS MISSING
  useEffect(() => {
    if (!clubId) return;
    fetchEvents();
  }, [clubId]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technical",
    date: "",
    time: "",
    venue: "",
    maxParticipants: 50,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.date || !form.time) {
      alert("Please fill required fields");
      return;
    }

    await onCreate(form);

    setShowModal(false);

    setForm({
      title: "",
      description: "",
      category: "Technical",
      date: "",
      time: "",
      venue: "",
      maxParticipants: 50,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Club Events</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold"
        >
          + Create Event
        </button>
      </div>

      {/* Empty state */}
      <p className="text-gray-500 text-sm">
        Create and manage events for your club. Registered students and stats will
        appear here.
      </p>

      {/* Create Event Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold">Create Event</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                name="title"
                placeholder="Event title"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  required
                />

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <input
                name="venue"
                placeholder="Venue"
                value={form.venue}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="number"
                name="maxParticipants"
                placeholder="Max participants"
                value={form.maxParticipants}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-green-700 text-white rounded-lg font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
