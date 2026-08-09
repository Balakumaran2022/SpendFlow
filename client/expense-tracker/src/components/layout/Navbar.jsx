import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Navbar({ onAddExpense }) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              
              {/* Bold & Clear Logo Image */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-950 overflow-hidden shadow-md flex items-center justify-center shrink-0 border border-slate-800">
                <img 
                  src="/logo.png" 
                  alt="BalaVault Logo" 
                  className="w-full h-full object-cover scale-105" 
                />
              </div>

              {/* Ultra-Clear High Contrast Solid Color Brand Title */}
              <div className="flex flex-col">
                <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight leading-none">
                  <span className="text-amber-500 font-black">
                    Bala
                  </span>
                  <span className="text-blue-600 font-black ml-0.5">
                    Vault
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase hidden sm:block pt-0.5">
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
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md px-4 sm:px-5 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm font-semibold"
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
