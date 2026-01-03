import React, { useState, useEffect } from "react";
import { 
  Users, Briefcase, Wrench, DollarSign, TrendingUp,
  CheckCircle, XCircle, Search, Loader2, AlertTriangle,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MOCK_JOBS, MOCK_TOOLS, MOCK_USERS, MOCK_WALLET_DATA } from '../utils/mockData';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';

export const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    completedJobs: 0,
    totalTools: 0,
    activeRentals: 0,
    totalRevenue: 0
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setStats({
            totalUsers: MOCK_USERS.length,
            totalJobs: MOCK_JOBS.length,
            completedJobs: MOCK_JOBS.filter(j => j.status === 'COMPLETED').length,
            totalTools: MOCK_TOOLS.length,
            activeRentals: 12,
            totalRevenue: 15420
        });
        setLoading(false);
    }, 800);
  };

  const filteredUsers = MOCK_USERS.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage AgroFarmer platform</p>
        </div>
        <button onClick={loadData} className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
            { label: 'Users', val: stats.totalUsers, icon: Users, color: 'blue' },
            { label: 'Jobs', val: stats.totalJobs, icon: Briefcase, color: 'emerald' },
            { label: 'Completed', val: stats.completedJobs, icon: CheckCircle, color: 'green' },
            { label: 'Equipment', val: stats.totalTools, icon: Wrench, color: 'amber' },
            { label: 'Rentals', val: stats.activeRentals, icon: TrendingUp, color: 'purple' },
            { label: 'Revenue', val: `$${stats.totalRevenue}`, icon: DollarSign, color: 'emerald' },
        ].map((stat, i) => (
             <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className={`p-4 rounded-xl bg-${stat.color}-50 border border-${stat.color}-100`}>
                    <div className="flex items-center gap-3">
                        <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                            <p className="text-xs text-gray-600">{stat.label}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-2">
         {['dashboard', 'users', 'jobs'].map(tab => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
             >
                 {tab}
             </button>
         ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 border-t-0 p-6">
        
        {activeTab === 'dashboard' && (
           <div className="grid md:grid-cols-2 gap-6">
             <div>
                <h3 className="font-bold text-gray-900 mb-4">Recent Users</h3>
                <div className="space-y-3">
                    {MOCK_USERS.slice(0, 5).map(user => (
                        <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                            <img src={user.photo_url} alt="" className="w-10 h-10 rounded-full bg-gray-200" />
                            <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">{user.full_name}</p>
                                <p className="text-xs text-gray-500">{user.user_type}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                user.account_status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>{user.account_status}</span>
                        </div>
                    ))}
                </div>
             </div>
             <div>
                <h3 className="font-bold text-gray-900 mb-4">Recent Jobs</h3>
                <div className="space-y-3">
                    {MOCK_JOBS.slice(0, 5).map(job => (
                        <div key={job.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900 line-clamp-1">{job.title}</p>
                                <p className="text-xs text-gray-500">{job.postedBy.name}</p>
                            </div>
                            <StatusBadge status={job.status} />
                        </div>
                    ))}
                </div>
             </div>
           </div>
        )}

        {activeTab === 'users' && (
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" 
                    />
                </div>
                <div className="space-y-2">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-brand-200 transition">
                             <div className="flex items-center gap-4">
                                <img src={user.photo_url} className="w-12 h-12 rounded-full" alt="" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-gray-900">{user.full_name}</h4>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{user.user_type}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{user.user_email}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                 {user.account_status === 'pending' && (
                                     <>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Suspend"><XCircle className="w-5 h-5" /></button>
                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Approve"><CheckCircle className="w-5 h-5" /></button>
                                     </>
                                 )}
                                 <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                                     user.account_status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                 }`}>
                                     {user.account_status}
                                 </span>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'jobs' && (
             <div className="space-y-4">
                {MOCK_JOBS.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">{job.title}</h4>
                            <p className="text-sm text-gray-500">Posted by {job.postedBy.name} • ${job.budget}</p>
                        </div>
                        <StatusBadge status={job.status} />
                    </div>
                ))}
             </div>
        )}

      </div>
    </div>
  );
}