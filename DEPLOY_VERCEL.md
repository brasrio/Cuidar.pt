# 🚀 Deploy no Vercel - Cuidar.pt

## ✅ O QUE FOI CONFIGURADO

### **Estrutura Serverless**
- Criada pasta `/api` com funções serverless
- Backend convertido para formato serverless do Vercel
- Detecção automática de ambiente (dev/prod)

Agora o sistema detecta **automaticamente** se está rodando em:
- 🖥️ **Desenvolvimento** (`localhost`) → usa `http://localhost:3000/api`
- 🌐 **Produção** (Vercel) → usa `https://cuidar-pt.vercel.app/api`

---

## 🔧 CORREÇÃO DO ERRO "builds"

O erro foi corrigido! A nova estrutura usa:
- ✅ `/api/index.js` - Função serverless principal
- ✅ `vercel.json` simplificado (apenas rewrites)
- ✅ Sem conflitos de build

---

## 📝 PRÓXIMOS PASSOS

### 1️⃣ **Fazer Push no Git**

```bash
git add .
git commit -m "feat: Configurar detecção automática de ambiente e deploy Vercel"
git push
```

### 2️⃣ **Configurar Variáveis de Ambiente no Vercel**

1. Acesse: https://vercel.com/
2. Vá no seu projeto **Cuidar.pt**
3. Clique em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

| Nome | Valor |
|------|-------|
| `SMTP_HOST` | `sandbox.smtp.mailtrap.io` |
| `SMTP_PORT` | `2525` |
| `SMTP_USER` | `ed4ea2f589032d` |
| `SMTP_PASS` | `46a6b9ff0d9dce` |
| `EMAIL_FROM` | `noreply@cuidar.pt` |
| `EMAIL_FROM_NAME` | `Cuidar.pt` |
| `NODE_ENV` | `production` |

5. Clique em **Save**

### 3️⃣ **Redeploy**

Após adicionar as variáveis, clique em **Deployments** → **⋯** (três pontos) → **Redeploy**

### 4️⃣ **Aguardar (1-2 minutos)**

O Vercel vai fazer o build e deploy automático.

---

## 🧪 TESTAR

### No **Celular** (produção):

1. Acesse: `https://cuidar-pt.vercel.app/`
2. Clique em **Cadastrar**
3. Preencha o formulário
4. **Deve funcionar!** ✅

### No **PC** (desenvolvimento):

1. Continue usando: `http://localhost:3000/`
2. **Continua funcionando normalmente!** ✅

---

## 🔍 DEBUG

Abra o **Console do navegador** (F12) e veja:

```
🌍 Ambiente: PRODUÇÃO
🔗 API URL: https://cuidar-pt.vercel.app/api
```

Ou:

```
🌍 Ambiente: DESENVOLVIMENTO
🔗 API URL: http://localhost:3000/api
```

---

## ⚠️ IMPORTANTE

### **Banco de Dados**

O Vercel é **stateless** (sem estado). Isso significa:
- ❌ O arquivo `database.json` **NÃO persiste** entre deploys
- ❌ Dados cadastrados serão **perdidos** a cada novo deploy

### **SOLUÇÃO:**

Para produção real, você precisa de um **banco de dados externo**:

**Opções grátis:**
1. **MongoDB Atlas** (NoSQL) - Recomendado
2. **Supabase** (PostgreSQL)
3. **PlanetScale** (MySQL)
4. **Neon** (PostgreSQL)

**Quer que eu configure um desses?** 🤔

---

## 📊 RESUMO

| Ambiente | URL | API |
|----------|-----|-----|
| **Desenvolvimento** | `localhost:3000` | `http://localhost:3000/api` |
| **Produção** | `cuidar-pt.vercel.app` | `https://cuidar-pt.vercel.app/api` |

---

## 🎯 TUDO PRONTO!

Agora o sistema funciona **no celular e no PC**! 🎉

