import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Navbar({ onAddExpense }) {
  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 supports-[backdrop-filter]:bg-white/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              
              {/* Premium Crystal Clear Logo Container */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-950 p-1 flex items-center justify-center shadow-md shadow-amber-500/20 border-2 border-amber-400/90 shrink-0 transition-transform hover:scale-105">
                <img 
                  src="/logo.png" 
                  alt="BalaVault Logo" 
                  className="w-full h-full object-contain rounded-xl" 
                />
              </div>

              {/* Distinctive Dual-Color Brand Title */}
              <div className="flex flex-col">
                <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-xs">
                    Bala
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-extrabold ml-0.5">
                    Vault
                  </span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase hidden sm:block pt-0.5">
                  Expense Tracker
                </span>
              </div>

            </div>

            {/* Global Search */}
            <div className="hidden md:flex items-center relative w-64">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <Input 
                placeholder="Search anything..." 
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-full h-9 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={onAddExpense}
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/30 px-4 sm:px-5 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Expense</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
