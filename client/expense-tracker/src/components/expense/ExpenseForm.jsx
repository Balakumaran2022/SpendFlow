import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createExpense, updateExpense } from '../../services/api';

export function ExpenseForm({ isOpen, onClose, onRefresh, initialData }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: ''
  });

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        description: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCategoryChange = (val) => {
    setFormData({ ...formData, category: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };
      
      if (!isEditMode) {
        payload.date = new Date().toISOString();
      }

      if (isEditMode) {
        await updateExpense(initialData._id || initialData.id, payload);
      } else {
        await createExpense(payload);
      }
      
      // Reset form
      if (!isEditMode) {
        setFormData({ title: '', amount: '', category: '', description: '' });
      }
      
      // Refresh the dashboard list
      window.dispatchEvent(new Event('expenseAdded'));
      if (onRefresh) onRefresh();
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error(isEditMode ? "Failed to update expense:" : "Failed to add expense:", error);
      alert(isEditMode ? "Failed to update expense" : "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white text-slate-900 border-slate-200 shadow-xl rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {isEditMode ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {isEditMode 
                ? "Update the details of your expense below. Click save when you're done." 
                : "Enter the details of your expense here. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium text-slate-700">Title</label>
              <Input id="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Lunch with team" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium text-slate-700">Amount (₹)</label>
              <Input id="amount" value={formData.amount} onChange={handleChange} required type="number" min="0" step="0.01" placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium text-slate-700">Category</label>
              <Select value={formData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100] shadow-lg border border-slate-200 text-slate-900">
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Bills">Bills</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium text-slate-700">Notes</label>
              <Textarea id="description" value={formData.description} onChange={handleChange} placeholder="Optional details..." className="resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl" disabled={loading}>Cancel</Button>
            <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? "Saving..." : (isEditMode ? "Save Changes" : "Save Expense")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
