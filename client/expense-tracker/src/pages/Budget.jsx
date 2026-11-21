import { useState, useEffect } from 'react';
import { getCachedExpensesLocally } from '../services/api';
import { 
  PiggyBank, Plus, Trash2, CheckCircle2, AlertTriangle, 
  TrendingUp, ChevronRight, IndianRupee, Calendar
} from 'lucide-react';

const STORAGE_KEY = 'spendflow_monthly_budgets';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function getBudgets() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveBudgets(b) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
}

function getMonthKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function getMonthSpent(expenses, year, month) {
  return expenses
    .filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
}

export default function Budget() {
  const now = new Date();
  const [budgets, setBudgets] = useState(getBudgets);
  const [expenses] = useState(() => getCachedExpensesLocally());
  const [inputYear, setInputYear] = useState(now.getFullYear());
  const [inputMonth, setInputMonth] = useState(now.getMonth());
  const [inputAmount, setInputAmount] = useState('');
  const [saved, setSaved] = useState(false);

  // Build list: all months that have a budget or have expenses
  const allKeys = new Set([
    ...Object.keys(budgets),
    ...expenses.map(e => {
      const d = new Date(e.date);
      return getMonthKey(d.getFullYear(), d.getMonth());
    })
  ]);

  const months = Array.from(allKeys)
    .sort((a, b) => b.localeCompare(a)) // newest first
    .map(key => {
      const [y, m] = key.split('-').map(Number);
      const month = m - 1;
      const spent = getMonthSpent(expenses, y, month);
      const budget = budgets[key] ? Number(budgets[key]) : 0;
      const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
      const over = budget > 0 && spent > budget;
      return { key, year: y, month, label: `${MONTHS[month]} ${y}`, spent, budget, pct, over };
    });

  const currentKey = getMonthKey(inputYear, inputMonth);
  const existingBudget = budgets[currentKey] ? Number(budgets[currentKey]) : '';

  useEffect(() => {
    setInputAmount(existingBudget ? String(existingBudget) : '');
  }, [inputYear, inputMonth]);

  const handleSave = () => {
    if (!inputAmount || isNaN(inputAmount) || Number(inputAmount) <= 0) return;
    const updated = { ...budgets, [currentKey]: Number(inputAmount) };
    setBudgets(updated);
    saveBudgets(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (key) => {
    const updated = { ...budgets };
    delete updated[key];
    setBudgets(updated);
    saveBudgets(updated);
  };

  // Current month stats
  const thisKey = getMonthKey(now.getFullYear(), now.getMonth());
  const thisSpent = getMonthSpent(expenses, now.getFullYear(), now.getMonth());
  const thisBudget = budgets[thisKey] ? Number(budgets[thisKey]) : 0;
  const thisPct = thisBudget > 0 ? Math.min((thisSpent / thisBudget) * 100, 100) : 0;
  const thisOver = thisBudget > 0 && thisSpent > thisBudget;
  const thisRemaining = thisBudget > 0 ? thisBudget - thisSpent : 0;

  return (
    <div className="mx-auto max-w-2xl px-3 sm:px-6 py-4 sm:py-8 space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-green-100 p-2.5 rounded-xl">
          <PiggyBank className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monthly Budget</h1>
          <p className="text-sm text-slate-500">Set and track your monthly spending limit</p>
        </div>
      </div>

      {/* This month summary */}
      {thisBudget > 0 && (
        <div className={`rounded-2xl p-5 border ${thisOver ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {thisOver
                ? <AlertTriangle className="w-5 h-5 text-red-500" />
                : <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              <span className="font-bold text-slate-800">
                {MONTHS[now.getMonth()]} {now.getFullYear()}
              </span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${thisOver ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              {thisPct.toFixed(0)}% used
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/60 rounded-full h-3 mb-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${thisOver ? 'bg-red-500' : thisPct > 80 ? 'bg-orange-400' : 'bg-blue-500'}`}
              style={{ width: `${thisPct}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-slate-500 font-medium">Spent</p>
              <p className="font-black text-slate-900 text-sm">₹{thisSpent.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Budget</p>
              <p className="font-black text-slate-900 text-sm">₹{thisBudget.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{thisOver ? 'Over by' : 'Remaining'}</p>
              <p className={`font-black text-sm ${thisOver ? 'text-red-600' : 'text-green-600'}`}>
                ₹{Math.abs(thisRemaining).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Set Budget Input Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4 text-blue-500" />
          Set Monthly Budget
        </h2>

        {/* Month + Year pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Month
            </label>
            <select
              value={inputMonth}
              onChange={e => setInputMonth(Number(e.target.value))}
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Year</label>
            <select
              value={inputYear}
              onChange={e => setInputYear(Number(e.target.value))}
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <IndianRupee className="w-3 h-3" /> Budget Amount (₹)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={inputAmount}
              onChange={e => setInputAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="e.g. 10000"
              className="flex-1 h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
            />
            <button
              onClick={handleSave}
              disabled={!inputAmount || Number(inputAmount) <= 0}
              className="h-11 px-5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }}
            >
              {saved ? '✓ Saved!' : existingBudget ? 'Update' : 'Set Budget'}
            </button>
          </div>
          {existingBudget > 0 && (
            <p className="text-xs text-slate-400 mt-1">
              Current: ₹{Number(existingBudget).toLocaleString('en-IN')} for {MONTHS[inputMonth]} {inputYear}
            </p>
          )}
        </div>
      </div>

      {/* All months list */}
      {months.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <h2 className="font-bold text-slate-800 text-sm">All Months</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {months.map(({ key, label, spent, budget, pct, over }) => (
              <div key={key} className="px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-800 text-sm">{label}</span>
                    <div className="flex items-center gap-2">
                      {budget > 0 && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          over ? 'bg-red-100 text-red-600' 
                               : pct > 80 ? 'bg-orange-100 text-orange-600' 
                               : 'bg-green-100 text-green-600'
                        }`}>
                          {over ? 'Over!' : `${pct.toFixed(0)}%`}
                        </span>
                      )}
                      {budget > 0 && (
                        <button
                          onClick={() => handleDelete(key)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-500"
                          title="Remove budget"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {budget > 0 && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5">
                      <div
                        className={`h-1.5 rounded-full ${over ? 'bg-red-500' : pct > 80 ? 'bg-orange-400' : 'bg-blue-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Spent: <span className="font-bold text-slate-700">₹{spent.toLocaleString('en-IN')}</span></span>
                    {budget > 0 && (
                      <span>Budget: <span className="font-bold text-slate-700">₹{budget.toLocaleString('en-IN')}</span></span>
                    )}
                    {budget === 0 && (
                      <span className="text-slate-400 italic">No budget set</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {months.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <PiggyBank className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No data yet</p>
          <p className="text-sm">Set a budget above to get started</p>
        </div>
      )}
    </div>
  );
}
