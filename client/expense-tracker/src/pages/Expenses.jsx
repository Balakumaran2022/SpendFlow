import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { ExpenseList } from "../components/expense/ExpenseList";
import { ExpenseFilters } from "../components/expense/ExpenseFilters";
import { useState, useEffect } from "react";
import { fetchExpenses } from "../services/api";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: 'All Categories', timeframe: 'All Time' });

  const loadExpenses = async () => {
    try {
      const response = await fetchExpenses();
      setExpenses(response.data || []);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    const handleExpenseAdded = () => loadExpenses();
    window.addEventListener('expenseAdded', handleExpenseAdded);
    return () => window.removeEventListener('expenseAdded', handleExpenseAdded);
  }, []);

  const filteredExpenses = expenses.filter(exp => {
    if (filters.search && !exp.title.toLowerCase().includes(filters.search.toLowerCase()) && !exp.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category !== 'All Categories' && exp.category !== filters.category) return false;
    if (filters.timeframe !== 'All Time') {
      const expDate = new Date(exp.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      
      const expDateZeroTime = new Date(expDate);
      expDateZeroTime.setHours(0, 0, 0, 0);
      
      if (filters.timeframe === 'today') {
        if (expDateZeroTime.getTime() !== today.getTime()) return false;
      } else if (filters.timeframe === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (expDateZeroTime.getTime() !== yesterday.getTime()) return false;
      } else if (filters.timeframe === 'week') {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        if (expDate < lastWeek) return false;
      } else if (filters.timeframe === 'past30') {
        const past30 = new Date(today);
        past30.setDate(past30.getDate() - 30);
        if (expDate < past30) return false;
      } else if (filters.timeframe === 'month') {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        if (expDate < firstDayOfMonth) return false;
      } else if (filters.timeframe === 'year') {
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        if (expDate < firstDayOfYear) return false;
      }
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2.5 rounded-xl">
          <Receipt className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Expenses</h1>
          <p className="text-slate-500">View, search, and manage your complete expense history.</p>
        </div>
      </div>

      <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <ExpenseFilters filters={filters} setFilters={setFilters} />
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading your expenses...</div>
          ) : (
            <ExpenseList expenses={filteredExpenses} onRefresh={loadExpenses} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
