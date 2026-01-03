import React, { useState, useEffect } from "react";
import { base44 } from "../services/base44";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/helpers";
import { Button, Badge, Avatar, AvatarFallback, AvatarImage } from "../components/ui/Primitives";
import { Card } from "../components/ui/Card";
import { RatingStars } from "../components/ui/RatingStars";
import {
  ArrowLeft, MapPin, DollarSign, Briefcase,
  MessageSquare, Phone, CheckCircle, Loader2
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export const WorkerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const workerId = urlParams.get("id");

      const workerData = await base44.entities.UserProfile.filter({ id: workerId });
      if (workerData.length > 0) {
        setWorker(workerData[0]);

        const workerReviews = await base44.entities.Review.filter({ reviewed_user_id: workerId });
        setReviews(workerReviews);

        const jobs = await base44.entities.Job.filter({ assigned_worker_id: workerId, status: "completed" });
        setCompletedJobs(jobs);
      }
    } catch (error) {
      console.error("Error loading worker:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="px-4 py-6 text-center">
        <p>Worker not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Worker Profile</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={worker.photo_url} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                  {worker.full_name?.[0]}
                </AvatarFallback>
              </Avatar>
              {worker.id_verified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{worker.full_name}</h2>
                {worker.id_verified && (
                  <Badge className="bg-blue-100 text-blue-700">Verified</Badge>
                )}
              </div>

              {worker.rating > 0 && (
                <div className="mt-2">
                  <RatingStars rating={worker.rating} size={16} />
                  <span className="text-sm text-gray-500 ml-2">({worker.total_reviews || 0} reviews)</span>
                </div>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                {worker.location_name && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{worker.location_name}</span>
                  </div>
                )}
                {worker.hourly_rate && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>${worker.hourly_rate}/hr</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-600">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span>{worker.jobs_completed || 0} jobs completed</span>
                </div>
              </div>

              <Badge className={`mt-4 capitalize ${
                worker.availability === "available"
                  ? "bg-green-100 text-green-700"
                  : worker.availability === "busy"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {worker.availability || "Available"}
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {worker.bio && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-gray-600">{worker.bio}</p>
          </Card>
        </motion.div>
      )}

      {worker.skills?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill: string, i: number) => (
                <Badge key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4">Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.reviewer_photo} />
                      <AvatarFallback>{review.reviewer_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.reviewer_name}</span>
                        <RatingStars rating={review.rating} size={14} className="" />
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(review.created_date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Contact Buttons */}
      <div className="fixed bottom-20 md:bottom-6 left-0 right-0 md:left-64 p-4 bg-white/95 backdrop-blur-lg border-t">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button variant="outline" className="flex-1 h-12">
            <Phone className="w-5 h-5 mr-2" />
            Call
          </Button>
          <Link to={createPageUrl(`Chat?userId=${worker.id}`)} className="flex-1">
            <Button className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600">
              <MessageSquare className="w-5 h-5 mr-2" />
              Message
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}