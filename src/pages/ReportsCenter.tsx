import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FileText, Download, Users, TrendingDown, Calendar, DollarSign, Briefcase } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const reportTypes = [
  { id: 'active', name: 'Active Employees', icon: Users, desc: 'List of all currently active staff members' },
  { id: 'left', name: 'Left Employees', icon: TrendingDown, desc: 'Attrition and exit details with LWD' },
  { id: 'retirement', name: 'Retirement Forecast', icon: Calendar, desc: 'Employees retiring in 1, 3, and 5 years' },
  { id: 'salary', name: 'Salary Analytics', icon: DollarSign, desc: 'Branch-wise and profile-wise cost breakdown' },
  { id: 'vacancy', name: 'Vacancy Report', icon: Briefcase, desc: 'Sanctioned vs available strength gap analysis' },
  { id: 'transfer', name: 'Transfer History', icon: FileText, desc: 'Complete employee movement log' },
];

export default function ReportsCenter() {
  const { employees } = useAppStore();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');

  const handleGenerate = () => {
    if (!selectedReport) return;

    let dataToExport: any[] = [];
    let fileName = `${selectedReport}_report`;

    if (selectedReport === 'active') {
      dataToExport = employees.filter(e => e.status === 'Active').map(e => ({
        'Employee Code': e.employeeCode, 'Name': e.name, 'Profile': e.profile, 'Branch': e.branch, 'State': e.state, 'CTC': e.totalCTC
      }));
    } else if (selectedReport === 'left') {
      dataToExport = employees.filter(e => e.status === 'Left').map(e => ({
        'Employee Code': e.employeeCode, 'Name': e.name, 'Profile': e.profile, 'Branch': e.branch, 'LWD': e.lwd || 'N/A', 'Exit Reason': 'N/A'
      }));
    } else {
      dataToExport = employees.slice(0, 20).map(e => ({ 'Employee Code': e.employeeCode, 'Name': e.name, 'Status': e.status })); // Fallback
    }

    if (exportFormat === 'excel' || exportFormat === 'csv') {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, `${fileName}.${exportFormat === 'excel' ? 'xlsx' : 'csv'}`);
    } else if (exportFormat === 'pdf') {
      const doc = new jsPDF();
      doc.text(`${selectedReport.toUpperCase()} REPORT`, 14, 15);
      const tableColumn = Object.keys(dataToExport[0] || {});
      const tableRows = dataToExport.map((row: any) => Object.values(row));
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });
      doc.save(`${fileName}.pdf`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports Center</h1>
        <p className="text-muted-foreground">Generate and export comprehensive HR reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`glass-card p-6 text-left transition-all duration-200 hover:scale-[1.02] ${
              selectedReport === report.id ? 'ring-2 ring-primary border-primary/50' : 'hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <report.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{report.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{report.desc}</p>
          </button>
        ))}
      </div>

      {selectedReport && (
        <div className="glass-card p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Generate: {reportTypes.find(r => r.id === selectedReport)?.name}
              </h3>
              <p className="text-sm text-muted-foreground">Select your preferred export format</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
              
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}