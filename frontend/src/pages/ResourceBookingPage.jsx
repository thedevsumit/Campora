import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useResourceStore } from "../store/useResourceStore";
import { userAuthStore } from "../store/useAuthStore";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import ResourceCalendar from "../components/ResourceCalendar";
import {
  Search, Plus, MapPin, Clock, Users, Wrench, Car, Microscope,
  LayoutGrid, Sparkles, ArrowRight, Calendar, CheckCircle, X, Building, Monitor,
  Projector, Volume2, Wifi, Power, ChevronRight, Filter, BookOpen, Edit3,
  Trash2, Star, Crown, Shield, Gem
} from "lucide-react";

const resourceTypeIcons = {
  room: Building,
  hall: LayoutGrid,
  lab: Microscope,
  equipment: Monitor,
  vehicle: Car,
  book: BookOpen,
  other: Wrench,
};

const amenityIcons = {
  wifi: Wifi,
  projector: Projector,
  audio: Volume2,
  power: Power,
};

const whyBookItems = [
  {
    icon: Calendar,
    title: "Easy Scheduling",
    desc: "Check real-time availability and book your preferred slots in just a few clicks. No more back-and-forth emails.",
    color: "primary",
  },
  {
    icon: CheckCircle,
    title: "Instant Confirmation",
    desc: "Get immediate booking confirmations for available resources. Pending approval for premium resources.",
    color: "secondary",
  },
  {
    icon: Users,
    title: "Collaborate Together",
    desc: "Book spaces for group projects, club meetings, and campus events. Share the experience with your peers.",
    color: "amber",
  },
];

const resourceTypes = ["room", "hall", "lab", "equipment", "vehicle", "book", "other"];
const bookResourceTypes = ["book", "other"];

const ResourceBookingPage = () => {
  const { resources, bookings, isLoading, fetchResources, createResource } = useResourceStore();
  const { authUser } = userAuthStore();
  const [selectedResource, setSelectedResource] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filter, setFilter] = useState({ type: "", search: "" });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newResource, setNewResource] = useState({
    name: "",
    type: "book",
    code: "",
    location: "",
    capacity: "",
    amenities: [],
    availableStartTime: "09:00",
    availableEndTime: "18:00",
    requiresApproval: false,
    author: "",
    publisher: "",
    isbn: "",
  });
  const [amenityInput, setAmenityInput] = useState("");

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const isAdmin = authUser?.userRole === "admin" || authUser?.role === "superAdmin";

  const filteredResources = resources.filter(r => {
    if (filter.type && r.type !== filter.type) return false;
    if (filter.search && !r.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setNewResource(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setNewResource(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleCreateResource = async () => {
    if (!newResource.name || !newResource.code) return;
    setIsCreating(true);
    try {
      await createResource(newResource);
      setShowCreateModal(false);
      setNewResource({
        name: "",
        type: "book",
        code: "",
        location: "",
        capacity: "",
        amenities: [],
        availableStartTime: "09:00",
        availableEndTime: "18:00",
        requiresApproval: false,
        author: "",
        publisher: "",
        isbn: "",
      });
    } catch (error) {
    } finally {
      setIsCreating(false);
    }
  };

  const getTypeIcon = (type) => resourceTypeIcons[type] || Wrench;

  const getTypeGradient = (type) => {
    const gradients = {
      room: "from-blue-500 to-blue-600",
      hall: "from-purple-500 to-purple-600",
      lab: "from-emerald-500 to-emerald-600",
      equipment: "from-orange-500 to-orange-600",
      vehicle: "from-red-500 to-red-600",
      book: "from-amber-500 to-amber-600",
      other: "from-slate-500 to-slate-600",
    };
    return gradients[type] || "from-slate-500 to-slate-600";
  };

  const getTypeBadgeVariant = (type) => {
    const variants = {
      room: "info",
      hall: "secondary",
      lab: "success",
      equipment: "warning",
      vehicle: "danger",
      book: "primary",
      other: "default",
    };
    return variants[type] || "default";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-primary-50 dark:from-slate-950 dark:via-slate-900 dark:to-primary-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-72 h-72 border border-white/10 rounded-full" />
        <div className="absolute top-40 right-40 w-32 h-32 border border-white/10 rounded-full" />
        <div className="absolute bottom-40 left-60 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-8 w-4 h-4 bg-amber-400 rounded-full" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/60 rounded-full" />

        {/* Floating icons */}
        <div className="absolute top-32 right-60 opacity-20 animate-pulse">
          <BookOpen className="w-16 h-16 text-white" />
        </div>
        <div className="absolute bottom-40 right-80 opacity-20 animate-bounce">
          <Building className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-40 left-40 opacity-20 animate-pulse">
          <Microscope className="w-14 h-14 text-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-sm font-medium uppercase tracking-wider mb-6 border border-white/20">
                <Gem className="w-4 h-4 text-amber-300" />
                <span className="text-primary-200">Campus Resources</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 animate-fade-in-up leading-tight">
                Book{" "}
                <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                  Campus
                </span>{" "}
                Resources
              </h1>
              <p className="text-primary-100 text-lg md:text-xl animate-fade-in-up stagger-1 max-w-xl leading-relaxed">
                From seminar halls to lab equipment and books — find and book the resources you need for your campus activities.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-5 mt-8 animate-fade-in-up stagger-2">
                <div className="group flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <LayoutGrid className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white">{resources.length}+</p>
                    <p className="text-primary-200 text-sm font-medium">Resources</p>
                  </div>
                </div>
                <div className="group flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white">{bookings.length}+</p>
                    <p className="text-primary-200 text-sm font-medium">Bookings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card - Show for ALL users */}
            <div className="flex flex-col items-center gap-4 animate-fade-in-up stagger-3">
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center max-w-sm shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {isAdmin ? "Add New Resource" : "Contribute a Resource"}
                </h3>
                <p className="text-primary-100 text-sm leading-relaxed mb-4">
                  {isAdmin
                    ? "Add rooms, halls, equipment, or vehicles to the campus resource pool."
                    : "Share books or materials with the campus community."}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-primary-200">
                  {isAdmin ? (
                    <>
                      <Shield className="w-3 h-3" />
                      <span>Admin Access</span>
                    </>
                  ) : (
                    <>
                      <Star className="w-3 h-3" />
                      <span>Community Contribution</span>
                    </>
                  )}
                </div>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 w-full justify-center border-0"
              >
                <Plus className="w-5 h-5 mr-2" />
                {isAdmin ? "Add Resource" : "Add Book/Material"}
              </Button>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L48 45.8C96 41.7 192 33.3 288 30C384 26.7 480 28.3 576 33.3C672 38.3 768 46.7 864 48.3C960 50 1056 45 1152 40C1248 35 1344 30 1392 27.5L1440 25V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
      </div>

      {/* Why Book Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Why Book{" "}
            <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              With Us?
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Our resource booking system makes it easy to find, reserve, and manage campus resources for all your academic needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyBookItems.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${
                item.color === "primary" ? "from-primary-50/80 to-transparent" :
                item.color === "secondary" ? "from-secondary-50/80 to-transparent" :
                "from-amber-50/80 to-transparent"
              } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className={`absolute top-6 right-6 w-10 h-10 rounded-xl bg-gradient-to-br ${
                item.color === "primary" ? "from-primary-500 to-primary-600" :
                item.color === "secondary" ? "from-secondary-500 to-secondary-600" :
                "from-amber-500 to-amber-600"
              } flex items-center justify-center text-white font-bold text-lg shadow-lg opacity-50 group-hover:opacity-100 transition-opacity`}>
                {i + 1}
              </div>

              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${
                item.color === "primary" ? "from-primary-500 to-primary-600" :
                item.color === "secondary" ? "from-secondary-500 to-secondary-600" :
                "from-amber-500 to-amber-600"
              } flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>

              <div className="relative">
                <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed">
                  {item.desc}
                </p>

                <div className={`h-1 w-16 rounded-full bg-gradient-to-r mt-5 ${
                  item.color === "primary" ? "from-primary-500 to-primary-300" :
                  item.color === "secondary" ? "from-secondary-500 to-secondary-300" :
                  "from-amber-500 to-amber-300"
                } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-primary-500/5 p-5 border border-slate-200/50 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="w-full pl-14 pr-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent dark:border-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-base"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter({ ...filter, type: "" })}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter.type === ""
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                All
              </button>
              {resourceTypes.map(type => {
                const Icon = getTypeIcon(type);
                return (
                  <button
                    key={type}
                    onClick={() => setFilter({ ...filter, type })}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                      filter.type === type
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {filteredResources.length} {filteredResources.length === 1 ? "Resource" : "Resources"} Available
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {filter.search ? `Showing results for "${filter.search}"` : "Browse and book available resources"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Filter</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-5">
              <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-slate-500 animate-pulse text-lg">Loading resources...</p>
            </div>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <LayoutGrid className="w-12 h-12 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {filter.search || filter.type ? "No resources match your search" : "No resources available"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              {filter.search || filter.type
                ? "We couldn't find any resources matching your search. Try different filters."
                : "There are no resources available at the moment. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, idx) => {
              const TypeIcon = getTypeIcon(resource.type);
              const gradient = getTypeGradient(resource.type);
              const resourceCreatorId = resource.createdBy?._id || resource.createdBy;
              const isResourceCreator = !!resourceCreatorId && resourceCreatorId === authUser?._id;
              const hasExistingBooking = bookings.some(
                b => b.resource?._id === resource._id && ["pending", "approved"].includes(b.status)
              );
              return (
                <div
                  key={resource._id}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${idx * 75}ms` }}
                >
                  {/* Top accent bar with gradient */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <TypeIcon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">{resource.name}</h3>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <span className="truncate">{resource.code}</span>
                            {resource.author && (
                              <span className="text-slate-400 truncate">• {resource.author}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge variant={resource.maintenanceMode ? "danger" : "success"} size="sm">
                        {resource.maintenanceMode ? "Maintenance" : "Available"}
                      </Badge>
                    </div>

                    <div className="space-y-3 text-sm mb-5">
                      {resource.location && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          <span className="truncate">{resource.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant={getTypeBadgeVariant(resource.type)} size="sm">
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {resource.type}
                        </Badge>
                        {resource.capacity && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Users className="w-4 h-4 text-secondary-500" />
                            {resource.capacity}
                          </span>
                        )}
                      </div>
                      {resource.type === "book" && resource.isbn && (
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            ISBN: {resource.isbn}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{resource.availableStartTime} - {resource.availableEndTime}</span>
                      </div>
                      {resource.createdBy ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="warning" size="sm">
                            <Users className="w-3 h-3 mr-1" />
                            Community Resource
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant="info" size="sm">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin Resource
                          </Badge>
                        </div>
                      )}
                    </div>

                    {resource.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {resource.amenities.slice(0, 3).map((a, i) => (
                          <Badge key={i} variant="default" size="sm" className="bg-slate-100 dark:bg-slate-800">
                            {a}
                          </Badge>
                        ))}
                        {resource.amenities.length > 3 && (
                          <Badge variant="default" size="sm" className="bg-slate-100 dark:bg-slate-800">
                            +{resource.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        className="w-full group-hover:shadow-lg transition-shadow"
                        variant={resource.maintenanceMode ? "ghost" : "primary"}
                        onClick={() => { setSelectedResource(resource); setShowCalendar(true); }}
                        disabled={resource.maintenanceMode}
                      >
                        {resource.maintenanceMode ? (
                          "Unavailable"
                        ) : isResourceCreator ? (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            Your Resource
                          </>
                        ) : hasExistingBooking ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Already Booked
                          </>
                        ) : (
                          <>
                            Book Now
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Calendar Modal */}
      {showCalendar && selectedResource && (
        <ResourceCalendar resource={selectedResource} onClose={() => { setShowCalendar(false); setSelectedResource(null); }} />
      )}

      {/* Create Resource Modal - Available for ALL users */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title={isAdmin ? "Add New Resource" : "Add Book/Material"} size="lg">
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-4 border border-primary-100 dark:border-primary-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
                {isAdmin ? <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" /> : <Star className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {isAdmin
                    ? "Add a new resource to the campus pool. Fill in the details below."
                    : "Share a book or material with the campus community. Your contribution helps others learn and grow."}
                </p>
              </div>
            </div>
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Resource Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {resourceTypes.map(type => {
                const Icon = getTypeIcon(type);
                const isBookType = bookResourceTypes.includes(type);
                const disabled = !isAdmin && !isBookType;

                return (
                  <button
                    key={type}
                    disabled={disabled}
                    onClick={() => setNewResource({ ...newResource, type })}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                      newResource.type === type
                        ? `border-primary-500 bg-primary-50 dark:bg-primary-900/30`
                        : disabled
                        ? "border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed"
                        : "border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getTypeGradient(type)} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">{type}</span>
                    {disabled && (
                      <div className="absolute -top-1 -right-1">
                        <Crown className="w-4 h-4 text-amber-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {!isAdmin && (
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                <Crown className="w-3 h-3 text-amber-500" />
                Only admins can create facility resources (rooms, halls, labs, equipment, vehicles)
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Resource Name"
              value={newResource.name}
              onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
              placeholder={newResource.type === "book" ? "The Pragmatic Programmer" : "Seminar Hall A"}
            />
            <Input
              label="Code"
              value={newResource.code}
              onChange={(e) => setNewResource({ ...newResource, code: e.target.value })}
              placeholder={newResource.type === "book" ? "BK-001" : "HALL-A"}
            />
          </div>

          {/* Book-specific fields */}
          {newResource.type === "book" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Author"
                value={newResource.author}
                onChange={(e) => setNewResource({ ...newResource, author: e.target.value })}
                placeholder="David Thomas"
              />
              <Input
                label="Publisher"
                value={newResource.publisher}
                onChange={(e) => setNewResource({ ...newResource, publisher: e.target.value })}
                placeholder="Addison-Wesley"
              />
              <Input
                label="ISBN"
                value={newResource.isbn}
                onChange={(e) => setNewResource({ ...newResource, isbn: e.target.value })}
                placeholder="978-0135957059"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={newResource.type === "book" ? "Library/Shelf Location" : "Location"}
              value={newResource.location}
              onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
              placeholder={newResource.type === "book" ? "Main Library, Shelf A-12" : "Block A, 2nd Floor"}
            />
          </div>

          {/* Only show facility-specific fields for admins */}
          {isAdmin && !bookResourceTypes.includes(newResource.type) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Capacity"
                  type="number"
                  value={newResource.capacity}
                  onChange={(e) => setNewResource({ ...newResource, capacity: e.target.value })}
                  placeholder="100"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Requires Approval
                  </label>
                  <select
                    value={newResource.requiresApproval ? "true" : "false"}
                    onChange={(e) => setNewResource({ ...newResource, requiresApproval: e.target.value === "true" })}
                    className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="false">No - Auto approve</option>
                    <option value="true">Yes - Manual approval</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Available From"
                  type="time"
                  value={newResource.availableStartTime}
                  onChange={(e) => setNewResource({ ...newResource, availableStartTime: e.target.value })}
                />
                <Input
                  label="Available Until"
                  type="time"
                  value={newResource.availableEndTime}
                  onChange={(e) => setNewResource({ ...newResource, availableEndTime: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Amenities */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Amenities / Features
            </label>
            <div className="flex gap-2">
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g., WiFi, Projector, AC"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAmenity())}
              />
              <Button variant="outline" onClick={handleAddAmenity}>Add</Button>
            </div>
            {newResource.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newResource.amenities.map((a, i) => (
                  <Badge key={i} variant="default" size="sm" className="pr-2 pl-3 flex items-center gap-1 bg-slate-100 dark:bg-slate-800">
                    {a}
                    <button onClick={() => handleRemoveAmenity(a)} className="hover:text-danger-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button
              onClick={handleCreateResource}
              isLoading={isCreating}
              disabled={!newResource.name || !newResource.code}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create {newResource.type === "book" ? "Book" : "Resource"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResourceBookingPage;
