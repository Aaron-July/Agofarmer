import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  Briefcase, Wrench, Users, MapPin, DollarSign,
  Navigation, Loader2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import { MOCK_JOBS, MOCK_TOOLS, MOCK_WORKERS } from "../utils/mockData";

// Fix for default markers
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const createIcon = (color: string) => new L.DivIcon({
  className: "custom-marker",
  html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const jobIcon = createIcon("#10b981");
const toolIcon = createIcon("#f59e0b");
const workerIcon = createIcon("#3b82f6");

function LocationMarker({ position }: { position: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);

  return position ? (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}

export const Map = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");
  const [items, setItems] = useState({ jobs: [], tools: [], workers: [] });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.9, -91.6]); // Default to Iowa region for mock data

  useEffect(() => {
    // Simulate API Load
    setTimeout(() => {
        setItems({
            jobs: MOCK_JOBS.filter(j => j.latitude && j.longitude) as any,
            tools: MOCK_TOOLS.filter(t => t.latitude && t.longitude) as any,
            workers: MOCK_WORKERS.filter(w => w.latitude && w.longitude) as any
        });
        setLoading(false);
    }, 500);

    // Get real location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.log("Location error:", error)
      );
    }
  }, []);

  const getMarkers = () => {
    switch (activeTab) {
      case "jobs":
        return items.jobs.map((job: any) => (
          <Marker
            key={job.id}
            position={[job.latitude, job.longitude]}
            icon={jobIcon}
            eventHandlers={{
              click: () => setSelectedItem({ type: "job", data: job })
            }}
          >
          </Marker>
        ));
      case "tools":
        return items.tools.map((tool: any) => (
          <Marker
            key={tool.id}
            position={[tool.latitude, tool.longitude]}
            icon={toolIcon}
            eventHandlers={{
              click: () => setSelectedItem({ type: "tool", data: tool })
            }}
          >
          </Marker>
        ));
      case "workers":
        return items.workers.map((worker: any) => (
          <Marker
            key={worker.id}
            position={[worker.latitude, worker.longitude]}
            icon={workerIcon}
            eventHandlers={{
              click: () => setSelectedItem({ type: "worker", data: worker })
            }}
          >
          </Marker>
        ));
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-white/95 backdrop-blur-lg p-1.5 rounded-xl shadow-md border border-gray-200 flex">
            {['jobs', 'tools', 'workers'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    {tab === 'jobs' && <Briefcase className="w-4 h-4 text-emerald-600" />}
                    {tab === 'tools' && <Wrench className="w-4 h-4 text-amber-600" />}
                    {tab === 'workers' && <Users className="w-4 h-4 text-blue-600" />}
                    <span className="capitalize hidden sm:inline">{tab}</span>
                    <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {items[tab as keyof typeof items].length}
                    </span>
                </button>
            ))}
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && <LocationMarker position={userLocation} />}
        {getMarkers()}
      </MapContainer>

      {/* Selected Item Card */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-4 left-4 right-4 z-[1000]"
          >
            <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-gray-200 max-w-lg mx-auto">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedItem.type === "job" ? "bg-emerald-100" :
                  selectedItem.type === "tool" ? "bg-amber-100" : "bg-blue-100"
                }`}>
                  {selectedItem.type === "job" && <Briefcase className="w-6 h-6 text-emerald-600" />}
                  {selectedItem.type === "tool" && <Wrench className="w-6 h-6 text-amber-600" />}
                  {selectedItem.type === "worker" && <Users className="w-6 h-6 text-blue-600" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {selectedItem.type === "job" && selectedItem.data.title}
                    {selectedItem.type === "tool" && selectedItem.data.name}
                    {selectedItem.type === "worker" && selectedItem.data.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">
                      {selectedItem.data.location || "Location available"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-lg font-semibold text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                    {selectedItem.type === "job" && `${selectedItem.data.pay_rate || selectedItem.data.budget}`}
                    {selectedItem.type === "tool" && `${selectedItem.data.pricePerDay}/day`}
                    {selectedItem.type === "worker" && `${selectedItem.data.hourlyRate}/hr`}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <Link 
                to={
                  selectedItem.type === "job" ? `/jobs/${selectedItem.data.id}` :
                  selectedItem.type === "tool" ? `/tools/${selectedItem.data.id}` :
                  `/worker-profile/${selectedItem.data.id}`
                }
                className="block w-full mt-4 bg-emerald-600 text-white text-center py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}