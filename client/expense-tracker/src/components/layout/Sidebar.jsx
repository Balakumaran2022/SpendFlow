import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, PieChart, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Expenses', icon: Receipt, path: '/expenses' },
    { name: 'Reports', icon: PieChart, path: '/reports' },
  ];

  return (
    <aside className="w-64 bg-slate-50/50 border-r border-slate-200 hidden md:flex flex-col min-h-[calc(100vh-4rem)] p-4">
      <nav className="flex-1 space-y-2">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Overview
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium group",
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                  : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
