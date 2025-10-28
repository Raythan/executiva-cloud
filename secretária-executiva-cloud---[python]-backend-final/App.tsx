import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExecutivesView from './components/ExecutivesView';
import OrganizationsView from './components/OrganizationsView';
import SecretariesView from './components/SecretariesView';
import AgendaView from './components/AgendaView';
import DocumentsView from './components/DocumentsView';
import ContactsView from './components/ContactsView';
import ExpensesView from './components/ExpensesView';
import TasksView from './components/TasksView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';
import UserMenu from './components/UserMenu';
import { useAuth } from './context/AuthContext';
import { View, AllDataBackup } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MenuIcon } from './components/Icons';
import { mockAllData } from './mock/data';

const App: React.FC = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [currentView, setCurrentView] = useLocalStorage<View>('currentView', 'dashboard');
  const [selectedExecutiveId, setSelectedExecutiveId] = useLocalStorage<string | undefined>('selectedExecutiveId', undefined);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [allData, setAllData] = useLocalStorage<AllDataBackup>('appDataCache', mockAllData);

  const visibleExecutives = useMemo(() => {
    if (!user || !allData?.executives) return [];
    
    if (user.role === 'master' || user.role === 'admin') {
      return allData.executives;
    }
    
    if (user.role === 'secretary' && user.executiveIds) {
       return allData.executives.filter(exec => user.executiveIds?.includes(exec.id));
    }
    
    if (user.role === 'executive') {
      return allData.executives.filter(exec => exec.id === user.executiveId);
    }
    
    return [];
  }, [user, allData?.executives]);

  useEffect(() => {
    if (visibleExecutives.length > 0 && !visibleExecutives.find(e => e.id === selectedExecutiveId)) {
      setSelectedExecutiveId(visibleExecutives[0].id);
    } else if (visibleExecutives.length === 0) {
      setSelectedExecutiveId(undefined);
    }
  }, [visibleExecutives, selectedExecutiveId, setSelectedExecutiveId]);


  const selectedExecutive = useMemo(() => {
    return allData?.executives.find(e => e.id === selectedExecutiveId);
  }, [allData?.executives, selectedExecutiveId]);

  const handleSetCurrentView = (view: View) => {
    setCurrentView(view);
  };

  const renderView = () => {
    const viewProps = {
      ...allData,
      selectedExecutive: selectedExecutive,
      visibleExecutives: visibleExecutives,
      allData: allData,
      setAllData: setAllData,
    };

    switch (currentView) {
      case 'dashboard': return <Dashboard {...viewProps} />;
      case 'executives': return <ExecutivesView {...viewProps} />;
      case 'organizations': return <OrganizationsView {...viewProps} />;
      case 'secretaries': return <SecretariesView {...viewProps} />;
      case 'agenda': return <AgendaView {...viewProps} />;
      case 'documents': return <DocumentsView {...viewProps} />;
      case 'contacts': return <ContactsView {...viewProps} />;
      case 'finances': return <ExpensesView {...viewProps} />;
      case 'tasks': return <TasksView {...viewProps} />;
      case 'reports': return <ReportsView {...viewProps} />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard {...viewProps} />;
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen bg-slate-100"><p>Carregando sessão...</p></div>;
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="flex h-screen bg-slate-100 antialiased">
      <Sidebar 
        currentUser={user}
        currentView={currentView} 
        setCurrentView={handleSetCurrentView} 
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600">
                  <MenuIcon />
              </button>
              <h1 className="text-lg font-semibold text-slate-800 capitalize">{currentView}</h1>
          </div>
          <div className="flex items-center gap-4">
              {visibleExecutives.length > 1 && (
                  <select
                      value={selectedExecutiveId || ''}
                      onChange={(e) => setSelectedExecutiveId(e.target.value)}
                      className="form-select text-sm py-2"
                  >
                      <option value="" disabled>Selecione um Executivo</option>
                      {visibleExecutives.map(exec => (
                          <option key={exec.id} value={exec.id}>{exec.fullName}</option>
                      ))}
                  </select>
              )}
              <UserMenu user={user} onLogout={logout} />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;