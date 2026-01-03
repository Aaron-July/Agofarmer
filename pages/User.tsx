import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { User, MapPin, Mail, Phone, Globe, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WorkerCard } from '../components/cards/WorkerCard';

const MOCK_WALLET_DATA = [
  { name: 'Mon', amount: 400 },
  { name: 'Tue', amount: 300 },
  { name: 'Wed', amount: 600 },
  { name: 'Thu', amount: 800 },
  { name: 'Fri', amount: 500 },
  { name: 'Sat', amount: 900 },
  { name: 'Sun', amount: 1000 },
];

export const Profile = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-brand-600 to-teal-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <img src="https://picsum.photos/200/200?random=100" className="w-24 h-24 rounded-full border-4 border-white shadow-md" alt="Profile" />
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Edit Profile</button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Alex Johnson</h1>
                        <p className="text-gray-500">Senior Electrician & Solar Innovator</p>
                        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                             <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> Nairobi, KE</span>
                             <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500"/> 4.9 (120 reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Contact Info</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center"><Mail className="w-4 h-4 mr-3"/> alex@example.com</div>
                            <div className="flex items-center"><Phone className="w-4 h-4 mr-3"/> +254 700 000000</div>
                            <div className="flex items-center"><Globe className="w-4 h-4 mr-3"/> alexjohnson.dev</div>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Solar', 'Wiring', 'High Voltage', 'Safety', 'Project Mgmt'].map(s => (
                                <span key={s} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">About Me</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Certified electrician with over 10 years of experience in renewable energy installations. 
                            Passionate about bringing sustainable power solutions to rural communities.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Wallet = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
                    <p className="text-gray-400 text-sm font-medium">Total Balance</p>
                    <h2 className="text-3xl font-bold mt-2">$2,450.50</h2>
                    <div className="mt-4 flex gap-2">
                        <button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-2 rounded-lg text-sm font-medium">Withdraw</button>
                        <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-medium">Top Up</button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Pending Clearance</p>
                    <h2 className="text-2xl font-bold mt-2 text-gray-900">$340.00</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Total Earned</p>
                    <h2 className="text-2xl font-bold mt-2 text-brand-600">$15,200.00</h2>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6">Earnings Overview</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_WALLET_DATA}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                            <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export const Onboarding = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
             <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                 <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-8 h-8"/>
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AgroFarmer Connect</h2>
                 <p className="text-gray-500 mb-8">Join the largest marketplace for African farmers and innovators.</p>
                 
                 <div className="space-y-4">
                    <Link to="/" className="block w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition">Continue as Guest</Link>
                    <button className="block w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition">Sign Up with Email</button>
                 </div>
                 <p className="mt-6 text-xs text-gray-400">By continuing you agree to our Terms of Service.</p>
             </div>
        </div>
    )
}

export const Workers = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Find Skilled Workers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <WorkerCard 
                  key={i} 
                  worker={{
                    id: i.toString(),
                    name: `Worker Name ${i}`,
                    role: 'Carpenter',
                    specialty: 'Woodwork',
                    location: 'Lagos, NG',
                    avatar: `https://picsum.photos/100/100?random=${i + 20}`,
                    rating: 4.5
                  }}
                />
            ))}
        </div>
    </div>
)

export const WorkerProfile = () => <div className="p-10 text-center text-gray-500">Worker Profile Placeholder</div>;