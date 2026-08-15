import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createExpense, updateExpense } from '../../services/api';
import { 
  Utensils, 
  Plane, 
  ShoppingBag, 
  FileText, 
  HeartPulse, 
  Film, 
  MoreHorizontal
} from "lucide-react";

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

  // Validation: 3 fields (title, amount, category) are strictly required. Notes/description is optional.
  const isTitleValid = Boolean(formData.title && formData.title.trim() !== '');
  const isAmountValid = Boolean(formData.amount !== '' && !isNaN(formData.amount) && Number(formData.amount) > 0);
  const isCategoryValid = Boolean(formData.category && formData.category.trim() !== '');
  
  const isFormValid = isTitleValid && isAmountValid && isCategoryValid;
  const isSaveDisabled = loading || !isFormValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

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
      
      // Refresh dashboard list
      window.dispatchEvent(new Event('expenseAdded'));
      if (onRefresh) onRefresh();
      
      // Close modal
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
      <DialogContent className="sm:max-w-[425px] bg-white text-slate-900 border-slate-200 shadow-2xl rounded-2xl p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {isEditMode ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs mt-1">
              {isEditMode 
                ? "Update the details of your expense below. Click save when you're done." 
                : "Enter the details of your expense here. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title (Required) */}
            <div className="grid gap-1.5">
              <label htmlFor="title" className="text-xs font-semibold text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Team Lunch / Grocery" 
                className="bg-slate-50 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-xl h-11"
              />
            </div>

            {/* Amount (Required) */}
            <div className="grid gap-1.5">
              <label htmlFor="amount" className="text-xs font-semibold text-slate-700">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <Input 
                id="amount" 
                value={formData.amount} 
                onChange={handleChange} 
                required 
                type="number" 
                min="0.01" 
                step="0.01" 
                placeholder="0.00" 
                className="bg-slate-50 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-xl h-11 font-semibold"
              />
            </div>

            {/* Category (Required) */}
            <div className="grid gap-1.5">
              <label htmlFor="category" className="text-xs font-semibold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <Select value={formData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-11 px-3.5 text-slate-800 font-medium">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100] shadow-2xl border border-slate-200 text-slate-800 rounded-2xl p-1.5 min-w-[200px]">
                  <SelectItem value="Food" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
                    <span className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-amber-500" />
                      Food
                    </span>
                  </SelectItem>
                  <SelectItem value="Travel" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
                    <span className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-sky-500" />
                      Travel
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
                      Bills
                    </span>
                  </SelectItem>
                  <SelectItem value="Health" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
                    <span className="flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-red-500" />
                      Health
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
            </div>

            {/* Notes / Description (Optional) */}
            <div className="grid gap-1.5">
              <label htmlFor="description" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Notes / Description</span>
                <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Add optional notes..." 
                className="resize-none bg-slate-50 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-xl h-20 text-xs" 
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-slate-200" disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSaveDisabled}
              style={
                isSaveDisabled 
                  ? { backgroundColor: '#cbd5e1', color: '#64748b', cursor: 'not-allowed', opacity: 0.6 } 
                  : { backgroundColor: '#2563eb', color: '#ffffff', cursor: 'pointer' }
              }
              className="rounded-xl font-bold transition-all border-0 shadow-sm"
            >
              {loading ? "Saving..." : (isEditMode ? "Save Changes" : "Save Expense")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
