import { Search, LogOut, User } from 'lucide-react';
import { Input } from '../ui/input';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 w-full shadow-xs">
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
          
          {/* Right Header: User Profile & PROMINENT VISIBLE LOGOUT BUTTON */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <div className="flex items-center gap-2">
                
                {/* User Info Badge */}
                <div className="flex items-center gap-1.5 bg-slate-100/90 px-2.5 py-1 rounded-full border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] sm:max-w-[140px] truncate">
                    {userName}
                  </span>
                </div>

                {/* CLEARLY VISIBLE RED LOGOUT BUTTON */}
                <button
                  type="button"
                  onClick={logout}
                  title="Logout"
                  style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
                  className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border text-xs font-bold transition-all hover:bg-red-100 active:scale-95 cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[2.5]" style={{ color: '#dc2626' }} />
                  <span>Logout</span>
                </button>

              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
