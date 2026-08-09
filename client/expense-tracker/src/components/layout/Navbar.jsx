import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Navbar({ onAddExpense }) {
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Luxury Brand Logo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <img src="/favicon.svg" alt="SpendFlow Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 bg-clip-text text-transparent tracking-tight">
                SpendFlow
              </span>
            </div>

            {/* Global Search */}
            <div className="hidden md:flex items-center relative w-64">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <Input 
                placeholder="Search anything..." 
                className="pl-9 bg-slate-50 border-slate-200/80 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-full h-9 text-xs"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={onAddExpense}
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 px-4 sm:px-5 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm font-semibold"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="inline font-semibold">New Expense</span>
            </Button>
          </div>

        </div>
      </div>
    </nav>
  );
}
