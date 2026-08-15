import { Search, LogOut, Wallet } from 'lucide-react';
import { Input } from '../ui/input';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 w-full shadow-xs">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
          
          {/* Logo & Brand Title - Always Visible */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <div className="flex items-center gap-2">
              <div 
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0"
              >
                <Wallet className="w-5 h-5 stroke-[2.5]" style={{ color: '#ffffff' }} />
              </div>
              <span className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
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
          
          {/* Right Header: TWO MATCHING EQUAL-SIZED BUTTONS */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {user && (
              <>
                {/* 1. User Profile Pill - Equal Height (h-8 sm:h-9) */}
                <div 
                  style={{ backgroundColor: '#f1f5f9', color: '#0f172a', borderColor: '#cbd5e1' }}
                  className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full border flex items-center gap-1.5 text-xs font-bold max-w-[120px] sm:max-w-[170px] shrink-0"
                >
                  <div 
                    style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                    className="w-5 h-5 rounded-full font-black flex items-center justify-center text-[10px] shrink-0"
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate">{userName}</span>
                </div>

                {/* 2. Logout Button - EXACT SAME Height (h-8 sm:h-9) and Rounded Style */}
                <button
                  type="button"
                  onClick={logout}
                  title="Logout Account"
                  style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
                  className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full border flex items-center gap-1.5 text-xs font-extrabold transition-all hover:bg-red-100 active:scale-95 cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[2.5]" style={{ color: '#dc2626' }} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
