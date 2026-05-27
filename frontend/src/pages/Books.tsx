import { Search, Plus, Filter, Book } from 'lucide-react';

export default function Books() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Book Inventory</h1>
          <p className="text-dark-400 mt-1">Manage cataloged publications, stock copies, and availability.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-brand-500/20 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add New Book
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-dark-400" />
          <input 
            type="text" 
            placeholder="Search title, author, or ISBN..." 
            className="w-full pl-11 pr-4 py-3 rounded-xl glass-input"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-900 border border-dark-800 hover:bg-dark-800 text-dark-300 transition-colors w-full md:w-auto justify-center">
          <Filter className="w-4 h-4" /> Filter Catalog
        </button>
      </div>

      <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-brand-500/10 p-4 rounded-full border border-brand-500/20 text-brand-400">
          <Book className="w-12 h-12" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-bold text-white">No Books Cataloged Yet</h3>
          <p className="text-sm text-dark-400">The foundational inventory architecture is active. Setup PR is ready to merge.</p>
        </div>
      </div>
    </div>
  );
}
