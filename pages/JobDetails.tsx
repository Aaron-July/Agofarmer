import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { StatusBadge } from "../components/ui/StatusBadge";
import { RatingStars } from "../components/ui/RatingStars";
import { Card } from "../components/ui/Card";
import {
  ArrowLeft, MapPin, Calendar, DollarSign, Clock, Users,
  MessageSquare, Phone, Loader2
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MOCK_JOBS } from "../utils/mockData";
import { base44 } from "../services/base44";

export const JobDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const loadJob = async () => {
        try {
            // Try fetch from service first
            const foundJobs = await base44.entities.Job.filter({ id });
            if (foundJobs.length > 0) {
                setJob(foundJobs[0]);
            } else {
                 // Fallback to mock data directly if not found via service
                 const foundJob = MOCK_JOBS.find(j => j.id === id);
                 if (foundJob) setJob(foundJob);
            }
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!job) return <div>Job not found</div>;

  // Normalize poster data
  const posterName = job.postedBy?.name || job.farmer_name || "Unknown Farmer";
  const posterAvatar = job.postedBy?.avatar || job.farmer_photo;
  const posterRating = job.postedBy?.rating || 0;
  const posterId = job.postedBy?.id || job.farmer_id;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
           <StatusBadge status={job.status} />
        </div>
      </div>

      {/* Job Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center text-3xl flex-shrink-0">
              🌿
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-gray-500 capitalize mt-1">{job.job_type || 'General'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center p-3 bg-emerald-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">${job.pay_rate || job.budget}</p>
              <p className="text-xs text-gray-500">{job.pay_type ? `per ${job.pay_type}` : 'Fixed'}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{job.duration_days || 1}</p>
              <p className="text-xs text-gray-500">day(s)</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-sm font-bold text-gray-900">
                {job.start_date ? format(new Date(job.start_date), "MMM d") : "ASAP"}
              </p>
              <p className="text-xs text-gray-500">start date</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <Users className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{job.workers_count_needed || 1}</p>
              <p className="text-xs text-gray-500">worker(s)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-gray-600">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>{job.location || job.location_name}</span>
          </div>
        </Card>
      </motion.div>

      {/* Description */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6">
          <h2 className="font-semibold mb-3">Description</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
        </Card>
      </motion.div>

      {/* Tags */}
      {(job.tags || job.required_skills) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
                <h2 className="font-semibold mb-3">Requirements</h2>
                <div className="flex flex-wrap gap-2">
                    {(job.tags || job.required_skills).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </Card>
        </motion.div>
      )}

      {/* Posted By */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Posted by</h2>
          <div className="flex items-center gap-4">
            {posterAvatar ? (
                 <img 
                    src={posterAvatar} 
                    alt={posterName}
                    className="w-14 h-14 rounded-full bg-gray-200"
                />
            ) : (
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
                    {posterName[0]}
                </div>
            )}
           
            <div className="flex-1">
              <p className="font-medium">{posterName}</p>
              {posterRating > 0 && <RatingStars rating={posterRating} />}
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 hover:bg-gray-50 rounded-full transition-colors">
                <Phone className="w-4 h-4 text-gray-600" />
              </button>
              {posterId && (
                <Link to={`/chat?userId=${posterId}`} className="p-2 border border-gray-200 hover:bg-gray-50 rounded-full transition-colors">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                </Link>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="sticky bottom-6">
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors">
              Apply Now
          </button>
      </div>
    </div>
  );
}