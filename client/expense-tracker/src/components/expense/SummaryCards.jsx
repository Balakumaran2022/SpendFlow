import { Card, CardContent } from "@/components/ui/card";
import { Wallet, IndianRupee, CalendarDays, Tags } from "lucide-react";

export default function SummaryCards({ expenses = [] }) {
  // Calculate totals
  const totalExpense = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysExpense = expenses
    .filter(exp => new Date(exp.date) >= today)
    .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthExpense = expenses
    .filter(exp => new Date(exp.date) >= firstDayOfMonth)
    .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const uniqueCategories = new Set(expenses.map(exp => exp.category)).size;

  const summaryData = [
    {
      title: "Total Expense",
      value: `₹${totalExpense.toLocaleString('en-IN')}`,
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50/80 border border-blue-100",
    },
    {
      title: "Today's Expense",
      value: `₹${todaysExpense.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50/80 border border-emerald-100",
    },
    {
      title: "This Month",
      value: `₹${thisMonthExpense.toLocaleString('en-IN')}`,
      icon: CalendarDays,
      color: "text-purple-600",
      bg: "bg-purple-50/80 border border-purple-100",
    },
    {
      title: "Categories",
      value: uniqueCategories.toString(),
      icon: Tags,
      color: "text-orange-600",
      bg: "bg-orange-50/80 border border-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {summaryData.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-md transition-all duration-200 bg-white overflow-hidden"
          >
            <CardContent className="p-3.5 sm:p-5 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">
                  {item.title}
                </p>
                <h2 className="mt-1 text-base sm:text-2xl font-black tracking-tight text-slate-900 truncate">
                  {item.value}
                </h2>
              </div>
              <div className={`shrink-0 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 ${item.bg} ${item.color}`}>
                <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}