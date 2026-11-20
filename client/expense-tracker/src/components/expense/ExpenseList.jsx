import { useState } from 'react';
import { ExpenseCard } from './ExpenseCard';
import { EmptyState } from '../common/EmptyState';
import { deleteExpense } from '../../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

export function ExpenseList({ expenses, onRefresh }) {
  const [page, setPage] = useState(1);

  if (!expenses?.length) {
    return <EmptyState />;
  }

  const totalPages = Math.ceil(expenses.length / PAGE_SIZE);
  const paginated = expenses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, expenses.length);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpense(id);
      // If last item on page > 1, go back
      if (paginated.length === 1 && page > 1) setPage(p => p - 1);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert(`Failed to delete expense: ${error.message || error}`);
    }
  };

  const handleEdit = (expense) => {
    window.dispatchEvent(new CustomEvent('editExpense', { detail: expense }));
  };

  return (
    <div className="space-y-1">
      {paginated.map((expense) => (
        <ExpenseCard
          key={expense._id || expense.id}
          expense={expense}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 pb-2 px-1">
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-700">{startIdx}–{endIdx}</span> of{' '}
            <span className="font-bold text-slate-700">{expenses.length}</span> expenses
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-slate-400 text-xs">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      page === p
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
