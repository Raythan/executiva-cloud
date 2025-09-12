// types.ts

export interface Organization {
  id: string; // UUID
  name: string;
}

export interface Department {
  id: string;
  name: string;
  organizationId: string;
}

export interface Executive {
  id: string; // UUID
  fullName: string;
  email?: string;
  phone?: string;
  organizationId?: string; // UUID
  departmentId?: string; // UUID
}

export interface Secretary {
  id: string; // UUID
  fullName: string;
  email?: string;
  executiveIds: string[]; // Array of executive IDs
}

export type UserRole = 'master' | 'admin' | 'secretary' | 'executive';

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  organizationId?: string; // for admin
  executiveId?: string;    // for executive
  secretaryId?: string;    // for secretary
}

export interface EventType {
  id:string; // UUID
  name: string;
  color: string; // color_hex
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'annually';
  interval: number;
  daysOfWeek?: number[]; // 0 for Sunday, 1 for Monday, etc.
  endDate?: string; // YYYY-MM-DD
  count?: number;
}

export interface Event {
  id: string; // UUID
  title: string;
  description?: string;
  startTime: string; // ISO String for TIMESTAMPTZ
  endTime: string;   // ISO String for TIMESTAMPTZ
  location?: string;
  eventTypeId?: string; // UUID
  executiveId: string; // UUID
  reminderMinutes?: number;
  recurrenceId?: string;
  recurrence?: RecurrenceRule;
}

// FIX: Add missing 'Appointment' type to resolve compilation error in components/AppointmentsView.tsx.
export interface Appointment {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
}

export interface ContactType {
    id: string; // UUID
    name: string;
}

export interface Contact {
  id: string; // UUID
  fullName: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  notes?: string;
  contactTypeId?: string; // UUID
  executiveId: string; // UUID
}

export type ExpenseStatus = 'Pendente' | 'Aprovada' | 'Reembolsada';

export interface Expense {
    id: string; // UUID
    description: string;
    amount: number;
    expenseDate: string; // YYYY-MM-DD
    category?: string;
    status: ExpenseStatus;
    receiptUrl?: string; // As per MVP, this is a simple text URL
    executiveId: string; // UUID
}

// Views correspond to navigation items in the sidebar
export type View = 'dashboard' | 'executives' | 'agenda' | 'contacts' | 'expenses' | 'organizations' | 'settings' | 'tasks' | 'secretaries' | 'reports';

export enum Priority {
  High = 'Alta',
  Medium = 'Média',
  Low = 'Baixa',
}

export enum Status {
  Todo = 'A Fazer',
  InProgress = 'Em Andamento',
  Done = 'Concluído',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  status: Status;
  executiveId: string; // UUID
  recurrenceId?: string;
  recurrence?: RecurrenceRule;
}

export interface AllDataBackup {
  version: string;
  organizations: Organization[];
  departments: Department[];
  executives: Executive[];
  secretaries: Secretary[];
  users: User[];
  eventTypes: EventType[];
  events: Event[];
  contactTypes: ContactType[];
  contacts: Contact[];
  expenses: Expense[];
  tasks: Task[];
}