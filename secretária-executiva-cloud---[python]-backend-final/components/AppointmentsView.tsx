import React from 'react';
import { Appointment } from '../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
}

const AppointmentsView: React.FC<AppointmentsViewProps> = ({ appointments }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Compromissos</h2>
        <p className="text-slate-500 mt-1">Gerencie seus compromissos.</p>
      </header>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-slate-700 mb-4">Lista de Compromissos</h3>
        {appointments.length > 0 ? (
          <ul>
            {appointments.map(app => (
              <li key={app.id} className="border-b py-2">
                <p className="font-semibold">{app.title}</p>
                <p className="text-sm text-slate-600">{app.date} às {app.time} - {app.location}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">Nenhum compromisso agendado.</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentsView;
