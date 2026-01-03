import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Send, Phone, MoreVertical, 
  Image, Mic, Loader2, Bot
} from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";
import { chatWithAI } from '../services/geminiService';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isAi?: boolean;
}

export const Chat = () => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock Profile
  const profile = { id: 'me', name: 'You' };
  const otherUser = { id: 'ai', name: 'AgroBot', avatar: null, role: 'Assistant' };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
        setMessages([
            { id: '1', senderId: 'ai', content: 'Hi! I am AgroBot. How can I help you today?', timestamp: new Date().toISOString(), isAi: true }
        ]);
        setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'me',
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setNewMessage("");
    inputRef.current?.focus();

    try {
        // AI Response
        const aiResponse = await chatWithAI(userMsg.content);
        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            senderId: 'ai',
            content: aiResponse,
            timestamp: new Date().toISOString(),
            isAi: true
        };
        setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error(error);
    }
    setSending(false);
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    }
    return format(date, "MMMM d, yyyy");
  };

  const shouldShowDate = (index: number) => {
    if (index === 0) return true;
    const currentDate = new Date(messages[index].timestamp).toDateString();
    const previousDate = new Date(messages[index - 1].timestamp).toDateString();
    return currentDate !== previousDate;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-100">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
            <Bot className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
          <p className="text-xs text-brand-600 flex items-center">
             <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
          </p>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div key={message.id}>
            {shouldShowDate(index) && (
              <div className="text-center my-4">
                <span className="text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
                  {formatMessageDate(message.timestamp)}
                </span>
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.senderId === profile.id ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                message.senderId === profile.id
                  ? "bg-brand-600 text-white rounded-br-none"
                  : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
              }`}>
                <p className="break-words text-sm">{message.content}</p>
                <p className={`text-[10px] mt-1 text-right ${
                  message.senderId === profile.id ? "text-brand-100" : "text-gray-400"
                }`}>
                  {format(new Date(message.timestamp), "h:mm a")}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <Image className="w-5 h-5" />
          </button>
          
          <input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 h-10 px-4 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
          />
          
          <button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                newMessage.trim() 
                ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;