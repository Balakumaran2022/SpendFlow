import { Link } from 'react-router-dom';
import { PiggyBank, Trash2, ChevronRight, Sparkles, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';

export default function More() {
  const menuItems = [
    {
      title: 'Monthly Budget',
      description: 'Set and track your monthly spending limits and progress.',
      path: '/budget',
      icon: PiggyBank,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50',
      badge: 'Savings'
    },
    {
      title: 'Bulk Delete',
      description: 'Select, filter, and delete multiple expense records securely.',
      path: '/bulk-delete',
      icon: Trash2,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50',
      badge: 'Manage'
    }
  ];

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      <PageHeader 
        title="More Features" 
        description="Access additional tools and financial management features." 
      />

      <div className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${item.bg}`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h2>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          );
        })}
      </div>

      {/* Helpful tips section */}
      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p className="font-semibold text-slate-900 dark:text-slate-100">SpendFlow Tip</p>
          <p>
            You can set monthly budgets anytime to keep spending under control. Use Bulk Delete when cleaning up test or duplicate records.
          </p>
        </div>
      </div>
    </div>
  );
}
