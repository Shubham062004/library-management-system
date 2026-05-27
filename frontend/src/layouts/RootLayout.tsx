import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, ClipboardList, LayoutDashboard, Menu, LogOut } from 'lucide-react';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Books', path: '/books', icon: BookOpen },
    { label: 'Members', path: '/members', icon: Users },
    { label: 'Transactions', path: '/transactions', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen flex bg-dark-950 text-dark-100 font-sans">
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-dark-900 border-r border-dark-800 lg:static lg:translate-x-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-dark-800 gap-3">
          <div className="bg-brand-500 p-2 rounded-xl text-white shadow-lg shadow-brand-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-display font-extrabold text-white tracking-tight">LuminaLib</h2>
            <span className="text-[10px] font-semibold text-brand-400 uppercase tracking-widest">Management</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-dark-400 hover:bg-dark-800 hover:text-white'}`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-dark-400 group-hover:text-white'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Profile */}
        <div className="p-4 border-t border-dark-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 font-semibold border border-brand-500/20">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-dark-400">admin@luminalib.com</p>
            </div>
          </div>
          <button className="p-2 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header navbar */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-8 border-b border-dark-800 bg-dark-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 rounded-lg text-dark-300 hover:bg-dark-900 border border-dark-800 lg:hidden transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-white capitalize hidden lg:block">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
              v1.0.0 Stable
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
