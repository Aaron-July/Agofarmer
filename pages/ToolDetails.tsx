import React, { useState, useEffect } from "react";
import { base44 } from "../services/base44";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/helpers";
import { Button, Label, Badge, Avatar, AvatarFallback, AvatarImage, Popover, PopoverContent, PopoverTrigger, Calendar } from "../components/ui/Primitives";
import { Card } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/StatusBadge";
import { RatingStars } from "../components/ui/RatingStars";
import {
  ArrowLeft, MapPin, Calendar as CalendarIcon,
  MessageSquare, Phone, Loader2, ChevronLeft, ChevronRight
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const categoryIcons: any = {
  tractor: "🚜", harvester: "🌾", water_pump: "💧",
  truck: "🚚", drone: "🛸", sprayer: "🌿",
  plow: "⚙️", seeder: "🌱", other: "🔧"
};

export const ToolDetails = () => {
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [ownerProfile, setOwnerProfile] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [dateRange, setDateRange] = useState<any>({ from: null, to: null });
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const toolId = urlParams.get("id");

      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }

      const toolData = await base44.entities.Tool.filter({ id: toolId });
      if (toolData.length > 0) {
        setTool(toolData[0]);

        if (toolData[0].owner_id) {
          const owners = await base44.entities.UserProfile.filter({ id: toolData[0].owner_id });
          if (owners.length > 0) setOwnerProfile(owners[0]);
        }

        // Fetch reviews
        const toolReviews = await base44.entities.Review.filter({ tool_id: toolId });
        setReviews(toolReviews);
      }
    } catch (error) {
      console.error("Error loading tool:", error);
    }
    setLoading(false);
  };

  const handleBooking = async () => {
    if (!dateRange.from || !dateRange.to) return;

    setBookingLoading(true);
    try {
      const days = differenceInDays(dateRange.to, dateRange.from) + 1;
      const totalAmount = tool.daily_rate ? tool.daily_rate * days : tool.hourly_rate * 8 * days;

      await base44.entities.ToolBooking.create({
        tool_id: tool.id,
        tool_name: tool.name,
        tool_image: tool.images?.[0],
        renter_id: profile.id,
        renter_name: profile.full_name,
        owner_id: tool.owner_id,
        owner_name: tool.owner_name,
        start_date: format(dateRange.from, "yyyy-MM-dd"),
        end_date: format(dateRange.to, "yyyy-MM-dd"),
        rental_type: "daily",
        total_amount: totalAmount,
        status: "pending"
      });

      await base44.entities.Notification.create({
        user_id: tool.owner_id,
        title: "New Booking Request",
        message: `${profile.full_name} wants to rent your ${tool.name}`,
        type: "booking_request",
        reference_id: tool.id
      });

      setShowBooking(false);
      alert("Booking request sent!");
    } catch (error) {
      console.error("Error creating booking:", error);
    }
    setBookingLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="px-4 py-6 text-center">
        <p>Tool not found</p>
      </div>
    );
  }

  const isOwner = profile?.id === tool.owner_id;
  const days = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0;
  const totalAmount = tool.daily_rate ? tool.daily_rate * days : tool.hourly_rate * 8 * days;

  return (
    <div className="pb-24">
      {/* Image Gallery with negative margins to compensate layout padding for edge-to-edge feel */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-emerald-100 to-amber-50 -mx-4 -mt-4 md:-mx-6 md:-mt-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {tool.images?.length > 0 ? (
          <>
            <img
              src={tool.images[currentImageIndex]}
              alt={tool.name}
              className="w-full h-full object-cover"
            />
            {tool.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : tool.images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentImageIndex((prev) => (prev < tool.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {tool.images.map((_: any, i: number) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {categoryIcons[tool.category] || "🔧"}
          </div>
        )}

        <div className="absolute top-4 right-4">
          <StatusBadge status={tool.availability_status || 'available'} />
        </div>
      </div>

      <div className="py-6 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
              <p className="text-gray-500 capitalize">{tool.category?.replace("_", " ")}</p>
            </div>
            {tool.rating > 0 && (
              <RatingStars rating={tool.rating} />
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            {tool.hourly_rate && (
              <div className="bg-emerald-50 px-4 py-2 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600">${tool.hourly_rate}</p>
                <p className="text-xs text-gray-500">per hour</p>
              </div>
            )}
            {tool.daily_rate && (
              <div className="bg-amber-50 px-4 py-2 rounded-xl">
                <p className="text-2xl font-bold text-amber-600">${tool.daily_rate}</p>
                <p className="text-xs text-gray-500">per day</p>
              </div>
            )}
             {tool.pricePerDay && !tool.daily_rate && (
              <div className="bg-amber-50 px-4 py-2 rounded-xl">
                <p className="text-2xl font-bold text-amber-600">${tool.pricePerDay}</p>
                <p className="text-xs text-gray-500">per day</p>
              </div>
            )}
          </div>

          {tool.location_name && (
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>{tool.location_name}</span>
            </div>
          )}
        </motion.div>

        {/* Description */}
        {tool.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 mb-6">
              <h2 className="font-semibold mb-3">Description</h2>
              <p className="text-gray-600">{tool.description}</p>
            </Card>
          </motion.div>
        )}

        {/* Owner */}
        {ownerProfile && !isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 mb-6">
              <h2 className="font-semibold mb-4">Equipment Owner</h2>
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={ownerProfile.photo_url} />
                  <AvatarFallback>{ownerProfile.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{ownerProfile.full_name}</p>
                  {ownerProfile.rating > 0 && (
                    <RatingStars rating={ownerProfile.rating} size={14} />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Link to={createPageUrl(`Chat?userId=${ownerProfile.id}`)}>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Reviews Section */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold flex items-center gap-2">
                      Reviews 
                      <span className="text-gray-500 font-normal text-sm">({reviews.length})</span>
                  </h2>
                  {reviews.length > 0 && tool.rating > 0 && (
                     <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{tool.rating.toFixed(1)}</span>
                        <RatingStars rating={tool.rating} size={16} />
                     </div>
                  )}
                </div>
                
                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                <div className="flex items-start gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={review.reviewer_photo} />
                                        <AvatarFallback>{review.reviewer_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">{review.reviewer_name}</p>
                                                <p className="text-xs text-gray-500">{format(new Date(review.created_date), "MMM d, yyyy")}</p>
                                            </div>
                                            <RatingStars rating={review.rating} size={14} />
                                        </div>
                                        <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No reviews yet for this tool</p>
                    </div>
                )}
            </Card>
        </motion.div>

        {/* Booking Form */}
        <AnimatePresence>
          {showBooking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="p-6 mb-6 border-2 border-emerald-200">
                <h2 className="font-semibold mb-4">Book Equipment</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Select Dates</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start h-12 mt-1.5">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                            ) : (
                              format(dateRange.from, "MMM d, yyyy")
                            )
                          ) : (
                            "Select dates"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {days > 0 && (
                    <div className="bg-emerald-50 p-4 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{days} day(s)</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-emerald-600">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowBooking(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleBooking}
                      disabled={bookingLoading || !dateRange.from || !dateRange.to}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      {bookingLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Request Booking"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Book Button */}
      {!isOwner && tool.availability_status === "available" && !showBooking && (
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 md:left-64 p-4 bg-white/95 backdrop-blur-lg border-t">
          <div className="max-w-3xl mx-auto">
            <Button
              onClick={() => setShowBooking(true)}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              Book This Equipment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}