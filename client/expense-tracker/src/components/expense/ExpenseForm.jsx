import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createExpense, updateExpense } from '../../services/api';
import { 
  Utensils, Plane, ShoppingBag, FileText, HeartPulse, Film, MoreHorizontal, Plus, Tag, X
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  { value: 'Food', icon: Utensils, color: 'text-amber-500' },
  { value: 'Travel', icon: Plane, color: 'text-sky-500' },
  { value: 'Shopping', icon: ShoppingBag, color: 'text-pink-500' },
  { value: 'Bills', icon: FileText, color: 'text-emerald-500' },
  { value: 'Health', icon: HeartPulse, color: 'text-red-500' },
  { value: 'Entertainment', icon: Film, color: 'text-purple-500' },
  { value: 'Others', icon: MoreHorizontal, color: 'text-slate-500' },
];

export function ExpenseForm({ isOpen, onClose, onRefresh, initialData }) {
  const [loading, setLoading] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [customCategories, setCustomCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spendflow_custom_cats') || '[]'); } catch { return []; }
  });
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const isEditMode = Boolean(initialData);
  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...customCategories.map(c => ({ value: c, icon: Tag, color: 'text-indigo-500' }))
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || '',
        description: initialData.description || '',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({ title: '', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
    }
    setShowCustomInput(false);
    setCustomCategoryInput('');
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCategoryChange = (val) => {
    if (val === '__add_custom__') {
      setShowCustomInput(true);
      return;
    }
    setFormData({ ...formData, category: val });
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    const updated = [...new Set([...customCategories, trimmed])];
    setCustomCategories(updated);
    localStorage.setItem('spendflow_custom_cats', JSON.stringify(updated));
    setFormData({ ...formData, category: trimmed });
    setShowCustomInput(false);
    setCustomCategoryInput('');
  };

  const handleRemoveCustomCategory = (cat) => {
    const updated = customCategories.filter(c => c !== cat);
    setCustomCategories(updated);
    localStorage.setItem('spendflow_custom_cats', JSON.stringify(updated));
    if (formData.category === cat) setFormData({ ...formData, category: '' });
  };

  const isTitleValid = Boolean(formData.title && formData.title.trim() !== '');
  const isAmountValid = Boolean(formData.amount !== '' && !isNaN(formData.amount) && Number(formData.amount) > 0);
  const isCategoryValid = Boolean(formData.category && formData.category.trim() !== '');
  const isDateValid = Boolean(formData.date);
  const isFormValid = isTitleValid && isAmountValid && isCategoryValid && isDateValid;
  const isSaveDisabled = loading || !isFormValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      setLoading(true);
      // Parse as local noon to avoid timezone boundary shift (safe for IST UTC+5:30)
      const [yr, mo, dy] = formData.date.split('-').map(Number);
      const localNoon = new Date(yr, mo - 1, dy, 12, 0, 0);
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        date: localNoon.toISOString(),
      };
      if (isEditMode) {
        await updateExpense(initialData._id || initialData.id, payload);
      } else {
        await createExpense(payload);
      }
      if (!isEditMode) {
        setFormData({ title: '', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
      }
      window.dispatchEvent(new Event('expenseAdded'));
      if (onRefresh) onRefresh();
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
      <DialogContent className="sm:max-w-[440px] bg-white text-slate-900 border-slate-200 shadow-2xl rounded-2xl p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {isEditMode ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs mt-1">
              {isEditMode
                ? "Update the details of your expense below."
                : "Enter the details of your expense. Past dates are allowed."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
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

            {/* Amount + Date side by side */}
            <div className="grid grid-cols-2 gap-3">
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
              <div className="grid gap-1.5">
                <label htmlFor="date" className="text-xs font-semibold text-slate-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                  required
                  className="bg-slate-50 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-xl h-11"
                />
              </div>
            </div>

            {/* Category */}
            <div className="grid gap-1.5">
              <label htmlFor="category" className="text-xs font-semibold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              {showCustomInput ? (
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    value={customCategoryInput}
                    onChange={e => setCustomCategoryInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCategory())}
                    placeholder="e.g. Gym, Petrol..."
                    className="bg-slate-50 border-slate-200 rounded-xl h-11 flex-1"
                  />
                  <Button type="button" onClick={handleAddCustomCategory}
                    className="rounded-xl h-11 px-3 bg-blue-600 text-white hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowCustomInput(false)}
                    className="rounded-xl h-11 px-3 text-slate-500">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Select value={formData.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-11 px-3.5 text-slate-800 font-medium">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-[100] shadow-2xl border border-slate-200 text-slate-800 rounded-2xl p-1.5 min-w-[200px]">
                    {allCategories.map(({ value, icon: Icon, color }) => (
                      <SelectItem key={value} value={value} className="rounded-xl cursor-pointer py-2 px-3 hover:bg-slate-100">
                        <span className="flex items-center justify-between gap-2 w-full">
                          <span className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${color}`} />
                            {value}
                          </span>
                          {customCategories.includes(value) && (
                            <span
                              onClick={e => { e.stopPropagation(); handleRemoveCustomCategory(value); }}
                              className="ml-2 text-slate-400 hover:text-red-500 cursor-pointer"
                              title="Remove custom category"
                            >
                              <X className="w-3 h-3" />
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                    {/* Add Custom option */}
                    <SelectItem value="__add_custom__" className="rounded-xl cursor-pointer py-2 px-3 hover:bg-blue-50 text-blue-600 font-semibold">
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-blue-500" />
                        Add Custom Category
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Notes */}
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
