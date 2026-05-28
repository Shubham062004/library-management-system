import { useEffect, useState } from 'react';
import api from '../api/axios';
import { BookOpen, Users, ClipboardList, AlertCircle, TrendingUp, Plus, ArrowRight, RefreshCw, Calendar, ShieldAlert } from 'lucide-react';

interface Stats {
  totalBooks: number;
  totalMembers: number;
  activeIssuances: number;
  overdueBooks: number;
}

interface OutstandingIssuance {
  id: string;
  member: {
    name: string;
    email: string;
  };
  book: {
    title: string;
    author: string;
  };
  issueDate: string;
  targetReturnDate: string;
  status: string;
}

interface OverdueIssuance {
  id: string;
  member: {
    name: string;
    email: string;
  };
  book: {
    title: string;
    author: string;
  };
  targetReturnDate: string;
  overdueDays: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [outstanding, setOutstanding] = useState<OutstandingIssuance[]>([]);
  const [overdue, setOverdue] = useState<OverdueIssuance[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, outstandingRes, overdueRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/issuances/outstanding?limit=5'),
        api.get('/issuances/overdue?limit=5'),
      ]);

      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
      if (outstandingRes.data?.success) {
        setOutstanding(outstandingRes.data.data.issuances);
      }
      if (overdueRes.data?.success) {
        setOverdue(overdueRes.data.data.issuances);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch library dashboard metrics. Please check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cards = [
    {
      label: 'Total Cataloged Books',
      value: stats ? stats.totalBooks : '-',
      icon: BookOpen,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/25',
    },
    {
      label: 'Active Member Cards',
      value: stats ? stats.totalMembers : '-',
      icon: Users,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    },
    {
      label: 'Active Outstanding Borrows',
      value: stats ? stats.activeIssuances : '-',
      icon: ClipboardList,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
    },
    {
      label: 'Overdue Active Borrows',
      value: stats ? stats.overdueBooks : '-',
      icon: AlertCircle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Dashboard Overview</h1>
          <p className="text-dark-400 mt-1">LuminaLib system-wide borrow activities, stats tracking, and overdue audits.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-800 text-dark-300 hover:text-white hover:border-dark-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit</span>
        </button>
      </div>

      {error && (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <ShieldAlert className="w-8 h-8 flex-shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <h4 className="font-semibold text-white">Data Sync Interrupted</h4>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-white rounded-xl font-medium transition-all text-xs"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-dark-800 animate-pulse">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-dark-800 rounded w-2/3" />
                  <div className="h-8 bg-dark-800 rounded w-1/3" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-dark-800" />
              </div>
            ))
          : cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="glass-panel p-6 rounded-2xl flex items-center justify-between glass-card-hover border border-dark-800 shadow-lg relative overflow-hidden">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">{card.label}</span>
                    <h3 className="text-3xl font-extrabold text-white tracking-tight">{card.value}</h3>
                  </div>
                  <div className={`p-4 rounded-xl border ${card.color}`}>
                    <Icon className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
              );
            })}
      </div>

      {/* Visual columns and metrics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Borrowing Analytics Graph */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-6 border border-dark-800 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Weekly Borrowing Trends</h3>
              <p className="text-xs text-dark-400">Aggregates member checkouts over elapsed period.</p>
            </div>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 animate-bounce" /> +12.4% this week
            </span>
          </div>
          <div className="h-60 flex items-end justify-between gap-3 pt-6 border-b border-dark-800">
            {[45, 60, 55, 75, 50, 80, 95].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div 
                  className="w-full bg-gradient-to-t from-brand-600 to-violet-400 rounded-t-lg transition-all duration-500 group-hover:from-brand-500 group-hover:to-cyan-400 shadow-lg shadow-brand-600/15" 
                  style={{ height: `${val}%` }}
                ></div>
                <span className="text-[10px] font-semibold text-dark-400 mt-2 uppercase">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Task action buttons */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 border border-dark-800 shadow-xl">
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">Administrative Actions</h3>
            <p className="text-xs text-dark-400">Perform standard operations with single clicks.</p>
          </div>
          
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all duration-300 shadow-xl shadow-brand-500/20 group">
              <span className="flex items-center gap-2.5">
                <Plus className="w-4 h-4" /> Issue new Book
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-dark-900 hover:bg-dark-800 border border-dark-800 hover:border-dark-700 text-white font-semibold transition-all duration-300 group">
              <span className="flex items-center gap-2.5">
                <Plus className="w-4 h-4" /> Register new Member
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Tables section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Outstanding Borrowings Table */}
        <div className="glass-panel rounded-2xl border border-dark-800 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-dark-800">
            <h3 className="text-lg font-bold text-white">Active Outstanding Borrows</h3>
            <p className="text-xs text-dark-400 mt-1">Currently unreturned book items with members details.</p>
          </div>
          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="h-10 bg-dark-800 rounded flex-1" />
                    <div className="h-10 bg-dark-800 rounded flex-1" />
                    <div className="h-10 bg-dark-800 rounded w-20" />
                  </div>
                ))}
              </div>
            ) : outstanding.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <ClipboardList className="w-12 h-12 text-dark-600 mx-auto" />
                <p className="text-sm font-semibold text-dark-400">No Outstanding Borrows found</p>
                <p className="text-xs text-dark-500">All issued books have been successfully returned.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-dark-900/50 border-b border-dark-800 text-dark-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="px-6 py-4">Cardholder</th>
                    <th className="px-6 py-4">Book Title</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Target Return</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800/40">
                  {outstanding.map((row) => (
                    <tr key={row.id} className="hover:bg-dark-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{row.member.name}</div>
                        <div className="text-xs text-dark-500">{row.member.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{row.book.title}</div>
                        <div className="text-xs text-dark-500">{row.book.author}</div>
                      </td>
                      <td className="px-6 py-4 text-dark-300 font-medium">
                        {new Date(row.issueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-4 text-dark-300 font-medium">
                        {new Date(row.targetReturnDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Overdue Borrowings Table */}
        <div className="glass-panel rounded-2xl border border-dark-800 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-dark-800">
            <h3 className="text-lg font-bold text-white text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse" />
              <span>Overdue Borrows Audit</span>
            </h3>
            <p className="text-xs text-dark-400 mt-1">Active borrow items exceeding target return deadline bounds.</p>
          </div>
          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="h-10 bg-dark-800 rounded flex-1" />
                    <div className="h-10 bg-dark-800 rounded flex-1" />
                    <div className="h-10 bg-dark-800 rounded w-16" />
                  </div>
                ))}
              </div>
            ) : overdue.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <Calendar className="w-12 h-12 text-dark-600 mx-auto" />
                <p className="text-sm font-semibold text-dark-400">No Overdue Books found</p>
                <p className="text-xs text-dark-500">Perfect! All cardholders returned items within return schedules.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-dark-900/50 border-b border-dark-800 text-dark-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="px-6 py-4">Cardholder</th>
                    <th className="px-6 py-4">Book Title</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Elapsed Late</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800/40">
                  {overdue.map((row) => (
                    <tr key={row.id} className="hover:bg-dark-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{row.member.name}</div>
                        <div className="text-xs text-dark-500">{row.member.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{row.book.title}</div>
                        <div className="text-xs text-dark-500">{row.book.author}</div>
                      </td>
                      <td className="px-6 py-4 text-amber-400 font-semibold">
                        {new Date(row.targetReturnDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold animate-pulse">
                          {row.overdueDays} Days Overdue
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
