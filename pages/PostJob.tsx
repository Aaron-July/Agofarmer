import React, { useState, useEffect } from "react";
import { base44 } from "../services/base44";
import { createPageUrl } from "../utils/helpers";
import { Button, Input, Label, Textarea, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Primitives";
import { Card } from "../components/ui/Card";
import { 
  ArrowLeft, MapPin, DollarSign, Calendar, 
  Users, Loader2, CheckCircle, Plus, X 
} from "lucide-react";
import { motion } from "framer-motion";

const JOB_TYPES = [
  { value: "planting", label: "🌱 Planting", icon: "🌱" },
  { value: "harvesting", label: "🌾 Harvesting", icon: "🌾" },
  { value: "clearing", label: "🪓 Land Clearing", icon: "🪓" },
  { value: "irrigation", label: "💧 Irrigation", icon: "💧" },
  { value: "livestock", label: "🐄 Livestock Care", icon: "🐄" },
  { value: "transport", label: "🚚 Transport", icon: "🚚" },
  { value: "other", label: "🔧 Other", icon: "🔧" }
];

const COMMON_SKILLS = [
  "Tractor Operation", "Harvesting", "Planting", "Irrigation",
  "Livestock Care", "Equipment Maintenance", "Crop Spraying",
  "Organic Farming", "Transport", "Heavy Lifting"
];

export const PostJob = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [customSkill, setCustomSkill] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    job_type: "",
    description: "",
    pay_rate: "",
    pay_type: "daily",
    duration_days: "1",
    start_date: "",
    location_name: "",
    workers_count_needed: "1",
    required_skills: [] as string[]
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setFormData(prev => ({
          ...prev,
          location_name: profiles[0].location_name || ""
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.includes(skill)
        ? prev.required_skills.filter(s => s !== skill)
        : [...prev.required_skills, skill]
    }));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.required_skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, customSkill.trim()]
      }));
      setCustomSkill("");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await base44.entities.Job.create({
        ...formData,
        pay_rate: parseFloat(formData.pay_rate),
        duration_days: parseInt(formData.duration_days),
        workers_count_needed: parseInt(formData.workers_count_needed),
        farmer_id: profile.id,
        farmer_name: profile.full_name,
        farmer_photo: profile.photo_url,
        status: "open",
        applicants: []
      });

      window.location.href = createPageUrl("Jobs");
    } catch (error) {
      console.error("Error creating job:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          className="rounded-full hover:bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
          <p className="text-gray-500 text-sm">Find workers for your farm</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              s === step ? "bg-emerald-500" : s < step ? "bg-emerald-300" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="p-6 space-y-5">
            <div>
              <Label className="text-base font-medium">Job Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {JOB_TYPES.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setFormData(prev => ({ ...prev, job_type: type.value }))}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.job_type === type.value
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-gray-200 hover:border-emerald-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <span className="text-sm font-medium">{type.label.split(" ").slice(1).join(" ")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Job Title</Label>
              <Input
                value={formData.title}
                onChange={(e: any) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Need help with corn harvest"
                className="h-12 mt-1.5"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e: any) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the job in detail..."
                className="mt-1.5 min-h-[120px]"
              />
            </div>
          </Card>

          <Button
            onClick={() => setStep(2)}
            disabled={!formData.job_type || !formData.title}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md"
          >
            Continue
          </Button>
        </motion.div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pay Rate ($)</Label>
                <Input
                  type="number"
                  value={formData.pay_rate}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, pay_rate: e.target.value }))}
                  placeholder="e.g., 100"
                  className="h-12 mt-1.5"
                />
              </div>
              <div>
                <Label>Pay Type</Label>
                {/* Simplified Select for mock environment */}
                <select
                    className="flex h-12 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1.5"
                    value={formData.pay_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, pay_type: e.target.value }))}
                >
                    <option value="hourly">Per Hour</option>
                    <option value="daily">Per Day</option>
                    <option value="fixed">Fixed Price</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="h-12 mt-1.5"
                />
              </div>
              <div>
                <Label>Duration (days)</Label>
                <Input
                  type="number"
                  value={formData.duration_days}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, duration_days: e.target.value }))}
                  className="h-12 mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label>Location</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={formData.location_name}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                  placeholder="Farm location"
                  className="h-12 pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Workers Needed</Label>
              <div className="flex items-center gap-3 mt-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    workers_count_needed: Math.max(1, parseInt(prev.workers_count_needed) - 1).toString()
                  }))}
                >
                  -
                </Button>
                <span className="text-xl font-bold w-12 text-center">{formData.workers_count_needed}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    workers_count_needed: (parseInt(prev.workers_count_needed) + 1).toString()
                  }))}
                >
                  +
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 shadow-sm">
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!formData.pay_rate}
              className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Skills */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <Label className="text-base font-medium">Required Skills</Label>
            <p className="text-sm text-gray-500 mb-4">Select skills needed for this job</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_SKILLS.map((skill) => (
                <Badge
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`cursor-pointer py-2 px-3 ${
                    formData.required_skills.includes(skill)
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Input
                value={customSkill}
                onChange={(e: any) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill..."
                className="h-10"
                onKeyPress={(e: any) => e.key === "Enter" && addCustomSkill()}
              />
              <Button type="button" variant="outline" onClick={addCustomSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.required_skills.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium mb-2">Selected Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.required_skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-emerald-100 text-emerald-700 pr-1 shadow-sm"
                    >
                      {skill}
                      <button
                        onClick={() => toggleSkill(skill)}
                        className="ml-1 p-1 hover:bg-emerald-200 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Summary */}
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-amber-50">
            <h3 className="font-semibold mb-4">Job Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Job Type</span>
                <span className="font-medium capitalize">{formData.job_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pay</span>
                <span className="font-medium">${formData.pay_rate}/{formData.pay_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{formData.duration_days} day(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Workers Needed</span>
                <span className="font-medium">{formData.workers_count_needed}</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 shadow-sm">
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Post Job
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}