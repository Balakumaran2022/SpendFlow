import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, PieChart, Trash2, Plus, LogOut, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ onAddExpense }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: Home,      path: '/' },
    { name: 'Expenses',  icon: Receipt,   path: '/expenses' },
    { name: 'Reports',   icon: PieChart,  path: '/reports' },
    { name: 'Budget',    icon: PiggyBank, path: '/budget' },
    { name: 'Bulk Delete',icon: Trash2,   path: '/bulk-delete' },
  ];

  return (
    <aside className="w-64 bg-slate-50/70 dark:bg-slate-900/80 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col min-h-[calc(100vh-4rem)] p-4 justify-between transition-colors duration-200">
      <div className="space-y-4">
        {/* Add Expense Desktop Sidebar Action */}
        <button
          type="button"
          onClick={onAddExpense}
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff' }}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" style={{ color: '#ffffff' }} />
          <span>New Expense</span>
        </button>

        <nav className="space-y-1.5 pt-2">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25" 
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800/60"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout option in sidebar footer */}
      {user && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold transition-all hover:bg-red-100 dark:hover:bg-red-900/60 cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Logout Account</span>
          </button>
        </div>
      )}
    </aside>
  );
}
