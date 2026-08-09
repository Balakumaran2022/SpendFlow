import { Plus, Wallet, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Navbar({ onAddExpense }) {
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            
            {/* Original Wallet Logo Icon & Original Color Palette */}
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                BalaVault
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
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={onAddExpense}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200/50 px-4 sm:px-5 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm font-semibold"
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
