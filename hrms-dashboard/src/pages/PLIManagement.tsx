import { useMemo } from 'react';
import { mockPLIRecords } from '../utils/mockData';
import { TrendingUp, Award, AlertTriangle, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function PLIManagement() {
  const pliStats = useMemo(() => {
    const totalPLI = mockPLIRecords.reduce((sum, r) => sum + r.pliAmount, 0);
    const avgAchievement = mockPLIRecords.reduce((sum, r) => sum + r.achievement, 0) / mockPLIRecords.length;
    const topPerformer = [...mockPLIRecords].sort((a, b) => b.achievement - a.achievement)[0];
    
    return [
      { label: 'Total PLI Payout', value: `₹${(totalPLI / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
      { label: 'Avg Achievement', value: `${avgAchievement.toFixed(0)}%`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { label: 'Top Performer', value: topPerformer?.employeeName || 'N/A', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', sub: `${topPerformer?.achievement}% Target` },
      { label: 'Below Target', value: mockPLIRecords.filter(r => r.achievement < 100).length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    ];
  }, []);

  const pliDistribution = useMemo(() => {
    return mockPLIRecords.map(r => ({
      name: r.employeeName.split(' ')[0],
      value: r.pliAmount,
      achievement: r.achievement,
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">PLI Management</h1>
        <p className="text-muted-foreground">Performance Linked Incentive tracking and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pliStats.map((stat, idx) => (
          <div key={idx} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-xl font-bold text-foreground truncate">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            {stat.sub && <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">PLI Amount Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pliDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {pliDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'PLI Amount']}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Target vs Achievement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pliDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
              />
              <Bar dataKey="achievement" fill="hsl(var(--primary))" name="Achievement %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Monthly PLI Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Month/Year</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Target</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Achievement</th>
                <th className="text-right p-4 font-medium text-muted-foreground">PLI %</th>
                <th className="text-right p-4 font-medium text-muted-foreground">PLI Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockPLIRecords.map((record) => (
                <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-foreground">{record.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{record.employeeCode}</p>
                  </td>
                  <td className="p-4 text-muted-foreground">{record.month} {record.year}</td>
                  <td className="p-4 text-right text-muted-foreground">{record.target}%</td>
                  <td className="p-4 text-right">
                    <span className={`font-medium ${record.achievement >= 100 ? 'text-green-500' : 'text-amber-500'}`}>
                      {record.achievement}%
                    </span>
                  </td>
                  <td className="p-4 text-right text-muted-foreground">{record.pliPercentage}%</td>
                  <td className="p-4 text-right font-bold text-foreground">₹{record.pliAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}