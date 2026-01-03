import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './Layout';
import { LanguageProvider } from './components/LanguageContext';

// Page Imports
import { Jobs } from './pages/Jobs';
import { JobDetails } from './pages/JobDetails';
import { PostJob } from './pages/PostJob';
import { MyJobs } from './pages/MyJobs';
import { Tools } from './pages/Tools';
import { ToolDetails } from './pages/ToolDetails';
import { AddTool } from './pages/AddTool';
import { MyTools } from './pages/MyTools';
import { Profile } from './pages/Profile';
import { Wallet } from './pages/Wallet';
import { Onboarding } from './pages/Onboarding';
import { Workers } from './pages/Workers';
import { WorkerProfile } from './pages/WorkerProfile';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { Map } from './pages/Map';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';
import { Chat } from './pages/Chat';
import { Messages } from './pages/Messages';
import { Bookings } from './pages/Bookings';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Route without Layout (Onboarding) */}
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Routes with Layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                
                {/* Jobs */}
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/my-jobs" element={<MyJobs />} />
                
                {/* Tools */}
                <Route path="/tools" element={<Tools />} />
                <Route path="/tools/:id" element={<ToolDetails />} />
                <Route path="/add-tool" element={<AddTool />} />
                <Route path="/my-tools" element={<MyTools />} />
                
                {/* User */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/workers" element={<Workers />} />
                <Route path="/worker-profile/:id" element={<WorkerProfile />} />
                
                {/* System */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/map" element={<Map />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/bookings" element={<Bookings />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;