import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Receipt, 
  PieChart, 
  MoreHorizontal, 
  Plus, 
  PiggyBank, 
  Trash2, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav({ onAddExpense }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Close sheet on route change
  useEffect(() => {
    setIsSheetOpen(false);
  }, [location.pathname]);

  const isMoreActive = 
    location.pathname === '/more' || 
    location.pathname === '/budget' || 
    location.pathname === '/bulk-delete';

  const handleMoreClick = (e) => {
    e.preventDefault();
    setIsSheetOpen(prev => !prev);
  };

  const handleNavigate = (path) => {
    setIsSheetOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-2xl flex items-center justify-around pb-safe"
        style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom, 0px))' }}
      >
        {/* 1. Home */}
        <Link
          to="/"
          aria-current={location.pathname === '/' ? 'page' : undefined}
          className={cn(
            'flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all text-[11px] font-semibold flex-1 min-w-[56px] min-h-[48px]',
            location.pathname === '/' 
              ? 'text-blue-600 dark:text-blue-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <Home className={cn('w-5 h-5 shrink-0 transition-transform', location.pathname === '/' && 'scale-110')} />
          <span className="truncate tracking-tight">Home</span>
        </Link>

        {/* 2. Expenses */}
        <Link
          to="/expenses"
          aria-current={location.pathname === '/expenses' ? 'page' : undefined}
          className={cn(
            'flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all text-[11px] font-semibold flex-1 min-w-[56px] min-h-[48px]',
            location.pathname === '/expenses' 
              ? 'text-blue-600 dark:text-blue-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <Receipt className={cn('w-5 h-5 shrink-0 transition-transform', location.pathname === '/expenses' && 'scale-110')} />
          <span className="truncate tracking-tight">Expenses</span>
        </Link>

        {/* Center Floating Action Button (+) */}
        <button
          type="button"
          onClick={onAddExpense}
          aria-label="Add New Expense"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
          className="flex items-center justify-center -mt-5 mx-1.5 rounded-full p-3.5 shadow-lg shadow-blue-500/35 border-2 border-white dark:border-slate-900 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[3] text-white" />
        </button>

        {/* 3. Reports */}
        <Link
          to="/reports"
          aria-current={location.pathname === '/reports' ? 'page' : undefined}
          className={cn(
            'flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all text-[11px] font-semibold flex-1 min-w-[56px] min-h-[48px]',
            location.pathname === '/reports' 
              ? 'text-blue-600 dark:text-blue-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <PieChart className={cn('w-5 h-5 shrink-0 transition-transform', location.pathname === '/reports' && 'scale-110')} />
          <span className="truncate tracking-tight">Reports</span>
        </Link>

        {/* 4. More (Opens Bottom Sheet with Budget & Bulk Delete) */}
        <button
          type="button"
          onClick={handleMoreClick}
          aria-expanded={isSheetOpen}
          aria-label="More Features"
          className={cn(
            'flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all text-[11px] font-semibold flex-1 min-w-[56px] min-h-[48px] cursor-pointer',
            isMoreActive || isSheetOpen
              ? 'text-blue-600 dark:text-blue-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          )}
        >
          <MoreHorizontal className={cn('w-5 h-5 shrink-0 transition-transform', (isMoreActive || isSheetOpen) && 'scale-110')} />
          <span className="truncate tracking-tight">More</span>
        </button>
      </nav>

      {/* iOS-Style "More" Bottom Sheet Overlay */}
      {isSheetOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex flex-col justify-end transition-opacity duration-200"
          onClick={() => setIsSheetOpen(false)}
        >
          <div 
            className="w-full bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200/80 dark:border-slate-800 p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 duration-200"
            style={{ paddingBottom: 'max(1.75rem, env(safe-area-inset-bottom, 0px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  More Features
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your finances and data
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-1">
              {/* 1. Monthly Budget */}
              <button
                type="button"
                onClick={() => handleNavigate('/budget')}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left group",
                  location.pathname === '/budget'
                    ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60"
                    : "bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Monthly Budget
                      </span>
                      {location.pathname === '/budget' && (
                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-md">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Set limits & track monthly spending
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 2. Bulk Delete */}
              <button
                type="button"
                onClick={() => handleNavigate('/bulk-delete')}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left group",
                  location.pathname === '/bulk-delete'
                    ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60"
                    : "bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Bulk Delete
                      </span>
                      {location.pathname === '/bulk-delete' && (
                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-md">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Filter & delete multiple expense records
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
