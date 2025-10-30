# 🚀 Início Rápido - Cuidar.pt

Guia rápido para colocar o projeto funcionando em minutos!

## 📋 Pré-requisitos

- ✅ Navegador moderno (Chrome, Firefox, Safari, Edge)
- ✅ Node.js 14+ (apenas para funcionalidade de cadastro)
- ✅ Editor de código (VS Code recomendado)

## ⚡ Instalação em 3 Passos

### 1️⃣ Frontend (Landing Page)

#### Opção A: VS Code com Live Server (Mais Fácil)

1. Abra a pasta do projeto no VS Code
2. Instale a extensão "Live Server"
3. Clique com botão direito em `index.html`
4. Selecione "Open with Live Server"
5. ✅ Pronto! O site abrirá em `http://localhost:5500`

#### Opção B: Navegador (Sem servidor)

1. Abra o arquivo `index.html` diretamente no navegador
2. ⚠️ Nota: Algumas funcionalidades podem não funcionar

### 2️⃣ Backend (Sistema de Cadastro)

Abra um novo terminal e execute:

```bash
# 1. Entre na pasta do servidor
cd server

# 2. Instale as dependências (primeira vez apenas)
npm install

# 3. Inicie o servidor
npm start
```

✅ Servidor rodando em: `http://localhost:3000`

### 3️⃣ Configurar Email (Opcional - Para Testes)

#### Opção A: Mailtrap (Recomendado para Desenvolvimento)

1. Acesse [mailtrap.io](https://mailtrap.io) e crie uma conta grátis
2. Copie as credenciais SMTP do inbox de teste
3. Na pasta `server`, crie um arquivo `.env`:

```env
PORT=3000
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
EMAIL_USER=seu-usuario-mailtrap
EMAIL_PASS=sua-senha-mailtrap
```

4. Reinicie o servidor

#### Opção B: Gmail (Para Produção)

1. Ative a verificação em 2 etapas no Google
2. Gere uma senha de app: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Crie o arquivo `.env`:

```env
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app-gerada
```

## 🎯 Como Testar

### Teste 1: Landing Page

1. Acesse `http://localhost:5500`
2. Verifique se a navbar aparece com o logo
3. Teste o menu mobile (redimensione a janela)
4. Role a página e veja as animações
5. Clique nos botões de navegação

### Teste 2: Sistema de Cadastro

1. Na landing page, clique em "Encontrar Cuidador" ou "Tornar-me Cuidador"
2. Preencha o formulário de cadastro
3. Clique em "Criar Minha Conta"
4. Verifique o email recebido (Mailtrap ou Gmail)
5. Use as credenciais para fazer login

### Teste 3: Responsividade

Teste em diferentes tamanhos:

- **Desktop**: 1920x1080
- **Tablet**: 768x1024
- **Mobile**: 375x667

Ou use DevTools: `F12` → `Ctrl+Shift+M` (Toggle device toolbar)

## 🔍 Checklist de Funcionalidades

Verifique se tudo está funcionando:

### Landing Page
- [ ] Navbar fixa no topo
- [ ] Logo aparece no header
- [ ] Menu mobile funciona (hamburger)
- [ ] Scroll suave ao clicar em links
- [ ] Animações ao rolar a página
- [ ] Botões redirecionam para cadastro
- [ ] Footer com logo

### Página de Cadastro
- [ ] Formulário carrega corretamente
- [ ] Seleção de tipo (Família/Cuidador)
- [ ] Validação de campos
- [ ] Envio de formulário funciona
- [ ] Mensagem de sucesso aparece

### Backend
- [ ] Servidor inicia sem erros
- [ ] Health check responde: `http://localhost:3000/api/health`
- [ ] Email é enviado após cadastro
- [ ] Dados são salvos em `database.json`

## 🐛 Problemas Comuns

### Problema: "Cannot GET /"
**Solução:** Certifique-se de que o servidor local está rodando.

### Problema: "CORS error"
**Solução:** Verifique se o backend está rodando na porta 3000.

### Problema: "Email não enviado"
**Solução:** 
1. Verifique as credenciais no `.env`
2. Use Mailtrap para testes
3. Verifique os logs do console

### Problema: "Module not found"
**Solução:**
```bash
cd server
rm -rf node_modules
npm install
```

### Problema: Navbar não aparece
**Solução:** Verifique se `css/styles.css` está carregando (F12 → Console).

### Problema: Logo não aparece
**Solução:** Verifique se `assets/images/logo.svg` existe.

## 📊 URLs Importantes

### Frontend
- Landing Page: `http://localhost:5500/index.html`
- Cadastro: `http://localhost:5500/cadastro.html`
- Login: `http://localhost:5500/login.html`

### Backend
- Health Check: `http://localhost:3000/api/health`
- API Cadastro: `POST http://localhost:3000/api/cadastro`

## 🎓 Próximos Passos

Depois que tudo estiver funcionando:

1. ✅ Explore o código em `js/main.js` e `js/cadastro.js`
2. ✅ Customize as cores em `css/styles.css` (variáveis CSS)
3. ✅ Adicione suas próprias imagens em `assets/images/`
4. ✅ Modifique o template de email em `server/server.js`
5. ✅ Implemente funcionalidade de login
6. ✅ Adicione mais páginas (dashboard, perfil, etc.)

## 📞 Precisa de Ajuda?

1. Consulte `README.md` para documentação completa
2. Veja `BOAS_PRATICAS.md` para entender o código
3. Leia `server/README.md` para detalhes do backend
4. Verifique o console do navegador (F12) para erros

## ✅ Tudo Funcionando?

Se todos os testes passaram, você está pronto! 🎉

Agora você pode:
- Personalizar o design
- Adicionar novas funcionalidades
- Fazer deploy para produção
- Integrar com banco de dados real

---

**Dica:** Use `Ctrl+C` no terminal para parar os servidores.

**Boa codificação! 🚀**

