import React, { useState, useMemo, useEffect } from 'react';
import { Executive, Organization, Event, EventType, Contact, ContactType, Expense, View, ExpenseStatus, Task, Priority, Status, Department, Secretary, User, UserRole } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExecutivesView from './components/ExecutivesView';
import OrganizationsView from './components/OrganizationsView';
import AgendaView from './components/AgendaView';
import ContactsView from './components/ContactsView';
import ExpensesView from './components/ExpensesView';
import SettingsView from './components/SettingsView';
import TasksView from './components/TasksView';
import SecretariesView from './components/SecretariesView';
import LoginView from './components/LoginView';
import ReportsView from './components/ReportsView';
import UserMenu from './components/UserMenu';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- DUMMY DATA INITIALIZATION ---
  const initialOrganizations: Organization[] = useMemo(() => [
    { id: 'org1', name: 'Tech Solutions Inc.' },
    { id: 'org2', name: 'Inova Corp Global' },
  ], []);

  const initialDepartments: Department[] = useMemo(() => [
    { id: 'dept1', name: 'Engenharia', organizationId: 'org1' },
    { id: 'dept2', name: 'Vendas', organizationId: 'org1' },
    { id: 'dept3', name: 'Marketing', organizationId: 'org2' },
  ], []);

  const initialExecutives: Executive[] = useMemo(() => [
    { id: 'exec1', fullName: 'Carlos Silva', email: 'carlos.silva@techsolutions.com', organizationId: 'org1', phone: '(11) 98888-1111', departmentId: 'dept1' },
    { id: 'exec2', fullName: 'Beatriz Costa', email: 'bia.costa@inovacorp.com', organizationId: 'org2', phone: '(21) 97777-2222', departmentId: 'dept3' },
    { id: 'exec3', fullName: 'Roberto Almeida', email: 'roberto.a@techsolutions.com', organizationId: 'org1', phone: '(11) 96666-3333', departmentId: 'dept2' },
  ], []);
  
  const initialSecretaries: Secretary[] = useMemo(() => [
    { id: 'sec1', fullName: 'Sofia Ribeiro', email: 'sofia.r@techsolutions.com', executiveIds: ['exec1', 'exec3'] },
    { id: 'sec2', fullName: 'Laura Mendes', email: 'laura.m@inovacorp.com', executiveIds: ['exec2'] },
  ], []);
  
  const initialUsers: User[] = useMemo(() => [
    // Static master user
    { id: 'user_master', fullName: 'Master User', role: 'master' },
    // Dynamic users from initial data
    ...initialOrganizations.map(org => ({
      id: `user_admin_${org.id}`,
      fullName: `Admin ${org.name}`,
      role: 'admin' as UserRole,
      organizationId: org.id,
    })),
    ...initialExecutives.map(e => ({
      id: `user_exec_${e.id}`,
      fullName: e.fullName,
      role: 'executive' as UserRole,
      executiveId: e.id,
    })),
    ...initialSecretaries.map(s => ({
      id: `user_sec_${s.id}`,
      fullName: s.fullName,
      role: 'secretary' as UserRole,
      secretaryId: s.id,
    })),
  ], [initialOrganizations, initialExecutives, initialSecretaries]);

  const initialEventTypes: EventType[] = useMemo(() => [
      { id: 'et1', name: 'Reunião Diretoria', color: '#ef4444' }, // red-500
      { id: 'et2', name: 'Pessoal', color: '#22c55e' }, // green-500
      { id: 'et3', name: 'Viagem', color: '#3b82f6' }, // blue-500
  ], []);

  const initialEvents: Event[] = useMemo(() => {
    const today = new Date();
    return [
      { id: 'ev1', executiveId: 'exec1', title: 'Reunião de Vendas Q3', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0).toISOString(), location: 'Sala de Conferência 1', eventTypeId: 'et1' },
      { id: 'ev2', executiveId: 'exec2', title: 'Almoço com Fornecedor', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30).toISOString(), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30).toISOString(), location: 'Restaurante Central', eventTypeId: 'et1', reminderMinutes: 15 },
      { id: 'ev3', executiveId: 'exec1', title: 'Consulta Médica', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0).toISOString(), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0).toISOString(), location: 'Clínica Bem-Estar', eventTypeId: 'et2' },
    ]
  }, []);

  const initialContactTypes: ContactType[] = useMemo(() => [
      { id: 'ct1', name: 'Cliente' },
      { id: 'ct2', name: 'Fornecedor' },
      { id: 'ct3', name: 'Networking' },
  ], []);

  const initialContacts: Contact[] = useMemo(() => [
    { id: 'c1', executiveId: 'exec1', fullName: 'Ana Pereira', company: 'Global Tech', email: 'ana.p@globaltech.com', phone: '(11) 95555-1234', contactTypeId: 'ct1', role: 'Gerente de Contas' },
    { id: 'c2', executiveId: 'exec2', fullName: 'Julio Marques', company: 'Fast Logistics', email: 'julio@fastlog.com', phone: '(21) 94444-5678', contactTypeId: 'ct2', role: 'Diretor de Operações' },
  ], []);

  const initialExpenses: Expense[] = useMemo(() => {
     const today = new Date();
     return [
      { id: 'ex1', executiveId: 'exec1', description: 'Almoço com cliente', amount: 150.75, expenseDate: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0], category: 'Alimentação', status: 'Aprovada' as ExpenseStatus, receiptUrl: 'http://example.com/recibo1.jpg' },
      { id: 'ex2', executiveId: 'exec1', description: 'Transporte para reunião', amount: 45.50, expenseDate: new Date().toISOString().split('T')[0], category: 'Transporte', status: 'Pendente' as ExpenseStatus },
      { id: 'ex3', executiveId: 'exec2', description: 'Assinatura Software', amount: 89.90, expenseDate: new Date(today.setDate(today.getDate() - 5)).toISOString().split('T')[0], category: 'Software', status: 'Reembolsada' as ExpenseStatus },
     ]
  }, []);

  const initialTasks: Task[] = useMemo(() => {
    const today = new Date();
    return [
        { id: 't1', executiveId: 'exec1', title: 'Preparar apresentação Q4', dueDate: new Date(new Date(today).setDate(today.getDate() + 3)).toISOString().split('T')[0], priority: Priority.High, status: Status.InProgress },
        { id: 't2', executiveId: 'exec1', title: 'Revisar contrato com Fast Logistics', dueDate: new Date(new Date(today).setDate(today.getDate() + 5)).toISOString().split('T')[0], priority: Priority.Medium, status: Status.Todo },
        { id: 't3', executiveId: 'exec2', title: 'Agendar reunião com time de marketing', dueDate: new Date(new Date(today).setDate(today.getDate() + 1)).toISOString().split('T')[0], priority: Priority.High, status: Status.Todo },
        { id: 't4', executiveId: 'exec1', title: 'Enviar relatório semanal', dueDate: new Date(new Date(today).setDate(today.getDate() - 1)).toISOString().split('T')[0], priority: Priority.Medium, status: Status.Done },
    ]
  }, []);


  // --- LOCAL STORAGE STATE MANAGEMENT ---
  const [organizations, setOrganizations] = useLocalStorage<Organization[]>('organizations', initialOrganizations);
  const [departments, setDepartments] = useLocalStorage<Department[]>('departments', initialDepartments);
  const [executives, setExecutives] = useLocalStorage<Executive[]>('executives', initialExecutives);
  const [secretaries, setSecretaries] = useLocalStorage<Secretary[]>('secretaries', initialSecretaries);
  const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
  const [eventTypes, setEventTypes] = useLocalStorage<EventType[]>('eventTypes', initialEventTypes);
  const [events, setEvents] = useLocalStorage<Event[]>('events', initialEvents);
  const [contactTypes, setContactTypes] = useLocalStorage<ContactType[]>('contactTypes', initialContactTypes);
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', initialContacts);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', initialExpenses);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', initialTasks);
  const [notifiedEventIds, setNotifiedEventIds] = useState<Set<string>>(new Set());

  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [selectedExecutiveId, setSelectedExecutiveId] = useLocalStorage<string | null>('selectedExecutiveId', null);

  // --- USER PERMISSIONS & DATA FILTERING ---
  const visibleExecutives = useMemo(() => {
    if (!currentUser) return [];
    switch (currentUser.role) {
      case 'master':
        return executives;
      case 'admin':
        return executives.filter(e => e.organizationId === currentUser.organizationId);
      case 'secretary':
        const secretary = secretaries.find(s => s.id === currentUser.secretaryId);
        if (!secretary) return [];
        return executives.filter(e => secretary.executiveIds.includes(e.id));
      case 'executive':
        return executives.filter(e => e.id === currentUser.executiveId);
      default:
        return [];
    }
  }, [currentUser, executives, secretaries]);
  
  // Effect to manage selected executive based on current user
  useEffect(() => {
    if (currentUser?.role === 'executive') {
      setSelectedExecutiveId(currentUser.executiveId || null);
    } else if (currentUser) {
      // If the current selection is no longer valid, reset it
      const isSelectionValid = visibleExecutives.some(e => e.id === selectedExecutiveId);
      if (!isSelectionValid) {
        setSelectedExecutiveId(visibleExecutives.length > 0 ? visibleExecutives[0].id : null);
      }
    }
  }, [currentUser, visibleExecutives, selectedExecutiveId, setSelectedExecutiveId]);


  // --- REMINDER NOTIFICATIONS LOGIC ---
  useEffect(() => {
    if ("Notification" in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
      const checkReminders = () => {
          if (!("Notification" in window) || Notification.permission !== 'granted') {
              return;
          }

          const now = new Date();
          events.forEach(event => {
              if (event.reminderMinutes && !notifiedEventIds.has(event.id)) {
                  const eventStartTime = new Date(event.startTime);
                  const reminderTime = new Date(eventStartTime.getTime() - event.reminderMinutes * 60 * 1000);

                  if (now >= reminderTime && now < eventStartTime) {
                      const executive = executives.find(e => e.id === event.executiveId);
                      const title = `Lembrete: ${event.title}`;
                      const options = {
                          body: `O evento de ${executive?.fullName || 'um executivo'} começa às ${eventStartTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`,
                          icon: '/vite.svg',
                      };

                      new Notification(title, options);
                      setNotifiedEventIds(prev => new Set(prev).add(event.id));
                  }
              }
          });
      };

      const intervalId = setInterval(checkReminders, 60000); // Check every minute
      checkReminders(); // Initial check

      return () => clearInterval(intervalId);
  }, [events, executives, notifiedEventIds]);


  // --- DERIVED/FILTERED DATA ---
  const selectedExecutive = useMemo(() => executives.find(e => e.id === selectedExecutiveId), [executives, selectedExecutiveId]);

  const filteredEvents = useMemo(() => events.filter(e => e.executiveId === selectedExecutiveId), [events, selectedExecutiveId]);
  const filteredContacts = useMemo(() => contacts.filter(c => c.executiveId === selectedExecutiveId), [contacts, selectedExecutiveId]);
  const filteredExpenses = useMemo(() => expenses.filter(ex => ex.executiveId === selectedExecutiveId), [expenses, selectedExecutiveId]);
  const filteredTasks = useMemo(() => tasks.filter(t => t.executiveId === selectedExecutiveId), [tasks, selectedExecutiveId]);

  const viewTitles: Record<View, string> = {
    dashboard: 'Painel',
    organizations: 'Organizações',
    executives: 'Executivos',
    secretaries: 'Secretárias',
    agenda: 'Agenda',
    contacts: 'Contatos',
    expenses: 'Despesas',
    tasks: 'Tarefas',
    reports: 'Relatórios',
    settings: 'Configurações',
  };


  const renderView = () => {
    if (!currentUser) return null;
    // Check if an executive is selected for views that require it
    if (['agenda', 'contacts', 'expenses', 'tasks'].includes(currentView) && !selectedExecutiveId && currentUser.role !== 'executive') {
      return (
          <div className="text-center p-10 bg-white rounded-lg shadow-md max-w-lg mx-auto">
             <h3 className="text-xl font-semibold text-slate-800">Selecione um Executivo</h3>
             <p className="text-slate-500 mt-2">Por favor, selecione um executivo no menu superior para visualizar os dados correspondentes.</p>
          </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard executives={visibleExecutives} events={events} expenses={expenses} selectedExecutive={selectedExecutive} />;
      case 'executives':
        return <ExecutivesView 
                  executives={visibleExecutives} 
                  setExecutives={setExecutives} 
                  organizations={organizations} 
                  departments={departments}
                  secretaries={secretaries}
                  setSecretaries={setSecretaries}
                  setEvents={setEvents}
                  setContacts={setContacts}
                  setExpenses={setExpenses}
                  setTasks={setTasks}
                  setUsers={setUsers}
                />;
      case 'organizations':
        return <OrganizationsView 
                  organizations={organizations} setOrganizations={setOrganizations} 
                  departments={departments} setDepartments={setDepartments} 
                  executives={executives} setExecutives={setExecutives} 
                  secretaries={secretaries} setSecretaries={setSecretaries}
                  setEvents={setEvents}
                  setContacts={setContacts}
                  setExpenses={setExpenses}
                  setTasks={setTasks}
                  setUsers={setUsers} 
                />;
      case 'secretaries':
        return <SecretariesView secretaries={secretaries} setSecretaries={setSecretaries} executives={executives} setUsers={setUsers} />;
      case 'agenda':
        return <AgendaView events={filteredEvents} setEvents={setEvents} eventTypes={eventTypes} executiveId={selectedExecutiveId!} />;
      case 'contacts':
        return <ContactsView contacts={filteredContacts} setContacts={setContacts} contactTypes={contactTypes} executiveId={selectedExecutiveId!} />;
      case 'expenses':
        return <ExpensesView expenses={filteredExpenses} setExpenses={setExpenses} executiveId={selectedExecutiveId!} />;
      case 'tasks':
        return <TasksView tasks={filteredTasks} setTasks={setTasks} executiveId={selectedExecutiveId!} />;
      case 'reports':
        return <ReportsView executives={executives} events={events} expenses={expenses} tasks={tasks} contacts={contacts} />;
      case 'settings':
        return <SettingsView eventTypes={eventTypes} setEventTypes={setEventTypes} contactTypes={contactTypes} setContactTypes={setContactTypes} />;
      default:
        return <Dashboard executives={visibleExecutives} events={events} expenses={expenses} selectedExecutive={selectedExecutive} />;
    }
  };

  const BurgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  );

  if (!currentUser) {
    return <LoginView users={users} onLogin={setCurrentUser} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar currentUser={currentUser} currentView={currentView} setCurrentView={setCurrentView} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/60 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10 gap-4">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-600 hover:text-slate-900" aria-label="Abrir menu">
               <BurgerIcon />
             </button>
             <h1 className="text-xl font-bold text-slate-700 capitalize hidden sm:block">
               {viewTitles[currentView]}
             </h1>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="w-full sm:max-w-xs md:max-w-sm">
                <select
                  aria-label="Selecionar Executivo"
                  value={selectedExecutiveId || ''}
                  onChange={e => setSelectedExecutiveId(e.target.value || null)}
                  disabled={currentUser?.role === 'executive'}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Selecione um Executivo --</option>
                  {visibleExecutives.map(exec => {
                     const org = organizations.find(o => o.id === exec.organizationId);
                     const dept = departments.find(d => d.id === exec.departmentId);
                     const orgDeptString = org ? `${org.name}${dept ? ` / ${dept.name}` : ''}` : '';
                     return (
                       <option key={exec.id} value={exec.id}>
                         {exec.fullName} {orgDeptString && `(${orgDeptString})`}
                       </option>
                     )
                  })}
                </select>
             </div>

             <UserMenu user={currentUser} onLogout={() => setCurrentUser(null)} />
           </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;