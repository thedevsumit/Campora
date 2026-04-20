import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, Clock, PartyPopper, ArrowRight, X } from "lucide-react";
import Button from "./Button";

/**
 * SuccessModal - A reusable success confirmation modal with celebration animation
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {string} props.type - "success" | "pending" | "approved"
 * @param {string} props.title - Main title text
 * @param {string} props.subtitle - Subtitle/description text
 * @param {string} props.highlightText - Text to highlight in the description
 * @param {string} props.buttonText - Text for the primary button
 * @param {function} props.onButtonClick - Function for primary button click (defaults to onClose)
 * @param {Object} props.details - Optional details to display (e.g., { date, time, purpose })
 * @param {string} props.variant - Color variant: "green" | "amber" | "blue"
 */
const SuccessModal = ({
  isOpen,
  onClose,
  type = "success",
  title,
  subtitle,
  highlightText = "",
  buttonText = "Done",
  onButtonClick,
  details = null,
  variant = "green",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variants = {
    green: {
      bg: "from-secondary-400 to-secondary-600",
      glow: "bg-secondary-400/10",
      ring: "border-secondary-400/30",
      badge: "bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400",
      button: "from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700",
      icon: CheckCircle,
      label: "Success",
      labelIcon: PartyPopper,
    },
    amber: {
      bg: "from-amber-400 to-amber-500",
      glow: "bg-amber-400/10",
      ring: "border-amber-400/30",
      badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
      button: "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
      icon: Clock,
      label: "Pending",
      labelIcon: Clock,
    },
    blue: {
      bg: "from-primary-400 to-primary-600",
      glow: "bg-primary-400/10",
      ring: "border-primary-400/30",
      badge: "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400",
      button: "from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700",
      icon: CheckCircle,
      label: "Approved",
      labelIcon: CheckCircle,
    },
  };

  const v = variants[variant];
  const Icon = v.icon;
  const LabelIcon = v.labelIcon;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Celebration animation */}
          <div className="relative mb-6">
            <div
              className={`w-24 h-24 mx-auto bg-gradient-to-br ${v.bg} rounded-full flex items-center justify-center shadow-2xl shadow-secondary-500/40 animate-bounce-in`}
            >
              <Icon className="w-12 h-12 text-white" />
            </div>
            {/* Pulsing ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-24 h-24 rounded-full border-4 ${v.ring} animate-ping`}
              />
            </div>
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-32 h-32 rounded-full ${v.glow} animate-pulse`} />
            </div>
          </div>

          {/* Success badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 ${v.badge} rounded-full text-sm font-semibold mb-4 animate-fade-in-up`}
          >
            <LabelIcon className="w-4 h-4" />
            {v.label}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 animate-fade-in-up">
            {title}
          </h3>

          {/* Subtitle with optional highlight */}
          <p className="text-slate-500 animate-fade-in-up">
            {subtitle}
            {highlightText && (
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {" "}{highlightText}
              </span>
            )}
          </p>

          {/* Optional details */}
          {details && (
            <div
              className={`mt-6 bg-gradient-to-br ${
                variant === "green"
                  ? "from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20 border-secondary-100 dark:border-secondary-800"
                  : variant === "amber"
                  ? "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800"
                  : "from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-100 dark:border-primary-800"
              } rounded-2xl p-5 border animate-fade-in-up`}
            >
              <div className="grid grid-cols-2 gap-4 text-left">
                {details.date && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Date</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {details.date}
                    </p>
                  </div>
                )}
                {details.time && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Time</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {details.time}
                    </p>
                  </div>
                )}
                {details.purpose && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400 mb-1">Purpose</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {details.purpose}
                    </p>
                  </div>
                )}
                {details.status && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400 mb-1">Status</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {details.status}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Button */}
          <Button
            onClick={handleButtonClick}
            className={`mt-6 bg-gradient-to-r ${v.button} animate-fade-in-up`}
          >
            {buttonText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default SuccessModal;
