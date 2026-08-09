import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, PieChart, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav({ onAddExpense }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Expenses', icon: Receipt, path: '/expenses' },
    { name: 'Reports', icon: PieChart, path: '/reports' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl px-4 py-2 flex items-center justify-around pb-safe">
      <Link
        to="/"
        className={cn(
          "flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all text-xs font-semibold",
          location.pathname === '/' 
            ? "text-blue-600 font-bold" 
            : "text-slate-500 hover:text-slate-900"
        )}
      >
        <Home className={cn("w-5 h-5", location.pathname === '/' ? "text-blue-600 scale-110" : "text-slate-400")} />
        <span>Dashboard</span>
      </Link>

      <Link
        to="/expenses"
        className={cn(
          "flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all text-xs font-semibold",
          location.pathname === '/expenses' 
            ? "text-blue-600 font-bold" 
            : "text-slate-500 hover:text-slate-900"
        )}
      >
        <Receipt className={cn("w-5 h-5", location.pathname === '/expenses' ? "text-blue-600 scale-110" : "text-slate-400")} />
        <span>Expenses</span>
      </Link>

      {/* Center Action Plus Button */}
      <button
        onClick={onAddExpense}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 -mt-5 transition-transform active:scale-95 hover:scale-105"
        aria-label="Add Expense"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      <Link
        to="/reports"
        className={cn(
          "flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all text-xs font-semibold",
          location.pathname === '/reports' 
            ? "text-blue-600 font-bold" 
            : "text-slate-500 hover:text-slate-900"
        )}
      >
        <PieChart className={cn("w-5 h-5", location.pathname === '/reports' ? "text-blue-600 scale-110" : "text-slate-400")} />
        <span>Reports</span>
      </Link>
    </div>
  );
}
