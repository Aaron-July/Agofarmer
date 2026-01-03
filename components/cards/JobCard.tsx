import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils/helpers";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Primitives";
import { StatusBadge } from "../ui/StatusBadge";
import { 
  MapPin, Calendar, DollarSign, ChevronRight, 
  Sprout, Droplet, Axe, Tractor, Truck, Wrench, Briefcase,
  Wheat
} from 'lucide-react';
import { format } from "date-fns";
import { motion } from "framer-motion";

const getJobIcon = (type: string) => {
  const t = (type || '').toLowerCase();
  if (t.includes('harvest')) return { icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-100' };
  if (t.includes('plant')) return { icon: Sprout, color: 'text-green-600', bg: 'bg-green-100' };
  if (t.includes('water') || t.includes('irrigat')) return { icon: Droplet, color: 'text-blue-600', bg: 'bg-blue-100' };
  if (t.includes('clear')) return { icon: Axe, color: 'text-red-600', bg: 'bg-red-100' };
  if (t.includes('livestock')) return { icon: Tractor, color: 'text-slate-600', bg: 'bg-slate-100' };
  if (t.includes('transport')) return { icon: Truck, color: 'text-orange-600', bg: 'bg-orange-100' };
  return { icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-100' };
};

export const JobCard = ({ job }: any) => {
  const { icon: Icon, color, bg } = getJobIcon(job.job_type || job.title);
  
  // Format Date
  const dateStr = job.start_date 
    ? format(new Date(job.start_date), 'MMM d') 
    : (job.createdAt ? format(new Date(job.createdAt), 'MMM d') : '');

  // Format Price
  const priceStr = job.pay_rate 
    ? `$${job.pay_rate}/${job.pay_type === 'hour' ? 'hr' : 'day'}`
    : `$${job.budget}`;

  return (
    <Link to={`/jobs/${job.id}`} className="block">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow hover:shadow-lg transition-shadow cursor-pointer flex flex-col sm:flex-row gap-5 items-start">
        {/* Icon */}
        <div className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center flex-shrink-0 shadow-inner`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{job.title}</h3>
                    <p className="text-gray-500 text-sm mb-3">{job.postedBy?.name || job.farmer_name}</p>
                </div>
                {/* Mobile Status Badge */}
                <div className="sm:hidden">
                    <StatusBadge status={job.status} />
                </div>
            </div>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium text-gray-900">{priceStr}</span>
                </div>
                {dateStr && (
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>{dateStr}</span>
                    </div>
                )}
            </div>

            {/* Tags */}
            {job.tags && (
                <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden sm:flex flex-col items-end gap-8 pl-4">
            <StatusBadge status={job.status} />
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Link>
  );
};