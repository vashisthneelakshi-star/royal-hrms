import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function EmployeeDirectory() {
  const navigate = useNavigate();
  const { employees, columns } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.mobile?.includes(searchQuery) ||
        emp.pan?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    const exportData = filteredEmployees.map(emp => {
      const row: any = {};
      visibleColumns.forEach(col => {
        row[col.label] = emp[col.key] !== undefined ? emp[col.key] : 'N/A';
      });
      return row;
    });
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'employee_directory.xlsx');
  };

  const formatValue = (value: any, type: string) => {
    if (value === undefined || value === null) return '-';
    if (type === 'currency') return `₹${Number(value).toLocaleString()}`;
    return String(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employee Directory</h1>
          <p className="text-muted-foreground">Search and manage employee records</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, code, mobile, or PAN..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Probation">Probation</option>
            <option value="Contract">Contract</option>
            <option value="Stringer">Stringer</option>
            <option value="Left">Left</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {visibleColumns.map(col => (
                  <th key={col.key} className="text-left p-4 font-medium text-muted-foreground whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedEmployees.map((emp) => (
                <tr 
                  key={emp.id} 
                  className="hover:bg-muted/30 transition-colors cursor-pointer" 
                  onClick={() => navigate(`/directory/${emp.id}`)}
                >
                  {visibleColumns.map(col => (
                    <td key={col.key} className="p-4 whitespace-nowrap">
                      {col.key === 'name' ? (
                        <span className="font-medium text-primary hover:underline">{emp[col.key]}</span>
                      ) : col.key === 'status' ? (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          emp[col.key] === 'Active' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                          emp[col.key] === 'Probation' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          emp[col.key] === 'Left' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                          'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          {emp[col.key]}
                        </span>
                      ) : (
                        <span className="text-foreground">{formatValue(emp[col.key], col.type)}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}