import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Search, MessageSquare, Loader2 } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";

const MOCK_CONVERSATIONS = [
    {
        otherUserId: 'u2',
        otherUserName: 'Jane Smith',
        otherUserAvatar: 'https://picsum.photos/100/100?random=2',
        lastMessage: { content: 'Is the tractor still available?', created_date: new Date().toISOString(), sender_id: 'u2' },
        unreadCount: 2
    },
    {
        otherUserId: 'u3',
        otherUserName: 'Mike Tools',
        otherUserAvatar: 'https://picsum.photos/100/100?random=3',
        lastMessage: { content: 'I can deliver it by tomorrow morning.', created_date: new Date(Date.now() - 86400000).toISOString(), sender_id: 'me' },
        unreadCount: 0
    }
];

export const Messages = () => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
        setConversations(MOCK_CONVERSATIONS);
        setLoading(false);
    }, 600);
  }, []);

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return "Yesterday";
    }
    return format(date, "MMM d");
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm">Your conversations</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 h-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Conversations List */}
      <div className="space-y-3">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv, index) => (
            <motion.div
              key={conv.otherUserId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to="/chat">
                <Card className={`p-4 hover:shadow-md transition-all cursor-pointer ${
                  conv.unreadCount > 0 ? "bg-emerald-50 border-emerald-200" : "bg-white"
                }`}>
                  <div className="flex items-center gap-4">
                    <img 
                        src={conv.otherUserAvatar} 
                        alt={conv.otherUserName}
                        className="w-12 h-12 rounded-full bg-gray-200 object-cover" 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium truncate ${conv.unreadCount > 0 ? "text-gray-900" : "text-gray-700"}`}>
                          {conv.otherUserName}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {formatMessageTime(conv.lastMessage.created_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate max-w-[85%] ${
                          conv.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"
                        }`}>
                          {conv.lastMessage.sender_id === 'me' && "You: "}
                          {conv.lastMessage.content}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center bg-white border border-gray-100 rounded-xl">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-500">Start a conversation with a worker or farmer</p>
          </div>
        )}
      </div>
    </div>
  );
}