import React from 'react';
import { Search, Plus, Filter, ClipboardList } from 'lucide-react';

export default function Transactions() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Loan Transactions</h1>
          <p className="text-dark-400 mt-1">Track checkouts, returns, due dates, and fine payments.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-brand-500/20 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Issue/Checkout Book
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-dark-400" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full pl-11 pr-4 py-3 rounded-xl glass-input"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-900 border border-dark-800 hover:bg-dark-800 text-dark-300 transition-colors w-full md:w-auto justify-center">
          <Filter className="w-4 h-4" /> Filter Log
        </button>
      </div>

      <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-brand-500/10 p-4 rounded-full border border-brand-500/20 text-brand-400">
          <ClipboardList className="w-12 h-12" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-bold text-white">No Transactions Recorded</h3>
          <p className="text-sm text-dark-400">The foundational loan history logger is active. Setup PR is ready to merge.</p>
        </div>
      </div>
    </div>
  );
}
