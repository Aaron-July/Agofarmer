import React from 'react';
import { ShieldAlert, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserNotRegisteredErrorProps {
  message?: string;
}

export const UserNotRegisteredError: React.FC<UserNotRegisteredErrorProps> = ({ 
  message = "You must be a registered member to access this feature." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-100 rounded-xl">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Access Restricted</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{message}</p>
      <Link 
        to="/onboarding" 
        className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
      >
        <LogIn className="w-4 h-4" />
        <span>Sign In / Register</span>
      </Link>
    </div>
  );
};