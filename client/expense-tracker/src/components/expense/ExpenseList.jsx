import { ExpenseCard } from './ExpenseCard';
import { EmptyState } from '../common/EmptyState';
import { deleteExpense } from '../../services/api';

export function ExpenseList({ expenses, onRefresh }) {
  if (!expenses?.length) {
    return <EmptyState />;
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpense(id);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert("Failed to delete expense");
    }
  };

  const handleEdit = (expense) => {
    window.dispatchEvent(new CustomEvent('editExpense', { detail: expense }));
  };

  return (
    <div className="space-y-1">
      {expenses.map((expense) => (
        <ExpenseCard 
          key={expense._id || expense.id} 
          expense={expense} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
