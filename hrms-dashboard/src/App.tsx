import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { mockEmployees, generateMockEmployees, mockAIInsights } from './utils/mockData';
import Layout from './components/layout/Layout';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import EmployeeDirectory from './pages/EmployeeDirectory';
import EmployeeProfile from './pages/EmployeeProfile';
import WorkforcePlanning from './pages/WorkforcePlanning';
import TransferManagement from './pages/TransferManagement';
import PLIManagement from './pages/PLIManagement';
import ReportsCenter from './pages/ReportsCenter';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { theme, setEmployees, setAiInsights } = useAppStore();

  useEffect(() => {
    // Initialize theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Load mock data (in production, this would fetch from Google Sheets API)
    const allEmployees = [...mockEmployees, ...generateMockEmployees(150)];
    setEmployees(allEmployees);
    setAiInsights(mockAIInsights);
  }, [theme, setEmployees, setAiInsights]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ExecutiveDashboard />} />
          <Route path="directory" element={<EmployeeDirectory />} />
          <Route path="directory/:id" element={<EmployeeProfile />} />
          <Route path="workforce" element={<WorkforcePlanning />} />
          <Route path="transfers" element={<TransferManagement />} />
          <Route path="pli" element={<PLIManagement />} />
          <Route path="reports" element={<ReportsCenter />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;