import { Card, CardContent } from "@/components/ui/card";
import { Wallet, IndianRupee, CalendarDays, Tags } from "lucide-react";

export default function SummaryCards({ expenses = [] }) {
  // Calculate totals
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysExpense = expenses
    .filter(exp => new Date(exp.date) >= today)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthExpense = expenses
    .filter(exp => new Date(exp.date) >= firstDayOfMonth)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const uniqueCategories = new Set(expenses.map(exp => exp.category)).size;

  const summaryData = [
    {
      title: "Total Expense",
      value: `₹${totalExpense.toLocaleString()}`,
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Today's Expense",
      value: `₹${todaysExpense.toLocaleString()}`,
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "This Month",
      value: `₹${thisMonthExpense.toLocaleString()}`,
      icon: CalendarDays,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Categories",
      value: uniqueCategories.toString(),
      icon: Tags,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {summaryData.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1 pr-4">
                <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {item.title}
                </p>
                <h2 className="mt-2 text-2xl xl:text-3xl font-bold tracking-tight text-slate-800 break-all">
                  {item.value}
                </h2>
              </div>
              <div className={`shrink-0 rounded-2xl p-4 ${item.bg} ${item.color}`}>
                <Icon className="h-7 w-7" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}