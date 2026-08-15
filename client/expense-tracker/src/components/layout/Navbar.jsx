import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Navbar({ onAddExpense }) {
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 supports-[backdrop-filter]:bg-white/60 w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-6">

            
            {/* Original SVG Logo Icon & Original Color Palette with BalaSpend */}
            <div className="flex items-center gap-2.5">
              <img 
                src="/favicon.svg" 
                alt="BalaSpend Logo" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-md shadow-blue-500/20 shrink-0 transition-transform hover:scale-105" 
              />
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                BalaSpend
              </span>
            </div>

            {/* Global Search */}
            <div className="hidden md:flex items-center relative w-64">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <Input 
                placeholder="Search anything..." 
                className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-100 rounded-full h-9 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={onAddExpense}
              className="rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-500/30 px-3.5 sm:px-5 py-2 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm font-bold border-0 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">New Expense</span>
              <span className="sm:hidden font-extrabold">+ Add</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
