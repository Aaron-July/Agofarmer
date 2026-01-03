import React, { useState, useEffect } from "react";
import { base44 } from "../services/base44";
import { createPageUrl } from "../utils/helpers";
import { Button, Input, Label, Textarea } from "../components/ui/Primitives";
import { Card } from "../components/ui/Card";
import { 
  Tractor, ArrowRight, ArrowLeft, 
  Camera, Upload, CheckCircle, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SKILLS = [
  "Planting", "Harvesting", "Tractor Operation", "Irrigation",
  "Livestock Care", "Crop Spraying", "Land Clearing", "Fertilizing",
  "Equipment Maintenance", "Transport", "Organic Farming", "Drone Operation"
];

export const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    user_type: "",
    full_name: "",
    phone: "",
    bio: "",
    location_name: "",
    skills: [] as string[],
    hourly_rate: "",
    farm_name: "",
    farm_size_acres: "",
    photo_url: "",
    id_document_url: ""
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setFormData(prev => ({ ...prev, full_name: currentUser.full_name || "" }));
      
      const profiles = await base44.entities.UserProfile.filter({ user_email: currentUser.email });
      if (profiles.length > 0) {
        window.location.href = createPageUrl("Home");
      }
    } catch (e) {
      base44.auth.redirectToLogin();
    }
  };

  const handlePhotoUpload = async (e: any, field: string) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, [field]: file_url }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setLoading(false);
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await base44.entities.UserProfile.create({
        user_id: user.id,
        user_email: user.email,
        user_type: formData.user_type,
        full_name: formData.full_name,
        phone: formData.phone,
        bio: formData.bio,
        location_name: formData.location_name,
        skills: formData.skills,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        farm_name: formData.farm_name,
        farm_size_acres: formData.farm_size_acres ? parseFloat(formData.farm_size_acres) : null,
        photo_url: formData.photo_url,
        id_document_url: formData.id_document_url,
        availability: "available",
        wallet_balance: 0,
        account_status: "approved"
      });
      
      window.location.href = createPageUrl("Home");
    } catch (error) {
      console.error("Error creating profile:", error);
    }
    setLoading(false);
  };

  const userTypes = [
    { 
      id: "farmer", 
      icon: "🌾", 
      title: "Farmer", 
      description: "Post jobs, hire workers, rent equipment" 
    },
    { 
      id: "worker", 
      icon: "👨‍🌾", 
      title: "Farm Worker", 
      description: "Find jobs, offer your skills, earn money" 
    },
    { 
      id: "tool_owner", 
      icon: "🚜", 
      title: "Equipment Owner", 
      description: "List equipment for rent, manage bookings" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Tractor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
            Welcome to AgroFarmer
          </h1>
          <p className="text-gray-500 mt-2">Let's set up your profile</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? "w-8 bg-emerald-500" : s < step ? "w-8 bg-emerald-300" : "w-8 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Choose Role */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-center mb-6">What brings you here?</h2>
              
              {userTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setFormData(prev => ({ ...prev, user_type: type.id }))}
                  className={`p-4 cursor-pointer transition-all duration-300 rounded-xl border-2 ${
                    formData.user_type === type.id
                      ? "ring-2 ring-emerald-500 bg-emerald-50 border-emerald-200"
                      : "border-transparent bg-white shadow-sm hover:border-emerald-200 hover:bg-emerald-50/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center text-3xl">
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{type.title}</h3>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                    {formData.user_type === type.id && (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>
                </div>
              ))}

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.user_type}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-12 text-lg"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Basic Info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-semibold text-center mb-6">Tell us about yourself</h2>

              {/* Photo Upload */}
              <div className="flex justify-center mb-6">
                <label className="relative cursor-pointer">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed ${
                    formData.photo_url ? "border-emerald-300" : "border-gray-300"
                  } overflow-hidden`}>
                    {formData.photo_url ? (
                      <img src={formData.photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, "photo_url")}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="h-12 mt-1.5"
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 234 567 8900"
                    className="h-12 mt-1.5"
                  />
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location_name}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                    placeholder="City, State"
                    className="h-12 mt-1.5"
                  />
                </div>

                {formData.user_type === "farmer" && (
                  <>
                    <div>
                      <Label>Farm Name</Label>
                      <Input
                        value={formData.farm_name}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, farm_name: e.target.value }))}
                        placeholder="Your farm name"
                        className="h-12 mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Farm Size (acres)</Label>
                      <Input
                        type="number"
                        value={formData.farm_size_acres}
                        onChange={(e: any) => setFormData(prev => ({ ...prev, farm_size_acres: e.target.value }))}
                        placeholder="e.g., 50"
                        className="h-12 mt-1.5"
                      />
                    </div>
                  </>
                )}

                {formData.user_type === "worker" && (
                  <div>
                    <Label>Hourly Rate ($)</Label>
                    <Input
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                      placeholder="e.g., 15"
                      className="h-12 mt-1.5"
                    />
                  </div>
                )}

                <div>
                  <Label>About You</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Brief description about yourself..."
                    className="mt-1.5 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.full_name || !formData.phone}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-12"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Skills & Verification */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-center mb-6">
                {formData.user_type === "worker" ? "Your Skills" : "Almost Done!"}
              </h2>

              {formData.user_type === "worker" && (
                <div>
                  <Label className="mb-3 block">Select your skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => (
                      <div
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`cursor-pointer text-sm py-2 px-3 transition-all rounded-full border ${
                          formData.skills.includes(skill)
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                        }`}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ID Verification */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <h3 className="font-medium text-amber-800 mb-2">ID Verification (Optional)</h3>
                <p className="text-sm text-amber-700 mb-3">
                  Upload your ID to get a verified badge and increase trust.
                </p>
                <label className="cursor-pointer">
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                    formData.id_document_url 
                      ? "border-emerald-300 bg-emerald-50" 
                      : "border-amber-300 hover:border-amber-400"
                  }`}>
                    {formData.id_document_url ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>Document Uploaded</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-amber-700">
                        <Upload className="w-5 h-5" />
                        <span>Upload ID Document</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, "id_document_url")}
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 h-12"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-12"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}