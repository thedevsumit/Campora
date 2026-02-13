import React, { useState, useEffect } from "react";
import { useEventStore } from "../store/useEventStore";

export default function ClubAdminEventsManager({ clubId }) {
  const [showModal, setShowModal] = useState(false);

  /* ================= ZUSTAND ================= */
  const { clubEvents, fetchClubEvents, createEvent, loading } = useEventStore();

  /* ================= FETCH CLUB EVENTS ================= */
  useEffect(() => {
    if (!clubId) return;
    fetchClubEvents(clubId);
  }, [clubId, fetchClubEvents]);

  /* ================= FORM STATE ================= */
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

  /* ================= CREATE EVENT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.date || !form.time) {
      alert("Please fill required fields");
      return;
    }

    await createEvent(clubId, form);

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

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading events...</p>}

      {/* Empty state */}
      {!loading && clubEvents.length === 0 && (
        <p className="text-gray-500 text-sm">
          No events yet. Create your first club event 🚀
        </p>
      )}

      {/* Events List */}
      <div className="space-y-3 mt-4">
        {clubEvents.map((event) => (
          <div
            key={event._id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {event.date} • {event.time} • {event.venue}
              </p>
              <p className="text-xs text-gray-400">
                {event.registeredCount || 0}/{event.maxParticipants} registered
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= CREATE EVENT MODAL ================= */}
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
