import { v4 as uuidv4 } from 'uuid';
import { AllDataBackup, Priority, Status, ExpenseType, ExpenseEntityType, ExpenseStatus, UserRole } from '../types';

const today = new Date();
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const addHours = (date: Date, hours: number): Date => {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
}

// 1. Organizações
const org_tech = { id: uuidv4(), name: "Tech Solutions" };
const org_finance = { id: uuidv4(), name: "Fintech Corp" };

// 2. Departamentos
const dept_dev = { id: uuidv4(), name: "Desenvolvimento", organizationId: org_tech.id };
const dept_mkt = { id: uuidv4(), name: "Marketing", organizationId: org_tech.id };
const dept_risk = { id: uuidv4(), name: "Análise de Risco", organizationId: org_finance.id };

// 3. Executivos
const exec_carlos = {
    id: uuidv4(),
    fullName: "Carlos Santana",
    jobTitle: "CEO",
    organizationId: org_tech.id,
    departmentId: dept_dev.id,
    workEmail: "carlos.santana@tech.com",
    photoUrl: "https://i.pravatar.cc/150?u=carlos"
};
const exec_ana = {
    id: uuidv4(),
    fullName: "Ana Pereira",
    jobTitle: "Diretora de Marketing",
    organizationId: org_tech.id,
    departmentId: dept_mkt.id,
    workEmail: "ana.pereira@tech.com",
    photoUrl: "https://i.pravatar.cc/150?u=ana"
};
const exec_bruno = {
    id: uuidv4(),
    fullName: "Bruno Mendes",
    jobTitle: "Gerente de Risco",
    organizationId: org_finance.id,
    departmentId: dept_risk.id,
    workEmail: "bruno.mendes@fintech.com",
    photoUrl: "https://i.pravatar.cc/150?u=bruno"
};

// 4. Secretárias
const sec_fernanda = {
    id: uuidv4(),
    fullName: "Fernanda Lima",
    email: "fernanda.lima@assist.com",
    executiveIds: [exec_carlos.id, exec_ana.id]
};
const sec_roberta = {
    id: uuidv4(),
    fullName: "Roberta Alves",
    email: "roberta.alves@assist.com",
    executiveIds: [exec_bruno.id]
};

// 5. Usuários
const user_master = { id: uuidv4(), fullName: "Usuário Master", role: UserRole.master };
const user_admin = { id: uuidv4(), fullName: "Admin Tech Solutions", role: UserRole.admin, organizationId: org_tech.id };
const user_carlos = { id: uuidv4(), fullName: "Carlos Santana (Exec)", role: UserRole.executive, executiveId: exec_carlos.id };
const user_ana = { id: uuidv4(), fullName: "Ana Pereira (Exec)", role: UserRole.executive, executiveId: exec_ana.id };
const user_bruno = { id: uuidv4(), fullName: "Bruno Mendes (Exec)", role: UserRole.executive, executiveId: exec_bruno.id };
const user_fernanda = { id: uuidv4(), fullName: "Fernanda Lima (Sec)", role: UserRole.secretary, secretaryId: sec_fernanda.id };
const user_roberta = { id: uuidv4(), fullName: "Roberta Alves (Sec)", role: UserRole.secretary, secretaryId: sec_roberta.id };


// 6. Categorias e Tipos
const event_type_reuniao = { id: uuidv4(), name: "Reunião", color: "#4f46e5" };
const contact_type_cliente = { id: uuidv4(), name: "Cliente" };
const exp_cat_viagem = { id: uuidv4(), name: "Viagem" };
const doc_cat_contrato = { id: uuidv4(), name: "Contrato" };

export const mockAllData: AllDataBackup = {
    version: "1.0.0-mock",
    organizations: [org_tech, org_finance],
    departments: [dept_dev, dept_mkt, dept_risk],
    executives: [exec_carlos, exec_ana, exec_bruno],
    secretaries: [sec_fernanda, sec_roberta],
    users: [user_master, user_admin, user_carlos, user_ana, user_bruno, user_fernanda, user_roberta],
    eventTypes: [event_type_reuniao],
    events: [
        { id: uuidv4(), title: "Reunião de Diretoria", startTime: addDays(new Date(), 1).toISOString(), endTime: addHours(addDays(new Date(), 1), 1).toISOString(), executiveId: exec_carlos.id, eventTypeId: event_type_reuniao.id, location: "Sala 1" },
        { id: uuidv4(), title: "Call de alinhamento", startTime: addHours(new Date(), 2).toISOString(), endTime: addHours(addHours(new Date(), 2), 0.5).toISOString(), executiveId: exec_bruno.id, eventTypeId: event_type_reuniao.id, location: "Online" }
    ],
    contactTypes: [contact_type_cliente],
    contacts: [
        { id: uuidv4(), fullName: "Pedro Alcantara", company: "Agência Criativa", email: "pedro@criativa.com", executiveId: exec_ana.id, contactTypeId: contact_type_cliente.id }
    ],
    expenseCategories: [exp_cat_viagem],
    expenses: [
        { id: uuidv4(), description: "Almoço com investidores", amount: 350.50, expenseDate: addDays(today, -2).toISOString().split('T')[0], type: ExpenseType.APagar, entityType: ExpenseEntityType.PessoaJuridica, status: ExpenseStatus.Pago, categoryId: exp_cat_viagem.id, executiveId: exec_carlos.id }
    ],
    tasks: [
        { id: uuidv4(), title: "Revisar relatório trimestral", dueDate: addDays(today, 5).toISOString().split('T')[0], priority: Priority.High, status: Status.Todo, executiveId: exec_carlos.id },
        { id: uuidv4(), title: "Aprovar campanha de MKT", dueDate: addDays(today, 2).toISOString().split('T')[0], priority: Priority.Medium, status: Status.InProgress, executiveId: exec_ana.id }
    ],
    documentCategories: [doc_cat_contrato],
    documents: [
        { id: uuidv4(), name: "Contrato Cliente XPTO", imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", categoryId: doc_cat_contrato.id, executiveId: exec_bruno.id, uploadDate: new Date().toISOString() }
    ]
};
