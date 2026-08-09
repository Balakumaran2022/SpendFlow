import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Trash2, 
  Calendar, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  Filter, 
  RefreshCw, 
  Tag, 
  Search,
  Check
} from "lucide-react";
import { fetchExpenses, bulkDeleteExpenses, deleteExpense } from "../services/api";

export default function BulkDelete() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetchExpenses(true);
      setExpenses(response.data || []);
    } catch (error) {
      console.error("Error loading expenses for bulk delete:", error);
      showNotification("Failed to load expenses. Please check network connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Preset Date Handlers
  const handleQuickPreset = (type) => {
    const today = new Date();
    const formatDateStr = (d) => d.toISOString().split('T')[0];

    if (type === 'today') {
      const str = formatDateStr(today);
      setFromDate(str);
      setToDate(str);
    } else if (type === 'yesterday') {
      const yest = new Date(today);
      yest.setDate(yest.getDate() - 1);
      const str = formatDateStr(yest);
      setFromDate(str);
      setToDate(str);
    } else if (type === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      setFromDate(formatDateStr(weekAgo));
      setToDate(formatDateStr(today));
    } else if (type === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setFromDate(formatDateStr(firstDay));
      setToDate(formatDateStr(today));
    } else if (type === 'clear') {
      setFromDate('');
      setToDate('');
      setSelectedCategory('All');
      setSearchQuery('');
    }
  };

  // Filter expenses by Date range, Category, and Search query
  const filteredExpenses = useMemo(() => {
    return expenses.filter(item => {
      // Date Filter
      if (fromDate) {
        const itemDate = new Date(item.date);
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        if (itemDate < start) return false;
      }

      if (toDate) {
        const itemDate = new Date(item.date);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
      }

      // Category Filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
      }

      return true;
    });
  }, [expenses, fromDate, toDate, selectedCategory, searchQuery]);

  const allFilteredIds = useMemo(() => filteredExpenses.map(exp => exp._id || exp.id), [filteredExpenses]);
  
  const isAllSelected = useMemo(() => {
    if (allFilteredIds.length === 0) return false;
    return allFilteredIds.every(id => selectedIds.includes(id));
  }, [allFilteredIds, selectedIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all visible
      setSelectedIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      // Select all visible
      const merged = Array.from(new Set([...selectedIds, ...allFilteredIds]));
      setSelectedIds(merged);
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Calculate totals
  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredExpenses]);

  const selectedExpenses = useMemo(() => {
    return expenses.filter(item => selectedIds.includes(item._id || item.id));
  }, [expenses, selectedIds]);

  const totalSelectedAmount = useMemo(() => {
    return selectedExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [selectedExpenses]);

  // Handle single deletion
  const handleDeleteSingle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpense(id);
      setSelectedIds(prev => prev.filter(item => item !== id));
      showNotification("Expense deleted successfully!");
      loadExpenses();
    } catch (err) {
      showNotification("Failed to delete expense.", "error");
    }
  };

  // Handle Bulk Deletion
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      const res = await bulkDeleteExpenses(selectedIds);
      showNotification(`Successfully deleted ${res.deletedCount || selectedIds.length} expenses!`);
      setSelectedIds([]);
      setShowConfirmModal(false);
      await loadExpenses();
    } catch (err) {
      console.error("Bulk delete failed:", err);
      showNotification(`Bulk delete failed: ${err.message || 'Server error'}`, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const categories = ["All", "Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Others"];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 pb-24 md:pb-8">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold transition-all animate-in fade-in slide-in-from-top-3 ${
          notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {notification.type === 'error' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <Check className="w-5 h-5 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2.5 sm:p-3 rounded-2xl text-red-600 shadow-sm shrink-0">
            <Trash2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">BULK DELETE</h1>
            <p className="text-slate-500 text-xs sm:text-sm">Choose From & To Date, select all, and delete expenses at once.</p>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={loadExpenses} 
          disabled={loading}
          className="self-end sm:self-auto rounded-xl gap-1.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-100 border-slate-200 h-9"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Date Filter & Options Card - Mobile Friendly Grid */}
      <Card className="rounded-2xl border border-slate-200/80 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 sm:p-5">
          <CardTitle className="text-sm sm:text-base font-semibold text-slate-800 flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600 shrink-0" />
            Filter Expenses by Date & Category
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Select date range to view all matching transactions.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            {/* From Date */}
            <div className="col-span-1">
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600 shrink-0" />
                From Date
              </label>
              <Input 
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-xl border-slate-200 text-xs sm:text-sm h-10 px-2.5 sm:px-3 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              />
            </div>

            {/* To Date */}
            <div className="col-span-1">
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600 shrink-0" />
                To Date
              </label>
              <Input 
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-xl border-slate-200 text-xs sm:text-sm h-10 px-2.5 sm:px-3 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              />
            </div>

            {/* Category Dropdown */}
            <div className="col-span-1">
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-blue-600 shrink-0" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 px-2.5 sm:px-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="col-span-1">
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Search className="w-3 h-3 text-blue-600 shrink-0" />
                Search
              </label>
              <Input 
                type="text"
                placeholder="Title, desc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border-slate-200 text-xs sm:text-sm h-10 px-2.5 sm:px-3"
              />
            </div>

          </div>

          {/* Quick Range Presets - Touch Friendly Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 mr-1 w-full sm:w-auto">Presets:</span>
            <Button size="sm" variant="ghost" onClick={() => handleQuickPreset('today')} className="rounded-xl text-xs h-8 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-600">
              Today
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleQuickPreset('yesterday')} className="rounded-xl text-xs h-8 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-600">
              Yesterday
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleQuickPreset('week')} className="rounded-xl text-xs h-8 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-600">
              Last 7 Days
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleQuickPreset('month')} className="rounded-xl text-xs h-8 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-600">
              This Month
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleQuickPreset('clear')} className="rounded-xl text-xs h-8 px-3 text-slate-500 hover:bg-slate-200 ml-auto">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action & Selection Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-lg space-y-3 md:space-y-0 md:flex md:items-center md:justify-between">
        
        {/* Stats Section */}
        <div className="space-y-1 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-300">
            <span>Showing: <strong className="text-white font-bold">{filteredExpenses.length}</strong> items</span>
            <span>•</span>
            <span>Total: <strong className="text-emerald-400 font-bold">₹{totalFilteredAmount.toLocaleString('en-IN')}</strong></span>
          </div>
          <div className="text-xs text-slate-400">
            Selected: <span className="text-red-400 font-bold">{selectedIds.length}</span> items (<span className="text-red-400 font-bold">₹{totalSelectedAmount.toLocaleString('en-IN')}</span>)
          </div>
        </div>

        {/* Buttons for Desktop & Mobile Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* SELECT ALL TOGGLE */}
          <Button
            type="button"
            onClick={toggleSelectAll}
            disabled={filteredExpenses.length === 0}
            className={`flex-1 sm:flex-initial rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 h-10 ${
              isAllSelected 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-900/40' 
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isAllSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
            <span>{isAllSelected ? "DESELECT ALL" : "SELECT ALL"}</span>
          </Button>

          {/* BULK DELETE BUTTON */}
          <Button
            type="button"
            disabled={selectedIds.length === 0 || isDeleting}
            onClick={() => setShowConfirmModal(true)}
            className="flex-1 sm:flex-initial rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 px-4 py-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 h-10 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>BULK DELETE ({selectedIds.length})</span>
          </Button>

        </div>
      </div>

      {/* Expense List View */}
      <Card className="rounded-2xl border border-slate-200/80 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-sm">Fetching expenses...</span>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2 p-4">
              <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-base font-semibold text-slate-700">No expenses found for this date range.</p>
              <p className="text-xs text-slate-400">Choose From Date & To Date above or tap Reset.</p>
            </div>
          ) : (
            <>
              {/* MOBILE CARD LIST (Visible on Mobile screens < 768px) */}
              <div className="block md:hidden divide-y divide-slate-100">
                {filteredExpenses.map((exp) => {
                  const id = exp._id || exp.id;
                  const isSelected = selectedIds.includes(id);
                  const formattedDate = new Date(exp.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <div 
                      key={id}
                      onClick={() => toggleSelectItem(id)}
                      className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer active:bg-slate-100 ${
                        isSelected ? 'bg-red-50/80 border-l-4 border-l-red-600' : ''
                      }`}
                    >
                      {/* Mobile Checkbox */}
                      <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(id)}
                          className="w-5 h-5 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{exp.title}</h4>
                          <span className="text-sm font-extrabold text-slate-900 shrink-0">
                            ₹{Number(exp.amount).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/50">
                            {exp.category}
                          </span>
                          <span>•</span>
                          <span>{formattedDate}</span>
                        </div>

                        {exp.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{exp.description}</p>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSingle(id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100/50 rounded-xl shrink-0"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TABLE VIEW (Visible on screens >= 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                      <th className="py-3.5 px-4 w-12 text-center">
                        <input 
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Expense Title</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Description</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExpenses.map((exp) => {
                      const id = exp._id || exp.id;
                      const isSelected = selectedIds.includes(id);
                      const formattedDate = new Date(exp.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });

                      return (
                        <tr 
                          key={id}
                          onClick={() => toggleSelectItem(id)}
                          className={`transition-colors cursor-pointer hover:bg-slate-50/80 ${
                            isSelected ? 'bg-red-50/70 font-medium text-red-900' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectItem(id)}
                              className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                            {formattedDate}
                          </td>
                          <td className="py-3.5 px-4 text-slate-900 font-semibold">
                            {exp.title}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/50">
                              {exp.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                            {exp.description || '—'}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-slate-900">
                            ₹{Number(exp.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSingle(id)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete this expense"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal - Mobile Centered */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-slate-100">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 sm:p-3 bg-red-100 rounded-2xl shrink-0">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Confirm Bulk Delete</h3>
                <p className="text-xs text-slate-500">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm space-y-2">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Items Selected for Deletion:</span>
                <span className="text-red-700 font-extrabold">{selectedIds.length} records</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Total Monetary Value:</span>
                <span className="text-red-700 font-extrabold">₹{totalSelectedAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Are you sure you want to delete these <strong className="text-slate-800">{selectedIds.length}</strong> selected expense records from the database?
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-xl h-11 border-slate-200 font-semibold text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmBulkDelete}
                className="flex-1 rounded-xl h-11 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
