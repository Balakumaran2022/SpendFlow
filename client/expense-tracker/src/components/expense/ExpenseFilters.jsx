import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search } from "lucide-react";

export function ExpenseFilters({ filters = { search: '', category: 'All Categories', timeframe: 'All Time' }, setFilters = () => {} }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <div className="relative w-full md:w-96 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search expenses..."
          className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-100 rounded-xl h-10"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Select 
          value={filters.category} 
          onValueChange={(val) => setFilters({ ...filters, category: val })}
        >
          <SelectTrigger className="w-full md:w-48 bg-slate-50/50 border-slate-200 rounded-xl h-10">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[100] shadow-lg border border-slate-200 text-slate-900 rounded-xl">
            <SelectItem value="All Categories">All Categories</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Travel">Travel</SelectItem>
            <SelectItem value="Shopping">Shopping</SelectItem>
            <SelectItem value="Bills">Bills</SelectItem>
            <SelectItem value="Health">Health</SelectItem>
            <SelectItem value="Entertainment">Entertainment</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.timeframe}
          onValueChange={(val) => setFilters({ ...filters, timeframe: val })}
        >
          <SelectTrigger className="w-full md:w-48 bg-slate-50/50 border-slate-200 rounded-xl h-10">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[100] shadow-lg border border-slate-200 text-slate-900 rounded-xl">
            <SelectItem value="All Time">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">Past 7 Days</SelectItem>
            <SelectItem value="past30">Past 30 Days</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
