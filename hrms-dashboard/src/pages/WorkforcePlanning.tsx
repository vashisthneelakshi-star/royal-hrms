import { useMemo } from 'react';
import { mockVacancies } from '../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WorkforcePlanning() {
  const vacancyData = useMemo(() => {
    return mockVacancies.map(v => ({
      name: `${v.branch} - ${v.profile}`,
      sanctioned: v.sanctionedStrength,
      available: v.availableStrength,
      vacancy: v.vacancy,
    }));
  }, []);

  const totalSanctioned = mockVacancies.reduce((sum, v) => sum + v.sanctionedStrength, 0);
  const totalAvailable = mockVacancies.reduce((sum, v) => sum + v.availableStrength, 0);
  const totalVacancy = totalSanctioned - totalAvailable;
  const vacancyPercentage = ((totalVacancy / totalSanctioned) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Workforce Planning</h1>
        <p className="text-muted-foreground">Sanctioned vs Available strength analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Total Sanctioned</p>
          <p className="text-3xl font-bold text-foreground">{totalSanctioned}</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Currently Available</p>
          <p className="text-3xl font-bold text-green-500">{totalAvailable}</p>
        </div>
        <div className="glass-card p-6 text-center border-l-4 border-l-red-500">
          <p className="text-sm text-muted-foreground mb-1">Total Vacancy</p>
          <p className="text-3xl font-bold text-red-500">{totalVacancy} <span className="text-sm text-muted-foreground">({vacancyPercentage}%)</span></p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Vacancy Gap Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={vacancyData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="name" type="category" width={150} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
            />
            <Bar dataKey="available" stackId="a" fill="hsl(var(--primary))" name="Available" radius={[0, 4, 4, 0]} />
            <Bar dataKey="vacancy" stackId="a" fill="hsl(var(--destructive))" name="Vacancy" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">State</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Branch</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Profile</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Sanctioned</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Available</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Vacancy</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Gap %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockVacancies.map((v) => (
              <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 text-foreground">{v.state}</td>
                <td className="p-4 text-foreground">{v.branch}</td>
                <td className="p-4 text-muted-foreground">{v.profile}</td>
                <td className="p-4 text-right font-medium">{v.sanctionedStrength}</td>
                <td className="p-4 text-right text-green-600 dark:text-green-400">{v.availableStrength}</td>
                <td className="p-4 text-right text-red-500 font-medium">{v.vacancy}</td>
                <td className="p-4 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    v.vacancyPercentage > 30 ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {v.vacancyPercentage.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}