import { Edit2, Trash2, Tag, Calendar, MessageSquare } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function ExpenseCard({ expense, onEdit, onDelete }) {
  // Extract first two letters for the avatar
  const initials = expense.title ? expense.title.substring(0, 2).toUpperCase() : 'EX';

  return (
    <Card className="rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 p-5 mb-4 bg-white group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-5">
        <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700 rounded-2xl font-bold text-lg shadow-inner">
          {initials}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-900 text-lg tracking-tight leading-none">{expense.title}</h3>
          
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md capitalize">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {expense.category}
            </span>
            {expense.description && (
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md truncate max-w-[120px]">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                {expense.description}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
        <div className="text-right">
          <span className="font-black text-xl text-slate-900 tracking-tight">₹{expense.amount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit?.(expense)}
            className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl h-10 w-10"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete?.(expense._id || expense.id)}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-10 w-10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
