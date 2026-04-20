import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useResourceStore } from "../store/useResourceStore";
import {
  Calendar, Clock, MapPin, User, ArrowRight, CheckCircle, Sparkles, AlertCircle,
  PartyPopper, Loader, XCircle, ExternalLink
} from "lucide-react";
import Badge from "./ui/Badge";

const ResourceCalendar = ({ resource, onClose }) => {
  const navigate = useNavigate();
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDateTo, setSelectedDateTo] = useState("");
  const [bookingForm, setBookingForm] = useState({ purpose: "" });
  const [step, setStep] = useState(1);
  const [bookingResult, setBookingResult] = useState(null);
  const [dateError, setDateError] = useState("");
  const [conflictInfo, setConflictInfo] = useState(null);
  const { createBooking, isBooking } = useResourceStore();
  const isCommunityResource = !!resource?.createdBy;

  const validateDates = (from, to) => {
    if (!from) return "";
    if (isCommunityResource) {
      if (!to) return "";
      if (new Date(to) < new Date(from)) {
        return "End date cannot be before start date";
      }
      if (resource.availableTo && new Date(to) > new Date(resource.availableTo)) {
        return `End date cannot be after resource availability (${new Date(resource.availableTo).toLocaleDateString()})`;
      }
      if (resource.availableFrom && new Date(from) < new Date(resource.availableFrom)) {
        return `Start date cannot be before resource availability (${new Date(resource.availableFrom).toLocaleDateString()})`;
      }
    } else {
      if (resource.availableFrom && new Date(from) < new Date(resource.availableFrom)) {
        return `Date cannot be before resource availability (${new Date(resource.availableFrom).toLocaleDateString()})`;
      }
      if (resource.availableTo && new Date(from) > new Date(resource.availableTo)) {
        return `Date cannot be after resource availability (${new Date(resource.availableTo).toLocaleDateString()})`;
      }
    }
    return "";
  };

  const generateTimeSlots = () => {
    if (!resource) return [];
    const times = [];
    const [startH] = (resource.availableStartTime || "09:00").split(":").map(Number);
    const [endH] = (resource.availableEndTime || "18:00").split(":").map(Number);
    for (let h = startH; h < endH; h++) {
      times.push(`${h.toString().padStart(2, "0")}:00`);
      times.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return times;
  };

  const handleDateChange = (field, value) => {
    setDateError("");
    if (field === "from") {
      setSelectedDateFrom(value);
      if (selectedDateTo && new Date(selectedDateTo) < new Date(value)) {
        setSelectedDateTo(value);
      }
    } else {
      setSelectedDateTo(value);
    }
    const err = validateDates(field === "from" ? value : selectedDateFrom, field === "to" ? value : selectedDateTo);
    if (err) setDateError(err);
  };

  const handleBook = async () => {
    if (!bookingForm.purpose) return;
    const err = validateDates(selectedDateFrom, isCommunityResource ? selectedDateTo : "");
    if (err) {
      setDateError(err);
      return;
    }
    const slotData = isCommunityResource
      ? { date: selectedDateFrom, dateTo: selectedDateTo || selectedDateFrom }
      : { date: selectedDateFrom, startTime: bookingForm.startTime, endTime: bookingForm.endTime };
    try {
      const booking = await createBooking({
        resource: resource._id,
        slots: [slotData],
        purpose: bookingForm.purpose
      });
      const result = booking.status === "approved" ? "approved" : "pending";
      setBookingResult(result);
      setStep(3);
    } catch (error) {
      if (error.response?.status === 409) {
        setConflictInfo(error.response?.data);
        setStep(4);
      }
    }
  };

  const timeSlots = generateTimeSlots();
  const isFormValid = bookingForm.purpose && (isCommunityResource || (bookingForm.startTime && bookingForm.endTime));

  // Success Step
  if (step === 3) {
    return (
      <Modal isOpen={true} onClose={onClose} title="" size="lg" hideTitle>
        <div className="space-y-6">
          {bookingResult === "approved" ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center shadow-2xl shadow-secondary-500/40 animate-bounce-in">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-secondary-400/30 animate-ping" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-secondary-400/10 animate-pulse" />
                </div>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-full text-secondary-600 dark:text-secondary-400 text-sm font-semibold mb-4 animate-fade-in-up">
                <PartyPopper className="w-4 h-4" />
                Booked Successfully!
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 animate-fade-in-up stagger-1">
                You're all set!
              </h3>
              <p className="text-slate-500 animate-fade-in-up stagger-2">
                Your booking for <span className="font-semibold text-slate-700 dark:text-slate-300">{resource?.name}</span> has been confirmed.
                The resource owner has been notified.
              </p>

              <div className="mt-6 bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20 rounded-2xl p-5 border border-secondary-100 dark:border-secondary-800 animate-fade-in-up stagger-3">
                <div className={`grid ${isCommunityResource ? "grid-cols-1" : "grid-cols-2"} gap-4 text-left`}>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Dates</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {new Date(selectedDateFrom).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {selectedDateTo && selectedDateTo !== selectedDateFrom && ` — ${new Date(selectedDateTo).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`}
                    </p>
                  </div>
                  {!isCommunityResource && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Time</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {bookingForm.startTime} - {bookingForm.endTime}
                      </p>
                    </div>
                  )}
                  <div className={isCommunityResource ? "" : "col-span-2"}>
                    <p className="text-xs text-slate-400 mb-1">Purpose</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{bookingForm.purpose}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="mt-6 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 animate-fade-in-up stagger-4"
              >
                Done
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/40 animate-pulse">
                <Clock className="w-12 h-12 text-white" />
              </div>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400 text-sm font-semibold mb-4 animate-fade-in-up">
                <Clock className="w-4 h-4" />
                Awaiting Approval
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 animate-fade-in-up stagger-1">
                Request Submitted!
              </h3>
              <p className="text-slate-500 animate-fade-in-up stagger-2">
                Your booking for <span className="font-semibold text-slate-700 dark:text-slate-300">{resource?.name}</span> has been sent to admins for approval.
                You'll be notified when it's reviewed.
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                className="mt-6 animate-fade-in-up stagger-4"
              >
                Got it
              </Button>
            </div>
          )}
        </div>
      </Modal>
    );
  }

  // Conflict Step
  if (step === 4) {
    return (
      <Modal isOpen={true} onClose={onClose} title="" size="lg" hideTitle>
        <div className="space-y-6">
          <div className="text-center py-6 animate-fade-in">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40">
                <XCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-red-400/30 animate-ping" />
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 text-sm font-semibold mb-4 animate-fade-in-up">
              <XCircle className="w-4 h-4" />
              Slot Already Booked
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 animate-fade-in-up stagger-1">
              Sorry, this slot is taken!
            </h3>
            <p className="text-slate-500 animate-fade-in-up stagger-2 max-w-sm mx-auto">
              Someone else has already booked this resource during your selected time.
            </p>

            {conflictInfo?.bookedBy && (
              <div className="mt-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-red-200 dark:border-red-800 animate-fade-in-up stagger-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden">
                    {conflictInfo.bookedBy?.profilePic ? (
                      <img src={conflictInfo.bookedBy.profilePic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      conflictInfo.bookedBy?.fullName?.[0] || "?"
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-slate-500 mb-1">Already booked by</p>
                    <button
                      onClick={() => navigate(`/profile/${conflictInfo.bookedBy._id}`)}
                      className="font-bold text-slate-900 dark:text-white text-lg hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      {conflictInfo.bookedBy?.fullName || "Someone"}
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {conflictInfo?.conflictSlot && (
                  <div className="mt-4 flex items-center gap-3 bg-white/60 dark:bg-slate-800/60 rounded-xl p-3">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {conflictInfo.conflictSlot.date
                        ? new Date(conflictInfo.conflictSlot.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                        : ""}
                    </span>
                    {conflictInfo.conflictSlot.startTime && (
                      <>
                        <Clock className="w-4 h-4 text-red-500 ml-2" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {conflictInfo.conflictSlot.startTime} - {conflictInfo.conflictSlot.endTime}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {conflictInfo?.conflictDate && (
                  <div className="mt-3 flex items-center gap-3 bg-white/60 dark:bg-slate-800/60 rounded-xl p-3">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {new Date(conflictInfo.conflictDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </span>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={() => { setStep(1); setConflictInfo(null); }}
              variant="outline"
              className="mt-6 animate-fade-in-up stagger-4"
            >
              Try Different Time
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // Steps 1 & 2 - Form & Confirmation
  return (
    <Modal isOpen={true} onClose={onClose} title={step === 1 ? `Book ${resource?.name}` : "Confirm Booking"} size="lg">
      <div className="space-y-6">
        {step === 1 ? (
          <>
            {/* Resource Info Banner */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800">
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="primary" size="lg">{resource?.type}</Badge>
                {resource?.location && (
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    {resource.location}
                  </span>
                )}
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-primary-500" />
                  {resource?.availableStartTime} - {resource?.availableEndTime}
                </span>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              {isCommunityResource ? (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="From Date"
                    type="date"
                    icon={Calendar}
                    value={selectedDateFrom}
                    onChange={(e) => handleDateChange("from", e.target.value)}
                    min={resource.availableFrom || new Date().toISOString().split("T")[0]}
                    max={resource.availableTo || undefined}
                  />
                  <Input
                    label="To Date"
                    type="date"
                    icon={Calendar}
                    value={selectedDateTo}
                    onChange={(e) => handleDateChange("to", e.target.value)}
                    min={selectedDateFrom || resource.availableFrom || new Date().toISOString().split("T")[0]}
                    max={resource.availableTo || undefined}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl px-4 py-3 border border-primary-100 dark:border-primary-800">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Booking for Today</p>
                    <p className="text-xs text-slate-500">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
              )}
              {dateError && (
                <p className="text-danger-500 text-sm font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {dateError}
                </p>
              )}
            </div>

            {/* Time Selection - Only for admin resources */}
            {!isCommunityResource && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-primary-500" />
                    Start Time
                  </label>
                  <select
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value, endTime: "" })}
                    className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select start time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-secondary-500" />
                    End Time
                  </label>
                  <select
                    value={bookingForm.endTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select end time</option>
                    {timeSlots.filter(slot => slot > bookingForm.startTime).map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Purpose */}
            <Input
              label="Purpose of Booking"
              icon={User}
              value={bookingForm.purpose}
              onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
              placeholder="e.g., Team meeting, Study session, Event"
            />

            {/* Amenities */}
            {resource?.amenities?.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Available Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {resource.amenities.map((a, i) => (
                    <Badge key={i} variant="default" size="sm" className="bg-slate-100 dark:bg-slate-800">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!isFormValid}
              >
                Review Booking
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation Step */}
            <div className="bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20 rounded-2xl p-6 border border-secondary-100 dark:border-secondary-800 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary-500/30">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Confirm Your Booking</h3>
              <p className="text-slate-500 text-sm">Please review your booking details</p>
            </div>

            {/* Booking Summary */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                  {resource?.name?.[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">{resource?.name}</p>
                  <p className="text-sm text-slate-500">{resource?.code} • {resource?.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span className="text-slate-600 dark:text-slate-400">Dates:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {new Date(selectedDateFrom).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    {selectedDateTo && selectedDateTo !== selectedDateFrom && ` — ${new Date(selectedDateTo).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`}
                  </span>
                </div>
                {bookingForm.startTime && bookingForm.endTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span className="text-slate-600 dark:text-slate-400">Time:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {bookingForm.startTime} - {bookingForm.endTime}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 mb-1">Purpose</p>
                <p className="font-medium text-slate-900 dark:text-white">{bookingForm.purpose}</p>
              </div>

            </div>

            {/* Notice */}
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {resource?.requiresApproval
                  ? "This resource requires admin approval. You'll be notified once your booking is confirmed."
                  : "You'll receive an instant confirmation. Present this booking at the resource location."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back
              </Button>
              <Button
                onClick={handleBook}
                isLoading={isBooking}
                className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ResourceCalendar;
