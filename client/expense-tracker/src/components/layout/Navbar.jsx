import { Plus, Search, LogOut, User } from 'lucide-react';
import { Input } from '../ui/input';
import { useAuth } from '../../context/AuthContext';

export function Navbar({ onAddExpense }) {
  const { user, logout } = useAuth();
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 supports-[backdrop-filter]:bg-white/80 w-full shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <img 
                src="/favicon.svg" 
                alt="BalaSpend Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-md shadow-blue-500/20 shrink-0 transition-transform hover:scale-105" 
              />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                BalaSpend
              </span>
            </div>

            {/* Global Search */}
            <div className="hidden md:flex items-center relative w-64">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <Input 
                placeholder="Search expenses..." 
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-100 rounded-full h-9 text-sm"
              />
            </div>
          </div>
          
          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* HIGH-VISIBILITY ALWAYS-BLUE + ADD BUTTON */}
            <button 
              type="button"
              onClick={onAddExpense}
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              className="rounded-full shadow-lg shadow-blue-500/30 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-1.5 transition-all hover:opacity-90 active:scale-95 text-xs sm:text-sm font-extrabold border-0 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" style={{ color: '#ffffff' }} />
              <span className="hidden sm:inline">New Expense</span>
              <span className="sm:hidden">+ Add</span>
            </button>

            {/* User Profile & Logout */}
            {user && (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200/60">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] sm:text-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-700 max-w-[80px] sm:max-w-[120px] truncate hidden xs:inline">
                  {userName}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  title="Logout"
                  className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-full border-0 bg-transparent cursor-pointer ml-0.5"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}
