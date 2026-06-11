import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Settings, Plus, Eye, EyeOff, Type, Hash, Calendar, List, DollarSign, Mail, Phone, Save, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

const fieldTypes = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'dropdown', label: 'Dropdown', icon: List },
  { value: 'currency', label: 'Currency', icon: DollarSign },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'mobile', label: 'Mobile', icon: Phone },
];

export default function AdminPanel() {
  const { columns, moveColumn, removeColumn, addColumn, toggleColumnVisibility } = useAppStore();
  const [newColName, setNewColName] = useState('');
  const [newColType, setNewColType] = useState('text');

  const handleAdd = () => {
    if (!newColName.trim()) return;
    const newCol = {
      key: newColName.toLowerCase().replace(/\s+/g, '_'),
      label: newColName,
      type: newColType,
      visible: true,
      mandatory: false,
    };
    addColumn(newCol);
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
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Changes save automatically</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Column Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Visible</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {columns.map((col, index) => {
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
                          onClick={() => toggleColumnVisibility(col.key)}
                          className={`p-1.5 rounded-lg transition-colors ${col.visible ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}
                        >
                          {col.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => moveColumn(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 text-muted-foreground"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => moveColumn(index, 'down')}
                            disabled={index === columns.length - 1}
                            className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 text-muted-foreground"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeColumn(col.key)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                            title="Delete Column"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Column */}
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
                onClick={handleAdd}
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
              <div className="p-3 rounded-lg bg-muted/30 text-muted-foreground text-center">
                Connect your Google Sheet via SheetDB.io to make this fully functional. <br/>
                <span className="text-xs opacity-70">(Feature coming in next update)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}