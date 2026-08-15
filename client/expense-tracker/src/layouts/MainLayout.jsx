import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
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
    <div className="min-h-screen max-w-full overflow-x-hidden bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col pb-24 md:pb-0">
      <Navbar onAddExpense={handleAddExpense} />
      
      <div className="flex flex-1 w-full max-w-full overflow-x-hidden">
        <Sidebar onAddExpense={handleAddExpense} />

        <main className="flex-1 w-full max-w-full animate-in fade-in duration-500 overflow-x-hidden">
          <Outlet />
        </main>
      </div>


      <MobileBottomNav onAddExpense={handleAddExpense} />

      <ExpenseForm 
        isOpen={isFormOpen} 
        onClose={handleClose} 
        initialData={editingExpense}
      />
    </div>
  );
}
