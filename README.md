# ide.al — reconstrução do projeto

Este projeto foi reconstruído a partir dos trechos e decisões que ainda estavam disponíveis nas conversas. Como os arquivos originais foram perdidos, esta é uma **reconstrução funcional**, não uma cópia byte a byte da versão que estava no seu computador.

## Tecnologias
- Frontend: React + Vite + Tailwind CSS + React Router
- Backend: Node.js + Express
- Banco: PostgreSQL
- Autenticação: JWT + bcrypt
- Upload de foto: Multer

## 1. Requisitos
Instale:
- Node.js (versão LTS)
- PostgreSQL
- Visual Studio Code

## 2. Banco de dados
Crie um banco chamado `adcos-ideas` no PostgreSQL e execute o conteúdo de `database/schema.sql`.

## 3. Backend
Abra um terminal na pasta `backend` e execute:

```bash
npm install
```

Copie `.env.example` para `.env` e preencha os dados do seu PostgreSQL e uma chave JWT própria.

Depois execute:

```bash
npm run dev
```

O servidor ficará em `http://localhost:3001`.

## 4. Frontend
Abra outro terminal na pasta `frontend` e execute:

```bash
npm install
npm run dev
```

O Vite mostrará o endereço local (normalmente `http://localhost:5173`).

## 5. Primeiro acesso
Crie uma conta pela tela **Criar conta**. A primeira conta é criada com perfil comum. Para tornar um usuário administrador, altere o campo `role` diretamente no PostgreSQL para `admin`.

Exemplo:
```sql
UPDATE usuarios SET role = 'admin' WHERE email = 'seu-email@exemplo.com';
```

## Observações importantes
- Não coloque senhas reais no código. Use o arquivo `.env` local.
- Não compartilhe seu `.env`.
- A pasta `backend/uploads` é criada automaticamente para armazenar fotos enviadas.
- O projeto usa as rotas `/api/auth`, `/usuarios` e `/api`.
- Esta reconstrução implementa o fluxo principal de cadastro, login, perfil, upload de foto, criação/listagem/edição/exclusão de ideias e gestão básica.
- Recursos específicos da versão perdida que não aparecem nos trechos recuperáveis podem precisar ser ajustados depois.
