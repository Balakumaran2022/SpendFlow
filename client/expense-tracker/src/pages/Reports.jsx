import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart as PieChartIcon, TrendingUp, BarChart3, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchExpenses } from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#64748B'];

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const response = await fetchExpenses();
        setExpenses(response.data || []);
      } catch (error) {
        console.error("Error loading expenses:", error);
      } finally {
        setLoading(false);
      }
    };
    loadExpenses();
  }, []);

  // Process data for Category Pie Chart
  const categoryData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += Number(curr.amount || 0);
    } else {
      acc.push({ name: curr.category, value: Number(curr.amount || 0) });
    }
    return acc;
  }, []);

  // Process data for Monthly Trends Bar Chart
  const monthlyData = expenses.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.total += Number(curr.amount || 0);
    } else {
      acc.push({ name: month, total: Number(curr.amount || 0) });
    }
    return acc;
  }, []);

  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const handleDownloadPDF = () => {
    if (!expenses.length) return;

    const doc = new jsPDF();
    
    // Header Branding
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // #2563EB Blue
    doc.text("BalaSpend Financial Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 14, 28);
    
    const avgAmount = expenses.length > 0 ? (totalAmount / expenses.length).toFixed(2) : 0;
    
    // Overview Summary Table
    autoTable(doc, {
      startY: 34,
      head: [['Financial Summary Metric', 'Details']],
      body: [
        ['Total Expenses Recorded', `${expenses.length} transaction(s)`],
        ['Total Amount Spent', `Rs. ${totalAmount.toLocaleString('en-IN')}`],
        ['Average Expense Amount', `Rs. ${Number(avgAmount).toLocaleString('en-IN')}`],
        ['Categories Active', `${categoryData.length} category(ies)`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
    });
    
    // Category Breakdown Table
    let nextY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("Category Summary", 14, nextY);
    
    const categoryRows = categoryData.map(cat => [
      cat.name,
      `Rs. ${cat.value.toLocaleString('en-IN')}`,
      `${((cat.value / (totalAmount || 1)) * 100).toFixed(1)}%`
    ]);
    
    autoTable(doc, {
      startY: nextY + 4,
      head: [['Category Name', 'Total Spent', 'Share (%)']],
      body: categoryRows,
      theme: 'striped',
      headStyles: { fillColor: [147, 51, 234], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    
    // Detailed Expense History
    nextY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("Detailed Expense History", 14, nextY);
    
    const expenseRows = expenses.map(exp => [
      new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      exp.title || '-',
      exp.category || '-',
      exp.description || '-',
      `Rs. ${Number(exp.amount).toLocaleString('en-IN')}`
    ]);
    
    autoTable(doc, {
      startY: nextY + 4,
      head: [['Date', 'Title', 'Category', 'Notes', 'Amount']],
      body: expenseRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
    });
    
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`BalaSpend App - Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    }
    
    doc.save(`BalaSpend_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="mx-auto max-w-7xl px-3.5 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2.5 rounded-xl flex-shrink-0">
            <PieChartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              Financial Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Analyze your spending patterns & financial health.
            </p>
          </div>
        </div>

        <Button 
          onClick={handleDownloadPDF} 
          disabled={loading || expenses.length === 0}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold"
        >
          <Download className="w-4 h-4" />
          Download PDF Report
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading your financial reports...</div>
      ) : expenses.length === 0 ? (
        <div className="py-12 text-center text-slate-500 font-medium">No expenses found to generate reports.</div>
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={5} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11 }} 
                    width={50}
                    tickFormatter={(value) => `₹${Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                  />
                  <Bar dataKey="total" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown Pie Chart */}
          <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 sm:p-5 flex flex-row items-center gap-3">
              <BarChart3 className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <CardTitle className="text-base sm:text-lg font-bold">Category Breakdown</CardTitle>
                <CardDescription className="text-xs">Where your money goes</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 h-[280px] sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>

                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(value) => `₹${value}`} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
