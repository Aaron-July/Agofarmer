import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { JobCard } from "../components/cards/JobCard";
import { 
  Clock, CheckCircle, Calendar, Loader2 
} from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_JOBS } from "../utils/mockData";

export const MyJobs = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [jobs, setJobs] = useState({
    active: [],
    pending: [],
    completed: []
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
        // Mock categorization
        setJobs({
            active: MOCK_JOBS.slice(0, 1),
            pending: MOCK_JOBS.slice(1, 2),
            completed: MOCK_JOBS.slice(2, 3)
        });
        setLoading(false);
    }, 600);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
        <p className="text-gray-500 text-sm">
          Manage your job history and status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{jobs.active.length}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{jobs.pending.length}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{jobs.completed.length}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            {['active', 'pending', 'completed'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                        activeTab === tab 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {tab} ({jobs[tab as keyof typeof jobs].length})
                </button>
            ))}
        </div>

        <div className="space-y-4">
            {jobs[activeTab as keyof typeof jobs].length > 0 ? (
                // @ts-ignore
                jobs[activeTab as keyof typeof jobs].map((job: any, index: number) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <JobCard job={job} />
                    </motion.div>
                ))
            ) : (
                <div className="p-12 text-center bg-white border border-gray-100 rounded-xl">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs in this category</h3>
                    <p className="text-gray-500">
                        {activeTab === 'active' ? "You have no active jobs at the moment." : 
                         activeTab === 'pending' ? "No pending applications or requests." : 
                         "You haven't completed any jobs yet."}
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}