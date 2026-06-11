import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, FileText, Award } from 'lucide-react';

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees } = useAppStore();
  
  const employee = employees.find(e => e.id === id);

  if (!employee) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Employee not found.</p>
        <button onClick={() => navigate('/directory')} className="mt-4 text-primary hover:underline">Back to Directory</button>
      </div>
    );
  }

  const infoCards = [
    { icon: Mail, label: 'Email', value: employee.email || 'N/A' },
    { icon: Phone, label: 'Mobile', value: employee.mobile || 'N/A' },
    { icon: MapPin, label: 'Location', value: `${employee.branch}, ${employee.state}` },
    { icon: Calendar, label: 'Date of Birth', value: employee.dob || 'N/A' },
  ];

  const employmentCards = [
    { icon: Briefcase, label: 'Profile', value: employee.profile },
    { icon: FileText, label: 'Department', value: employee.department },
    { icon: Calendar, label: 'Date of Joining', value: employee.doj },
    { icon: Award, label: 'Employee Type', value: employee.employeeType },
  ];

  const salaryCards = [
    { icon: DollarSign, label: 'Gross Salary', value: `₹${employee.grossSalary.toLocaleString()}` },
    { icon: DollarSign, label: 'Total CTC', value: `₹${employee.totalCTC.toLocaleString()}` },
    { icon: DollarSign, label: 'PLI (Last)', value: employee.pli ? `₹${employee.pli.toLocaleString()}` : 'N/A' },
    { icon: DollarSign, label: 'Voucher', value: employee.voucher ? `₹${employee.voucher.toLocaleString()}` : 'N/A' },
  ];

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/directory')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </button>

      {/* Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
          {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{employee.name}</h1>
          <p className="text-muted-foreground">{employee.profile} • {employee.employeeCode}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              employee.status === 'Active' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
              employee.status === 'Probation' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
              'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}>
              {employee.status}
            </span>
            {employee.zimbeaId && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Zimbea: {employee.zimbeaId}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Section title="Contact Information" icon={Mail}>
          <div className="grid grid-cols-1 gap-4">
            {infoCards.map((card, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <card.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-sm font-medium text-foreground">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Employment Details" icon={Briefcase}>
          <div className="grid grid-cols-1 gap-4">
            {employmentCards.map((card, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <card.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-sm font-medium text-foreground">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Salary Information" icon={DollarSign}>
          <div className="grid grid-cols-1 gap-4">
            {salaryCards.map((card, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <card.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-sm font-medium text-foreground">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Placeholder for History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Transfer History" icon={MapPin}>
          <p className="text-sm text-muted-foreground text-center py-8">No transfer records found for this employee.</p>
        </Section>
        <Section title="PLI History" icon={Award}>
          <p className="text-sm text-muted-foreground text-center py-8">No PLI records found for this employee.</p>
        </Section>
      </div>
    </div>
  );
}