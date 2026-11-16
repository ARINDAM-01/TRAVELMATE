import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get('tripId');

  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(tripIdParam || '');
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

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
        currency: 'INR',
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

  // Category Color Map
  const categoryColorMap = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = cat.color;
    return acc;
  }, {});

  return (
    <DashboardLayout activeTitle="Budget & Expense Analytics">
      {/* Top Trip Selector & Action Bar */}
      <div className="glass-card p-4 border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-white/50">Trip:</label>
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="bg-navy-secondary border border-white/15 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-electric-blue"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

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

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : analytics ? (
        <div className="space-y-8">
          {/* Key Metric Gauges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-card p-5 border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-1">
                Allocated Budget
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {analytics.totalBudget
                  ? `${analytics.currency} ${analytics.totalBudget.toLocaleString()}`
                  : 'Flexible'}
              </span>
            </div>

            <div className="glass-card p-5 border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-1">
                Total Outlay
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber">
                {analytics.currency} {analytics.totalSpent.toLocaleString()}
              </span>
            </div>

            <div className="glass-card p-5 border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-1">
                Remaining Balance
              </span>
              <span
                className={`text-2xl sm:text-3xl font-black ${
                  analytics.remainingBudget != null && analytics.remainingBudget < 0
                    ? 'text-red-400'
                    : 'text-emerald-400'
                }`}
              >
                {analytics.remainingBudget != null
                  ? `${analytics.currency} ${analytics.remainingBudget.toLocaleString()}`
                  : 'N/A'}
              </span>
            </div>

            <div className="glass-card p-5 border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-1">
                Actual vs Estimated
              </span>
              <div className="text-xs text-white/80 space-y-1">
                <p>Confirmed: <span className="font-bold text-white">${analytics.actualSpent}</span></p>
                <p>Estimated: <span className="font-bold text-electric-cyan">${analytics.estimatedSpent}</span></p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart: Expenses by Category */}
            <div className="glass-card p-6 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/80 mb-6 flex items-center gap-2">
                <PieIcon size={16} className="text-electric-cyan" />
                Category Breakdown
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

          {/* Expenses Detailed Table */}
          <div className="glass-card p-6 border border-white/10">
            <h3 className="text-base font-bold text-white mb-4">Transaction Ledger ({expenses.length})</h3>

            {expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Title</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Type</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 font-bold text-white">{exp.title}</td>
                        <td className="py-3 text-white/70 capitalize">{exp.category}</td>
                        <td className="py-3 text-white/50">
                          {exp.date ? new Date(exp.date).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              exp.isEstimated
                                ? 'bg-amber/20 text-amber'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {exp.isEstimated ? 'Estimate' : 'Actual'}
                          </span>
                        </td>
                        <td className="py-3 font-black text-white text-right">
                          {exp.currency} {exp.amount.toFixed(2)}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(exp)}
                              className="p-1 text-white/50 hover:text-white transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="p-1 text-red-400/80 hover:text-red-400 transition-colors"
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
            ) : (
              <div className="text-center py-10 text-xs text-white/40 italic">
                No individual expenses recorded yet. Click "Add Expense" to log costs.
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
            placeholder="e.g. Louvre Museum Tickets"
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
              placeholder="e.g. 45.00"
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
              Mark as estimated projection (unconfirmed)
            </label>
          </div>

          <Input
            label="Notes / Vendor Description"
            placeholder="e.g. Paid via Visa card"
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
