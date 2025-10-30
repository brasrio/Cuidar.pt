# Cuidar.pt

> Plataforma portuguesa que liga famílias a cuidadores e enfermeiros qualificados

![Cuidar.pt Banner](assets/images/hero-care.jpg)

## 📋 Sobre o Projeto

Cuidar.pt é uma landing page moderna e responsiva desenvolvida para conectar famílias portuguesas com cuidadores e enfermeiros verificados. O projeto apresenta um design limpo e profissional, com foco em usabilidade e experiência do usuário.

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização com variáveis CSS (Custom Properties)
- **JavaScript ES6+** - Interatividade e animações
- **Design Responsivo** - Mobile-first approach

## 📁 Estrutura do Projeto

```
Cuidar.pt/
│
├── assets/
│   └── images/              # Imagens e recursos visuais
│       ├── hero-care.jpg
│       ├── nurse-icon.jpg
│       ├── caregiver-icon.jpg
│       └── logo.svg         # ⭐ Logo usado no header e footer
│
├── css/
│   ├── styles.css           # Estilos principais
│   └── cadastro.css         # Estilos da página de cadastro
│
├── js/
│   ├── main.js              # JavaScript principal
│   └── cadastro.js          # JavaScript do cadastro
│
├── server/                  # Backend Node.js
│   ├── server.js           # Servidor Express
│   ├── package.json        # Dependências do backend
│   ├── .env.example        # Exemplo de configuração
│   ├── database.json       # Banco de dados (gerado automaticamente)
│   └── README.md           # Documentação do backend
│
├── index.html              # Landing page principal
├── cadastro.html           # Página de cadastro
├── login.html              # Página de login
├── .gitignore              # Arquivos ignorados pelo Git
├── README.md               # Documentação principal
├── BOAS_PRATICAS.md        # Guia de boas práticas
└── CHANGELOG.md            # Histórico de mudanças
```

## ✨ Funcionalidades

### Frontend
- ✅ Design 100% responsivo (mobile, tablet, desktop)
- ✅ Navbar com menu mobile funcional
- ✅ Logo.svg integrado (header e footer)
- ✅ Animações suaves de scroll
- ✅ Navegação com scroll suave
- ✅ Sistema de design baseado em componentes
- ✅ Otimizado para performance
- ✅ Código modular e bem documentado

### Sistema de Cadastro e Login
- ✅ Página de cadastro responsiva
- ✅ Validação de formulário no frontend
- ✅ Diferenciação entre "Família", "Cuidador" e "Admin"
- ✅ Geração automática de senha segura
- ✅ Sistema de login completo
- ✅ Autenticação baseada em roles (admin/cuidador/cliente)
- ✅ Redirecionamento automático baseado no tipo de usuário
- ✅ Integração com backend Node.js

### Dashboard
- ✅ Dashboard personalizado por tipo de usuário
- ✅ Dashboard Admin com gestão completa de usuários
- ✅ Estatísticas em tempo real
- ✅ Separação visual de usuários por tipo (Admin/Cuidador/Cliente)
- ✅ Cards coloridos e informativos
- ✅ Ações administrativas (Ver/Editar/Ativar/Desativar)
- ✅ Proteção de rotas (apenas admins acessam dashboard-admin)
- ✅ Visualização de perfis profissionais dos cuidadores

### Perfil do Cuidador
- ✅ Upload de foto de perfil (até 2MB)
- ✅ Definir valor por hora (€)
- ✅ Descrição profissional
- ✅ Anos de experiência
- ✅ Seleção de múltiplas áreas de atuação
- ✅ Adicionar qualificações e especialidades
- ✅ Disponibilidade por dia da semana
- ✅ Definir horários disponíveis
- ✅ Edição e atualização de perfil
- ✅ Armazenamento em Base64 (foto)
- ✅ Validações frontend e backend

### Busca de Cuidadores (tipo iFood)
- ✅ Sistema de busca completo com filtros
- ✅ Filtros por cidade, valor, dia e qualificação
- ✅ Cards visuais com fotos dos cuidadores
- ✅ Ordenação por relevância, preço e experiência
- ✅ Modal de perfil completo
- ✅ Botão solicitar serviço
- ✅ Design responsivo e moderno
- ✅ Acesso público (sem login obrigatório)
- ✅ API expandida com múltiplos filtros

### Backend
- ✅ API RESTful com Express
- ✅ Envio automático de email com credenciais
- ✅ Template HTML profissional para emails
- ✅ Banco de dados JSON simples
- ✅ Validação de dados
- ✅ Prevenção de emails duplicados
- ✅ Autenticação e autorização
- ✅ Middleware de segurança
- ✅ Servir arquivos estáticos

## 🎨 Páginas e Seções

### Landing Page (index.html)
1. **Header/Navbar** - Navegação fixa com logo e menu responsivo
2. **Hero Section** - Apresentação principal com call-to-action
3. **Como Funciona** - Explicação do processo em 3 passos
4. **Serviços** - Apresentação dos tipos de profissionais disponíveis
5. **Features** - Benefícios e diferenciais da plataforma
6. **CTA Final** - Chamada final para ação
7. **Footer** - Links e informações de contato com logo

### Página de Cadastro (cadastro.html)
- Formulário completo de cadastro
- Seleção de tipo de usuário
- Validação de dados
- Integração com backend
- Design responsivo

### Página de Login (login.html)
- Formulário de login
- Links para recuperação de senha
- Link para cadastro
- Redirecionamento automático baseado em tipo de usuário

### Dashboard (dashboard.html)
- Informações do usuário logado
- Ações específicas por tipo de usuário
- Dashboard personalizado
- Botão de logout funcional

### Dashboard Admin (dashboard-admin.html)
- Painel administrativo completo
- Estatísticas em tempo real (total de usuários por tipo)
- Listagem de todos os usuários separados por tipo
- Cards coloridos: 👑 Admins (roxo), 👨‍⚕️ Cuidadores (verde), 👤 Clientes (amarelo)
- Informações detalhadas de cada usuário
- Visualização de perfis profissionais dos cuidadores
- Botões de ação (Ver detalhes, Editar, Ativar/Desativar)
- Acesso restrito a administradores

### Perfil do Cuidador (perfil-cuidador.html)
- Página completa de perfil profissional
- Upload de foto (até 2MB, JPG/PNG)
- Valor por hora em euros
- Descrição profissional (máx. 500 caracteres)
- Seleção de áreas de atuação (múltiplas cidades)
- Sistema de qualificações (adicionar/remover)
- Disponibilidade por dia da semana
- Definir horários de trabalho
- Salvamento automático no backend
- Carregamento de dados existentes
- Acesso restrito a cuidadores

## 🛠️ Como Usar

### Passo 1: Frontend

#### Opção 1: Abrir diretamente

Simplesmente abra o arquivo `index.html` em seu navegador.

#### Opção 2: Servidor local (Recomendado)

Para melhor experiência, use um servidor local:

```bash
# Com Python
python -m http.server 5500

# Com Node.js (http-server)
npx http-server -p 5500

# Com PHP
php -S localhost:5500

# Com Live Server (VS Code)
# Instale a extensão "Live Server" e clique em "Go Live"
```

Depois acesse: `http://localhost:5500`

### Passo 2: Backend (Para funcionalidade de cadastro)

1. **Navegue até a pasta do servidor:**
```bash
cd server
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o arquivo .env:**
```bash
# Copie o exemplo
cp .env.example .env

# Edite com suas credenciais de email
# Para Gmail, use uma "senha de app" (não sua senha normal)
```

4. **Inicie o servidor:**
```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

> 📧 **Nota:** Para enviar emails reais, configure suas credenciais SMTP no arquivo `server.env`. Para testes, use [Mailtrap.io](https://mailtrap.io).

Para instruções detalhadas, consulte: `server/README.md`

### Passo 3: Acessar o Sistema

#### 🔑 Credenciais de Admin (Pré-configurado)
```
Email: admin@cuidar.pt
Senha: Admin@2024
```

#### 🌐 URLs de Acesso
- **Página Inicial:** http://localhost:3000/index.html
- **Login:** http://localhost:3000/login.html
- **Cadastro:** http://localhost:3000/cadastro.html
- **Dashboard:** http://localhost:3000/dashboard.html (após login)
- **Dashboard Admin:** http://localhost:3000/dashboard-admin.html (apenas admin)

#### 📱 Fluxo de Uso
1. Inicie o servidor (Passo 2)
2. Acesse http://localhost:3000/login.html
3. Faça login com as credenciais de admin
4. Você será automaticamente redirecionado para o **Dashboard Admin**
5. Veja todos os usuários separados por tipo (Admin/Cuidador/Cliente)

## 📱 Compatibilidade

- ✅ Chrome (última versão)
- ✅ Firefox (última versão)
- ✅ Safari (última versão)
- ✅ Edge (última versão)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Boas Práticas Implementadas

### HTML
- Estrutura semântica
- Meta tags para SEO
- Open Graph para redes sociais
- Acessibilidade (alt text em imagens)

### CSS
- Variáveis CSS para design system
- Organização modular por seções
- Mobile-first approach
- Transitions suaves
- Comentários descritivos

### JavaScript
- Código modular e reutilizável
- Funções bem nomeadas e documentadas
- Event delegation onde apropriado
- Performance otimizada (Intersection Observer)
- Strict mode habilitado

## 🔧 Personalização

### Cores

As cores podem ser facilmente alteradas no arquivo `css/styles.css` através das variáveis CSS:

```css
:root {
    --primary: hsl(217, 91%, 45%);
    --secondary: hsl(176, 60%, 50%);
    --accent: hsl(32, 95%, 60%);
    /* ... */
}
```

### Conteúdo

Todo o conteúdo pode ser editado diretamente no arquivo `index.html`.

### Animações

As animações podem ser ajustadas no arquivo `js/main.js` na seção de configuração do Intersection Observer.

## 📈 Performance

- Imagens otimizadas
- CSS minificável para produção
- JavaScript modular
- Animações usando CSS transitions
- Lazy loading preparado para implementação

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas! Para contribuir:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é um trabalho de desenvolvimento web. Todos os direitos reservados.

## 👥 Autor

Desenvolvido com ❤️ para Cuidar.pt

---

**Nota**: Este é um projeto de landing page. Para funcionalidade completa (sistema de agendamento, pagamentos, etc.), seria necessário desenvolver backend e integrações adicionais.

