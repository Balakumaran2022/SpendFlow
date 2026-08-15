import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, PieChart, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Expenses', icon: Receipt, path: '/expenses' },
    { name: 'Reports', icon: PieChart, path: '/reports' },
    { name: 'Bulk Delete', icon: Trash2, path: '/bulk-delete' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl px-1 sm:px-4 py-2 flex items-center justify-around pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 py-1 px-1.5 sm:px-3 rounded-xl transition-all text-[10px] sm:text-xs font-semibold flex-1 max-w-[25%] min-w-0",
              isActive 
                ? "text-blue-600 font-bold" 
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <item.icon className={cn("w-4 h-4 sm:w-5 sm:h-5 shrink-0", isActive ? "text-blue-600 scale-110" : "text-slate-400")} />
            <span className="truncate w-full text-center tracking-tighter leading-tight">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

