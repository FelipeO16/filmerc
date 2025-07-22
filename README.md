# FilmerC - Sistema de Gerenciamento de Locadora de Filmes

Um sistema moderno de gerenciamento de locadora de filmes construído com Vue.js 3, TypeScript e Tailwind CSS v4. Esta aplicação fornece uma solução completa para gerenciar usuários, clientes, filmes e locações em um negócio de locadora de vídeos.

## 🚀 Funcionalidades

### Funcionalidades Principais
- **Gerenciamento de Usuários**: Operações CRUD completas com controle de acesso baseado em função
- **Gerenciamento de Clientes**: Base de dados de clientes com informações de contato e gerenciamento de endereços
- **Catálogo de Filmes**: Integração com API OMDb para busca e detalhes de filmes
- **Sistema de Locação**: Gerenciamento completo do ciclo de vida da locação com rastreamento de devoluções
- **Autenticação**: Login/logout seguro com sessões persistentes

### Funcionalidades Técnicas
- **TypeScript**: Segurança de tipos completa em toda a aplicação
- **Design Responsivo**: Abordagem mobile-first com Tailwind CSS v4
- **Atomic Design**: Arquitetura de componentes seguindo princípios de design atômico
- **Gerenciamento de Estado**: Stores Pinia para gerenciamento de estado reativo
- **Local Storage**: Persistência de dados no local storage do navegador
- **Integração de APIs**: API OMDb para filmes, ViaCEP para endereços brasileiros
- **Notificações em Tempo Real**: Notificações toast para feedback do usuário

## 🛠 Stack Tecnológico

- **Framework**: Vue.js 3 com Composition API
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **Componentes UI**: Element Plus
- **Gerenciamento de Estado**: Pinia
- **Roteador**: Vue Router 4
- **Ferramenta de Build**: Vite
- **Testes**: Vitest + Cypress
- **Qualidade de Código**: ESLint + Prettier

## 📦 Estrutura do Projeto

```
src/
├── components/
│   ├── atoms/          # Componentes UI básicos (botões, inputs, cards)
│   ├── molecules/      # Combinações de componentes
│   ├── organisms/      # Seções UI complexas
│   └── templates/      # Layouts de página
├── composables/        # Funções de composição reutilizáveis
├── services/           # Serviços de API e integrações externas
├── stores/            # Stores de estado Pinia
├── types/             # Definições de tipos TypeScript
├── utils/             # Funções utilitárias
└── views/             # Páginas da aplicação
    ├── auth/          # Páginas de autenticação
    ├── users/         # Páginas de gerenciamento de usuários
    ├── clients/       # Páginas de gerenciamento de clientes
    ├── movies/        # Páginas do catálogo de filmes
    └── rentals/       # Páginas de gerenciamento de locações
```

## 🚀 Primeiros Passos

### Pré-requisitos
- Node.js 20.19.0 ou superior
- npm 8.0.0 ou superior

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd filmerc
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env e adicione sua chave da API OMDb
VITE_OMDB_API_KEY=sua_chave_api_omdb_aqui
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Credenciais Padrão de Login
- **Documento**: `12345678901`
- **Senha**: `admin123`

## 📋 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Visualizar build de produção
```

### Testes
```bash
npm run test:unit    # Executar testes unitários com Vitest
npm run test:e2e     # Executar testes E2E com Cypress
npm run test:e2e:dev # Executar testes E2E em modo desenvolvimento
```

### Qualidade de Código
```bash
npm run lint         # Verificar código com ESLint
npm run format       # Formatar código com Prettier
npm run type-check   # Verificar tipos TypeScript
```

## 🔧 Configuração

### API OMDb
Para usar a funcionalidade de busca de filmes, você precisa:
1. Obter uma chave de API gratuita da [API OMDb](https://www.omdbapi.com/)
2. Criar um arquivo `.env` na raiz do projeto
3. Adicionar sua chave de API: `VITE_OMDB_API_KEY=sua_chave_api_aqui`

### Integração ViaCEP
A aplicação busca automaticamente dados de endereços brasileiros usando CEP (código postal) através da API ViaCEP. Nenhuma configuração necessária.

### Tailwind CSS v4
Esta aplicação utiliza a versão mais recente do Tailwind CSS (v4) que traz:
- **Nova arquitetura**: Plugin nativo para Vite (@tailwindcss/vite)
- **Configuração simplificada**: Sem necessidade de tailwind.config.js ou postcss.config.js
- **Performance melhorada**: Compilação mais rápida e otimizada
- **Import único**: Apenas `@import "tailwindcss"` no CSS principal

## 📱 Funcionalidades da Aplicação

### Gerenciamento de Usuários
- Criar, ler, atualizar e excluir usuários (soft delete)
- Autenticação e autorização de usuários
- Gerenciamento de status (ativo/inativo)
- Sistema de login baseado em documento

### Gerenciamento de Clientes
- Gerenciamento completo do perfil do cliente
- Validação de CPF brasileiro
- Busca de endereço via integração CEP
- Gerenciamento de informações de contato
- Rastreamento de status de locação ativa

### Catálogo de Filmes
- Buscar filmes por título
- Filtrar por ano de lançamento
- Visualizar informações detalhadas do filme
- Integração com base de dados OMDb
- Exibição de pôster do filme

### Sistema de Locação
- Criar novas locações com múltiplos filmes
- Verificação de disponibilidade do cliente
- Gerenciamento de período de locação
- Processamento de devolução
- Rastreamento de locações em atraso
- Histórico de locações

### Dashboard
- Estatísticas de visão geral
- Botões de ação rápida
- Rastreamento de atividade recente
- Notificações de devoluções próximas

## 🧪 Testes

A aplicação inclui testes abrangentes:

### Testes Unitários
- Teste de componentes com Vue Test Utils
- Teste de stores com Pinia
- Teste de serviços com APIs mockadas

### Testes E2E
- Fluxos completos do usuário
- Fluxos de autenticação
- Operações CRUD
- Validações de formulário

Executar testes:
```bash
npm run test:unit    # Testes unitários
npm run test:e2e     # Testes E2E
```

## 📚 Documentação da API

### Integração API OMDb
- **Endpoint**: `https://www.omdbapi.com/`
- **Uso**: Busca e detalhes de filmes
- **Limite de Taxa**: 1000 requisições por dia (versão gratuita)

### Integração ViaCEP
- **Endpoint**: `https://viacep.com.br/ws/`
- **Uso**: Busca de endereço brasileiro por código postal
- **Limite de Taxa**: Sem limite oficial

## 🤝 Diretrizes de Desenvolvimento

### Estilo de Código
- Seguir padrões da API de Composição Vue.js 3
- Usar interfaces TypeScript ao invés de types
- Implementar princípios de design atômico
- Escrever nomes de componentes descritivos
- Usar inglês americano para nomenclatura

### Fluxo Git
- Usar commits convencionais
- Criar branches de funcionalidade
- Escrever mensagens de commit significativas
- Incluir testes para novas funcionalidades

### Diretrizes de Componentes
- **Atoms**: Elementos UI básicos (botões, inputs)
- **Molecules**: Combinações simples de átomos
- **Organisms**: Seções UI complexas
- **Templates**: Layouts e estrutura de página

## 🚀 Implantação

### Build de Produção
```bash
npm run build
```

### Variáveis de Ambiente
- `VITE_OMDB_API_KEY`: Chave da API OMDb para busca de filmes

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.


## 🔄 Histórico de Versões

- **v1.0.0**: Lançamento inicial com funcionalidade principal
  - Gerenciamento de usuários e clientes
  - Sistema de busca de filmes e locação
  - Autenticação e autorização
  - Design responsivo

## 📝 Funcionalidades Implementadas

### ✅ Requisitos Obrigatórios
- **Vue.js 3**: ✅ Implementado com Composition API
- **Tailwind CSS**: ✅ Estilização completa e responsiva
- **TypeScript**: ✅ Tipagem completa em toda aplicação
- **Gerenciamento de Usuários**: ✅ CRUD completo com soft delete
- **Gerenciamento de Clientes**: ✅ CRUD completo com validações
- **API OMDb**: ✅ Integração para busca de filmes
- **Sistema de Locação**: ✅ Completo com validações de negócio
- **ViaCEP**: ✅ Integração para busca de endereços
- **Local Storage**: ✅ Persistência de todos os dados
- **Autenticação**: ✅ Login/logout com persistência
- **Notificações**: ✅ Feedback visual para todas as operações

### ✅ Requisitos Adicionais
- **Testes Unitários**: ✅ Estrutura preparada com Vitest
- **Responsividade**: ✅ Design mobile-first
- **Componentização**: ✅ Atomic Design implementado
- **Clean Code**: ✅ Código organizado e bem documentado

### 🎯 Validações de Negócio Implementadas
- Usuários inativos não podem fazer login
- Clientes com locação ativa não podem fazer nova locação
- Validação de documentos únicos
- Validação de CPF e email únicos para clientes
- Soft delete para usuários e clientes
- Controle de status de locações (alugado/entregue)
