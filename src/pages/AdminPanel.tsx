import { useState } from 'react';
import { Settings, Plus, Eye, EyeOff, Type, Hash, Calendar, List, DollarSign, Mail, Phone, Save } from 'lucide-react';

const fieldTypes = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'dropdown', label: 'Dropdown', icon: List },
  { value: 'currency', label: 'Currency', icon: DollarSign },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'mobile', label: 'Mobile', icon: Phone },
];

const defaultColumns = [
  { key: 'employeeCode', label: 'Employee Code', type: 'text', visible: true, mandatory: true },
  { key: 'name', label: 'Full Name', type: 'text', visible: true, mandatory: true },
  { key: 'dob', label: 'Date of Birth', type: 'date', visible: true, mandatory: false },
  { key: 'doj', label: 'Date of Joining', type: 'date', visible: true, mandatory: true },
  { key: 'mobile', label: 'Mobile Number', type: 'mobile', visible: true, mandatory: false },
  { key: 'email', label: 'Email Address', type: 'email', visible: true, mandatory: false },
  { key: 'grossSalary', label: 'Gross Salary', type: 'currency', visible: true, mandatory: true },
  { key: 'pan', label: 'PAN Number', type: 'text', visible: false, mandatory: false },
];

export default function AdminPanel() {
  const [columns, setColumns] = useState(defaultColumns);
  const [newColName, setNewColName] = useState('');
  const [newColType, setNewColType] = useState('text');

  const toggleVisibility = (key: string) => {
    setColumns(cols => cols.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  };

  const toggleMandatory = (key: string) => {
    setColumns(cols => cols.map(c => c.key === key ? { ...c, mandatory: !c.mandatory } : c));
  };

  const addColumn = () => {
    if (!newColName) return;
    const newCol = {
      key: newColName.toLowerCase().replace(/\s+/g, '_'),
      label: newColName,
      type: newColType,
      visible: true,
      mandatory: false,
    };
    setColumns([...columns, newCol]);
    setNewColName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground">Manage columns, field types, and system configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column Management */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Dynamic Column Manager
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Column Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Field Type</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Visible</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Mandatory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {columns.map((col) => {
                  const TypeIcon = fieldTypes.find(f => f.value === col.type)?.icon || Type;
                  return (
                    <tr key={col.key} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-foreground">{col.label}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TypeIcon className="w-4 h-4" />
                          <span className="capitalize">{col.type}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => toggleVisibility(col.key)}
                          className={`p-1.5 rounded-lg transition-colors ${col.visible ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}
                        >
                          {col.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => toggleMandatory(col.key)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            col.mandatory ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {col.mandatory ? 'Yes' : 'No'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Column & Settings */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Custom Field
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Field Name</label>
                <input
                  type="text"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="e.g., Blood Group"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Field Type</label>
                <select
                  value={newColType}
                  onChange={(e) => setNewColType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {fieldTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={addColumn}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Google Sheets Mapping</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">Sheet ID</span>
                <span className="font-mono text-xs text-foreground">1A2B3C...XYZ</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">Tab Name</span>
                <span className="font-medium text-foreground">Employee_Master</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="font-medium text-green-500">2 mins ago</span>
              </div>
              <button className="w-full mt-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
                Reconnect Google Sheets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}