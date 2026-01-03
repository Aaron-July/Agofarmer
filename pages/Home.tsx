import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { JobCard } from "../components/cards/JobCard";
import { ToolCard } from "../components/cards/ToolCard";
import { WorkerCard } from "../components/cards/WorkerCard";
import {
  Plus, Briefcase, Wrench, Users, MapPin, Wallet,
  TrendingUp, Calendar, ChevronRight, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../components/LanguageContext";
import { MOCK_JOBS, MOCK_TOOLS, MOCK_WORKERS, MOCK_USERS } from "../utils/mockData";

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentTools, setRecentTools] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    activeTools: 0,
    earnings: 0
  });
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Simulate API call
    setTimeout(() => {
        // Use first mock user as current user
        const userProfile = MOCK_USERS[0];
        setProfile(userProfile);

        setRecentJobs(MOCK_JOBS);
        setRecentTools(MOCK_TOOLS);
        setWorkers(MOCK_WORKERS);

        setStats({
          totalJobs: MOCK_JOBS.length,
          completedJobs: MOCK_JOBS.filter(j => j.status === 'COMPLETED').length,
          activeTools: MOCK_TOOLS.length,
          earnings: userProfile.wallet_balance || 0
        });
        setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const quickActions = [
      { icon: Plus, label: "Post Job", page: "/post-job", color: "from-emerald-500 to-emerald-600" },
      { icon: Users, label: "Find Workers", page: "/workers", color: "from-blue-500 to-blue-600" },
      { icon: Wrench, label: "Rent Tools", page: "/tools", color: "from-amber-500 to-amber-600" },
      { icon: MapPin, label: "View Map", page: "/map", color: "from-purple-500 to-purple-600" }
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your farm jobs and hire workers
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-brand-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalJobs}</h3>
                <p className="text-sm text-gray-500 font-medium">Total Jobs</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-blue-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.completedJobs}</h3>
                <p className="text-sm text-gray-500 font-medium">Completed</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="bg-amber-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900">${stats.earnings.toFixed(2)}</h3>
                <p className="text-sm text-gray-500 font-medium">Balance</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-purple-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.activeTools}</h3>
                <p className="text-sm text-gray-500 font-medium">Tools</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={action.page} to={action.page} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-700 text-sm">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Jobs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Jobs</h2>
            <Link to="/jobs" className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        <div className="space-y-4">
          {recentJobs.length > 0 ? (
            recentJobs.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
             <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No jobs posted yet.</p>
             </div>
          )}
        </div>
      </motion.div>

      {/* Available Workers */}
      {workers.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Available Workers</h2>
              <Link to="/workers" className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          <div className="space-y-3">
            {workers.slice(0, 3).map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Available Tools */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Equipment for Rent</h2>
            <Link to="/tools" className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentTools.length > 0 ? (
            recentTools.slice(0, 2).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))
          ) : (
            <div className="col-span-2 p-8 text-center bg-gray-50 rounded-xl">
                <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No equipment available.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}