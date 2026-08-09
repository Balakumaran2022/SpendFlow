import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart as PieChartIcon, TrendingUp, BarChart3, Download, FileText } from "lucide-react";
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
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  // Process data for Monthly Trends Bar Chart
  const monthlyData = expenses.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.total += curr.amount;
    } else {
      acc.push({ name: month, total: curr.amount });
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
    doc.text("SpendFlow Financial Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 14, 28);
    
    const avgAmount = expenses.length > 0 ? (totalAmount / expenses.length).toFixed(2) : 0;
    
    // Key Overview Summary Table
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
    
    // Detailed Expense Transactions Table
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
    
    // Footer page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`SpendFlow App - Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    }
    
    doc.save(`SpendFlow_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2.5 rounded-xl">
            <PieChartIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Reports</h1>
            <p className="text-slate-500">Analyze your spending patterns and financial health.</p>
          </div>
        </div>

        <Button 
          onClick={handleDownloadPDF} 
          disabled={loading || expenses.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 px-5 py-2.5"
        >
          <Download className="w-4 h-4" />
          Download PDF Report
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading your reports...</div>
      ) : expenses.length === 0 ? (
        <div className="py-12 text-center text-slate-500">No expenses found to generate reports.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <div>
                <CardTitle className="text-lg">Monthly Trends</CardTitle>
                <CardDescription>Your spending over time</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b' }} 
                    width={80}
                    dx={-10} 
                    tickFormatter={(value) => `₹${Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="total" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center gap-3">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <div>
                <CardTitle className="text-lg">Category Breakdown</CardTitle>
                <CardDescription>Where your money goes</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => `₹${value}`} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
