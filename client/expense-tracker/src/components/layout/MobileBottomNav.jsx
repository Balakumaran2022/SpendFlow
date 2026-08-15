import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, PieChart, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav({ onAddExpense }) {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl px-1 py-1.5 flex items-center justify-around pb-safe">
      <Link
        to="/"
        className={cn(
          "flex flex-col items-center gap-0.5 py-1 px-1 rounded-xl transition-all text-[10px] font-semibold flex-1 min-w-0",
          location.pathname === '/' ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
        )}
      >
        <Home className={cn("w-4 h-4 shrink-0", location.pathname === '/' ? "text-blue-600 scale-110" : "text-slate-400")} />
        <span className="truncate w-full text-center tracking-tighter">Dashboard</span>
      </Link>

      <Link
        to="/expenses"
        className={cn(
          "flex flex-col items-center gap-0.5 py-1 px-1 rounded-xl transition-all text-[10px] font-semibold flex-1 min-w-0",
          location.pathname === '/expenses' ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
        )}
      >
        <Receipt className={cn("w-4 h-4 shrink-0", location.pathname === '/expenses' ? "text-blue-600 scale-110" : "text-slate-400")} />
        <span className="truncate w-full text-center tracking-tighter">Expenses</span>
      </Link>

      {/* Prominent Central Floating "+ Add" Button */}
      <button
        type="button"
        onClick={onAddExpense}
        className="flex flex-col items-center justify-center -mt-5 mx-1 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-90 text-white rounded-full p-3 shadow-lg shadow-blue-500/40 border-2 border-white transition-all cursor-pointer shrink-0"
        title="Add Expense"
      >
        <Plus className="w-5 h-5 stroke-[3]" />
      </button>

      <Link
        to="/reports"
        className={cn(
          "flex flex-col items-center gap-0.5 py-1 px-1 rounded-xl transition-all text-[10px] font-semibold flex-1 min-w-0",
          location.pathname === '/reports' ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
        )}
      >
        <PieChart className={cn("w-4 h-4 shrink-0", location.pathname === '/reports' ? "text-blue-600 scale-110" : "text-slate-400")} />
        <span className="truncate w-full text-center tracking-tighter">Reports</span>
      </Link>

      <Link
        to="/bulk-delete"
        className={cn(
          "flex flex-col items-center gap-0.5 py-1 px-1 rounded-xl transition-all text-[10px] font-semibold flex-1 min-w-0",
          location.pathname === '/bulk-delete' ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
        )}
      >
        <Trash2 className={cn("w-4 h-4 shrink-0", location.pathname === '/bulk-delete' ? "text-blue-600 scale-110" : "text-slate-400")} />
        <span className="truncate w-full text-center tracking-tighter">Bulk Delete</span>
      </Link>
    </div>
  );
}


