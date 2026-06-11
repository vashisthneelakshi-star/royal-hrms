import { useMemo } from 'react';
import { mockTransfers } from '../utils/mockData';
import { ArrowRight, Briefcase, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TransferManagement() {
  const transferAnalytics = useMemo(() => {
    const branchCounts: Record<string, number> = {};
    mockTransfers.forEach(t => {
      branchCounts[t.newBranch] = (branchCounts[t.newBranch] || 0) + 1;
    });
    return Object.entries(branchCounts).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transfer Management</h1>
        <p className="text-muted-foreground">Track employee movement, history, and branch analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Timeline */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Recent Transfer History</h3>
          <div className="space-y-6">
            {mockTransfers.map((transfer) => (
              <div key={transfer.id} className="relative pl-8 border-l-2 border-primary/30 pb-6 last:pb-0 last:border-l-transparent">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                <div className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{transfer.transferDate}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      {transfer.reason}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{transfer.employeeName} ({transfer.employeeCode})</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                    <div className="flex-1 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                      <p className="text-xs text-red-500 font-semibold mb-1">FROM</p>
                      <p className="text-foreground font-medium">{transfer.oldBranch}</p>
                      <p className="text-muted-foreground">{transfer.oldLocation} • {transfer.oldProfile}</p>
                    </div>
                    <ArrowRight className="hidden md:block w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                      <p className="text-xs text-green-500 font-semibold mb-1">TO</p>
                      <p className="text-foreground font-medium">{transfer.newBranch}</p>
                      <p className="text-muted-foreground">{transfer.newLocation} • {transfer.newProfile}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Analytics */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Branch-wise Transfers</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={transferAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">Total Transfers (YTD)</span>
              <span className="text-lg font-bold text-foreground">{mockTransfers.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">Inter-State Transfers</span>
              <span className="text-lg font-bold text-foreground">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}