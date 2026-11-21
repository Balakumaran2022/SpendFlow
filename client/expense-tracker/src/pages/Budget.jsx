import { useState, useEffect } from 'react';
import { getCachedExpensesLocally } from '../services/api';
import { 
  PiggyBank, Plus, Trash2, CheckCircle2, AlertTriangle, 
  TrendingUp, ChevronRight, IndianRupee, Calendar
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';

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
  }, [inputYear, inputMonth, existingBudget]);

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
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-4 sm:py-8 space-y-6">

      <PageHeader 
        title="Monthly Budget" 
        description="Set spending targets and track your monthly budget progress." 
      />

      {/* This month summary Hero card */}
      {thisBudget > 0 && (
        <div className={`rounded-2xl p-5 border transition-colors ${
          thisOver 
            ? 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/50' 
            : 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {thisOver
                ? <AlertTriangle className="w-5 h-5 text-red-500" />
                : <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                {MONTHS[now.getMonth()]} {now.getFullYear()}
              </span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              thisOver 
                ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' 
                : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
            }`}>
              {thisPct.toFixed(0)}% used
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-700/60 rounded-full h-3 mb-3.5 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                thisOver 
                  ? 'bg-red-500' 
                  : thisPct > 80 
                    ? 'bg-orange-400' 
                    : 'bg-blue-500'
              }`}
              style={{ width: `${thisPct}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Spent</p>
              <p className="font-black text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                ₹{thisSpent.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Budget</p>
              <p className="font-black text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                ₹{thisBudget.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {thisOver ? 'Over by' : 'Remaining'}
              </p>
              <p className={`font-black text-sm sm:text-base ${thisOver ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                ₹{Math.abs(thisRemaining).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Set Budget Input Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs p-4 sm:p-6 space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm sm:text-base">
          <Plus className="w-4 h-4 text-blue-500" />
          Set Monthly Budget
        </h2>

        {/* Month + Year pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" /> Month
            </label>
            <select
              value={inputMonth}
              onChange={e => setInputMonth(Number(e.target.value))}
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Year</label>
            <select
              value={inputYear}
              onChange={e => setInputYear(Number(e.target.value))}
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-blue-500" /> Budget Target (₹)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={inputAmount}
              onChange={e => setInputAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="e.g. 15000"
              className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={!inputAmount || Number(inputAmount) <= 0}
              className="h-11 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }}
            >
              {saved ? '✓ Saved!' : existingBudget ? 'Update' : 'Set Budget'}
            </button>
          </div>
          {existingBudget > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Current target: ₹{Number(existingBudget).toLocaleString('en-IN')} for {MONTHS[inputMonth]} {inputYear}
            </p>
          )}
        </div>
      </div>

      {/* All months list */}
      {months.length > 0 && (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Budget History & Breakdown</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {months.map(({ key, label, spent, budget, pct, over }) => (
              <div key={key} className="px-4 sm:px-5 py-3.5 sm:py-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{label}</span>
                    <div className="flex items-center gap-2">
                      {budget > 0 && (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          over 
                            ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' 
                            : pct > 80 
                              ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' 
                              : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {over ? 'Over Budget' : `${pct.toFixed(0)}%`}
                        </span>
                      )}
                      {budget > 0 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(key)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-500"
                          title="Remove budget target"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {budget > 0 && (
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mb-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          over ? 'bg-red-500' : pct > 80 ? 'bg-orange-400' : 'bg-blue-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>Spent: <span className="font-bold text-slate-700 dark:text-slate-300">₹{spent.toLocaleString('en-IN')}</span></span>
                    {budget > 0 ? (
                      <span>Budget: <span className="font-bold text-slate-700 dark:text-slate-300">₹{budget.toLocaleString('en-IN')}</span></span>
                    ) : (
                      <span className="text-slate-400 italic">No budget set</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {months.length === 0 && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <PiggyBank className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-slate-700 dark:text-slate-300">No budget data yet</p>
          <p className="text-xs text-slate-500">Set a target above to get started</p>
        </div>
      )}
    </div>
  );
}
