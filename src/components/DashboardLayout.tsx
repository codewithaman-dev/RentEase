import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sofa, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  roleBadge: string;
  roleColor: 'purple' | 'amber';
  sidebarItems: SidebarItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  roleBadge,
  roleColor,
  sidebarItems,
  activeTab,
  onTabChange,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed out successfully', 'info');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* Collapsible Sidebar */}
      <aside
        className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between z-30 shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Sidebar Header Logo */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shrink-0">
                <Sofa className="w-5 h-5 text-white" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-black text-white text-base tracking-tight">RentEase</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest -mt-1">
                    Control HQ
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? roleColor === 'purple'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
                        : 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!collapsed && item.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-slate-950/30 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {!collapsed && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-white truncate">{user?.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link to="/" className="hover:text-emerald-400 flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Home
              </Link>
              <span>/</span>
              <span className="capitalize font-semibold text-slate-200">{roleBadge} Panel</span>
              <span>/</span>
              <span className="text-emerald-400 font-bold capitalize">{activeTab}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white">{title}</h1>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              roleColor === 'purple'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {roleBadge}
            </span>

            <Link
              to="/catalog"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Public App View
            </Link>
          </div>
        </header>

        {/* Dashboard Content View */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-950">
          {children}
        </main>

      </div>

    </div>
  );
};
