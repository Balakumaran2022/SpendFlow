import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Navbar({ onAddExpense }) {
  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 supports-[backdrop-filter]:bg-white/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {/* Custom Uploaded Logo Icon */}
              <div className="relative group flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="BalaVault Logo" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-md shadow-amber-500/20 border-2 border-amber-400/80 transition-transform group-hover:scale-105" 
                />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-700 bg-clip-text text-transparent">
                BalaVault
              </span>
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
