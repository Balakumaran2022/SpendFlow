import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { ExpenseForm } from '../components/expense/ExpenseForm';

export function MainLayout() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const handleEditExpense = (e) => {
      setEditingExpense(e.detail);
      setIsFormOpen(true);
    };

    window.addEventListener('editExpense', handleEditExpense);
    return () => window.removeEventListener('editExpense', handleEditExpense);
  }, []);

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col">
      <Navbar onAddExpense={handleAddExpense} />
      
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 w-full animate-in fade-in duration-500 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <ExpenseForm 
        isOpen={isFormOpen} 
        onClose={handleClose} 
        initialData={editingExpense}
      />
    </div>
  );
}
