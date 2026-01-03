import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils/helpers";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Primitives";
import { RatingStars } from "../ui/RatingStars";
import { MapPin, DollarSign, Briefcase, CheckCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const WorkerCard = ({ worker }: any) => {
  return (
    <Link to={createPageUrl(`WorkerProfile?id=${worker.id}`)} className="block">
        <Card className="p-4 shadow hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white group">
          <div className="flex gap-4">
            <div className="relative flex-shrink-0">
              {worker.photo_url || worker.avatar ? (
                <img 
                  src={worker.photo_url || worker.avatar} 
                  alt={worker.full_name || worker.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                  {(worker.full_name || worker.name)?.[0] || "W"}
                </div>
              )}
              {worker.id_verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {worker.full_name || worker.name}
                  </h3>
                  {worker.rating > 0 && (
                    <RatingStars rating={worker.rating} size={14} />
                  )}
                </div>
                <Badge className={`capitalize ${
                  worker.availability === "available" || worker.available
                    ? "bg-green-100 text-green-700" 
                    : worker.availability === "busy"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {worker.availability || (worker.available ? "available" : "unavailable")}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                {(worker.location_name || worker.location) && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="truncate max-w-[100px]">{worker.location_name || worker.location}</span>
                  </div>
                )}
                {(worker.hourly_rate || worker.hourlyRate) && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>${worker.hourly_rate || worker.hourlyRate}/hr</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{worker.jobs_completed || worker.jobsCompleted || 0} jobs</span>
                </div>
              </div>

              {worker.skills?.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {worker.skills.slice(0, 3).map((skill: string, i: number) => (
                    <Badge key={i} className="text-xs bg-emerald-50 text-emerald-700 border-0 font-medium px-2 py-0.5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
          </div>
        </Card>
    </Link>
  );
}