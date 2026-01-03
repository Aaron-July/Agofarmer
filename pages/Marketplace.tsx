import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Job, Tool, UserRole } from '../types';
import { generateDescription } from '../services/geminiService';
import { JobCard } from '../components/cards/JobCard';
import { ToolCard } from '../components/cards/ToolCard';

// Mock Data
const MOCK_JOBS: Job[] = [
  { id: '1', title: 'Solar Panel Installation', description: 'Need an experienced technician to install 10kw system.', budget: 500, location: 'Lagos, Nigeria', postedBy: { id: 'u1', name: 'John Doe', role: UserRole.INNOVATOR, avatar: '', location: '', bio: '', skills: [], rating: 4.8 }, status: 'OPEN', createdAt: '2023-10-27', tags: ['Solar', 'Electrical'] },
  { id: '2', title: 'Farm Irrigation Setup', description: 'Setup drip irrigation for 2 acres of land.', budget: 1200, location: 'Nairobi, Kenya', postedBy: { id: 'u2', name: 'Jane Smith', role: UserRole.INVESTOR, avatar: '', location: '', bio: '', skills: [], rating: 5.0 }, status: 'OPEN', createdAt: '2023-10-28', tags: ['Agriculture', 'Plumbing'] },
];

const MOCK_TOOLS: Tool[] = [
  { id: '1', name: 'Heavy Duty Drill', description: 'Bosch Professional drill for concrete.', pricePerDay: 15, owner: { id: 'u3', name: 'Mike Tools', role: UserRole.WORKER, avatar: '', location: '', bio: '', skills: [], rating: 4.5 }, image: 'https://picsum.photos/400/300?random=1', available: true, category: 'Power Tools', rating: 4.5 },
  { id: '2', name: 'Drone Camera', description: 'DJI Mavic 3 for aerial surveys.', pricePerDay: 50, owner: { id: 'u1', name: 'John Doe', role: UserRole.INNOVATOR, avatar: '', location: '', bio: '', skills: [], rating: 4.8 }, image: 'https://picsum.photos/400/300?random=2', available: true, category: 'Photography', rating: 4.8 },
];

const Card = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>{children}</div>
);

export const Jobs = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search jobs..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-brand-600 px-4 py-2 border border-gray-200 rounded-lg hover:border-brand-500 transition">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_JOBS.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export const Tools = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-gray-900">Available Tools</h2>
         <Link to="/add-tool" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">List a Tool</Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MOCK_TOOLS.map(tool => (
           <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export const PostJob = () => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAI = async () => {
    setLoading(true);
    const desc = await generateDescription(title, keywords);
    setDescription(desc);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent" 
              placeholder="e.g. Solar Installation Expert" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
                <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="500" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="City, Country" />
             </div>
          </div>

          <div className="bg-brand-50 p-4 rounded-xl border border-brand-100">
             <div className="flex justify-between items-center mb-2">
               <label className="block text-sm font-semibold text-brand-800">AI Assistant</label>
               <Sparkles className="w-4 h-4 text-brand-600" />
             </div>
             <p className="text-xs text-brand-600 mb-3">Enter keywords below and let Gemini write a perfect description for you.</p>
             <div className="flex gap-2">
               <input 
                 value={keywords} 
                 onChange={(e) => setKeywords(e.target.value)}
                 className="flex-1 p-2 border border-brand-200 rounded-lg text-sm" 
                 placeholder="Keywords (e.g. urgent, expert, certified)" 
                />
               <button 
                onClick={handleAI} 
                disabled={loading || !title}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center"
               >
                 {loading ? 'Thinking...' : 'Generate'}
               </button>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500" 
              placeholder="Detailed requirements..."
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
             <button onClick={() => navigate('/jobs')} className="text-gray-600 px-6 py-3 font-medium hover:text-gray-900 mr-4">Cancel</button>
             <button onClick={() => navigate('/jobs')} className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 shadow-lg shadow-gray-200">Post Job</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const JobDetails = () => {
    const { id } = useParams();
    const job = MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0];
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to="/jobs" className="text-gray-500 hover:text-gray-900 flex items-center mb-4"><ArrowRight className="w-4 h-4 rotate-180 mr-2"/> Back to Jobs</Link>
            <Card className="p-0 overflow-hidden">
                <div className="bg-gray-900 p-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                            <div className="flex items-center space-x-4 text-gray-300">
                                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {job.location}</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-sm text-white">${job.budget} Fixed Price</span>
                            </div>
                        </div>
                        <button className="bg-brand-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-400">Apply Now</button>
                    </div>
                </div>
                <div className="p-8">
                    <h3 className="text-lg font-bold mb-4">Description</h3>
                    <p className="text-gray-600 leading-relaxed mb-8">{job.description}</p>
                    
                    <h3 className="text-lg font-bold mb-4">About the Client</h3>
                    <div className="flex items-center space-x-4">
                        <img src="https://picsum.photos/60/60?random=10" className="w-12 h-12 rounded-full" alt="client"/>
                        <div>
                            <p className="font-medium text-gray-900">{job.postedBy.name}</p>
                            <div className="flex text-yellow-500 text-sm">
                                <Star className="w-4 h-4 fill-current"/>
                                <span className="ml-1 text-gray-600">{job.postedBy.rating} Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export const AddTool = () => <div className="p-10 text-center text-gray-500">Add Tool Page Placeholder</div>;
export const ToolDetails = () => <div className="p-10 text-center text-gray-500">Tool Details Placeholder</div>;
export const MyJobs = () => <div className="p-10 text-center text-gray-500">My Jobs Placeholder</div>;
export const MyTools = () => <div className="p-10 text-center text-gray-500">My Tools Placeholder</div>;