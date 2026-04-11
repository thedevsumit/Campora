import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useResourceStore } from "../store/useResourceStore";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import StatCard from "../components/ui/StatCard";
import ResourceCalendar from "../components/ResourceCalendar";
import { Search, Plus, MapPin, Clock, DollarSign, Users, Wrench, Car, Microscope, LayoutGrid, Sparkles, ArrowRight } from "lucide-react";

const ResourceBookingPage = () => {
  const { resources, bookings, isLoading, fetchResources, fetchBookings, createResource } = useResourceStore();
  const [selectedResource, setSelectedResource] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filter, setFilter] = useState({ type: "", search: "" });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newResource, setNewResource] = useState({ name: "", type: "room", code: "", location: "", capacity: "", hourlyRate: 0 });

  useEffect(() => {
    fetchResources();
    fetchBookings();
  }, [fetchResources, fetchBookings]);

  const filteredResources = resources.filter(r => {
    if (filter.type && r.type !== filter.type) return false;
    if (filter.search && !r.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    const data = bookings.map(b => ({
      Resource: b.resource?.name,
      Date: b.slots?.[0]?.date,
      Time: `${b.slots?.[0]?.startTime} - ${b.slots?.[0]?.endTime}`,
      Status: b.status,
      Cost: b.totalCost
    }));
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => Object.values(row).map(v => `"${v ?? ""}"`).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
  };

  const handleCreateResource = async () => {
    try {
      await createResource(newResource);
      setShowCreateModal(false);
      setNewResource({ name: "", type: "room", code: "", location: "", capacity: "", hourlyRate: 0 });
    } catch (error) {}
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "room": return LayoutGrid;
      case "hall": return LayoutGrid;
      case "lab": return Microscope;
      case "equipment": return Microscope;
      case "vehicle": return Car;
      default: return Wrench;
    }
  };

  const resourceTypes = ["room", "hall", "lab", "equipment", "vehicle", "other"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-200" />
                <span className="text-primary-200 font-medium">Campus Resources</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 animate-fade-in-up">
                Resource <span className="bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">Booking</span>
              </h1>
              <p className="text-primary-100 text-lg animate-fade-in-up stagger-1">Browse and book campus resources easily</p>
            </div>
            <div className="flex items-center gap-3 animate-fade-in-up stagger-2">
              <Button variant="outline" className="border-white/50 text-white hover:bg-white/20" onClick={handleExport}>
                Export CSV
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 30 720 35C840 40 960 50 1080 55C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-slate-50 dark:fill-slate-950" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard title="Total Resources" value={resources.length} icon={LayoutGrid} className="animate-fade-in-up stagger-1" />
          <StatCard title="Available" value={resources.filter(r => !r.maintenanceMode).length} icon={Clock} className="animate-fade-in-up stagger-2" />
          <StatCard title="My Bookings" value={bookings.length} icon={DollarSign} className="animate-fade-in-up stagger-3" />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-primary-500/5 p-4 border border-slate-100 dark:border-slate-800 animate-fade-in-up">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                icon={Search}
                placeholder="Search resources..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant={filter.type === "" ? "primary" : "outline"} size="sm" onClick={() => setFilter({ ...filter, type: "" })}>All</Button>
              {resourceTypes.map(type => (
                <Button key={type} variant={filter.type === type ? "primary" : "outline"} size="sm" onClick={() => setFilter({ ...filter, type })}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {filteredResources.map((resource, idx) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div
                key={resource._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-3.5 rounded-2xl ${resource.maintenanceMode ? "bg-danger-500/10" : "bg-gradient-to-br from-primary-500 to-primary-600"} shadow-lg`}>
                        <TypeIcon className={`w-6 h-6 ${resource.maintenanceMode ? "text-danger-500" : "text-white"}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{resource.name}</h3>
                        <p className="text-sm text-slate-500">{resource.code}</p>
                      </div>
                    </div>
                    <Badge variant={resource.maintenanceMode ? "danger" : "success"} size="sm">
                      {resource.maintenanceMode ? "Maintenance" : "Available"}
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    {resource.location && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        {resource.location}
                      </div>
                    )}
                    <Badge variant="primary" size="sm">{resource.type}</Badge>
                    {resource.capacity && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4 text-secondary-500" />
                        Capacity: {resource.capacity}
                      </div>
                    )}
                    {resource.hourlyRate > 0 && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <DollarSign className="w-4 h-4 text-accent-500" />
                        ₹{resource.hourlyRate}/hr
                      </div>
                    )}
                  </div>

                  {resource.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {resource.amenities.slice(0, 3).map((a, i) => (
                        <Badge key={i} variant="default" size="sm">{a}</Badge>
                      ))}
                      {resource.amenities.length > 3 && <Badge variant="default" size="sm">+{resource.amenities.length - 3}</Badge>}
                    </div>
                  )}

                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      className="w-full"
                      variant={resource.maintenanceMode ? "ghost" : "primary"}
                      onClick={() => { setSelectedResource(resource); setShowCalendar(true); }}
                      disabled={resource.maintenanceMode}
                    >
                      {resource.maintenanceMode ? "Unavailable" : "Book Now"}
                      {!resource.maintenanceMode && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && !isLoading && (
          <div className="text-center py-16 animate-fade-in">
            <Search className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No resources found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Calendar Modal */}
      {showCalendar && selectedResource && (
        <ResourceCalendar resource={selectedResource} onClose={() => { setShowCalendar(false); setSelectedResource(null); }} />
      )}

      {/* Create Resource Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Resource" size="md">
        <div className="space-y-5">
          <Input label="Name" value={newResource.name} onChange={(e) => setNewResource({ ...newResource, name: e.target.value })} placeholder="Seminar Hall A" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Type</label>
              <select
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                className="w-full px-4 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              >
                {resourceTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <Input label="Code" value={newResource.code} onChange={(e) => setNewResource({ ...newResource, code: e.target.value })} placeholder="HALL-A" />
          </div>
          <Input label="Location" value={newResource.location} onChange={(e) => setNewResource({ ...newResource, location: e.target.value })} placeholder="Block A, 2nd Floor" />
          <Input label="Capacity" type="number" value={newResource.capacity} onChange={(e) => setNewResource({ ...newResource, capacity: e.target.value })} placeholder="100" />
          <Input label="Hourly Rate (₹)" type="number" value={newResource.hourlyRate} onChange={(e) => setNewResource({ ...newResource, hourlyRate: e.target.value })} placeholder="0" />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreateResource}>Create Resource</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResourceBookingPage;
