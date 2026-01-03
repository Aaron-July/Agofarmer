import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils/helpers";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Primitives";
import { StatusBadge } from "../ui/StatusBadge";
import { RatingStars } from "../ui/RatingStars";
import { MapPin, DollarSign, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const categoryIcons: any = {
  tractor: "🚜",
  harvester: "🌾",
  water_pump: "💧",
  truck: "🚚",
  drone: "🛸",
  sprayer: "🌿",
  plow: "⚙️",
  seeder: "🌱",
  other: "🔧"
};

export const ToolCard = ({ tool }: any) => {
  return (
    <Link to={createPageUrl(`ToolDetails?id=${tool.id}`)} className="block h-full">
        <Card className="overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white group h-full flex flex-col p-0">
          <div className="aspect-[4/3] relative bg-gradient-to-br from-emerald-100 to-amber-50">
            {tool.images?.[0] ? (
              <img 
                src={tool.images[0]} 
                alt={tool.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">
                {categoryIcons[tool.category] || "🔧"}
              </div>
            )}
            <div className="absolute top-3 right-3">
              <StatusBadge status={tool.availability_status || 'available'} className="shadow-sm" />
            </div>
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500 capitalize">{tool.category?.replace("_", " ")}</p>
              </div>
              {tool.rating > 0 && (
                <div className="flex flex-col items-end flex-shrink-0">
                  <RatingStars rating={tool.rating} size={14} />
                  <span className="text-xs text-gray-500 mt-0.5">({tool.total_reviews || 0} reviews)</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 mb-3">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span className="truncate">{tool.location_name || "Location not set"}</span>
            </div>
            
            <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {tool.hourly_rate && (
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">${tool.hourly_rate}</span>
                    <span className="text-gray-500">/hr</span>
                  </div>
                )}
                {tool.daily_rate && (
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">${tool.daily_rate}</span>
                    <span className="text-gray-500">/day</span>
                  </div>
                )}
                {/* Fallback for mock data that uses pricePerDay */}
                {tool.pricePerDay && !tool.daily_rate && (
                   <div className="text-sm">
                    <span className="font-bold text-gray-900">${tool.pricePerDay}</span>
                    <span className="text-gray-500">/day</span>
                  </div>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Card>
    </Link>
  );
}