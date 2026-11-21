import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, PieChart, PiggyBank, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav({ onAddExpense }) {
  const location = useLocation();

  const tabs = [
    { to: '/',        icon: Home,      label: 'Home' },
    { to: '/expenses',icon: Receipt,   label: 'Expenses' },
    { to: '/reports', icon: PieChart,  label: 'Reports' },
    { to: '/budget',  icon: PiggyBank, label: 'Budget' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-2xl flex items-center justify-around pb-safe"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom, 0px))' }}>

      {/* First 2 tabs */}
      {tabs.slice(0, 2).map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl transition-all text-[10px] font-semibold flex-1 min-w-0',
              active ? 'text-blue-600' : 'text-slate-400'
            )}
          >
            <Icon className={cn('w-5 h-5 shrink-0 transition-transform', active ? 'text-blue-600 scale-110' : 'text-slate-400')} />
            <span className="truncate w-full text-center">{label}</span>
          </Link>
        );
      })}

      {/* Centre FAB */}
      <button
        type="button"
        onClick={onAddExpense}
        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
        className="flex items-center justify-center -mt-5 mx-2 rounded-full p-3.5 shadow-lg shadow-blue-500/40 border-2 border-white active:scale-90 transition-all cursor-pointer shrink-0"
        title="Add Expense"
      >
        <Plus className="w-5 h-5 stroke-[3] text-white" />
      </button>

      {/* Last 2 tabs */}
      {tabs.slice(2).map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl transition-all text-[10px] font-semibold flex-1 min-w-0',
              active ? 'text-blue-600' : 'text-slate-400'
            )}
          >
            <Icon className={cn('w-5 h-5 shrink-0 transition-transform', active ? 'text-blue-600 scale-110' : 'text-slate-400')} />
            <span className="truncate w-full text-center">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
