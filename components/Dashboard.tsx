import React from 'react';
import { Executive, Event, Expense } from '../types';
import { CalendarIcon, ExpensesIcon, ClockIcon, ExecutivesIcon } from './Icons';

interface DashboardProps {
  executives: Executive[];
  events: Event[];
  expenses: Expense[];
  selectedExecutive: Executive | undefined;
}

const Dashboard: React.FC<DashboardProps> = ({ executives, events, expenses, selectedExecutive }) => {
  const upcomingEvents = events
    .filter(event => new Date(event.startTime) >= new Date() && event.executiveId === selectedExecutive?.id)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  const recentExpenses = expenses
    .filter(expense => expense.executiveId === selectedExecutive?.id)
    .sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
    .slice(0, 5);
  
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const timeZoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + timeZoneOffset);
    return adjustedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">
          {selectedExecutive ? `Painel de Controle - ${selectedExecutive.fullName}` : 'Painel de Controle'}
        </h2>
        <p className="text-slate-500 mt-1">
          {selectedExecutive ? 'Resumo das atividades e informações do executivo.' : 'Visão geral da sua operação.'}
        </p>
      </header>

      {/* Grid for summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><ExecutivesIcon className="w-6 h-6" /></div>
          <div>
            <p className="text-slate-500 text-sm">Executivos Gerenciados</p>
            <p className="text-2xl font-bold">{executives.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-full"><CalendarIcon className="w-6 h-6" /></div>
          <div>
            <p className="text-slate-500 text-sm">Eventos na Agenda</p>
            <p className="text-2xl font-bold">{selectedExecutive ? events.filter(e => e.executiveId === selectedExecutive.id).length : '-'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full"><ExpensesIcon className="w-6 h-6" /></div>
          <div>
            <p className="text-slate-500 text-sm">Total de Despesas</p>
            <p className="text-2xl font-bold">{selectedExecutive ? expenses.filter(e => e.executiveId === selectedExecutive.id).length : '-'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full"><ClockIcon className="w-6 h-6" /></div>
          <div>
            <p className="text-slate-500 text-sm">Próximos Eventos (7d)</p>
            <p className="text-2xl font-bold">{
              selectedExecutive ? events.filter(e => {
                const eventDate = new Date(e.startTime);
                const today = new Date();
                const in7Days = new Date(today.setDate(today.getDate() + 7));
                return e.executiveId === selectedExecutive.id && eventDate >= new Date() && eventDate <= in7Days;
              }).length : '-'
            }</p>
          </div>
        </div>
      </div>

      {!selectedExecutive && (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <h3 className="text-xl font-semibold text-slate-700">Bem-vinda à Executiva Cloud!</h3>
            <p className="text-slate-500 mt-2">Para começar, selecione um executivo no menu superior para visualizar seus detalhes.</p>
        </div>
      )}

      {/* Main content grid */}
      {selectedExecutive && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
              <CalendarIcon className="w-6 h-6" />
              <span className="ml-2">Próximos Eventos</span>
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event.id} className="p-4 rounded-lg bg-slate-50 border-l-4 border-purple-500">
                    <p className="font-semibold text-slate-800">{event.title}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-2"><ClockIcon className="w-4 h-4" /> {formatDateTime(event.startTime)}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 p-4 text-center">Nenhum evento futuro agendado.</p>
              )}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
              <ExpensesIcon className="w-6 h-6" />
              <span className="ml-2">Despesas Recentes</span>
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {recentExpenses.length > 0 ? (
                recentExpenses.map(expense => (
                  <div key={expense.id} className="p-4 rounded-lg bg-slate-50 border-l-4 border-green-500 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-slate-800">{expense.description}</p>
                        <p className="text-sm text-slate-500">{formatDate(expense.expenseDate)} - {expense.category}</p>
                    </div>
                    <p className="font-bold text-green-700">{formatCurrency(expense.amount)}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 p-4 text-center">Nenhuma despesa registrada para este executivo.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;