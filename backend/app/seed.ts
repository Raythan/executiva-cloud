
const content = `
from sqlalchemy.orm import Session
import uuid
from datetime import date, timedelta, datetime
from .database import SessionLocal, engine, Base
from . import models

def seed_db():
    db = SessionLocal()
    try:
        # Verifica se o banco já foi populado
        if db.query(models.User).first():
            print("Banco de dados já populado.")
            return

        print("Populando o banco de dados com dados iniciais...")

        # 1. Organizações
        org_tech = models.Organization(id=str(uuid.uuid4()), name="Tech Solutions")
        org_finance = models.Organization(id=str(uuid.uuid4()), name="Fintech Corp")
        db.add_all([org_tech, org_finance])
        db.commit()

        # 2. Departamentos
        dept_dev = models.Department(id=str(uuid.uuid4()), name="Desenvolvimento", organizationId=org_tech.id)
        dept_mkt = models.Department(id=str(uuid.uuid4()), name="Marketing", organizationId=org_tech.id)
        dept_risk = models.Department(id=str(uuid.uuid4()), name="Análise de Risco", organizationId=org_finance.id)
        db.add_all([dept_dev, dept_mkt, dept_risk])
        db.commit()
        
        # 3. Executivos
        exec_carlos = models.Executive(
            id=str(uuid.uuid4()),
            fullName="Carlos Santana",
            jobTitle="CEO",
            organizationId=org_tech.id,
            departmentId=dept_dev.id,
            workEmail="carlos.santana@tech.com",
            photoUrl="https://i.pravatar.cc/150?u=carlos"
        )
        exec_ana = models.Executive(
            id=str(uuid.uuid4()),
            fullName="Ana Pereira",
            jobTitle="Diretora de Marketing",
            organizationId=org_tech.id,
            departmentId=dept_mkt.id,
            workEmail="ana.pereira@tech.com",
            photoUrl="https://i.pravatar.cc/150?u=ana"
        )
        exec_bruno = models.Executive(
            id=str(uuid.uuid4()),
            fullName="Bruno Mendes",
            jobTitle="Gerente de Risco",
            organizationId=org_finance.id,
            departmentId=dept_risk.id,
            workEmail="bruno.mendes@fintech.com",
            photoUrl="https://i.pravatar.cc/150?u=bruno"
        )
        db.add_all([exec_carlos, exec_ana, exec_bruno])
        db.commit()

        # 4. Secretárias
        sec_fernanda = models.Secretary(
            id=str(uuid.uuid4()),
            fullName="Fernanda Lima",
            email="fernanda.lima@assist.com",
            executives=[exec_carlos, exec_ana]
        )
        sec_roberta = models.Secretary(
            id=str(uuid.uuid4()),
            fullName="Roberta Alves",
            email="roberta.alves@assist.com",
            executives=[exec_bruno]
        )
        db.add_all([sec_fernanda, sec_roberta])
        db.commit()

        # 5. Usuários
        user_master = models.User(id=str(uuid.uuid4()), fullName="Usuário Master", role="master")
        user_admin = models.User(id=str(uuid.uuid4()), fullName="Admin Tech Solutions", role="admin", organizationId=org_tech.id)
        user_carlos = models.User(id=str(uuid.uuid4()), fullName="Carlos Santana (Exec)", role="executive", executiveId=exec_carlos.id)
        user_ana = models.User(id=str(uuid.uuid4()), fullName="Ana Pereira (Exec)", role="executive", executiveId=exec_ana.id)
        user_bruno = models.User(id=str(uuid.uuid4()), fullName="Bruno Mendes (Exec)", role="executive", executiveId=exec_bruno.id)
        user_fernanda = models.User(id=str(uuid.uuid4()), fullName="Fernanda Lima (Sec)", role="secretary", secretaryId=sec_fernanda.id)
        user_roberta = models.User(id=str(uuid.uuid4()), fullName="Roberta Alves (Sec)", role="secretary", secretaryId=sec_roberta.id)
        db.add_all([user_master, user_admin, user_carlos, user_ana, user_bruno, user_fernanda, user_roberta])
        db.commit()

        # 6. Categorias e Tipos
        event_type_reuniao = models.EventType(id=str(uuid.uuid4()), name="Reunião", color="#4f46e5")
        contact_type_cliente = models.ContactType(id=str(uuid.uuid4()), name="Cliente")
        exp_cat_viagem = models.ExpenseCategory(id=str(uuid.uuid4()), name="Viagem")
        doc_cat_contrato = models.DocumentCategory(id=str(uuid.uuid4()), name="Contrato")
        db.add_all([event_type_reuniao, contact_type_cliente, exp_cat_viagem, doc_cat_contrato])
        db.commit()
        
        today = date.today()
        # 7. Dados de Exemplo por Executivo
        # Carlos
        db.add(models.Event(id=str(uuid.uuid4()), title="Reunião de Diretoria", startTime=(datetime.now() + timedelta(days=1)).isoformat(), endTime=(datetime.now() + timedelta(days=1, hours=1)).isoformat(), executiveId=exec_carlos.id, eventTypeId=event_type_reuniao.id, location="Sala 1"))
        db.add(models.Task(id=str(uuid.uuid4()), title="Revisar relatório trimestral", dueDate=(today + timedelta(days=5)).isoformat(), priority="Alta", status="A Fazer", executiveId=exec_carlos.id))
        db.add(models.Expense(id=str(uuid.uuid4()), description="Almoço com investidores", amount=350.50, expenseDate=(today - timedelta(days=2)).isoformat(), type="A pagar", entityType="Pessoa Jurídica", status="Pago", categoryId=exp_cat_viagem.id, executiveId=exec_carlos.id))
        
        # Ana
        db.add(models.Contact(id=str(uuid.uuid4()), fullName="Pedro Alcantara", company="Agência Criativa", email="pedro@criativa.com", executiveId=exec_ana.id, contactTypeId=contact_type_cliente.id))
        db.add(models.Task(id=str(uuid.uuid4()), title="Aprovar campanha de MKT", dueDate=(today + timedelta(days=2)).isoformat(), priority="Média", status="Em Andamento", executiveId=exec_ana.id))
        
        # Bruno
        db.add(models.Document(id=str(uuid.uuid4()), name="Contrato Cliente XPTO", imageUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", categoryId=doc_cat_contrato.id, executiveId=exec_bruno.id, uploadDate=datetime.now().isoformat()))
        db.add(models.Event(id=str(uuid.uuid4()), title="Call de alinhamento", startTime=(datetime.now() + timedelta(hours=2)).isoformat(), endTime=(datetime.now() + timedelta(hours=2, minutes=30)).isoformat(), executiveId=exec_bruno.id, eventTypeId=event_type_reuniao.id, location="Online"))
        
        db.commit()
        print("Banco de dados populado com sucesso.")

    finally:
        db.close()
`;
export default content;
