import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Wallet,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertCircle,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle,
  Sparkles,
  ArrowUpDown,
  Filter,
  Layers,
  Search,
  Tag,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { EXPENSE_CATEGORIES, CURRENCY_LIST } from '../utils/constants';

const Budget = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(tripIdParam || '');
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncingAi, setSyncingAi] = useState(false);

  // Sorting and filtering state
  const [categorySort, setCategorySort] = useState('amount-desc'); // amount-desc, amount-asc, name-asc, name-desc, estimated-desc, actual-desc
  const [ledgerSort, setLedgerSort] = useState('category-asc'); // category-asc, category-desc, amount-desc, amount-asc, date-desc, date-asc, title-asc
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all'); // all, actual, estimated
  const [searchQuery, setSearchQuery] = useState('');
  const [groupByCategory, setGroupByCategory] = useState(false);

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'food',
    amount: '',
    currency: 'INR',
    date: new Date().toISOString().split('T')[0],
    isEstimated: false,
    description: '',
  });

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const { data } = await api.get('/trips');
        setTrips(data.data);
        if (!selectedTripId && data.data.length > 0) {
          setSelectedTripId(data.data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadTrips();
  }, []);

  const fetchBudgetDetails = async (tripId) => {
    if (!tripId) return;
    setLoading(true);
    try {
      const [expRes, anaRes] = await Promise.all([
        api.get(`/expenses/${tripId}`),
        api.get(`/analytics/${tripId}`),
      ]);
      setExpenses(expRes.data.data.expenses);
      setAnalytics(anaRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTripId) {
      fetchBudgetDetails(selectedTripId);
    }
  }, [selectedTripId]);

  // Sync AI Cost Planning to Budget
  const handleSyncAiBudget = async () => {
    if (!selectedTripId) return;
    setSyncingAi(true);
    try {
      await api.post(`/ai/sync-budget/${selectedTripId}`);
      await fetchBudgetDetails(selectedTripId);
      alert('AI cost planning successfully synchronized with your budget by category!');
    } catch (err) {
      alert(extractError(err));
    } finally {
      setSyncingAi(false);
    }
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tripId: selectedTripId,
        amount: parseFloat(formData.amount),
      };

      if (editingId) {
        await api.put(`/expenses/${editingId}`, payload);
      } else {
        await api.post('/expenses', payload);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        title: '',
        category: 'food',
        amount: '',
        currency: analytics?.currency || 'INR',
        date: new Date().toISOString().split('T')[0],
        isEstimated: false,
        description: '',
      });
      fetchBudgetDetails(selectedTripId);
    } catch (err) {
      alert(extractError(err));
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense entry?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchBudgetDetails(selectedTripId);
    } catch (err) {
      alert(extractError(err));
    }
  };

  const handleEditClick = (exp) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      category: exp.category,
      amount: exp.amount,
      currency: exp.currency,
      date: exp.date ? new Date(exp.date).toISOString().split('T')[0] : '',
      isEstimated: exp.isEstimated,
      description: exp.description || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenAddForCategory = (categoryKey) => {
    setEditingId(null);
    setFormData({
      title: '',
      category: categoryKey,
      amount: '',
      currency: analytics?.currency || 'INR',
      date: new Date().toISOString().split('T')[0],
      isEstimated: false,
      description: '',
    });
    setIsModalOpen(true);
  };

  // Category Color & Meta Map
  const categoryMetaMap = useMemo(() => {
    return EXPENSE_CATEGORIES.reduce((acc, cat) => {
      acc[cat.value] = cat;
      return acc;
    }, {});
  }, []);

  const categoryColorMap = useMemo(() => {
    return EXPENSE_CATEGORIES.reduce((acc, cat) => {
      acc[cat.value] = cat.color;
      return acc;
    }, {});
  }, []);

  // Sorted Categories for Per-Category Breakdown
  const sortedCategories = useMemo(() => {
    if (!analytics?.byCategory) return [];

    const list = [...analytics.byCategory].map((cat) => {
      const meta = categoryMetaMap[cat.category] || {
        label: cat.category,
        icon: '🏷️',
        color: '#3B82F6',
      };
      return {
        ...cat,
        label: meta.label,
        icon: meta.icon,
        color: meta.color,
      };
    });

    switch (categorySort) {
      case 'amount-desc':
        return list.sort((a, b) => b.amount - a.amount);
      case 'amount-asc':
        return list.sort((a, b) => a.amount - b.amount);
      case 'name-asc':
        return list.sort((a, b) => a.label.localeCompare(b.label));
      case 'name-desc':
        return list.sort((a, b) => b.label.localeCompare(a.label));
      case 'estimated-desc':
        return list.sort((a, b) => (b.estimated || 0) - (a.estimated || 0));
      case 'actual-desc':
        return list.sort((a, b) => (b.actual || 0) - (a.actual || 0));
      case 'percentage-desc':
        return list.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
      default:
        return list;
    }
  }, [analytics?.byCategory, categorySort, categoryMetaMap]);

  // Filtered and Sorted Expenses Ledger
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter by Category
    if (selectedCategoryFilter !== 'all') {
      result = result.filter((e) => e.category === selectedCategoryFilter);
    }

    // Filter by Type
    if (selectedTypeFilter === 'actual') {
      result = result.filter((e) => !e.isEstimated);
    } else if (selectedTypeFilter === 'estimated') {
      result = result.filter((e) => e.isEstimated);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q)
      );
    }

    // Sort with per category or other dimensions
    result.sort((a, b) => {
      switch (ledgerSort) {
        case 'category-asc':
          return (a.category || '').localeCompare(b.category || '');
        case 'category-desc':
          return (b.category || '').localeCompare(a.category || '');
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'date-desc':
          return new Date(b.date || 0) - new Date(a.date || 0);
        case 'date-asc':
          return new Date(a.date || 0) - new Date(b.date || 0);
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return (a.category || '').localeCompare(b.category || '');
      }
    });

    return result;
  }, [expenses, selectedCategoryFilter, selectedTypeFilter, searchQuery, ledgerSort]);

  // Grouped by Category for Ledger View
  const groupedExpenses = useMemo(() => {
    const groups = {};
    for (const exp of filteredAndSortedExpenses) {
      const catKey = exp.category || 'miscellaneous';
      if (!groups[catKey]) {
        groups[catKey] = {
          category: catKey,
          label: categoryMetaMap[catKey]?.label || catKey,
          icon: categoryMetaMap[catKey]?.icon || '🏷️',
          color: categoryMetaMap[catKey]?.color || '#3B82F6',
          items: [],
          total: 0,
          actual: 0,
          estimated: 0,
        };
      }
      groups[catKey].items.push(exp);
      groups[catKey].total += exp.amount;
      if (exp.isEstimated) {
        groups[catKey].estimated += exp.amount;
      } else {
        groups[catKey].actual += exp.amount;
      }
    }
    return Object.values(groups).sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredAndSortedExpenses, categoryMetaMap]);

  const activeTrip = trips.find((t) => t.id === selectedTripId);

  return (
    <DashboardLayout activeTitle="Budget & Expense Analytics">
      {/* Top Trip Selector & Action Bar */}
      <div className="glass-card p-4 sm:p-5 border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-white/50">Active Trip:</label>
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="bg-navy-secondary border border-white/15 rounded-xl px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:border-electric-blue"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} {t.destinations?.length > 0 ? `(${t.destinations.join(', ')})` : ''}
              </option>
            ))}
          </select>

          {activeTrip?.currency && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 font-mono">
              Currency: {activeTrip.currency}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Sparkles}
            loading={syncingAi}
            onClick={handleSyncAiBudget}
            className="border-electric-cyan/40 text-electric-cyan hover:bg-electric-cyan/10"
            title="Import or synchronize AI cost planning by category for this trip"
          >
            Sync AI Cost Plan
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Sparkles}
            onClick={() => navigate('/dashboard/ai-planner')}
            title="Open AI Trip Planner"
          >
            AI Planner Studio
          </Button>

          <Button
            variant="gradient"
            size="sm"
            icon={Plus}
            onClick={() => {
              setEditingId(null);
              setIsModalOpen(true);
            }}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : analytics ? (
        <div className="space-y-8">
          {/* Key Metric Gauges */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="glass-card p-5 border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-1">
                Allocated Budget
              </span>
              <span className="text-2xl font-black text-white">
                {analytics.totalBudget
                  ? `${analytics.currency} ${analytics.totalBudget.toLocaleString()}`
                  : 'Flexible'}
              </span>
              <span className="text-[10px] text-white/40 block mt-1">Trip target cap</span>
            </div>

            <div className="glass-card p-5 border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-1">
                Total Outlay
              </span>
              <span className="text-2xl font-black text-amber">
                {analytics.currency} {analytics.totalSpent.toLocaleString()}
              </span>
              <span className="text-[10px] text-white/40 block mt-1">Combined expenses</span>
            </div>

            <div className="glass-card p-5 border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-1 flex items-center justify-between">
                <span>AI Planned</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-electric-blue/20 text-electric-cyan font-bold lowercase">
                  projected
                </span>
              </span>
              <span className="text-2xl font-black text-electric-cyan">
                {analytics.currency} {analytics.estimatedSpent?.toLocaleString() || 0}
              </span>
              <span className="text-[10px] text-white/40 block mt-1">AI benchmark estimates</span>
            </div>

            <div className="glass-card p-5 border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-1 flex items-center justify-between">
                <span>Actual Spent</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold lowercase">
                  confirmed
                </span>
              </span>
              <span className="text-2xl font-black text-emerald-400">
                {analytics.currency} {analytics.actualSpent?.toLocaleString() || 0}
              </span>
              <span className="text-[10px] text-white/40 block mt-1">Real ledger transactions</span>
            </div>

            <div className="glass-card p-5 border border-white/10 col-span-2 lg:col-span-1">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-1">
                Remaining Balance
              </span>
              <span
                className={`text-2xl font-black ${
                  analytics.remainingBudget != null && analytics.remainingBudget < 0
                    ? 'text-red-400'
                    : 'text-emerald-400'
                }`}
              >
                {analytics.remainingBudget != null
                  ? `${analytics.currency} ${analytics.remainingBudget.toLocaleString()}`
                  : 'N/A'}
              </span>
              <span className="text-[10px] text-white/40 block mt-1">
                {analytics.remainingBudget != null && analytics.remainingBudget < 0
                  ? 'Over budget'
                  : 'Available funds'}
              </span>
            </div>
          </div>

          {/* ================= PER-CATEGORY COST PLANNING & BREAKDOWN SECTION ================= */}
          <div className="glass-card p-6 border border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Layers size={18} className="text-electric-cyan" />
                  <h3 className="text-base font-bold text-white">
                    Per-Category Cost Breakdown & AI Planning
                  </h3>
                </div>
                <p className="text-xs text-white/50">
                  Connects AI Planner cost allocations with actual receipts. Sort per category to track spending efficiency.
                </p>
              </div>

              {/* Sort with Per Category control */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 flex items-center gap-1 font-semibold whitespace-nowrap">
                  <ArrowUpDown size={13} className="text-electric-cyan" />
                  Sort Categories:
                </span>
                <select
                  value={categorySort}
                  onChange={(e) => setCategorySort(e.target.value)}
                  className="bg-navy-secondary border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-electric-blue"
                >
                  <option value="amount-desc" className="bg-navy-secondary text-white">
                    Highest Allocation / Outlay
                  </option>
                  <option value="amount-asc" className="bg-navy-secondary text-white">
                    Lowest Allocation / Outlay
                  </option>
                  <option value="name-asc" className="bg-navy-secondary text-white">
                    Category Name (A → Z)
                  </option>
                  <option value="name-desc" className="bg-navy-secondary text-white">
                    Category Name (Z → A)
                  </option>
                  <option value="estimated-desc" className="bg-navy-secondary text-white">
                    Highest AI Estimated
                  </option>
                  <option value="actual-desc" className="bg-navy-secondary text-white">
                    Highest Actual Logged
                  </option>
                  <option value="percentage-desc" className="bg-navy-secondary text-white">
                    Highest % Share of Budget
                  </option>
                </select>
              </div>
            </div>

            {/* Categorized Cards Grid */}
            {sortedCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedCategories.map((cat) => {
                  const hasEstimate = (cat.estimated || 0) > 0;
                  const hasActual = (cat.actual || 0) > 0;
                  const isExceeded = hasEstimate && cat.actual > cat.estimated;

                  return (
                    <div
                      key={cat.category}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                      style={{ borderLeftColor: cat.color, borderLeftWidth: 4 }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{cat.icon}</span>
                            <div>
                              <h4 className="font-bold text-white text-sm capitalize">{cat.label}</h4>
                              <span className="text-[10px] text-white/40 block font-mono">
                                {cat.count || 0} transaction{cat.count !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white/10 text-white font-mono">
                            {cat.percentage}%
                          </span>
                        </div>

                        {/* Cost Comparison: AI Estimated vs Actual */}
                        <div className="grid grid-cols-2 gap-2 bg-navy-secondary/60 p-2.5 rounded-xl border border-white/5 text-xs mb-3">
                          <div>
                            <span className="text-[10px] text-electric-cyan/80 block font-semibold uppercase">
                              AI Planned
                            </span>
                            <span className="font-bold text-white">
                              {analytics.currency} {(cat.estimated || 0).toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-400/80 block font-semibold uppercase">
                              Actual Spent
                            </span>
                            <span className="font-bold text-white">
                              {analytics.currency} {(cat.actual || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Status / Comparison Progress */}
                        {hasEstimate && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-[10px] mb-1">
                              <span className="text-white/50">Plan Progress</span>
                              <span
                                className={`font-bold ${
                                  isExceeded ? 'text-red-400' : 'text-emerald-400'
                                }`}
                              >
                                {cat.estimated > 0
                                  ? `${Math.round(((cat.actual || 0) / cat.estimated) * 100)}%`
                                  : '100%'}
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isExceeded ? 'bg-red-500' : 'bg-emerald-400'
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    cat.estimated > 0
                                      ? Math.round(((cat.actual || 0) / cat.estimated) * 100)
                                      : 100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px]">
                        <button
                          onClick={() => {
                            setSelectedCategoryFilter(cat.category);
                            const el = document.getElementById('transaction-ledger');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-electric-cyan hover:underline font-semibold"
                        >
                          View in Ledger &rarr;
                        </button>
                        <button
                          onClick={() => handleOpenAddForCategory(cat.category)}
                          className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
                        >
                          + Log Expense
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-white/40 italic">
                No category data available yet. Click "Sync AI Cost Plan" or "Add Expense" to get started.
              </div>
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart: Expenses by Category */}
            <div className="glass-card p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/80 mb-6 flex items-center gap-2">
                <PieIcon size={16} className="text-electric-cyan" />
                Category Distribution Chart
              </h3>
              {analytics.byCategory && analytics.byCategory.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.byCategory}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                      >
                        {analytics.byCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={categoryColorMap[entry.category] || '#3B82F6'}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B1930',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-white/40 italic">
                  No categorical expense data recorded yet.
                </div>
              )}
            </div>

            {/* Bar Chart: Daily Spending Timeline */}
            <div className="glass-card p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/80 mb-6 flex items-center gap-2">
                <BarChart3 size={16} className="text-violet" />
                Daily Expenditure Timeline
              </h3>
              {analytics.dailySpending && analytics.dailySpending.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.dailySpending}>
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B1930',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="amount" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-white/40 italic">
                  No daily transaction timeline to graph.
                </div>
              )}
            </div>
          </div>

          {/* ================= TRANSACTION LEDGER WITH SORT WITH PER CATEGORY ================= */}
          <div id="transaction-ledger" className="glass-card p-6 border border-white/10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tag size={18} className="text-electric-cyan" />
                  Transaction Ledger ({filteredAndSortedExpenses.length} of {expenses.length})
                </h3>
                <p className="text-xs text-white/50">
                  Filter and sort line items directly by category, amount, or AI projection type
                </p>
              </div>

              {/* Group By Category Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGroupByCategory(!groupByCategory)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    groupByCategory
                      ? 'bg-electric-blue text-white shadow-lg shadow-electric-blue/20'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <Layers size={13} />
                  Group by Category
                </button>
              </div>
            </div>

            {/* Filter and Sort Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  placeholder="Search title, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-navy-secondary border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-electric-blue"
                />
              </div>

              {/* Filter by Category */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 font-semibold shrink-0">Category:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full bg-navy-secondary border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-blue"
                >
                  <option value="all" className="bg-navy-secondary text-white">
                    All Categories
                  </option>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-navy-secondary text-white">
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Type */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 font-semibold shrink-0">Type:</span>
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="w-full bg-navy-secondary border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-blue"
                >
                  <option value="all" className="bg-navy-secondary text-white">
                    All Types
                  </option>
                  <option value="estimated" className="bg-navy-secondary text-white">
                    ✨ AI Estimated Plan
                  </option>
                  <option value="actual" className="bg-navy-secondary text-white">
                    ✓ Actual Confirmed
                  </option>
                </select>
              </div>

              {/* Sort With Per Category / Other */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 font-semibold shrink-0 flex items-center gap-1">
                  <ArrowUpDown size={12} className="text-electric-cyan" />
                  Sort:
                </span>
                <select
                  value={ledgerSort}
                  onChange={(e) => setLedgerSort(e.target.value)}
                  className="w-full bg-navy-secondary border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-blue"
                >
                  <option value="category-asc" className="bg-navy-secondary text-white">
                    Category (A → Z)
                  </option>
                  <option value="category-desc" className="bg-navy-secondary text-white">
                    Category (Z → A)
                  </option>
                  <option value="amount-desc" className="bg-navy-secondary text-white">
                    Amount (High → Low)
                  </option>
                  <option value="amount-asc" className="bg-navy-secondary text-white">
                    Amount (Low → High)
                  </option>
                  <option value="date-desc" className="bg-navy-secondary text-white">
                    Date (Newest First)
                  </option>
                  <option value="date-asc" className="bg-navy-secondary text-white">
                    Date (Oldest First)
                  </option>
                  <option value="title-asc" className="bg-navy-secondary text-white">
                    Title (A → Z)
                  </option>
                </select>
              </div>
            </div>

            {/* Render Grouped View or Flat View */}
            {filteredAndSortedExpenses.length > 0 ? (
              groupByCategory ? (
                /* Grouped by Category View */
                <div className="space-y-6">
                  {groupedExpenses.map((group) => (
                    <div
                      key={group.category}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
                    >
                      {/* Group Header */}
                      <div
                        className="px-5 py-3.5 bg-navy-secondary/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3"
                        style={{ borderLeftColor: group.color, borderLeftWidth: 4 }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{group.icon}</span>
                          <div>
                            <span className="font-bold text-white text-sm capitalize">
                              {group.label}
                            </span>
                            <span className="text-[11px] text-white/50 ml-2">
                              ({group.items.length} item{group.items.length !== 1 ? 's' : ''})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-white/50">
                            AI Plan: <span className="text-electric-cyan font-bold">{analytics.currency} {group.estimated.toLocaleString()}</span>
                          </span>
                          <span className="text-white/50">
                            Actual: <span className="text-emerald-400 font-bold">{analytics.currency} {group.actual.toLocaleString()}</span>
                          </span>
                          <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">
                            Total: {analytics.currency} {group.total.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Items under this category */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-white/5 text-white/40 uppercase tracking-wider bg-white/[0.01]">
                              <th className="py-2.5 px-4 font-semibold">Title</th>
                              <th className="py-2.5 px-4 font-semibold">Date</th>
                              <th className="py-2.5 px-4 font-semibold">Type</th>
                              <th className="py-2.5 px-4 font-semibold">Notes</th>
                              <th className="py-2.5 px-4 font-semibold text-right">Amount</th>
                              <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {group.items.map((exp) => (
                              <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-3 px-4 font-bold text-white">{exp.title}</td>
                                <td className="py-3 px-4 text-white/50">
                                  {exp.date ? new Date(exp.date).toLocaleDateString() : '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                                      exp.isEstimated
                                        ? 'bg-amber/20 text-amber'
                                        : 'bg-emerald-500/20 text-emerald-400'
                                    }`}
                                  >
                                    {exp.isEstimated ? (
                                      <>
                                        <Sparkles size={10} /> AI Estimate
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle size={10} /> Actual
                                      </>
                                    )}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-white/50 text-[11px] max-w-xs truncate">
                                  {exp.description || '-'}
                                </td>
                                <td className="py-3 px-4 font-black text-white text-right font-mono">
                                  {exp.currency} {exp.amount.toFixed(2)}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleEditClick(exp)}
                                      className="p-1 text-white/50 hover:text-white transition-colors"
                                      title="Edit expense"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteExpense(exp.id)}
                                      className="p-1 text-red-400/80 hover:text-red-400 transition-colors"
                                      title="Delete expense"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Flat Sortable Ledger Table */
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Title</th>
                        <th className="pb-3 font-semibold">
                          <button
                            onClick={() =>
                              setLedgerSort(ledgerSort === 'category-asc' ? 'category-desc' : 'category-asc')
                            }
                            className="flex items-center gap-1 hover:text-white transition-colors"
                          >
                            Category
                            <ArrowUpDown size={11} />
                          </button>
                        </th>
                        <th className="pb-3 font-semibold">
                          <button
                            onClick={() =>
                              setLedgerSort(ledgerSort === 'date-desc' ? 'date-asc' : 'date-desc')
                            }
                            className="flex items-center gap-1 hover:text-white transition-colors"
                          >
                            Date
                            <ArrowUpDown size={11} />
                          </button>
                        </th>
                        <th className="pb-3 font-semibold">Type</th>
                        <th className="pb-3 font-semibold">Notes</th>
                        <th className="pb-3 font-semibold text-right">
                          <button
                            onClick={() =>
                              setLedgerSort(ledgerSort === 'amount-desc' ? 'amount-asc' : 'amount-desc')
                            }
                            className="flex items-center gap-1 ml-auto hover:text-white transition-colors"
                          >
                            Amount
                            <ArrowUpDown size={11} />
                          </button>
                        </th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredAndSortedExpenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 font-bold text-white">{exp.title}</td>
                          <td className="py-3">
                            <span
                              className="px-2 py-0.5 rounded-lg text-[11px] font-semibold capitalize inline-flex items-center gap-1"
                              style={{
                                backgroundColor: `${categoryColorMap[exp.category] || '#3B82F6'}20`,
                                color: categoryColorMap[exp.category] || '#3B82F6',
                              }}
                            >
                              <span>{categoryMetaMap[exp.category]?.icon || '🏷️'}</span>
                              <span>{exp.category}</span>
                            </span>
                          </td>
                          <td className="py-3 text-white/50 font-mono text-[11px]">
                            {exp.date ? new Date(exp.date).toLocaleDateString() : '-'}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                                exp.isEstimated
                                  ? 'bg-amber/20 text-amber'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {exp.isEstimated ? (
                                <>
                                  <Sparkles size={10} /> AI Estimate
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={10} /> Actual
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3 text-white/50 text-[11px] max-w-xs truncate">
                            {exp.description || '-'}
                          </td>
                          <td className="py-3 font-black text-white text-right font-mono">
                            {exp.currency} {exp.amount.toFixed(2)}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(exp)}
                                className="p-1 text-white/50 hover:text-white transition-colors"
                                title="Edit expense"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(exp.id)}
                                className="p-1 text-red-400/80 hover:text-red-400 transition-colors"
                                title="Delete expense"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-center py-10 text-xs text-white/40 italic">
                No expenses match the current filter or search criteria.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center border border-white/10">
          <EmptyState
            icon={Wallet}
            title="No Budget Record"
            description="Select or create a trip to start tracking your travel expenses."
          />
        </div>
      )}

      {/* ================= ADD/EDIT EXPENSE MODAL ================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Expense Entry' : 'Log Travel Expense'}
      >
        <form onSubmit={handleSubmitExpense} className="space-y-4">
          <Input
            label="Expense Title"
            placeholder="e.g. Flight to Jaipur, Amber Fort Ticket"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-navy-secondary text-white">
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Amount"
              type="number"
              step="any"
              placeholder="e.g. 450.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
              >
                {CURRENCY_LIST.map((c) => (
                  <option key={c.code} value={c.code} className="bg-navy-secondary text-white">
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isEstimated"
              checked={formData.isEstimated}
              onChange={(e) => setFormData({ ...formData, isEstimated: e.target.checked })}
              className="rounded bg-white/10 border-white/20 text-electric-blue focus:ring-0"
            />
            <label htmlFor="isEstimated" className="text-xs text-white/70 cursor-pointer">
              Mark as AI Estimated projection (unconfirmed)
            </label>
          </div>

          <Input
            label="Notes / Vendor Description"
            placeholder="e.g. Paid online via UPI / Credit Card"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="md" type="submit">
              {editingId ? 'Save Changes' : 'Log Expense'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Budget;
