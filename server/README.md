# 📧 Servidor Cuidar.pt - Configuração de Email

## ⚡ Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Obter Credenciais SMTP do Mailtrap

**Login no Mailtrap:**
- Site: https://mailtrap.io/signin
- Email: brasriocg@gmail.com
- Senha: Dido@@300123

**Obter credenciais SMTP:**
1. Faça login no Mailtrap
2. Menu lateral → **"Sending Domains"**
3. Clique em **"demomailtrap.co"**
4. Aba **"SMTP Settings"**
5. Copie a **senha/password** que aparecer

### 3. Atualizar o arquivo `server.env` (na raiz do projeto)

Cole a senha SMTP copiada:

```env
SMTP_PASS=COLE_A_SENHA_SMTP_AQUI
```

### 4. Testar a configuração
```bash
node test-email.js
```

✅ Se aparecer "Email enviado com sucesso", está pronto!

### 5. Iniciar o servidor
```bash
npm start
```

## 🧪 Teste de Email

Execute `node test-email.js` para validar as credenciais antes de iniciar o servidor.

## 📁 Arquivos Importantes

- **server.js** - Servidor principal
- **test-email.js** - Script de teste de email
- **database.json** - Banco de dados local
- **server.env** (na raiz) - Configurações de ambiente

## 🔧 Estrutura da API

### POST /api/cadastro
Registra um novo usuário e envia email de boas-vindas

**Body:**
```json
{
  "nome": "Nome Completo",
  "email": "email@exemplo.com",
  "telefone": "123456789",
  "cidade": "Lisboa",
  "userType": "cuidador",
  "senha": "senha123"
}
```

### GET /api/health
Verifica se o servidor está funcionando

## 🆘 Problemas?

**Erro "Invalid login"**
→ Atualize a senha SMTP no arquivo `server.env`

**Erro "Missing credentials"**
→ Verifique se todas as variáveis estão no arquivo `server.env`
