import React, { useState, useEffect } from "react";
import { base44 } from "../services/base44";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/helpers";
import { Button, Input, Label, Textarea, Badge, Avatar, AvatarFallback, AvatarImage, Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Primitives";
import { Card } from "../components/ui/Card";
import { RatingStars } from "../components/ui/RatingStars";
import {
  Camera, MapPin, DollarSign, Briefcase, Wrench,
  CheckCircle, Edit, Save, X, Loader2, Star,
  Phone, Mail, Settings
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const SKILLS = [
  "Planting", "Harvesting", "Tractor Operation", "Irrigation",
  "Livestock Care", "Crop Spraying", "Land Clearing", "Fertilizing",
  "Equipment Maintenance", "Transport", "Organic Farming", "Drone Operation"
];

export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [myTools, setMyTools] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setFormData(profiles[0]);

        // Load reviews
        const userReviews = await base44.entities.Review.filter(
          { reviewed_user_id: profiles[0].id }
        );
        setReviews(userReviews);

        // Load jobs based on user type
        if (profiles[0].user_type === "worker") {
          const jobs = await base44.entities.Job.filter(
            { assigned_worker_id: profiles[0].id }
          );
          setCompletedJobs(jobs);
        } else if (profiles[0].user_type === "farmer") {
          const jobs = await base44.entities.Job.filter(
            { farmer_id: profiles[0].id }
          );
          setCompletedJobs(jobs);
        }

        // Load tools for tool owners
        if (profiles[0].user_type === "tool_owner") {
          const tools = await base44.entities.Tool.filter(
            { owner_id: profiles[0].id }
          );
          setMyTools(tools);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setLoading(false);
  };

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData((prev: any) => ({ ...prev, photo_url: file_url }));
      await base44.entities.UserProfile.update(profile.id, { photo_url: file_url });
      setProfile((prev: any) => ({ ...prev, photo_url: file_url }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setSaving(false);
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = formData.skills || [];
    setFormData((prev: any) => ({
      ...prev,
      skills: currentSkills.includes(skill)
        ? currentSkills.filter((s: string) => s !== skill)
        : [...currentSkills, skill]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.UserProfile.update(profile.id, {
        full_name: formData.full_name,
        phone: formData.phone,
        bio: formData.bio,
        location_name: formData.location_name,
        skills: formData.skills,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        farm_name: formData.farm_name,
        farm_size_acres: formData.farm_size_acres ? parseFloat(formData.farm_size_acres) : null
      });
      setProfile({ ...profile, ...formData });
      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Link to={createPageUrl("Settings")}>
          <Button variant="outline" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Photo */}
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.photo_url} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                  {profile?.full_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-colors">
                {saving ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
              {profile?.id_verified && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {editing ? (
                <Input
                  value={formData.full_name || ""}
                  onChange={(e: any) => setFormData((prev: any) => ({ ...prev, full_name: e.target.value }))}
                  className="text-xl font-bold mb-2"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">{profile?.full_name}</h2>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge className="bg-emerald-100 text-emerald-700 capitalize">
                  {profile?.user_type?.replace("_", " ")}
                </Badge>
                {profile?.id_verified && (
                  <Badge className="bg-blue-100 text-blue-700">Verified</Badge>
                )}
                <Badge className={`capitalize ${
                  profile?.availability === "available"
                    ? "bg-green-100 text-green-700"
                    : profile?.availability === "busy"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {profile?.availability || "Available"}
                </Badge>
              </div>

              {profile?.rating > 0 && (
                <div className="mt-3">
                  <RatingStars rating={profile.rating} size={16} />
                  <span className="text-sm text-gray-500 ml-2">
                    ({profile.total_reviews || 0} reviews)
                  </span>
                </div>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-gray-600">
                {profile?.location_name && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {editing ? (
                      <Input
                        value={formData.location_name || ""}
                        onChange={(e: any) => setFormData((prev: any) => ({ ...prev, location_name: e.target.value }))}
                        className="w-32 h-8"
                      />
                    ) : (
                      <span>{profile.location_name}</span>
                    )}
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-emerald-500" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile?.hourly_rate && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>${profile.hourly_rate}/hr</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span>{profile?.jobs_completed || 0} jobs</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div>
              {editing ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setFormData(profile);
                      setEditing(false);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="icon" onClick={() => setEditing(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="grid grid-cols-3 bg-white">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Bio</h3>
              {editing ? (
                <Textarea
                  value={formData.bio || ""}
                  onChange={(e: any) => setFormData((prev: any) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-gray-600">{profile?.bio || "No bio added yet"}</p>
              )}
            </Card>
          </motion.div>

          {profile?.user_type === "worker" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Skills</h3>
                {editing ? (
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => (
                      <Badge
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`cursor-pointer py-2 px-3 ${
                          (formData.skills || []).includes(skill)
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(profile?.skills || []).length > 0 ? (
                      profile.skills.map((skill: string, i: number) => (
                        <Badge key={i} className="bg-emerald-100 text-emerald-700">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills added</p>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {profile?.user_type === "farmer" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Farm Details</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-500">Farm Name</Label>
                    {editing ? (
                      <Input
                        value={formData.farm_name || ""}
                        onChange={(e: any) => setFormData((prev: any) => ({ ...prev, farm_name: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{profile?.farm_name || "Not specified"}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-500">Farm Size</Label>
                    {editing ? (
                      <Input
                        type="number"
                        value={formData.farm_size_acres || ""}
                        onChange={(e: any) => setFormData((prev: any) => ({ ...prev, farm_size_acres: e.target.value }))}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{profile?.farm_size_acres ? `${profile.farm_size_acres} acres` : "Not specified"}</p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Work History</h3>
            {completedJobs.length > 0 ? (
              <div className="space-y-3">
                {completedJobs.map((job) => (
                  <Link key={job.id} to={createPageUrl(`JobDetails?id=${job.id}`)}>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(job.created_date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Badge className={`capitalize ${
                        job.status === "completed" || job.status === "reviewed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {job.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No work history yet</p>
            )}
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Reviews ({reviews.length})</h3>
            {reviews.length > 0 ? (
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
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No reviews yet</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}