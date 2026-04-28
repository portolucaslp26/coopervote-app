# CooperVote Frontend - Sistema de Votação Cooperativista

Interface web para o sistema de votação cooperativista.

## Início Rápido

### Pré-requisitos
- Docker
- Docker Compose
- API backend rodando em `http://localhost:8080`

### Executar com Docker Compose

```bash
# Na raiz do projeto coopervote-react/
docker-compose up -d
```

O frontend estará disponível em: **http://localhost**

### Configurar URL da API

Para alterar a URL da API, edite o arquivo `docker-compose.yml`:

```yaml
environment:
  - API_URL=http://seu-servidor:8080
```

### Parar a aplicação

```bash
docker-compose down
```

---

## Visão Geral

Aplicação React para gerenciamento de assembleias e votação:
- Dashboard com estatísticas
- Lista de pautas
- Criação de novas pautas
- Detalhes da pauta com sessão de votação
- Interface de votação
- Modal de confirmação
- Toast notifications
- Design responsivo

## Tecnologias

| Tecnologia | Versão |
|-----------|--------|
| React | 19 |
| TypeScript | 5 |
| TailwindCSS | 4 |
| Zustand | - |
| Framer Motion | - |
| Vite | 8 |
| Docker | - |

---

## Quick Start com Docker

### Pré-requisitos
- Docker
- Docker Compose

### 1. Subir toda a stack

```bash
# Na raiz do projeto (pasta que contém docker-compose.yml)
cd ..
docker-compose up -d --build
```

### 2. Acessar

- **Frontend**: http://localhost:80
- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:80/swagger-ui

---

## Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

### 4. Build para produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/`.

---

## Docker

### Pré-requisitos

- Docker instalado
- API backend rodando (para funcionalidade completa)

### Build da Imagem

```bash
# Na raiz do projeto coopervote-react/
docker build -t coopervote/frontend:latest .
```

### Executar Container (Standalone)

```bash
# Executar na porta 80
docker run -d \
  --name coopervote-frontend \
  -p 80:80 \
  coopervote/frontend:latest
```

Acesse: **http://localhost**

### Executar Conectando na API (Mesma Máquina)

```bash
# Se a API estiver rodando no host (localhost:8080)
docker run -d \
  --name coopervote-frontend \
  -p 80:80 \
  --add-host=host.docker.internal:host-gateway \
  coopervote/frontend:latest
```

**Nota**: O nginx está configurado para fazer proxy de `/api/` para `http://api:8080`. Para rodar standalone, você pode:

1. Alterar o `nginx.conf` para apontar para `host.docker.internal:8080`
2. Ou usar docker-compose para orquestração (veja abaixo)

### Executar com Docker Compose (Recomendado para Dev)

Crie um `docker-compose.yml` na raiz do frontend:

```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    image: coopervote/frontend:latest
    container_name: coopervote-frontend
    ports:
      - "80:80"
    networks:
      - coopervote-network
    restart: unless-stopped

networks:
  coopervote-network:
    driver: bridge
```

E execute:
```bash
docker-compose up -d --build
```

### Ver Logs

```bash
docker logs -f coopervote-frontend
```

### Parar e Remover

```bash
docker stop coopervote-frontend
docker rm coopervote-frontend
```

### Estrutura Docker

O Dockerfile usa multi-stage build:

1. **Stage 1 (Builder)**: Compila o React com Vite
2. **Stage 2 (Production)**: Servidor nginx com arquivos estáticos

### Nginx Configuration

O `nginx.conf` configura:
- SPA fallback (todas as rotas para `index.html`)
- Proxy para `/api/` → `http://api:8080`
- Cache de assets estáticos
- Compressão gzip

---

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|---------|
| GET | `/api/v1/agendas` | Listar pautas |
| POST | `/api/v1/agendas` | Criar pauta |
| GET | `/api/v1/agendas/{id}` | Buscar pauta |
| POST | `/api/v1/sessions/agenda/{id}` | Abrir sessão |
| GET | `/api/v1/sessions/{id}` | Buscar sessão |
| POST | `/api/v1/sessions/{id}/close` | Encerrar sessão |
| POST | `/api/v1/votes/session/{id}` | Registrar voto |
| GET | `/api/v1/votes/session/{id}/result` | Ver resultado |

---

## Funcionalidades

### 1. Dashboard
- Visualização geral das pautas
- Indicadores de status
- Links rápidos para ações

### 2. Lista de Pautas
- Visualização de todas as pautas
- Status da sessão (Pendente/Ativo/Encerrado)
- Ações rápidas

### 3. Criar Pauta
- Formulário para nova pauta
- Título e descrição
- Redirect para Dashboard após criação

### 4. Detalhes da Pauta
- Visualização completa da pauta
- Status da sessão
- Botão para abrir/encerrar sessão
- Resultado da votação

### 5. Votação
- Campo CPF com máscara
- Botões SIM/NÃO
- Modal de confirmação
- Feedback visual

### 6. Componentes UI

#### Toast Notifications
- Posição: topo direito
- Tipos: success, error, warning, info
- Animações com Framer Motion
- Fechamento automático (4s)

#### Modal de Confirmação
- Confirmação de voto
- Confirmação de encerramento de sessão

#### Sidebar
- Navegação entre páginas
- Links: Dashboard, Pautas, Nova Pauta

---

## Status de Sessão

| Status | Cor | Descrição |
|--------|-----|-----------|
| Pendente | Amarelo | Sessão não iniciada |
| Ativo | Verde | Votação em andamento |
| Encerrado | Cinza | Votação finalizada |

---

## Validações

### CPF
- Formato: 000.000.000-00
- 11 dígitos numéricos
- Máscara automática

### Voto
- CPF obrigatório
- Uma votação por CPF por sessão
- Sessão deve estar ativa

---

## Design System

### Cores

| Cor | Hex | Uso |
|------|-----|-----|
| Primary | #0677F9 | Botões, links |
| Success | #22C55E | Mensagens positivas |
| Danger | #D92626 | Erros, botões negativo |
| Warning | #F59E0B | Avisos |
| Text | #171A1C | Texto principal |
| Text Muted | #91969C | Texto secundário |

---

## Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ConfirmModal.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   └── Toast.tsx
├── hooks/             # Custom hooks
│   └── useCpfMask.ts
├── pages/             # Páginas
│   ├── Dashboard.tsx
│   ├── PautaCreate.tsx
│   ├── PautaDetail.tsx
│   ├── PautaList.tsx
│   └── Voting.tsx
├── services/          # Chamadas API
│   ├── agendaService.ts
│   ├── sessionService.ts
│   └── voteService.ts
├── stores/           # Estado global (Zustand)
│   └── appStore.ts
├── types/            # Tipos TypeScript
│   └── index.ts
├── App.tsx           # Componente principal
└── main.tsx          # Entry point
```

---

## Testes

```bash
# Rodar testes
npm test

# Rodar com UI
npm run test:ui

# Rodar testes uma vez
npm run test:run
```

---

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|----------|-------|
| `VITE_API_URL` | URL da API backend | http://localhost:8080 |

---

## Deploy

### Vercel (Recomendado para produção)

1. Conectar repositório Git
2. Configurar variável de ambiente:
   - `VITE_API_URL`: URL da produção da API
3. Deploy automático

### Railway

1. Criar projeto Next.js ou estático
2. Configurar build: `npm run build`
3. Output: `dist/`
4. Configurar variável `VITE_API_URL`

### Docker Compose

O `docker-compose.yml` na raiz já inclui o frontend:

```bash
docker-compose up -d --build
```

---

## Licença

**© 2026 Lucas Porto. Todos os direitos reservados.**