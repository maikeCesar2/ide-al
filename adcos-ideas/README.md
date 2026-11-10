# 💡 ide.al

### Plataforma de inovação e compartilhamento de ideias

O **ide.al** é uma plataforma web desenvolvida para incentivar a inovação, a colaboração e o compartilhamento de ideias dentro de uma organização.

A proposta é oferecer um espaço onde colaboradores possam cadastrar sugestões, acompanhar o andamento de suas ideias e visualizar avaliações realizadas pela equipe administrativa.

O sistema também conta com uma área de gestão, permitindo que administradores acompanhem as propostas, atualizem seus status e registrem avaliações técnicas e observações.

---

## 🎯 Objetivo do projeto

Criar um ambiente digital que facilite a comunicação de ideias e sugestões, tornando o processo de inovação mais organizado, acessível e transparente.

## ✨ Funcionalidades

### 👤 Usuários e autenticação
- Cadastro de usuários.
- Login com e-mail e senha.
- Autenticação utilizando JWT.
- Criptografia de senhas com bcrypt.
- Diferenciação entre usuários comuns e administradores.
- Consulta de informações do perfil.
- Upload e atualização de foto de perfil.

### 💡 Gerenciamento de ideias
- Cadastro de novas ideias.
- Definição de título, categoria e descrição.
- Listagem de ideias cadastradas.
- Consulta das próprias ideias.
- Visualização detalhada de cada proposta.
- Edição e exclusão de ideias.

### 📊 Gestão administrativa
- Visualização de todas as ideias cadastradas.
- Atualização do status das propostas.
- Registro de avaliações técnicas.
- Adição de observações administrativas.
- Histórico de atualizações das ideias.

### 🖥️ Interface
- Página inicial.
- Cadastro e login.
- Página sobre o projeto.
- Cadastro de ideias.
- Minhas ideias.
- Detalhes da ideia.
- Perfil do usuário.
- Painel de gestão administrativa.

---

## 🛠️ Tecnologias utilizadas

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React

**Backend**
- Node.js
- Express
- JSON Web Token (JWT)
- Bcrypt
- Multer
- CORS
- Dotenv

**Banco de dados**
- PostgreSQL

---

## 📂 Estrutura do projeto

```text
Adcos-Ideas/
│
└── adcos-ideas/
    │
    ├── backend/
    │   ├── db/
    │   ├── middleware/
    │   ├── routes/
    │   ├── uploads/
    │   ├── .env.example
    │   ├── index.js
    │   └── package.json
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── context/
    │   │   ├── pages/
    │   │   ├── App.jsx
    │   │   ├── api.js
    │   │   └── index.css
    │   ├── .env.example
    │   └── package.json
    │
    ├── database/
    │   └── schema.sql
    │
    └── README.md
```

---

## ⚙️ Como executar o projeto

### 1. Pré-requisitos

Antes de começar, você precisará ter instalado:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

### 2. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/Adcos-Ideas.git
```

Entre na pasta do projeto:

```bash
cd Adcos-Ideas/adcos-ideas
```

### 3. Configure o banco de dados

Crie um banco de dados PostgreSQL com o nome:

```sql
CREATE DATABASE "adcos-ideas";
```

Em seguida, execute o conteúdo do arquivo:

```text
database/schema.sql
```

Esse arquivo cria as tabelas necessárias para o funcionamento da aplicação.

### 4. Configure o backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie uma cópia do arquivo `.env.example` com o nome `.env`.

Configure suas variáveis de ambiente:

```env
PORT=3001

DB_USER=postgres
DB_HOST=localhost
DB_NAME=adcos-ideas
DB_PASSWORD=sua_senha_postgresql
DB_PORT=5432

JWT_SECRET=sua_chave_secreta_aleatoria
```

**Importante:** substitua os valores pelos dados do seu ambiente local. Gere uma chave JWT longa e aleatória.

Inicie o servidor:

```bash
npm run dev
```

O backend estará disponível em:

```text
http://localhost:3001
```

### 5. Configure o frontend

Abra outro terminal e entre na pasta:

```bash
cd adcos-ideas/frontend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` baseado no `.env.example`:

```env
VITE_API_URL=http://localhost:3001
```

Inicie a aplicação:

```bash
npm run dev
```

O Vite disponibilizará o endereço local, normalmente:

```text
http://localhost:5173
```

Pronto! O ide.al estará disponível no navegador.

---

## 🔐 Acesso administrativo

Por padrão, os novos usuários são cadastrados com o perfil `comum`.

Para conceder acesso administrativo a um usuário, execute no PostgreSQL:

```sql
UPDATE usuarios
SET role = 'admin'
WHERE email = 'seu-email@exemplo.com';
```

Após a alteração, faça login novamente para obter um token com as permissões atualizadas.

---

## 🔒 Segurança

Algumas medidas de segurança utilizadas no projeto:

- Senhas armazenadas com hash utilizando bcrypt.
- Autenticação baseada em JWT.
- Rotas protegidas por middleware de autenticação.
- Controle de permissões entre usuários comuns e administradores.
- Consultas SQL parametrizadas para reduzir riscos de SQL Injection.
- Variáveis sensíveis armazenadas em arquivos de ambiente.

**Nunca compartilhe seu arquivo `.env` ou publique chaves e credenciais no repositório.**

---

## 🚧 Status do projeto

**Em desenvolvimento.**

O ide.al está em processo de validação e evolução, com melhorias planejadas para a identidade visual, experiência do usuário, responsividade, funcionalidades e segurança.

---

## 👨‍💻 Desenvolvimento

Projeto desenvolvido por **Maike Silva**, com foco em desenvolvimento web Full Stack, inovação e criação de soluções digitais.

---

💡 **ide.al — Toda grande inovação começa com uma ideia.**