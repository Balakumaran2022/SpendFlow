import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart as PieChartIcon, TrendingUp, BarChart3, Download, X, Calendar, Filter } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { fetchExpenses, getCachedExpensesLocally } from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#64748B', '#F97316', '#06B6D4'];

const QUICK_RANGES = [
  { label: 'All Time', value: 'all' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'This Year', value: 'this_year' },
  { label: 'Custom', value: 'custom' },
];

function getDateRange(preset) {
  const now = new Date();
  const start = new Date();
  switch (preset) {
    case 'this_month':
      start.setDate(1); start.setHours(0, 0, 0, 0);
      return { from: start, to: now };
    case 'last_month': {
      const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const e = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      return { from: s, to: e };
    }
    case 'last_3_months':
      start.setMonth(now.getMonth() - 3); start.setHours(0, 0, 0, 0);
      return { from: start, to: now };
    case 'this_year':
      start.setMonth(0); start.setDate(1); start.setHours(0, 0, 0, 0);
      return { from: start, to: now };
    default:
      return null;
  }
}

export default function Reports() {
  const [expenses, setExpenses] = useState(() => getCachedExpensesLocally());
  const [loading, setLoading] = useState(() => expenses.length === 0);
  const [preset, setPreset] = useState('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState(new Date().toISOString().split('T')[0]);
  const [drillCategory, setDrillCategory] = useState(null); // { name, expenses }

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const response = await fetchExpenses();
        if (response.data) setExpenses(response.data);
      } catch (error) {
        console.error("Error loading expenses:", error);
      } finally {
        setLoading(false);
      }
    };
    loadExpenses();
  }, []);

  // Filter expenses by date range
  const filteredExpenses = useMemo(() => {
    if (preset === 'all') return expenses;
    if (preset === 'custom') {
      if (!customFrom) return expenses;
      const from = new Date(customFrom + 'T00:00:00');
      const to = new Date(customTo + 'T23:59:59');
      return expenses.filter(e => {
        const d = new Date(e.date);
        return d >= from && d <= to;
      });
    }
    const range = getDateRange(preset);
    if (!range) return expenses;
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d >= range.from && d <= range.to;
    });
  }, [expenses, preset, customFrom, customTo]);

  // Category pie data
  const categoryData = filteredExpenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) { existing.value += Number(curr.amount || 0); }
    else { acc.push({ name: curr.category, value: Number(curr.amount || 0) }); }
    return acc;
  }, []);

  // Monthly bar data
  const monthlyData = filteredExpenses.reduce((acc, curr) => {
    const d = new Date(curr.date);
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const existing = acc.find(item => item.name === label);
    if (existing) { existing.total += Number(curr.amount || 0); }
    else { acc.push({ name: label, total: Number(curr.amount || 0) }); }
    return acc;
  }, []).sort((a, b) => new Date('1 ' + a.name) - new Date('1 ' + b.name));

  const totalAmount = filteredExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // Category drill-down click
  const handlePieClick = (data) => {
    if (!data || !data.name) return;
    const catExpenses = filteredExpenses
      .filter(e => e.category === data.name)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setDrillCategory({ name: data.name, expenses: catExpenses, total: data.value });
  };

  const handleDownloadPDF = () => {
    if (!filteredExpenses.length) return;
    const doc = new jsPDF();
    doc.setFontSize(22); doc.setTextColor(37, 99, 235);
    doc.text("SpendFlow Financial Report", 14, 20);
    doc.setFontSize(10); doc.setTextColor(100, 116, 139);
    const rangeLabel = preset === 'all' ? 'All Time'
      : preset === 'custom' ? `${customFrom} to ${customTo}`
      : QUICK_RANGES.find(r => r.value === preset)?.label || '';
    doc.text(`Period: ${rangeLabel} | Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 28);
    const avgAmount = filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toFixed(2) : 0;
    autoTable(doc, {
      startY: 34,
      head: [['Metric', 'Details']],
      body: [
        ['Total Expenses', `${filteredExpenses.length} transaction(s)`],
        ['Total Amount Spent', `Rs. ${totalAmount.toLocaleString('en-IN')}`],
        ['Average Expense', `Rs. ${Number(avgAmount).toLocaleString('en-IN')}`],
        ['Categories', `${categoryData.length} category(ies)`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
    });
    let nextY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(13); doc.setTextColor(15, 23, 42);
    doc.text("Category Summary", 14, nextY);
    autoTable(doc, {
      startY: nextY + 4,
      head: [['Category', 'Total Spent', 'Share (%)']],
      body: categoryData.map(cat => [cat.name, `Rs. ${cat.value.toLocaleString('en-IN')}`, `${((cat.value / (totalAmount || 1)) * 100).toFixed(1)}%`]),
      theme: 'striped',
      headStyles: { fillColor: [147, 51, 234], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    nextY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(13); doc.setTextColor(15, 23, 42);
    doc.text("Expense History", 14, nextY);
    autoTable(doc, {
      startY: nextY + 4,
      head: [['Date', 'Title', 'Category', 'Notes', 'Amount']],
      body: filteredExpenses.map(exp => [
        new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        exp.title || '-', exp.category || '-', exp.description || '-',
        `Rs. ${Number(exp.amount).toLocaleString('en-IN')}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
    });
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
      doc.text(`SpendFlow - Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    }
    doc.save(`SpendFlow_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="mx-auto max-w-7xl px-3.5 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2.5 rounded-xl flex-shrink-0">
            <PieChartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">Financial Reports</h1>
            <p className="text-xs sm:text-sm text-slate-500">Analyze your spending patterns.</p>
          </div>
        </div>
        <Button
          onClick={handleDownloadPDF}
          disabled={loading || filteredExpenses.length === 0}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold"
        >
          <Download className="w-4 h-4" /> Download PDF Report
        </Button>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Date Range Filter</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_RANGES.map(r => (
            <button
              key={r.value}
              onClick={() => setPreset(r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                preset === r.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        {preset === 'custom' && (
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">From</span>
              <Input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                max={customTo}
                className="h-8 text-xs rounded-lg border-slate-200 w-36" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">To</span>
              <Input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                min={customFrom} max={new Date().toISOString().split('T')[0]}
                className="h-8 text-xs rounded-lg border-slate-200 w-36" />
            </div>
          </div>
        )}
        {preset !== 'all' && (
          <p className="text-xs text-slate-500 mt-2">
            Showing <span className="font-bold text-blue-600">{filteredExpenses.length}</span> expenses
            totalling <span className="font-bold text-blue-600">₹{totalAmount.toLocaleString('en-IN')}</span>
          </p>
        )}
      </div>

      {/* Category Drill-Down Modal */}
      {drillCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setDrillCategory(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">{drillCategory.name}</h2>
                <p className="text-xs text-slate-500">{drillCategory.expenses.length} expenses · Total: <span className="font-bold text-blue-600">₹{drillCategory.total.toLocaleString('en-IN')}</span></p>
              </div>
              <button onClick={() => setDrillCategory(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-2">
              {drillCategory.expenses.map(exp => (
                <div key={exp._id || exp.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{exp.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {exp.description && ` · ${exp.description}`}
                    </p>
                  </div>
                  <span className="font-black text-slate-900 text-sm">₹{Number(exp.amount).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading your financial reports...</div>
      ) : filteredExpenses.length === 0 ? (
        <div className="py-12 text-center text-slate-500 font-medium">No expenses found for this date range.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* Monthly Trends Bar Chart */}
          <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 sm:p-5 flex flex-row items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <CardTitle className="text-base sm:text-lg font-bold">Monthly Trends</CardTitle>
                <CardDescription className="text-xs">Your spending over time</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 h-[280px] sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
                <BarChart data={monthlyData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={55}
                    tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`} />
                  <Tooltip cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Total Spent']} />
                  <Bar dataKey="total" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown Pie Chart — clickable */}
          <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 sm:p-5 flex flex-row items-center gap-3">
              <BarChart3 className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <CardTitle className="text-base sm:text-lg font-bold">Category Breakdown</CardTitle>
                <CardDescription className="text-xs">Click a slice to see expenses in that category</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 h-[280px] sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%" cy="45%"
                    innerRadius={45} outerRadius={80}
                    paddingAngle={4} dataKey="value"
                    stroke="none"
                    onClick={handlePieClick}
                    style={{ cursor: 'pointer' }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spent']}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Summary Cards */}
          <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden lg:col-span-2">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 sm:p-5">
              <CardTitle className="text-base sm:text-lg font-bold">Category Summary</CardTitle>
              <CardDescription className="text-xs">Click any row to see detailed expenses</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {categoryData.sort((a, b) => b.value - a.value).map((cat, idx) => {
                  const pct = ((cat.value / (totalAmount || 1)) * 100).toFixed(1);
                  return (
                    <button key={cat.name} onClick={() => handlePieClick(cat)}
                      className="w-full flex items-center gap-3 bg-slate-50 hover:bg-blue-50 rounded-xl p-3 transition-all group text-left">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="font-semibold text-slate-700 text-sm flex-1">{cat.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:block w-32 bg-slate-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[idx % COLORS.length] }} />
                        </div>
                        <span className="text-xs text-slate-500 w-10 text-right">{pct}%</span>
                        <span className="font-black text-slate-900 text-sm w-24 text-right">₹{cat.value.toLocaleString('en-IN')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
