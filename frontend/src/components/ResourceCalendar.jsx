import { useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useResourceStore } from "../store/useResourceStore";
import { Calendar, Clock, MapPin, User, ArrowRight } from "lucide-react";
import Badge from "./ui/Badge";

const ResourceCalendar = ({ resource, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [bookingForm, setBookingForm] = useState({ purpose: "", startTime: "", endTime: "" });
  const { createBooking, isBooking } = useResourceStore();

  const generateTimeSlots = () => {
    if (!resource) return [];
    const times = [];
    const [startH] = resource.availableStartTime.split(":").map(Number);
    const [endH] = resource.availableEndTime.split(":").map(Number);
    for (let h = startH; h < endH; h++) {
      times.push(`${h.toString().padStart(2, "0")}:00`);
      times.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return times;
  };

  const handleBook = async () => {
    if (!bookingForm.purpose || !bookingForm.startTime || !bookingForm.endTime) return;
    try {
      await createBooking({
        resource: resource._id,
        slots: [{ date: selectedDate, startTime: bookingForm.startTime, endTime: bookingForm.endTime }],
        purpose: bookingForm.purpose
      });
      onClose();
    } catch (error) {}
  };

  const timeSlots = generateTimeSlots();

  return (
    <Modal isOpen={true} onClose={onClose} title={`Book ${resource?.name}`} size="lg">
      <div className="space-y-6">
        {/* Resource Info */}
        <div className="flex items-center gap-4 text-sm">
          <Badge variant="primary">{resource?.type}</Badge>
          {resource?.location && (
            <span className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-4 h-4 text-primary-500" />
              {resource.location}
            </span>
          )}
          {resource?.hourlyRate > 0 && (
            <span className="font-bold text-primary-600 dark:text-primary-400">
              ₹{resource.hourlyRate}/hr
            </span>
          )}
        </div>

        {/* Date Selection */}
        <Input
          label="Select Date"
          type="date"
          icon={Calendar}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Start Time
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                value={bookingForm.startTime}
                onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select start</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              End Time
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                value={bookingForm.endTime}
                onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select end</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Purpose */}
        <Input
          label="Purpose"
          icon={User}
          value={bookingForm.purpose}
          onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
          placeholder="Describe the purpose of your booking"
        />

        {/* Amenities */}
        {resource?.amenities?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {resource.amenities.map((a, i) => (
                <Badge key={i} variant="info" size="sm">{a}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleBook}
            isLoading={isBooking}
            disabled={!bookingForm.purpose || !bookingForm.startTime || !bookingForm.endTime}
          >
            Book Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ResourceCalendar;
