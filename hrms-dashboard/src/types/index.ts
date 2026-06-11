// Core Employee Interface (Dynamic columns supported via Record<string, any>)
export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  fatherName?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  doj: string;
  dor?: string; // Date of Retirement
  lwd?: string; // Last Working Date
  status: 'Active' | 'Left' | 'Probation' | 'Contract' | 'Part-Time' | 'Stringer';
  state: string;
  branch: string;
  edition: string;
  location: string;
  department: string;
  profile: string;
  subProfile?: string;
  employeeType: 'Fixed' | 'Contract' | 'Stringer' | 'Part-Time';
  education?: string;
  email?: string;
  mobile?: string;
  pan?: string;
  zimbeaId?: string;
  grossSalary: number;
  voucher?: number;
  pli?: number;
  partB?: number;
  totalCTC: number;
  // Dynamic custom fields
  [key: string]: any;
}

export interface TransferRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  transferDate: string;
  oldState: string;
  oldBranch: string;
  oldLocation: string;
  oldProfile: string;
  newState: string;
  newBranch: string;
  newLocation: string;
  newProfile: string;
  reason: string;
}

export interface PLIRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  month: string;
  year: number;
  target: number;
  achievement: number;
  pliPercentage: number;
  pliAmount: number;
}

export interface VacancyRecord {
  id: string;
  state: string;
  branch: string;
  department: string;
  profile: string;
  sanctionedStrength: number;
  availableStrength: number;
  vacancy: number;
  vacancyPercentage: number;
}

export interface Notification {
  id: string;
  type: 'retirement' | 'birthday' | 'anniversary' | 'vacancy' | 'missing_data' | 'transfer';
  message: string;
  date: string;
  isRead: boolean;
}

export interface AIInsight {
  id: string;
  category: 'attrition' | 'vacancy' | 'cost' | 'retirement' | 'general';
  insight: string;
  severity: 'low' | 'medium' | 'high';
}

export type UserRole = 'Super Admin' | 'HR Admin' | 'Regional HR' | 'Branch HR' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedBranch?: string;
  assignedState?: string;
}