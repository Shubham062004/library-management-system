import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Plus, Users, Edit3, UserCheck, ShieldAlert, RefreshCw, X, Loader2, ArrowUpDown } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipDate: string;
  createdAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  
  // Queries
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/members', {
        params: {
          page,
          limit: 6,
          search,
          sortBy,
          sortOrder,
        },
      });
      if (response.data?.success) {
        setMembers(response.data.data.members);
        setMeta(response.data.data.meta);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to load member records. Ensure backend server is connected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMembers();
  };

  const openCreateModal = () => {
    setEditingMember(null);
    setName('');
    setEmail('');
    setPhone('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone);
    setFormError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Strict frontend validation aligning with hardened Zod rules
    if (!name.trim()) return setFormError('Name is required');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setFormError('Please enter a valid email address');
    if (!/^\d{10}$/.test(phone)) return setFormError('Phone number must be exactly 10 digits');

    setSubmitting(true);
    try {
      if (editingMember) {
        // Edit Action
        const res = await api.put(`/members/${editingMember.id}`, { name, email, phone });
        if (res.data?.success) {
          setModalOpen(false);
          fetchMembers();
        }
      } else {
        // Create Action
        const res = await api.post('/members', { name, email, phone });
        if (res.data?.success) {
          setModalOpen(false);
          setPage(1);
          fetchMembers();
        }
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Transaction failed. Check parameters and try again.');
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
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Registered Members</h1>
          <p className="text-dark-400 mt-1">Manage library cardholders, account statuses, and fines.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Query Search Filters Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none"
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
        <button
          onClick={fetchMembers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-900 border border-dark-800 hover:bg-dark-800 text-dark-300 hover:text-white transition-colors w-full md:w-auto justify-center disabled:opacity-50"
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
          ) : members.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="bg-brand-500/10 p-4 rounded-full border border-brand-500/20 text-brand-400 inline-block">
                <Users className="w-12 h-12" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-white">No Members Found</h3>
                <p className="text-sm text-dark-400">No member records match your query parameters. Register a cardholder to begin.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-dark-900/50 border-b border-dark-800 text-dark-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th onClick={() => toggleSort('name')} className="px-6 py-4 cursor-pointer hover:text-white select-none">
                    <span className="flex items-center gap-1.5">
                      Cardholder <ArrowUpDown className="w-3.5 h-3.5" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('email')} className="px-6 py-4 cursor-pointer hover:text-white select-none">
                    <span className="flex items-center gap-1.5">
                      Email <ArrowUpDown className="w-3.5 h-3.5" />
                    </span>
                  </th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/40">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-dark-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-display font-bold text-sm">
                          {member.name.charAt(0)}
                        </div>
                        <span>{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-300 font-medium">{member.email}</td>
                    <td className="px-6 py-4 text-dark-400 font-semibold tracking-wider">{member.phone}</td>
                    <td className="px-6 py-4 text-dark-400">
                      {new Date(member.membershipDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(member)}
                        className="p-2 rounded-lg bg-dark-900 border border-dark-800 hover:border-dark-700 text-dark-300 hover:text-white transition-all active:scale-95 inline-flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Toolbar */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 bg-dark-950/40 border-t border-dark-800 flex items-center justify-between gap-4">
            <span className="text-xs text-dark-400 font-semibold">
              Showing Page {meta.page} of {meta.totalPages} ({meta.total} Total Members)
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
                <UserCheck className="w-5 h-5 text-brand-400" />
                <span>{editingMember ? 'Update Cardholder Credentials' : 'Register New Library Member'}</span>
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
                <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john@doe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Phone Number (10 Digits)</label>
                <input
                  type="text"
                  placeholder="e.g. 5550199001"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white focus:outline-none text-sm tracking-wider font-semibold"
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
                  <span>{editingMember ? 'Save Updates' : 'Complete Register'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
