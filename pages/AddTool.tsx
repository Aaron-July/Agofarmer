import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Loader2, Image
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from '../components/ui/Card';

const TOOL_CATEGORIES = [
  { value: "tractor", label: "🚜 Tractor" },
  { value: "harvester", label: "🌾 Harvester" },
  { value: "water_pump", label: "💧 Pump" },
  { value: "truck", label: "🚚 Truck" },
  { value: "drone", label: "🛸 Drone" },
  { value: "sprayer", label: "🌿 Sprayer" },
  { value: "plow", label: "⚙️ Plow" },
  { value: "other", label: "🔧 Other" }
];

export const AddTool = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    hourly_rate: "",
    daily_rate: "",
    location_name: "",
    condition: "good",
    images: [] as string[]
  });

  const handleSubmit = () => {
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
        setLoading(false);
        navigate('/tools');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full shadow-sm bg-white/50">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add Equipment</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">Equipment Photos</label>
            <div className="grid grid-cols-3 gap-3">
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-all text-gray-400 hover:text-brand-500 bg-gray-50">
                    <Image className="w-6 h-6 mb-2" />
                    <span className="text-xs">Add Photo</span>
                </div>
            </div>
        </Card>

        <Card className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {TOOL_CATEGORIES.map(cat => (
                    <div 
                        key={cat.value} 
                        onClick={() => setFormData({...formData, category: cat.value})}
                        className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${
                            formData.category === cat.value ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm' : 'border-gray-100 hover:border-brand-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className="text-lg mb-1">{cat.label.split(' ')[0]}</div>
                        <div className="text-xs font-medium">{cat.label.split(' ')[1]}</div>
                    </div>
                ))}
            </div>
        </Card>

        <Card className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
                <input 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                    placeholder="e.g. John Deere Tractor"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none min-h-[100px]" 
                    placeholder="Describe condition, specs, etc."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate ($)</label>
                    <input 
                        type="number" 
                        className="w-full p-3 border border-gray-200 rounded-lg" 
                        placeholder="150"
                        value={formData.daily_rate}
                        onChange={e => setFormData({...formData, daily_rate: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input 
                            className="w-full pl-9 p-3 border border-gray-200 rounded-lg" 
                            placeholder="City, Area"
                            value={formData.location_name}
                            onChange={e => setFormData({...formData, location_name: e.target.value})}
                        />
                    </div>
                </div>
            </div>
        </Card>

        <button 
            onClick={handleSubmit}
            disabled={loading || !formData.name}
            className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold shadow-lg hover:bg-brand-700 transition-all disabled:opacity-50 flex items-center justify-center"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'List Equipment'}
        </button>
      </motion.div>
    </div>
  );
};