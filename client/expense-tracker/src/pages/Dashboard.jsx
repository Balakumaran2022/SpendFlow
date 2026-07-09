import { useState, useEffect } from 'react';
import SummaryCards from '../components/expense/SummaryCards';
import { ExpenseList } from '../components/expense/ExpenseList';
import { ExpenseFilters } from "@/components/expense/ExpenseFilters";
import { PageHeader } from '../components/common/PageHeader';
import { fetchExpenses } from '../services/api';

export default function Dashboard() {
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

    const handleExpenseAdded = () => {
      loadExpenses();
    };

    window.addEventListener('expenseAdded', handleExpenseAdded);
    return () => window.removeEventListener('expenseAdded', handleExpenseAdded);
  }, []);

  // Apply filters
  const filteredExpenses = expenses.filter(exp => {
    // 1. Search Filter
    if (filters.search && !exp.title.toLowerCase().includes(filters.search.toLowerCase()) && !exp.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // 2. Category Filter
    if (filters.category !== 'All Categories' && exp.category !== filters.category) {
      return false;
    }
    
    // 3. Timeframe Filter
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
      <PageHeader 
        title="Dashboard" 
        description="Track and manage your expenses efficiently." 
      />
      
      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading expenses...</div>
      ) : (
        <>
          <SummaryCards expenses={expenses} />
          
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Recent Expenses</h2>
            <ExpenseFilters filters={filters} setFilters={setFilters} />
            <ExpenseList expenses={filteredExpenses} onRefresh={loadExpenses} />
          </div>
        </>
      )}
    </div>
  );
}