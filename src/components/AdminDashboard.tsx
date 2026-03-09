import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  LayoutDashboard,
  Box,
  Table as TableIcon,
  PieChart as PieChartIcon,
  Map as MapIcon,
  Layers,
  ChevronRight,
  Menu,
  ArrowLeft,
  Settings,
  ChevronDown,
  Check,
  Car,
  X,
  Camera,
  UserPlus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simplified dashboard, no data fetching needed for now
    setLoading(false);
  }, []);

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#050505] text-slate-900 dark:text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 transition-all duration-300 flex flex-col z-50`}>
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
              <Car className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">Wheelzie</span>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 transition-colors cursor-pointer"
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {sidebarOpen ? <ArrowLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <NavItem icon={LayoutDashboard} label="Dashboard" active sidebarOpen={sidebarOpen} />
        </nav>

        <div className="p-3 mt-auto border-t border-slate-100 dark:border-white/5">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-xs">
            <ArrowLeft className="w-4 h-4" />
            {sidebarOpen && 'Logout'}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg lg:hidden cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs w-48 focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <IconButton icon={Settings} onClick={() => setIsProfileModalOpen(true)} />
              <IconButton icon={Bell} badge />
            </div>
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2.5 pl-4 border-l border-slate-200 dark:border-white/10 hover:opacity-80 transition-opacity cursor-pointer text-left"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-0.5">{user?.name || 'Admin User'}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user?.username || 'admin'}</p>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-brand-500/20">
                <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </button>
          </div>
        </header>

        {/* Profile Modal */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Profile Settings</h2>
                  <button 
                    onClick={() => setIsProfileModalOpen(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  updateUser({
                    name: formData.get('name') as string,
                    username: formData.get('username') as string,
                    email: formData.get('email') as string,
                    avatar: formData.get('avatar') as string,
                  });
                  setIsProfileModalOpen(false);
                }}>
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-500/20">
                        <img 
                          src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"} 
                          alt="Profile Large" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click to change avatar</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                      <input 
                        name="name"
                        type="text" 
                        defaultValue={user?.name}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                      <input 
                        name="username"
                        type="text" 
                        defaultValue={user?.username}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                      <input 
                        name="email"
                        type="email" 
                        defaultValue={user?.email}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Avatar URL</label>
                      <input 
                        name="avatar"
                        type="text" 
                        defaultValue={user?.avatar}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-4 bg-brand-500 text-white font-black rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-95 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            
            {/* Left Column: Main Dashboard */}
            <div className="xl:col-span-3 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard label="Total Users" value="1,284" change="+12.5%" icon={UserPlus} />
                <StatsCard label="Active Searches" value="452" change="+5.2%" icon={Search} />
                <StatsCard label="Reports Generated" value="89" change="-2.4%" icon={TableIcon} />
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
                  <button className="text-xs font-bold text-brand-500 uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                          <Car className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">New VIN Lookup</p>
                          <p className="text-xs text-slate-500">User searched for 1HGCM82633A004352</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2 mins ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Info */}
            <div className="space-y-8">
              <div className="bg-brand-500 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <h4 className="text-lg font-black mb-2 relative z-10">Pro Plan Active</h4>
                <p className="text-xs text-white/80 mb-6 relative z-10">You have access to all premium features and unlimited reports.</p>
                <button className="w-full py-3 bg-white text-brand-500 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors relative z-10">Manage Plan</button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10">
                <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight mb-6">System Status</h4>
                <div className="space-y-4">
                  <StatusItem label="API Status" status="Operational" color="bg-emerald-500" />
                  <StatusItem label="Database" status="Operational" color="bg-emerald-500" />
                  <StatusItem label="Storage" status="92% Full" color="bg-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false, sidebarOpen, badge, hasSubmenu = false }: any) => (
  <button 
    type="button"
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
      active ? 'bg-brand-500/10 text-brand-500' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
      {sidebarOpen && <span className="text-sm font-bold whitespace-nowrap">{label}</span>}
    </div>
    {sidebarOpen && (
      <div className="flex items-center gap-2">
        {badge && <span className="w-4 h-4 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full">{badge}</span>}
        {hasSubmenu && <ChevronDown className="w-3 h-3 opacity-50" />}
      </div>
    )}
  </button>
);

const IconButton = ({ icon: Icon, badge, onClick }: any) => (
  <button 
    type="button"
    onClick={onClick}
    className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg relative hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
  >
    <Icon className="w-4 h-4 text-slate-500" />
    {badge && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800"></span>}
  </button>
);

const StatsCard = ({ label, value, change, icon: Icon }: any) => (
  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-brand-500" />
      </div>
      <span className={`text-xs font-black px-2 py-1 rounded-lg ${change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        {change}
      </span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
  </div>
);

const StatusItem = ({ label, status, color }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-xs font-bold text-slate-500">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{status}</span>
    </div>
  </div>
);

