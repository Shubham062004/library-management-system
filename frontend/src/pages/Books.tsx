import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Plus, Book, Edit3, ShieldAlert, RefreshCw, X, Loader2, ArrowUpDown, Tag, AlertTriangle } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  availableQuantity: number;
  createdAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Books() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);

  // Query variables
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [available, setAvailable] = useState<boolean>(false);
  const [lowStock, setLowStock] = useState<boolean>(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/books', {
        params: {
          page,
          limit: 6,
          search,
          sortBy,
          sortOrder,
          available: available ? 'true' : undefined,
          lowStock: lowStock ? 'true' : undefined,
        },
      });
      if (response.data?.success) {
        setBooks(response.data.data.books);
        setMeta(response.data.data.meta);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch book catalog. Ensure backend server is connected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, sortBy, sortOrder, available, lowStock]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const openCreateModal = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setIsbn('');
    setQuantity(1);
    setAvailableQuantity(1);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (book: BookItem) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setQuantity(book.quantity);
    setAvailableQuantity(book.availableQuantity);
    setFormError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Front-end validations mirroring hardened Zod constraints
    if (!title.trim()) return setFormError('Title is required');
    if (!author.trim()) return setFormError('Author is required');
    if (!/^(?:\d{10}|\d{13})$/.test(isbn)) return setFormError('ISBN must be a valid 10 or 13 character numeric string');
    if (quantity < 0) return setFormError('Total quantity cannot be negative');
    if (availableQuantity < 0) return setFormError('Available quantity cannot be negative');
    if (availableQuantity > quantity) return setFormError('Available quantity cannot exceed total quantity');

    setSubmitting(true);
    try {
      if (editingBook) {
        // Edit Action
        const res = await api.put(`/books/${editingBook.id}`, {
          title,
          author,
          isbn,
          quantity,
          availableQuantity,
        });
        if (res.data?.success) {
          setModalOpen(false);
          fetchBooks();
        }
      } else {
        // Create Action
        const res = await api.post('/books', {
          title,
          author,
          isbn,
          quantity,
          availableQuantity,
        });
        if (res.data?.success) {
          setModalOpen(false);
          setPage(1);
          fetchBooks();
        }
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Transaction failed. Verify parameters and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Book Inventory</h1>
          <p className="text-dark-400 mt-1">Manage cataloged publications, stock copies, and availability.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-500/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Query Filters Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Search title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setPage(1); }}
              className="absolute right-4 top-3.5 text-dark-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => { setAvailable(!available); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              available
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-dark-900 border-dark-800 text-dark-300 hover:border-dark-700 hover:text-white'
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => { setLowStock(!lowStock); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              lowStock
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-dark-900 border-dark-800 text-dark-300 hover:border-dark-700 hover:text-white'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={fetchBooks}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-800 hover:bg-dark-800 text-dark-300 hover:text-white transition-colors justify-center disabled:opacity-50 ml-auto lg:ml-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <ShieldAlert className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Grid List catalog */}
      <div className="glass-panel rounded-2xl border border-dark-800 shadow-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="h-12 bg-dark-800 rounded flex-1" />
                  <div className="h-12 bg-dark-800 rounded flex-1" />
                  <div className="h-12 bg-dark-800 rounded w-24" />
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="bg-brand-500/10 p-4 rounded-full border border-brand-500/20 text-brand-400 inline-block">
                <Book className="w-12 h-12" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-white">No Books Found</h3>
                <p className="text-sm text-dark-400">No catalog items match your search queries. Catalog a publication to begin.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-dark-900/50 border-b border-dark-800 text-dark-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th onClick={() => toggleSort('title')} className="px-6 py-4 cursor-pointer hover:text-white select-none">
                    <span className="flex items-center gap-1.5">
                      Book Details <ArrowUpDown className="w-3.5 h-3.5" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('author')} className="px-6 py-4 cursor-pointer hover:text-white select-none">
                    <span className="flex items-center gap-1.5">
                      Author <ArrowUpDown className="w-3.5 h-3.5" />
                    </span>
                  </th>
                  <th className="px-6 py-4">ISBN</th>
                  <th onClick={() => toggleSort('availableQuantity')} className="px-6 py-4 cursor-pointer hover:text-white select-none">
                    <span className="flex items-center gap-1.5">
                      Stock Status <ArrowUpDown className="w-3.5 h-3.5" />
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/40">
                {books.map((book) => {
                  const isOutOfStock = book.availableQuantity === 0;
                  const isLowStock = book.availableQuantity > 0 && book.availableQuantity <= 2;
                  
                  return (
                    <tr key={book.id} className="hover:bg-dark-900/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
                            <Tag className="w-4 h-4" />
                          </div>
                          <span>{book.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-dark-300 font-medium">{book.author}</td>
                      <td className="px-6 py-4 text-dark-400 font-semibold tracking-wider">{book.isbn}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">
                            {book.availableQuantity} <span className="text-xs text-dark-500">/ {book.quantity} copies</span>
                          </span>
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase animate-pulse">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                              <AlertTriangle className="w-3 h-3" /> Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                              Healthy
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditModal(book)}
                          className="p-2 rounded-lg bg-dark-900 border border-dark-800 hover:border-dark-700 text-dark-300 hover:text-white transition-all active:scale-95 inline-flex items-center gap-1.5 text-xs font-semibold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Catalog</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Toolbar */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 bg-dark-950/40 border-t border-dark-800 flex items-center justify-between gap-4">
            <span className="text-xs text-dark-400 font-semibold">
              Showing Page {meta.page} of {meta.totalPages} ({meta.total} Total Books)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-dark-900 border border-dark-800 text-dark-300 hover:text-white hover:border-dark-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-dark-900 border border-dark-800 text-dark-300 hover:text-white hover:border-dark-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modal Create / Edit Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md glass-panel border border-dark-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="px-6 py-5 border-b border-dark-800 flex items-center justify-between bg-dark-900/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Book className="w-5 h-5 text-brand-400" />
                <span>{editingBook ? 'Update Catalog Details' : 'Catalog New Book Publication'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-dark-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Book Title</label>
                <input
                  type="text"
                  placeholder="e.g. Clean Architecture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Author Name</label>
                <input
                  type="text"
                  placeholder="e.g. Robert C. Martin"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">ISBN Number (10 or 13 Digits)</label>
                <input
                  type="text"
                  placeholder="e.g. 9780134494166"
                  maxLength={13}
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm tracking-wider font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Total Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={quantity}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setQuantity(v);
                      if (!editingBook) setAvailableQuantity(v);
                    }}
                    className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm font-semibold"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Available Stock</label>
                  <input
                    type="number"
                    min={0}
                    max={quantity}
                    value={availableQuantity}
                    onChange={(e) => setAvailableQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-dark-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-dark-900 border border-dark-800 text-dark-300 hover:text-white font-semibold transition-all hover:bg-dark-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all shadow-lg shadow-brand-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingBook ? 'Update Catalog' : 'Catalog Book'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
