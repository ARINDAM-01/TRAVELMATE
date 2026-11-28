import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Sparkles,
  Globe,
  Network,
  Map as MapIcon,
  Wallet,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Plane,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Trips', path: '/dashboard/trips', icon: MapPin },
  { label: 'AI Trip Planner', path: '/dashboard/planner', icon: Sparkles, badge: 'AI' },
  { label: 'Explore Destinations', path: '/dashboard/explore', icon: Globe },
  { label: 'Travel Graph', path: '/dashboard/graph', icon: Network, highlight: true },
  { label: 'Interactive Maps', path: '/dashboard/maps', icon: MapIcon },
  { label: 'Budget Manager', path: '/dashboard/budget', icon: Wallet },
  { label: 'Favorites', path: '/dashboard/favorites', icon: Heart },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const DashboardLayout = ({ children, activeTitle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0D13] via-[#0E1118] to-[#0B0D13] text-white flex">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0E1118] border-r border-white/[0.08] z-30 shrink-0 select-none">
        {/* Brand header */}
        <div className="h-20 flex items-center px-6 border-b border-white/[0.08]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/[0.06] border border-white/10 rounded-xl flex items-center justify-center shadow-md">
              <Plane className="text-white" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                Travel<span className="text-neutral-400">Mate</span>
              </span>
              <span className="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold">
                Platform Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-white/[0.08] text-white border border-white/15 shadow-sm font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3.5">
                  <Icon size={18} className={isActive ? 'text-amber-400' : 'text-neutral-500'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-white/10 text-neutral-300 border border-white/10">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile card & Logout */}
        <div className="p-4 border-t border-white/[0.08]">
          <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.06] mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Traveler'}</p>
                <p className="text-[11px] text-white/40 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR DRAWER ================= */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-[#0E1118] border-r border-white/[0.08] flex flex-col h-full z-10">
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/[0.08] border border-white/10 rounded-xl flex items-center justify-center">
                  <Plane className="text-white" size={18} />
                </div>
                <span className="text-lg font-bold text-white">TravelMate</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium
                      ${
                        isActive
                          ? 'bg-white/[0.08] text-white border border-white/15'
                          : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/[0.08]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-[#0E1118] border-b border-white/[0.08] px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5"
            >
              <Menu size={22} />
            </button>
            {activeTitle && (
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeTitle}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/dashboard/planner">
              <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all">
                <Sparkles size={14} className="text-amber-500" />
                Plan with AI
              </button>
            </Link>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden md:block text-sm font-semibold text-white/90">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
