export const ptBR = {
  // General
  save: 'Salvar',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  edit: 'Editar',
  delete: 'Excluir',
  add: 'Adicionar',
  new: 'Novo',
  close: 'Fechar',
  actions: 'Ações',
  status: 'Status',
  priority: 'Prioridade',
  description: 'Descrição',
  name: 'Nome',
  email: 'E-mail',
  phone: 'Telefone',
  organization: 'Organização',
  department: 'Departamento',
  all: 'Todos',
  none: 'Nenhum',
  no_data_found: 'Nenhum dado encontrado.',
  
  // Sidebar
  sidebar: {
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
    copyright: '© {year} Executiva Cloud',
    version: 'Versão {version}',
  },
  
  // Header
  header: {
    select_executive_label: 'Selecionar Executivo',
    select_executive_placeholder: '-- Selecione um Executivo --',
    open_menu_aria: 'Abrir menu',
  },

  // UserMenu
  userMenu: {
    hello: 'Olá, {name}!',
    logout: 'Sair do sistema',
    open_menu_aria: 'Abrir menu do usuário',
  },

  // Login
  login: {
    welcome: 'Bem-vindo à Executiva Cloud',
    prompt: 'Selecione seu perfil para acessar o sistema.',
    select_profile_label: 'Selecione o Perfil',
    placeholder: 'Selecione um perfil para acessar',
    button: 'Entrar no Sistema',
    role_executive: 'Acesso focado nas próprias atividades.',
    role_secretary: 'Gerenciamento dos executivos associados.',
    role_admin: 'Administração de uma organização.',
    role_master: 'Acesso total a todas as funcionalidades.',
  },

  // Common Messages
  no_executive_selected: {
    title: 'Selecione um Executivo',
    message: 'Por favor, selecione um executivo no menu superior para visualizar os dados correspondentes.',
  },

  // Modals
  modal: {
    close_aria: 'Fechar modal',
  },
  confirmation_modal: {
    default_title: 'Confirmar Exclusão',
    delete_event_message: 'Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.',
    delete_contact_message: 'Tem certeza que deseja excluir o contato {name}?',
    delete_executive_message: 'Tem certeza que deseja excluir o executivo {name}? Todos os seus dados (eventos, contatos, etc), vínculos com secretárias e seu acesso de usuário serão perdidos.',
    delete_expense_message: 'Tem certeza que deseja excluir a despesa "{description}"?',
    delete_organization_message: 'Tem certeza que deseja excluir a organização {name}? TODOS os seus dados (departamentos, executivos, atividades, etc) e usuários associados serão permanentemente removidos.',
    delete_department_message: 'Tem certeza que deseja excluir o departamento {name}? Os executivos associados serão desvinculados.',
    delete_secretary_message: 'Tem certeza que deseja excluir a secretária {name}? O usuário associado também será removido.',
    delete_event_type_message: 'Tem certeza que deseja excluir o tipo de evento "{name}"?',
    delete_contact_type_message: 'Tem certeza que deseja excluir o tipo de contato "{name}"?',
    delete_task_message: 'Tem certeza que deseja excluir esta tarefa?',
  },

  // Dashboard
  dashboard: {
    title: 'Painel de Controle',
    title_with_executive: 'Painel de Controle - {name}',
    subtitle: 'Visão geral da sua operação.',
    subtitle_with_executive: 'Resumo das atividades e informações do executivo.',
    managed_executives: 'Executivos Gerenciados',
    events_in_agenda: 'Eventos na Agenda',
    total_expenses: 'Total de Despesas',
    upcoming_events_7d: 'Próximos Eventos (7d)',
    welcome_title: 'Bem-vinda à Executiva Cloud!',
    welcome_prompt: 'Para começar, selecione um executivo no menu superior para visualizar seus detalhes.',
    upcoming_events: 'Próximos Eventos',
    recent_expenses: 'Despesas Recentes',
    no_upcoming_events: 'Nenhum evento futuro agendado.',
    no_recent_expenses: 'Nenhuma despesa registrada para este executivo.',
  },

  // Agenda
  agenda: {
    title: 'Agenda de Eventos',
    subtitle: 'Visualize e gerencie os próximos eventos.',
    new_event: 'Novo Evento',
    edit_event: 'Editar Evento',
    no_events: 'Nenhum evento agendado para este executivo.',
    form: {
      title: 'Título',
      event_type: 'Tipo de Evento',
      location_link: 'Local ou Link',
      start_time: 'Início do 1º Evento',
      end_time: 'Fim do 1º Evento',
      reminder: 'Lembrete',
      reminder_placeholder: 'Não notificar',
      reminder_unit_aria: 'Unidade de tempo para o lembrete',
      minutes_before: 'minutos antes',
      hours_before: 'horas antes',
      days_before: 'dias antes',
    },
    recurrence: {
      title: 'Evento Recorrente',
      prompt_delete: 'Este é um evento recorrente. O que você gostaria de excluir?',
      delete_one: 'Apenas esta ocorrência',
      delete_future: 'Esta e as futuras ocorrências',
      delete_all: 'Toda a série',
      repeat_every: 'Repetir a cada',
      ends: 'Termina:',
      after: 'Após',
      occurrences: 'ocorrências',
      on: 'Em',
      in_days: 'Nos dias:',
      days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      frequencies: {
        daily: 'dia(s)', weekly: 'semana(s)', monthly: 'mês(es)', annually: 'ano(s)'
      }
    },
    reminder_text: {
      day: '{count} dia antes',
      days: '{count} dias antes',
      hour: '{count} hora antes',
      hours: '{count} horas antes',
      minutes: '{count} minutos antes',
    }
  },
  
  // Contacts
  contacts: {
    title: 'Lista de Contatos',
    subtitle: 'Sua rede profissional, sempre à mão.',
    new_contact: 'Novo Contato',
    edit_contact: 'Editar Contato',
    no_contacts: 'Nenhum contato adicionado para este executivo.',
    form: {
        full_name: 'Nome Completo',
        contact_type: 'Tipo de Contato',
        company: 'Empresa',
        role: 'Cargo',
        notes: 'Anotações',
    }
  },

  // Expenses
  expenses: {
    title: 'Controle de Despesas',
    subtitle: 'Registre e acompanhe todas as despesas.',
    new_expense: 'Nova Despesa',
    edit_expense: 'Editar Despesa',
    no_expenses: 'Nenhuma despesa registrada para este executivo.',
    table: {
      date: 'Data',
      category: 'Categoria',
      value: 'Valor',
    },
    form: {
        value_brl: 'Valor (R$)',
        expense_date: 'Data da Despesa',
        category: 'Categoria',
        category_placeholder: 'Ex: Transporte, Alimentação',
        receipt_url: 'URL do Recibo',
        receipt_url_placeholder: 'https://...',
    }
  },
  
  // Tasks
  tasks: {
    title: 'Gerenciador de Tarefas',
    subtitle: 'Organize suas atividades e mantenha o foco no que importa.',
    new_task: 'Nova Tarefa',
    edit_task: 'Editar Tarefa',
    filter_by_status: 'Filtrar por status:',
    table: {
      title: 'Título',
      due_date: 'Vencimento',
    },
    no_tasks_filter: 'Nenhuma tarefa encontrada para este filtro.',
    form: {
        title: 'Título',
        due_date: 'Data de Vencimento da 1ª Tarefa',
    },
    recurrence: {
      title: 'Tarefa Recorrente'
    }
  },
  
  // Executives
  executives: {
    title: 'Gerenciar Executivos',
    subtitle: 'Adicione, edite e visualize os executivos que você gerencia.',
    new_executive: 'Novo Executivo',
    edit_executive: 'Editar Executivo',
    no_executives: 'Nenhum executivo cadastrado.',
    table: {
      organization_department: 'Organização / Departamento',
      contact: 'Contato',
    },
    form: {
      full_name: 'Nome Completo',
      no_organization: 'Sem Organização',
      no_department: 'Sem Departamento',
    }
  },
  
  // Secretaries
  secretaries: {
    title: 'Gerenciar Secretárias',
    subtitle: 'Adicione e associe secretárias aos executivos.',
    new_secretary: 'Nova Secretária',
    edit_secretary: 'Editar Secretária',
    no_secretaries: 'Nenhuma secretária cadastrada.',
    table: {
        attended_executives: 'Executivos Atendidos',
    },
    form: {
        full_name: 'Nome Completo',
        attended_executives: 'Executivos Atendidos',
        no_executives_registered: 'Nenhum executivo cadastrado.',
    }
  },
  
  // Organizations
  organizations: {
    title: 'Gerenciar Organizações',
    subtitle: 'Adicione ou edite as empresas e seus respectivos departamentos.',
    new_organization: 'Nova Organização',
    edit_organization: 'Editar Organização',
    new_department: 'Novo Departamento',
    edit_department: 'Editar Departamento',
    add_department: 'Adicionar Departamento',
    no_organizations: 'Nenhuma organização cadastrada.',
    departments: 'Departamentos',
    no_departments: 'Nenhum departamento cadastrado.',
    form: {
        org_name: 'Nome da Organização',
        dept_name: 'Nome do Departamento',
    }
  },
  
  // Settings
  settings: {
    title: 'Configurações',
    subtitle: 'Personalize as categorias e tipos para organizar seu trabalho.',
    event_types: 'Tipos de Evento',
    contact_types: 'Tipos de Contato',
    new_event_type: 'Novo Tipo de Evento',
    edit_event_type: 'Editar Tipo de Evento',
    new_contact_type: 'Novo Tipo de Contato',
    edit_contact_type: 'Editar Tipo de Contato',
    form: {
        type_name: 'Nome do Tipo',
        color: 'Cor',
    }
  },

  // Reports
  reports: {
    title: 'Gerador de Relatórios',
    subtitle: 'Filtre e extraia os dados que você precisa.',
    executives: 'Executivos',
    all_executives: 'Todos os Executivos',
    start_date: 'Data de Início',
    end_date: 'Data de Fim',
    data_types: 'Tipos de Dados',
    data_type_events: 'Eventos',
    data_type_expenses: 'Despesas',
    data_type_tasks: 'Tarefas',
    data_type_contacts: 'Contatos',
    generate_button: 'Gerar Relatório',
    report_result_title: 'Resultado do Relatório',
    export_csv_button: 'Exportar para CSV',
    no_data_for_filter: 'Nenhum dado encontrado para os filtros selecionados.',
    csv_headers: {
        data_type: 'Tipo de Dado',
        executive: 'Executivo',
        date: 'Data',
        description_title: 'Descrição/Título',
        detail_1: 'Detalhe 1',
        detail_2: 'Detalhe 2',
    },
    csv_data: {
        event: 'Evento',
        expense: 'Despesa',
        task: 'Tarefa',
        contact: 'Contato',
        location_prefix: 'Local: ',
        duration_prefix: 'Duração: ',
        duration_suffix: ' min',
        value_prefix: 'Valor: ',
        status_prefix: 'Status: ',
        priority_prefix: 'Prioridade: ',
        company_prefix: 'Empresa: ',
        email_prefix: 'Email: ',
    }
  }
};
