import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, ClipboardList, ShieldAlert, RefreshCw, X, Loader2, CheckCircle2, AlertTriangle, ArrowRightLeft } from 'lucide-react';

interface Issuance {
  id: string;
  memberId: string;
  bookId: string;
  issueDate: string;
  targetReturnDate: string;
  actualReturnDate: string | null;
  status: 'ISSUED' | 'RETURNED';
  overdueDays?: number;
  member: {
    name: string;
    email: string;
  };
  book: {
    title: string;
    author: string;
    isbn: string;
  };
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Transactions() {
  const [issuances, setIssuances] = useState<Issuance[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);

  // Queries
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<'all' | 'outstanding' | 'overdue'>('all');

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Checkout Form fields
  const [memberId, setMemberId] = useState('');
  const [bookId, setBookId] = useState('');
  const [targetReturnDate, setTargetReturnDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '/issuances';
      if (filterType === 'outstanding') {
        endpoint = '/issuances/outstanding';
      } else if (filterType === 'overdue') {
        endpoint = '/issuances/overdue';
      }

      const response = await api.get(endpoint, {
        params: {
          page,
          limit: 6,
        },
      });

      if (response.data?.success) {
        setIssuances(response.data.data.issuances);
        setMeta(response.data.data.meta);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch transaction logs. Verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, filterType]);

  const openCheckoutModal = () => {
    setMemberId('');
    setBookId('');
    
    // Default to 14 days in future
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 14);
    setTargetReturnDate(defaultDate.toISOString().split('T')[0]);
    
    setFormError(null);
    setModalOpen(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Front-end validations
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(memberId)) {
      return setFormError('Please enter a valid Member UUID');
    }
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(bookId)) {
      return setFormError('Please enter a valid Book UUID');
    }
    if (!targetReturnDate) {
      return setFormError('Target return date is required');
    }
    if (new Date(targetReturnDate) <= new Date()) {
      return setFormError('Target return date must be in the future');
    }

    setSubmitting(true);
    try {
      const res = await api.post('/issuances', {
        memberId,
        bookId,
        targetReturnDate: new Date(targetReturnDate).toISOString(),
      });
      if (res.data?.success) {
        setModalOpen(false);
        setPage(1);
        setFilterType('all');
        fetchTransactions();
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Issuance failed. Double check stock and member active loan limits.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnBook = async (issuanceId: string) => {
    try {
      const res = await api.put(`/issuances/${issuanceId}/return`);
      if (res.data?.success) {
        fetchTransactions();
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Return failed. Ensure transaction parameters are consistent.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Loan Transactions</h1>
          <p className="text-dark-400 mt-1">Track checkouts, returns, due dates, and fine audits.</p>
        </div>
        <button
          onClick={openCheckoutModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-500/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue/Checkout Book</span>
        </button>
      </div>

      {/* Query Filters buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-dark-900/60 p-1 border border-dark-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => { setFilterType('all'); setPage(1); }}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              filterType === 'all' ? 'bg-brand-600 text-white shadow-md' : 'text-dark-300 hover:text-white'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => { setFilterType('outstanding'); setPage(1); }}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              filterType === 'outstanding' ? 'bg-cyan-600 text-white shadow-md' : 'text-dark-300 hover:text-white'
            }`}
          >
            Outstanding
          </button>
          <button
            onClick={() => { setFilterType('overdue'); setPage(1); }}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              filterType === 'overdue' ? 'bg-amber-600 text-white shadow-md' : 'text-dark-300 hover:text-white'
            }`}
          >
            Overdue
          </button>
        </div>

        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-800 hover:bg-dark-800 text-dark-300 hover:text-white transition-colors justify-center disabled:opacity-50 w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <ShieldAlert className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Datagrid Table view */}
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
          ) : issuances.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="bg-brand-500/10 p-4 rounded-full border border-brand-500/20 text-brand-400 inline-block">
                <ClipboardList className="w-12 h-12" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-white">No Transactions Recorded</h3>
                <p className="text-sm text-dark-400">No borrowing records match your filter criteria. Issue a book to log transactions.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-dark-900/50 border-b border-dark-800 text-dark-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="px-6 py-4">Cardholder</th>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Return Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/40">
                {issuances.map((item) => {
                  const isActive = item.status === 'ISSUED';
                  const isReturned = item.status === 'RETURNED';
                  const isOverdue = isActive && new Date(item.targetReturnDate) < new Date();
                  
                  return (
                    <tr key={item.id} className="hover:bg-dark-900/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{item.member.name}</div>
                        <div className="text-xs text-dark-500 font-semibold">{item.member.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{item.book.title}</div>
                        <div className="text-xs text-dark-500 font-medium">ISBN: {item.book.isbn}</div>
                      </td>
                      <td className="px-6 py-4 text-dark-300 font-medium">
                        {new Date(item.issueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-4 text-dark-300 font-medium">
                        {new Date(item.targetReturnDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-4">
                        {isReturned ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                            Overdue {item.overdueDays ? `(${item.overdueDays} Days)` : ''}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                            Active Outstanding
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isActive && (
                          <button
                            onClick={() => handleReturnBook(item.id)}
                            className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all active:scale-95 shadow-md shadow-emerald-600/10"
                          >
                            Return Book
                          </button>
                        )}
                        {isReturned && (
                          <span className="text-xs text-dark-500 font-semibold italic">
                            Returned on {new Date(item.actualReturnDate!).toLocaleDateString(undefined, { dateStyle: 'short' })}
                          </span>
                        )}
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
              Showing Page {meta.page} of {meta.totalPages} ({meta.total} Total Records)
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

      {/* Interactive Modal Checkout Book Wizard */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md glass-panel border border-dark-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="px-6 py-5 border-b border-dark-800 flex items-center justify-between bg-dark-900/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-brand-400" />
                <span>Issue & Checkout Book Catalog</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-dark-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Member UUID ID</label>
                <input
                  type="text"
                  placeholder="e.g. 52c286e6-df06-44eb-b6df-d6e87f827173"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value.trim())}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm tracking-wider font-semibold"
                  required
                />
                <p className="text-[10px] text-dark-500 font-medium">Unique cardholder ID (Must be valid UUID format).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Book UUID ID</label>
                <input
                  type="text"
                  placeholder="e.g. a6028a0e-df86-4ceb-85df-a0e28c738c82"
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value.trim())}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm tracking-wider font-semibold"
                  required
                />
                <p className="text-[10px] text-dark-500 font-medium">Unique publication catalog ID (Must be valid UUID format).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Target Return Date</label>
                <input
                  type="date"
                  value={targetReturnDate}
                  onChange={(e) => setTargetReturnDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm font-semibold"
                  required
                />
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
                  <span>Issue checkout</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
