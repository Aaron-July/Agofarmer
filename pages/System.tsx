import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, DollarSign, Briefcase, Map as MapIcon, 
  Send, Bot, MoreVertical, Check, CheckCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { chatWithAI } from '../services/geminiService';
import { Message } from '../types';

export const Home = () => {
    return (
        <div className="space-y-8">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Jobs', val: '12', icon: Briefcase, color: 'blue' },
                    { label: 'Total Earnings', val: '$3,240', icon: DollarSign, color: 'green' },
                    { label: 'Views', val: '1.2k', icon: Users, color: 'purple' },
                    { label: 'Completion Rate', val: '98%', icon: CheckCircle, color: 'orange' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.val}</h3>
                        </div>
                        <div className={`p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-lg`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Recent Activity</h3>
                        <Link to="/notifications" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mr-4"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">New job posted matching your skills</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                        <p className="text-gray-300 text-sm mb-6">Get verified, lower fees, and premium support.</p>
                        <button className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-lg font-bold transition">Upgrade Now</button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', senderId: 'ai', receiverId: 'me', content: 'Hi! I am AgroBot. How can I help you today?', timestamp: new Date().toISOString(), isAi: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg: Message = {
            id: Date.now().toString(),
            senderId: 'me',
            receiverId: 'ai',
            content: input,
            timestamp: new Date().toISOString(),
            isAi: false
        };
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const aiResponseText = await chatWithAI(input);
        
        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            senderId: 'ai',
            receiverId: 'me',
            content: aiResponseText,
            timestamp: new Date().toISOString(),
            isAi: true
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">AgroFarmer Assistant</h3>
                        <p className="text-xs text-brand-600 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online</p>
                    </div>
                </div>
                <MoreVertical className="text-gray-400 w-5 h-5 cursor-pointer" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                            msg.senderId === 'me' 
                                ? 'bg-brand-600 text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-none">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSend} className="bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700 transition">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Map = () => (
    <div className="h-[calc(100vh-8rem)] bg-gray-100 rounded-xl overflow-hidden relative group">
        <div className="absolute inset-0 flex items-center justify-center flex-col">
            <MapIcon className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-500">Interactive Map</h3>
            <p className="text-gray-400">Showing jobs near Nairobi, Kenya</p>
        </div>
        {/* Mock Map UI overlay */}
        <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md z-10">
            <div className="flex items-center space-x-2 text-sm">
               <span className="w-3 h-3 bg-red-500 rounded-full"></span> <span>Jobs</span>
               <span className="w-3 h-3 bg-blue-500 rounded-full"></span> <span>Tools</span>
            </div>
        </div>
    </div>
);

export const Admin = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[1,2,3].map(i => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">User {i}</td>
                            <td className="p-4">Worker</td>
                            <td className="p-4 text-green-600">Active</td>
                            <td className="p-4 text-brand-600 cursor-pointer">Edit</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>
    </div>
);

// Placeholders for simple pages
export const Settings = () => <div className="p-10 text-center text-gray-500">Settings Page Placeholder</div>;
export const Notifications = () => <div className="p-10 text-center text-gray-500">Notifications Page Placeholder</div>;
export const Messages = () => <Chat />; // Reuse Chat UI for Messages for now
export const Bookings = () => <div className="p-10 text-center text-gray-500">Bookings Page Placeholder</div>;