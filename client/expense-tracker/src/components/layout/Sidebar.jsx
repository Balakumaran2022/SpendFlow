import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, PieChart, Trash2, Plus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ onAddExpense }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Expenses', icon: Receipt, path: '/expenses' },
    { name: 'Reports', icon: PieChart, path: '/reports' },
    { name: 'Bulk Delete', icon: Trash2, path: '/bulk-delete' },
  ];

  return (
    <aside className="w-64 bg-slate-50/70 border-r border-slate-200 hidden md:flex flex-col min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-4">
        {/* Add Expense Desktop Sidebar Action */}
        <button
          type="button"
          onClick={onAddExpense}
          style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" style={{ color: '#ffffff' }} />
          <span>New Expense</span>
        </button>

        <nav className="space-y-1.5 pt-2">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout option in sidebar footer */}
      {user && (
        <div className="pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={logout}
            style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all hover:bg-red-100 cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" style={{ color: '#dc2626' }} />
            <span>Logout Account</span>
          </button>
        </div>
      )}
    </aside>
  );
}
