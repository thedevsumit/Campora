import React, { useState, useEffect, useRef } from "react";
import { useEventStore } from "../store/useEventStore";
import { getImageUrl } from "../lib/utils";
import { axiosInstance } from "../lib/axios";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { Calendar, Clock, MapPin, Users, Image, X, Upload, Plus, ChevronRight, Edit3, Trash2, Eye, Shield, CheckCircle } from "lucide-react";
import SuccessModal from "./ui/SuccessModal";

const categories = ["Technical", "Cultural", "Sports", "Arts", "Business", "Social", "Other"];

export default function ClubAdminEventsManager({ clubId, canCreateEvents = true }) {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventImagePreview, setEventImagePreview] = useState(null);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const eventImageRef = useRef(null);

  const { clubEvents, fetchClubEvents, createEvent, updateEvent, deleteEvent, loading } = useEventStore();

  useEffect(() => {
    if (!clubId) return;
    fetchClubEvents(clubId);
  }, [clubId, fetchClubEvents]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technical",
    date: "",
    time: "",
    venue: "",
    maxParticipants: 50,
    coverImage: "",
    registrationType: "open",
    maxTeamSize: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrationTypeChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      registrationType: val,
      maxTeamSize: val === "solo" ? 1 : val === "group" ? 5 : 1,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setEventImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, coverImage: "" }));
    setEventImagePreview(null);
    if (eventImageRef.current) eventImageRef.current.value = "";
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "Technical",
      date: "",
      time: "",
      venue: "",
      maxParticipants: 50,
      coverImage: "",
      registrationType: "open",
      maxTeamSize: 1,
    });
    setEventImagePreview(null);
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("startDate", form.date);
    formData.append("time", form.time);
    formData.append("venue", form.venue);
    formData.append("maxParticipants", form.maxParticipants);
    formData.append("registrationType", form.registrationType);
    if (form.registrationType === "group") {
      formData.append("maxTeamSize", form.maxTeamSize);
    }
    if (form.coverImage) {
      formData.append("coverImage", form.coverImage);
    }

    if (editingEvent) {
      // Handle update if needed
    } else {
      await createEvent(clubId, formData);
      setShowSuccessModal(true);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.startDate ? event.startDate.split("T")[0] : "",
      time: event.time || "",
      venue: event.venue || "",
      maxParticipants: event.maxParticipants,
      coverImage: "",
      registrationType: event.registrationType || "open",
      maxTeamSize: event.maxTeamSize || 1,
    });
    if (event.coverImage) {
      setEventImagePreview(getImageUrl(event.coverImage));
    }
    setShowModal(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(eventId);
    }
  };

  const handleViewParticipants = async (event) => {
    setSelectedEventForParticipants(event);
    setLoadingParticipants(true);
    try {
      const res = await axiosInstance.get(`/events/${event._id}/registrations`);
      setParticipants(res.data.registrations || []);
    } catch (err) {
    } finally {
      setLoadingParticipants(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Club Events
          </h2>
          <p className="text-sm text-slate-500 mt-1">Create and manage your club events</p>
        </div>
        {canCreateEvents && (
        <Button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && clubEvents.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
            <Calendar className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No events yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Create your first event to engage your club members and followers.</p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Event
          </Button>
        </div>
      )}

      {/* Events Grid */}
      {!loading && clubEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clubEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group"
            >
              {event.coverImage && (
                <div className="relative h-40 overflow-hidden">
                  <img src={getImageUrl(event.coverImage)} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge
                    className="absolute top-3 left-3 bg-white/20 backdrop-blur-xl text-white border border-white/30"
                  >
                    {event.category}
                  </Badge>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{event.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-4">
                  {event.startDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      {formatDate(event.startDate)}
                    </span>
                  )}
                  {event.time && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-secondary-500" />
                      {event.time}
                    </span>
                  )}
                  {event.venue && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      {event.venue}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Users className="w-4 h-4" />
                    {event.registrations?.length || 0}/{event.maxParticipants} registered
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleViewParticipants(event)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="View Participants"
                    >
                      <Eye className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-danger-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingEvent ? "Edit Event" : "Create New Event"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Cover Image</label>
            {eventImagePreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={eventImagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => eventImageRef.current?.click()}
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <Image className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Click to upload cover image</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                <input
                  ref={eventImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <Input
            label="Event Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Hackathon 2026, Cultural Night..."
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              rows={3}
              className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Registration Type</label>
              <select
                name="registrationType"
                value={form.registrationType}
                onChange={handleRegistrationTypeChange}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
              >
                <option value="open">Open (Anyone can join)</option>
                <option value="solo">Solo (Individual registration)</option>
                <option value="group">Group (Teams)</option>
                <option value="closed">Closed (Invite only)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={form.registrationType === "group" ? "Max Teams" : "Max Participants"}
              name="maxParticipants"
              type="number"
              value={form.maxParticipants}
              onChange={handleChange}
              placeholder="50"
            />
            {form.registrationType === "group" && (
              <Input
                label="Max Team Size"
                name="maxTeamSize"
                type="number"
                value={form.maxTeamSize}
                onChange={handleChange}
                placeholder="5"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
            <Input
              label="Time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Venue"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Main Auditorium, Block A..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => { setShowModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              disabled={!form.title || !form.date || !form.time}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {editingEvent ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Participants Modal */}
      <Modal
        isOpen={!!selectedEventForParticipants}
        onClose={() => { setSelectedEventForParticipants(null); setParticipants([]); }}
        title={`Participants — ${selectedEventForParticipants?.title || ""}`}
        size="md"
      >
        {loadingParticipants ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-10">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No participants yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {participants.map((reg, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                    {reg.user?.fullName?.[0] || reg.name?.[0] || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {reg.user?.fullName || reg.name}
                    </p>
                    <p className="text-xs text-slate-500">{reg.user?.email || reg.email}</p>
                    {reg.year && (
                      <p className="text-xs text-slate-400">{reg.year}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      reg.status === "registered"
                        ? "success"
                        : reg.status === "waitlisted"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {reg.status}
                  </Badge>
                  {reg.teamMembers?.length > 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                      +{reg.teamMembers.length} members
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Event Created!"
        subtitle="Your event"
        highlightText={`"${form.title || 'New Event'}"`}
        buttonText="Awesome!"
        variant="green"
      />
    </div>
  );
}