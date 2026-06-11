import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  ArrowLeftRight, 
  TrendingUp, 
  FileText, 
  Settings,
  Building2
} from 'lucide-react';

const navItems = [
  { name: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Employee Directory', path: '/directory', icon: Users },
  { name: 'Workforce Planning', path: '/workforce', icon: Briefcase },
  { name: 'Transfer Management', path: '/transfers', icon: ArrowLeftRight },
  { name: 'PLI Management', path: '/pli', icon: TrendingUp },
  { name: 'Reports Center', path: '/reports', icon: FileText },
  { name: 'Admin Panel', path: '/admin', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 glass border-r border-border flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="font-bold text-lg text-foreground">Media HRMS</h1>
            <p className="text-xs text-muted-foreground">Enterprise Analytics</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="glass-card p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-foreground">Google Sheets Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
}