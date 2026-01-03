import React, { useState, useEffect } from "react";
import { base44 } from "../services/base44";
import { Input, Badge, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Primitives";
import { Card } from "../components/ui/Card";
import { WorkerCard } from "../components/cards/WorkerCard";
import { Search, Users, SlidersHorizontal, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SKILLS = [
  "Planting", "Harvesting", "Tractor Operation", "Irrigation",
  "Livestock Care", "Crop Spraying", "Land Clearing", "Fertilizing",
  "Equipment Maintenance", "Transport", "Organic Farming", "Drone Operation"
];

export const Workers = () => {
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState<any[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterWorkers();
  }, [workers, searchTerm, selectedSkill, availability]);

  const loadData = async () => {
    try {
      const allWorkers = await base44.entities.UserProfile.filter(
        { user_type: "worker" }
      );
      setWorkers(allWorkers);
    } catch (error) {
      console.error("Error loading workers:", error);
    }
    setLoading(false);
  };

  const filterWorkers = () => {
    let filtered = [...workers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(worker =>
        worker.full_name?.toLowerCase().includes(term) ||
        worker.location_name?.toLowerCase().includes(term) ||
        worker.bio?.toLowerCase().includes(term)
      );
    }

    if (selectedSkill !== "all") {
      filtered = filtered.filter(worker =>
        worker.skills?.includes(selectedSkill)
      );
    }

    if (availability !== "all") {
      filtered = filtered.filter(worker => worker.availability === availability);
    }

    setFilteredWorkers(filtered);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Workers</h1>
        <p className="text-gray-500 text-sm">{filteredWorkers.length} workers available</p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search workers..."
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
                <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="h-10 rounded-md border border-gray-200 px-3 bg-white shadow-sm">
                    <option value="all">All Skills</option>
                    {SKILLS.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                </select>

                <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="h-10 rounded-md border border-gray-200 px-3 bg-white shadow-sm">
                    <option value="all">Availability</option>
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                </select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skill Tags */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {SKILLS.slice(0, 8).map((skill) => (
            <Badge
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? "all" : skill)}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 shadow-sm ${
                selectedSkill === skill
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Workers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map((worker, index) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <WorkerCard worker={worker} />
            </motion.div>
          ))
        ) : (
          <Card className="col-span-full p-12 text-center bg-white/50">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedSkill !== "all"
                ? "Try adjusting your filters"
                : "No workers have registered yet"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}