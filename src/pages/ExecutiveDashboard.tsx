import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Users, TrendingUp, TrendingDown, AlertCircle, DollarSign, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function ExecutiveDashboard() {
  const { employees, aiInsights } = useAppStore();

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Active').length;
    const left = employees.filter(e => e.status === 'Left').length;
    const probation = employees.filter(e => e.status === 'Probation').length;
    const totalCTC = employees.reduce((sum, e) => sum + e.totalCTC, 0);
    const avgCTC = total > 0 ? totalCTC / total : 0;

    return [
      { label: 'Total Employees', value: total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { label: 'Active Staff', value: active, icon: Briefcase, color: 'text-green-500', bg: 'bg-green-500/10' },
      { label: 'Total Salary Cost', value: `₹${(totalCTC / 100000).toFixed(1)}L`, icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-500/10' },
      { label: 'Avg Cost/Employee', value: `₹${(avgCTC / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { label: 'Probation', value: probation, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
      { label: 'Ex-Employees', value: left, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10' },
    ];
  }, [employees]);

  const stateData = useMemo(() => {
    const stateCounts: Record<string, number> = {};
    employees.filter(e => e.status === 'Active').forEach(e => {
      stateCounts[e.state] = (stateCounts[e.state] || 0) + 1;
    });
    return Object.entries(stateCounts).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const profileData = useMemo(() => {
    const profileCounts: Record<string, number> = {};
    employees.filter(e => e.status === 'Active').forEach(e => {
      profileCounts[e.profile] = (profileCounts[e.profile] || 0) + 1;
    });
    return Object.entries(profileCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [employees]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-muted-foreground">Real-time workforce analytics and insights</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-4 hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* AI Insights Panel */}
      <div className="glass-card p-6 border-l-4 border-l-primary">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">AI Insights & Alerts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${
                  insight.severity === 'high' ? 'bg-red-500' : 
                  insight.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                }`} />
                <span className="text-xs font-semibold uppercase text-muted-foreground">{insight.category}</span>
              </div>
              <p className="text-sm text-foreground">{insight.insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">State-wise Active Employees</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Profile Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={profileData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {profileData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}