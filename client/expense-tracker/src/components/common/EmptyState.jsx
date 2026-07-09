import { Receipt } from 'lucide-react';

export function EmptyState({ title = "No expenses yet", description = "Add your first expense to get started." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <Receipt className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-500 mt-1 max-w-sm">{description}</p>
    </div>
  );
}
