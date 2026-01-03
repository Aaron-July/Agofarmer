import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { JobCard } from "../components/cards/JobCard";
import { 
  Search, Plus, SlidersHorizontal, Loader2, Briefcase,
  Sprout, Wheat, Axe, Droplet, Truck, Wrench, Tractor
} from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_JOBS } from "../utils/mockData";

const JOB_TYPES = [
  { value: "planting", label: "Planting", icon: Sprout },
  { value: "harvesting", label: "Harvesting", icon: Wheat },
  { value: "clearing", label: "Clearing", icon: Axe },
  { value: "irrigation", label: "Irrigation", icon: Droplet },
  { value: "livestock", label: "Livestock", icon: Tractor },
  { value: "transport", label: "Transport", icon: Truck },
  { value: "other", label: "Other", icon: Wrench }
];

export const Jobs = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, jobType]);

  const loadData = async () => {
    setTimeout(() => {
      setJobs(MOCK_JOBS);
      setLoading(false);
    }, 500);
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term) ||
        job.location?.toLowerCase().includes(term)
      );
    }

    if (jobType !== "all") {
      filtered = filtered.filter(job => job.job_type === jobType);
    }

    setFilteredJobs(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Jobs</h1>
          <p className="text-gray-500 font-medium mt-1">{filteredJobs.length} jobs available</p>
        </div>
        <Link to="/post-job" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold transition shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          Post Job
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm transition-all"
            />
          </div>
          <button
            className="h-12 w-12 flex items-center justify-center border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {JOB_TYPES.map(type => (
                <button
                key={type.value}
                onClick={() => setJobType(jobType === type.value ? 'all' : type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
                    jobType === type.value 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                }`}
                >
                    <type.icon className={`w-4 h-4 ${jobType === type.value ? 'text-white' : 'text-gray-500'}`} />
                    {type.label}
                </button>
            ))}
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <JobCard job={job} />
            </motion.div>
          ))
        ) : (
          <div className="py-16 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
            <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              We couldn't find any jobs matching your search criteria. Try adjusting your filters.
            </p>
            <button 
                onClick={() => {setSearchTerm(''); setJobType('all');}}
                className="text-emerald-600 font-bold hover:underline"
            >
                Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};