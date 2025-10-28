// FIX: The file had Python syntax, which is invalid in a TypeScript file.
// It has been wrapped in a template literal to be exported as a string,
// matching the pattern of other files in the backend directory.
const content = `
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from .app.database import engine, Base
from .app.routers import (
    auth, users, data, organizations, departments, executives, secretaries,
    events, contacts, expenses, tasks, documents
)
from .app.seed import seed_db

# Cria o diretório do banco de dados se não existir (para o volume do Docker)
os.makedirs("database", exist_ok=True)

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Popula o banco de dados com dados iniciais se estiver vazio
seed_db()

app = FastAPI(
    title="Secretária Executiva Cloud API",
    description="API para gerenciar dados da aplicação Secretária Executiva Cloud.",
    version="1.0.0"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui os roteadores da API sob o prefixo /api
api_prefix = "/api"
app.include_router(auth.router, prefix=api_prefix, tags=["Authentication"])
app.include_router(users.router, prefix=api_prefix, tags=["Users"])
app.include_router(data.router, prefix=api_prefix, tags=["Data Backup"])
app.include_router(organizations.router, prefix=api_prefix)
app.include_router(departments.router, prefix=api_prefix)
app.include_router(executives.router, prefix=api_prefix)
app.include_router(secretaries.router, prefix=api_prefix)
app.include_router(events.router, prefix=api_prefix)
app.include_router(contacts.router, prefix=api_prefix)
app.include_router(expenses.router, prefix=api_prefix)
app.include_router(tasks.router, prefix=api_prefix)
app.include_router(documents.router, prefix=api_prefix)

# Monta os arquivos estáticos do frontend
# A pasta 'static' conterá o build do React (index.html, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static_files")

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_react_app(full_path: str):
    """
    Serve o aplicativo React.
    Qualquer rota que não corresponda a uma rota da API servirá o index.html,
    permitindo que o React Router lide com o roteamento do lado do cliente.
    """
    return FileResponse("static/index.html")

`;
export default content;
