import React, { useState, useEffect } from "react";
import { base44 } from "../services/base44";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/helpers";
import { Button, Input, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Primitives";
import { Card } from "../components/ui/Card";
import { ToolCard } from "../components/cards/ToolCard";
import { 
  Search, Plus, Wrench, SlidersHorizontal, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../components/LanguageContext";

const TOOL_CATEGORIES = [
  { value: "all", label: "All Equipment" },
  { value: "tractor", label: "🚜 Tractors" },
  { value: "harvester", label: "🌾 Harvesters" },
  { value: "water_pump", label: "💧 Water Pumps" },
  { value: "truck", label: "🚚 Trucks" },
  { value: "drone", label: "🛸 Drones" },
  { value: "sprayer", label: "🌿 Sprayers" },
  { value: "plow", label: "⚙️ Plows" },
  { value: "seeder", label: "🌱 Seeders" },
  { value: "other", label: "🔧 Other" }
];

export const Tools = () => {
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<any[]>([]);
  const [filteredTools, setFilteredTools] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTools();
  }, [tools, searchTerm, category, availability]);

  const loadData = async () => {
    try {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }

      const allTools = await base44.entities.Tool.list();
      setTools(allTools);
    } catch (error) {
      console.error("Error loading tools:", error);
    }
    setLoading(false);
  };

  const filterTools = () => {
    let filtered = [...tools];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name?.toLowerCase().includes(term) ||
        tool.description?.toLowerCase().includes(term) ||
        tool.location_name?.toLowerCase().includes(term)
      );
    }

    if (category !== "all") {
      filtered = filtered.filter(tool => tool.category === category);
    }

    if (availability !== "all") {
      filtered = filtered.filter(tool => tool.availability_status === availability);
    }

    setFilteredTools(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment Rental</h1>
          <p className="text-gray-500 text-sm">{filteredTools.length} items available</p>
        </div>
        {profile?.user_type === "tool_owner" && (
          <Link to={createPageUrl("AddTool")}>
            <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </Link>
        )}
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white shadow-sm border-gray-200"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-12 shadow-sm ${showFilters ? "bg-emerald-50 border-emerald-300" : ""}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-3"
            >
              {/* Using native selects for simplicity in this fix */}
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-md border border-gray-200 px-3 bg-white shadow-sm">
                  <option value="all">Category</option>
                  {TOOL_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
              </select>

              <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="h-10 rounded-md border border-gray-200 px-3 bg-white shadow-sm">
                  <option value="all">Availability</option>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {TOOL_CATEGORIES.slice(1).map((cat) => (
            <Badge
              key={cat.value}
              onClick={() => setCategory(category === cat.value ? "all" : cat.value)}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 shadow-sm ${
                category === cat.value
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))
        ) : (
          <Card className="col-span-full p-12 text-center bg-white/50">
            <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || category !== "all" 
                ? "Try adjusting your filters"
                : "Be the first to list equipment!"}
            </p>
            {profile?.user_type === "tool_owner" && (
              <Link to={createPageUrl("AddTool")}>
                <Button className="bg-emerald-500 hover:bg-emerald-600 shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Equipment
                </Button>
              </Link>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}