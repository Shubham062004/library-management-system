import { BookOpen, Users, ClipboardList, AlertCircle, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Books', value: '1,248', icon: BookOpen, color: 'text-violet-400 bg-violet-500/10' },
    { label: 'Active Borrows', value: '84', icon: ClipboardList, color: 'text-cyan-400 bg-cyan-500/10' },
    { label: 'Active Members', value: '312', icon: Users, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Overdue Books', value: '7', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Dashboard Overview</h1>
        <p className="text-dark-400 mt-1">Welcome back, Admin. Here is what is happening at LuminaLib today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel p-6 rounded-2xl flex items-center justify-between glass-card-hover">
              <div className="space-y-2">
                <span className="text-sm font-medium text-dark-400">{stat.label}</span>
                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart Mock */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Borrowing Analytics</h3>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4% this week
            </span>
          </div>
          {/* Custom CSS/SVG Bar Chart */}
          <div className="h-60 flex items-end justify-between gap-3 pt-6 border-b border-dark-800">
            {[45, 60, 55, 75, 50, 80, 95].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div 
                  className="w-full bg-gradient-to-t from-brand-600 to-violet-400 rounded-t-lg transition-all duration-500 group-hover:from-brand-500 group-hover:to-cyan-400" 
                  style={{ height: `${val}%` }}
                ></div>
                <span className="text-xs text-dark-400 mt-2">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Quick Tasks</h3>
            <p className="text-xs text-dark-400">Perform quick operational tasks instantly.</p>
          </div>
          
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-all duration-300 shadow-lg shadow-brand-500/20 group">
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Issue/Checkout Book
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-dark-900 hover:bg-dark-800 border border-dark-800 hover:border-dark-700 text-white font-medium transition-all duration-300 group">
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add New Member
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
