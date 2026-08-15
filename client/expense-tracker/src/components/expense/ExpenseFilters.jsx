import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { 
  Search, 
  Tag, 
  Calendar, 
  Utensils, 
  Plane, 
  ShoppingBag, 
  FileText, 
  HeartPulse, 
  Film, 
  MoreHorizontal,
  Clock
} from "lucide-react";

export function ExpenseFilters({ 
  filters = { search: '', category: 'All Categories', timeframe: 'All Time' }, 
  setFilters = () => {} 
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
      
      {/* Search Input */}
      <div className="relative w-full md:w-80 flex-shrink-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search expenses..."
          className="pl-10 bg-slate-50 border-slate-200/80 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl h-11 text-slate-800 text-sm font-medium transition-all"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Dropdowns Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex items-center gap-2.5 w-full md:w-auto">

        
        {/* Category Dropdown */}
        <Select 
          value={filters.category} 
          onValueChange={(val) => setFilters({ ...filters, category: val })}
        >
          <SelectTrigger className="w-full md:w-48 bg-slate-50 border-slate-200/80 hover:bg-slate-100/70 rounded-xl h-11 text-slate-800 text-sm font-medium transition-colors shadow-none px-3.5">
            <div className="flex items-center gap-2 truncate">
              <Tag className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <SelectValue placeholder="All Categories" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white z-[100] shadow-2xl border border-slate-200 text-slate-800 rounded-2xl p-1.5 min-w-[200px]">
            <SelectItem value="All Categories" className="rounded-xl font-semibold cursor-pointer py-2 px-3 hover:bg-blue-50 text-blue-700">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                All Categories
              </span>
            </SelectItem>
            <SelectItem value="Food" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-500" />
                Food & Dining
              </span>
            </SelectItem>
            <SelectItem value="Travel" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-sky-500" />
                Travel & Commute
              </span>
            </SelectItem>
            <SelectItem value="Shopping" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-pink-500" />
                Shopping
              </span>
            </SelectItem>
            <SelectItem value="Bills" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                Bills & Utilities
              </span>
            </SelectItem>
            <SelectItem value="Health" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-red-500" />
                Health & Wellness
              </span>
            </SelectItem>
            <SelectItem value="Entertainment" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <Film className="w-4 h-4 text-purple-500" />
                Entertainment
              </span>
            </SelectItem>
            <SelectItem value="Others" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <MoreHorizontal className="w-4 h-4 text-slate-500" />
                Others
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Timeframe Dropdown */}
        <Select
          value={filters.timeframe}
          onValueChange={(val) => setFilters({ ...filters, timeframe: val })}
        >
          <SelectTrigger className="w-full md:w-44 bg-slate-50 border-slate-200/80 hover:bg-slate-100/70 rounded-xl h-11 text-slate-800 text-sm font-medium transition-colors shadow-none px-3.5">
            <div className="flex items-center gap-2 truncate">
              <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <SelectValue placeholder="All Time" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white z-[100] shadow-2xl border border-slate-200 text-slate-800 rounded-2xl p-1.5 min-w-[180px]">
            <SelectItem value="All Time" className="rounded-xl font-semibold cursor-pointer py-2 px-3 hover:bg-purple-50 text-purple-700">
              All Time
            </SelectItem>
            <SelectItem value="today" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              Today
            </SelectItem>
            <SelectItem value="yesterday" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              Yesterday
            </SelectItem>
            <SelectItem value="week" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              Past 7 Days
            </SelectItem>
            <SelectItem value="past30" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              Past 30 Days
            </SelectItem>
            <SelectItem value="month" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              This Month
            </SelectItem>
            <SelectItem value="year" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
              This Year
            </SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>
  );
}
