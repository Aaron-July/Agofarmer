import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Wrench, Calendar, DollarSign, 
  CheckCircle, XCircle, Loader2 
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { MOCK_BOOKINGS } from '../utils/mockData';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';

export const Bookings = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("incoming");
  const [bookings, setBookings] = useState<{incoming: any[], outgoing: any[], completed: any[]}>({
    incoming: [],
    outgoing: [],
    completed: []
  });

  useEffect(() => {
    // Simulate API Load
    setTimeout(() => {
        setBookings({
            incoming: MOCK_BOOKINGS.filter(b => b.status === 'pending'),
            outgoing: MOCK_BOOKINGS.filter(b => b.status === 'active'),
            completed: MOCK_BOOKINGS.filter(b => ['completed', 'cancelled'].includes(b.status)),
        });
        setLoading(false);
    }, 800);
  }, []);

  const handleAction = (id: string, action: 'approve' | 'decline') => {
      // Mock action logic
      const updatedIncoming = bookings.incoming.filter(b => b.id !== id);
      const target = bookings.incoming.find(b => b.id === id);
      
      if (target) {
        if (action === 'approve') {
             // Move to completed for demo purposes or keep as approved
             target.status = 'approved'; 
             // In a real app this would go to an 'active' list
        }
      }
      setBookings(prev => ({ ...prev, incoming: updatedIncoming }));
  };

  const BookingItem = ({ booking, showActions = false }: { booking: any, showActions?: boolean }) => {
     const days = differenceInDays(new Date(booking.end_date), new Date(booking.start_date)) + 1;
     return (
        <Card className="p-4 mb-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden shadow-inner">
                    <img src={booking.tool_image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-900">{booking.tool_name}</h3>
                            <p className="text-sm text-gray-500">
                                {showActions ? `Renter: ${booking.renter_name}` : `Owner: ${booking.owner_name}`}
                            </p>
                        </div>
                        <StatusBadge status={booking.status} />
                    </div>

                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-emerald-500"/> {format(new Date(booking.start_date), "MMM d")} - {format(new Date(booking.end_date), "MMM d")}</span>
                        <span className="flex items-center font-semibold"><DollarSign className="w-4 h-4 mr-1 text-emerald-500"/> ${booking.total_amount}</span>
                    </div>

                    {showActions && (
                        <div className="flex gap-2 mt-3">
                             <button onClick={() => handleAction(booking.id, 'decline')} className="flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
                                 <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
                             </button>
                             <button onClick={() => handleAction(booking.id, 'approve')} className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition shadow-sm">
                                 <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                             </button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
     );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
       <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
       </div>

       <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-full md:w-auto">
           {['incoming', 'outgoing', 'completed'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                     activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                   {tab} <span className="ml-1 text-xs opacity-60">({bookings[tab as keyof typeof bookings].length})</span>
               </button>
           ))}
       </div>

       <div className="min-h-[300px]">
           {bookings[activeTab as keyof typeof bookings].length === 0 ? (
               <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100 shadow-sm">
                   <Wrench className="w-12 h-12 mx-auto mb-3 opacity-20" />
                   <p>No bookings found in this category.</p>
               </div>
           ) : (
               bookings[activeTab as keyof typeof bookings].map((booking: any) => (
                   <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                       <BookingItem booking={booking} showActions={activeTab === 'incoming'} />
                   </motion.div>
               ))
           )}
       </div>
    </div>
  );
};