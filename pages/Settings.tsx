import React, { useState, useEffect } from "react";
import { base44 } from "../services/base44";
import { Button, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Primitives";
import { Card } from "../components/ui/Card";
import {
  ArrowLeft, Bell, Shield, Globe, HelpCircle,
  FileText, LogOut, ChevronRight, Loader2, User,
  CreditCard, Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../components/LanguageContext";

export const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const { language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    availability: "available"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setSettings(prev => ({
          ...prev,
          availability: profiles[0].availability || "available"
        }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    setLoading(false);
  };

  const handleAvailabilityChange = async (value: string) => {
    try {
      await base44.entities.UserProfile.update(profile.id, { availability: value });
      setSettings(prev => ({ ...prev, availability: value }));
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Edit Profile",
          description: "Update your personal information",
          action: "link",
          href: "Profile"
        },
        {
          icon: Shield,
          label: "Availability Status",
          description: "Set your current availability",
          action: "select",
          options: [
            { value: "available", label: "Available" },
            { value: "busy", label: "Busy" },
            { value: "unavailable", label: "Unavailable" }
          ],
          value: settings.availability,
          onChange: handleAvailabilityChange
        },
        {
          icon: CreditCard,
          label: "Payment Methods",
          description: "Manage your payment options",
          action: "link",
          href: "Wallet"
        }
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Receive push notifications",
          action: "toggle",
          value: settings.notifications,
          onChange: () => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))
        },
        {
          icon: Globe,
          label: "Language",
          description: "Choose your preferred language",
          action: "select",
          options: [
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
            { value: "fr", label: "Français" },
            { value: "ja", label: "日本語" }
          ],
          value: language,
          onChange: (value: any) => setLanguage(value)
        }
      ]
    },
    {
      title: "Security",
      items: [
        {
          icon: Lock,
          label: "Change Password",
          description: "Update your account password",
          action: "button"
        },
        {
          icon: Shield,
          label: "ID Verification",
          description: profile?.id_verified ? "Verified" : "Upload your ID to get verified",
          action: "link",
          href: "Profile",
          status: profile?.id_verified ? "verified" : "pending"
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          description: "Get help and support",
          action: "button"
        },
        {
          icon: FileText,
          label: "Terms & Privacy",
          description: "Read our policies",
          action: "button"
        }
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {section.title}
            </h2>
            <Card className="divide-y">
              {section.items.map((item: any) => (
                <div
                  key={item.label}
                  className="p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500 truncate">{item.description}</p>
                  </div>

                  {item.action === "toggle" && (
                    <Switch
                      checked={item.value}
                      onCheckedChange={item.onChange}
                    />
                  )}

                  {item.action === "select" && (
                    <div className="w-32">
                        <select 
                            value={item.value} 
                            onChange={(e) => item.onChange(e.target.value)}
                            className="w-full h-9 rounded-md border border-gray-200 px-2 text-sm"
                        >
                            {item.options.map((opt: any) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                  )}

                  {item.action === "link" && (
                    <div className="flex items-center gap-2">
                      {item.status === "verified" && (
                        <span className="text-xs text-green-600 font-medium">✓ Verified</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  )}

                  {item.action === "button" && (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              ))}
            </Card>
          </motion.div>
        ))}

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </motion.div>

        {/* App Version */}
        <div className="text-center text-sm text-gray-400 pt-4">
          <p>AgroFarmer v1.0.0</p>
          <p>© 2024 AgroFarmer. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}