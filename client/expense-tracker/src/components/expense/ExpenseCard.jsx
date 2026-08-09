import { useState } from 'react';
import { Edit2, Trash2, Tag, Calendar, Clock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function ExpenseCard({ expense, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract first two letters for avatar
  const initials = expense.title ? expense.title.substring(0, 2).toUpperCase() : 'EX';

  // Format Date and Time
  const dateObj = new Date(expense.date || expense.createdAt || Date.now());
  
  const formattedDate = dateObj.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  const formattedTime = dateObj.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <Card className="rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 p-4 sm:p-5 mb-3 bg-white group flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 rounded-2xl font-bold text-base sm:text-lg shadow-inner">
            {initials}
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 text-base sm:text-lg tracking-tight truncate leading-tight">
              {expense.title}
            </h3>
            
            {/* Meta Tags: Date & Time Timestamp + Category */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium pt-0.5">
              <span className="flex items-center gap-1 bg-slate-100/80 text-slate-600 px-2.5 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {formattedTime}
              </span>
              <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg capitalize">
                <Tag className="w-3.5 h-3.5 text-purple-500" />
                {expense.category}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Amount & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 flex-shrink-0">
          <span className="font-black text-lg sm:text-xl text-slate-900 tracking-tight">
            ₹{Number(expense.amount || 0).toLocaleString('en-IN')}
          </span>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit?.(expense)}
              className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl h-8 w-8 sm:h-9 sm:w-9"
              title="Edit Expense"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete?.(expense._id || expense.id)}
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-8 w-8 sm:h-9 sm:w-9"
              title="Delete Expense"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notes / Description Section - Clickable to expand fully */}
      {expense.description && (
        <div className="pt-2 border-t border-slate-100 mt-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left flex items-start gap-2 bg-slate-50 hover:bg-slate-100/80 p-2.5 rounded-xl text-xs text-slate-700 transition-colors group/note"
          >
            <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-slate-900 block mb-0.5">Notes:</span>
              <p className={isExpanded ? "whitespace-pre-wrap leading-relaxed" : "truncate text-slate-600"}>
                {expense.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-[11px] font-semibold flex-shrink-0 self-center">
              <span>{isExpanded ? "Show less" : "Read full note"}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>
        </div>
      )}
    </Card>
  );
}
