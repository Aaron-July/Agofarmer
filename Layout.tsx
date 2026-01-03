import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Briefcase, Wrench, Map, Wallet, 
  Settings, LogOut, Menu, X, Bell, MessageSquare, User
} from 'lucide-react';
import { useLanguage } from './components/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Scroll main content to top on route change
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [path]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const NavItem = ({ to, icon: Icon, label, exact = false }: { to: string, icon: any, label: string, exact?: boolean }) => {
    const isActive = exact ? path === to : path.startsWith(to);
    return (
      <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 mb-1 font-medium ${
          isActive 
            ? 'bg-emerald-600 text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
        <span>{label}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full px-4 py-6">
       {/* Profile Widget */}
       <div className="bg-emerald-50 p-4 rounded-2xl mb-8 border border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                <User className="w-6 h-6" />
             </div>
             <div className="overflow-hidden">
                <h3 className="font-bold text-gray-900 truncate">aaronjulya</h3>
                <span className="inline-block bg-emerald-200 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium">Farmer</span>
             </div>
          </div>
          <div>
             <p className="text-xs text-gray-500 mb-0.5">Wallet Balance</p>
             <p className="text-emerald-600 font-bold text-xl">$0.00</p>
          </div>
       </div>

       {/* Navigation */}
       <nav className="flex-1 space-y-1">
          <NavItem to="/" icon={Home} label="Home" exact />
          <NavItem to="/jobs" icon={Briefcase} label="Jobs" />
          <NavItem to="/tools" icon={Wrench} label="Tools" />
          <NavItem to="/map" icon={Map} label="Map" />
          <NavItem to="/wallet" icon={Wallet} label="Wallet" />
       </nav>

       {/* Bottom Actions */}
       <div className="pt-4 mt-4 border-t border-gray-100 space-y-1">
          <NavItem to="/settings" icon={Settings} label="Settings" />
          <Link
            to="/onboarding"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-50 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Top Header */}
      <header className="h-16 flex-shrink-0 bg-white border-b border-gray-200 z-30 px-4 md:px-6 flex items-center justify-between shadow-sm relative">
        <div className="flex items-center gap-3">
            <button onClick={toggleMenu} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                 <Wrench className="w-4 h-4 text-white" />
               </div>
               <span className="text-xl font-bold text-emerald-600 tracking-tight">AgroFarmer</span>
            </div>
        </div>

        <div className="flex items-center gap-4">
           <Link to="/messages" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
              <MessageSquare className="w-5 h-5" />
           </Link>
           <Link to="/notifications" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
           </Link>
           <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-emerald-200 transition">
              <User className="w-4 h-4" />
           </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative">
          
          {/* Sidebar Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto z-20">
             <SidebarContent />
          </aside>

          {/* Sidebar Mobile */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-black bg-opacity-20 md:hidden" onClick={toggleMenu}></div>
          )}
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
             <div className="absolute top-4 right-4 z-50">
               <button onClick={toggleMenu}><X className="w-6 h-6 text-gray-500" /></button>
             </div>
             <div className="pt-16 h-full">
                <SidebarContent />
             </div>
          </div>

          {/* Main Content */}
          <main ref={mainRef} className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 w-full">
            <div className="max-w-7xl mx-auto pb-10">
              {children}
            </div>
          </main>
      </div>
    </div>
  );
};