import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useEventStore } from "../store/useEventStore";

export default function EventsPage() {
  const { events, loading, fetchAllEvents, registerForEvent } = useEventStore();

  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
  });

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    fetchAllEvents();
  }, []);

  /* ================= REGISTER ================= */
  const handleRegister = (event) => {
    setSelectedEvent(event);
    setShowRegisterModal(true);
  };

  const handleRegistrationSubmit = async () => {
    if (!registrationData.name || !registrationData.email) {
      alert("Please fill required fields");
      return;
    }

    await registerForEvent(selectedEvent._id, registrationData);

    setShowRegisterModal(false);
    setRegistrationData({ name: "", email: "", phone: "", year: "" });
  };

  /* ================= FILTER ================= */
  const filteredEvents =
    filterCategory === "all"
      ? events
      : events.filter((e) => e.category === filterCategory);

  const categories = [
    "all",
    "Technical",
    "Cultural",
    "Sports",
    "Competition",
    "Workshop",
  ];

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading events...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* HERO */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Upcoming Events</h1>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-5 py-2 rounded-full font-semibold ${
                  filterCategory === c
                    ? "bg-white text-green-700"
                    : "bg-white/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* EVENTS GRID */}
        <div className="max-w-7xl mx-auto p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const registered = event.registeredCount || 0;
            const percent =
              (registered / event.maxParticipants) * 100 || 0;

            return (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
              >
                {/* IMAGE */}
                <img
                  src={
                    event.image ||
                    "https://via.placeholder.com/400x200?text=Event"
                  }
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {event.description}
                  </p>

                  <p className="text-sm">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-sm">{event.venue}</p>

                  <p className="text-sm mt-2">
                    {registered}/{event.maxParticipants} registered
                  </p>

                  {/* PROGRESS */}
                  <div className="w-full bg-gray-200 h-2 rounded mt-2">
                    <div
                      className="bg-green-700 h-2 rounded"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* CLUB INFO */}
                  <div className="flex items-center gap-2 mt-3">
                    {event.club?.clubIcon && (
                      <img
                        src={`http://localhost:5000${event.club.clubIcon}`}
                        className="w-6 h-6 rounded-full"
                        alt="club"
                      />
                    )}
                    <span className="text-sm text-gray-500">
                      {event.club?.clubName}
                    </span>
                  </div>

                  {/* REGISTER BUTTON */}
                  <button
                    onClick={() => handleRegister(event)}
                    disabled={registered >= event.maxParticipants}
                    className="w-full mt-4 bg-green-700 text-white py-2 rounded disabled:bg-gray-300"
                  >
                    {registered >= event.maxParticipants
                      ? "Event Full"
                      : "Register"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* REGISTER MODAL */}
        {showRegisterModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                Register for {selectedEvent.title}
              </h2>

              <input
                placeholder="Name"
                className="border p-2 w-full mb-2"
                value={registrationData.name}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="Email"
                className="border p-2 w-full mb-2"
                value={registrationData.email}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    email: e.target.value,
                  })
                }
              />

              <input
                placeholder="Phone"
                className="border p-2 w-full mb-2"
                value={registrationData.phone}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    phone: e.target.value,
                  })
                }
              />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleRegistrationSubmit}
                  className="bg-green-700 text-white px-4 py-2 rounded"
                >
                  Register
                </button>

                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
