# 🍃 MongoDB Atlas - Guia Passo a Passo

## ✅ ETAPA 1: CÓDIGO JÁ ESTÁ PRONTO!

Os seguintes arquivos foram criados/atualizados:
- ✅ `api/db.js` - Conexão com MongoDB
- ✅ `api/index.js` - API adaptada
- ✅ `api/package.json` - Dependências

---

## 📝 ETAPA 2: CRIAR CONTA MONGODB ATLAS (2 MINUTOS)

### **Passo 1: Acessar o site**
1. Abra: https://www.mongodb.com/cloud/atlas/register
2. Clique em **"Try Free"** ou **"Start Free"**

### **Passo 2: Criar conta**
Escolha uma opção:
- 🔵 Google
- 📧 Email

### **Passo 3: Questionário rápido**
- **What is your goal?** → "Learn MongoDB"
- **What type of application?** → "I'm just exploring"
- Clique em **"Finish"**

---

## 🗄️ ETAPA 3: CRIAR CLUSTER (BANCO DE DADOS)

### **Passo 1: Escolher plano FREE**
1. Você verá opções de planos
2. Escolha **"M0 FREE"** (512MB grátis forever!)
3. Clique em **"Create"** ou **"Create Deployment"**

### **Passo 2: Configurar provedor**
- **Provider**: AWS (recomendado)
- **Region**: Escolha o mais próximo:
  - 🇧🇷 Brasil: "São Paulo (sa-east-1)"
  - 🇵🇹 Portugal: "Frankfurt (eu-central-1)"
- **Cluster Name**: `cuidar-pt` (ou deixe o padrão)

Clique em **"Create"** novamente!

### **Passo 3: Criar usuário do banco**
Uma tela pop-up vai aparecer:

1. **Username**: `cuidar-admin`
2. **Password**: Clique em **"Autogenerate Secure Password"**
3. **IMPORTANTE**: 📋 **COPIE A SENHA** e guarde!
4. Clique em **"Create Database User"**

### **Passo 4: Configurar IP de acesso**
Na mesma tela:

1. **Where would you like to connect from?**
2. Escolha: **"My Local Environment"**
3. **IP Access List**: Adicione `0.0.0.0/0` (permite qualquer IP)
   - Clique em **"Add Entry"** ou **"Add IP Address"**
   - Digite: `0.0.0.0/0`
   - Description: "Vercel/Qualquer lugar"
4. Clique em **"Finish and Close"**

---

## 🔗 ETAPA 4: PEGAR STRING DE CONEXÃO

### **Passo 1: Ir para Database**
1. No menu lateral, clique em **"Database"**
2. Você verá seu cluster (pode estar sendo criado, aguarde 1-2 min)

### **Passo 2: Conectar**
1. Clique no botão **"Connect"** do seu cluster
2. Escolha: **"Drivers"**
3. Selecione:
   - **Driver**: Node.js
   - **Version**: 6.3 or later

### **Passo 3: Copiar a Connection String**
Você verá algo assim:

```
mongodb+srv://cuidar-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

1. 📋 **COPIE essa string**
2. **SUBSTITUA** `<password>` pela senha que você copiou no Passo 3!

**Exemplo:**
```
Se a senha era: aBc123XyZ
Mude de: mongodb+srv://cuidar-admin:<password>@cluster0...
Para: mongodb+srv://cuidar-admin:aBc123XyZ@cluster0...
```

---

## ⚙️ ETAPA 5: CONFIGURAR NO VERCEL

### **Passo 1: Acessar Vercel**
1. Vá para: https://vercel.com/
2. Entre no seu projeto **cuidar-pt**

### **Passo 2: Adicionar variável**
1. Clique em **"Settings"** (⚙️ no topo)
2. No menu lateral: **"Environment Variables"**
3. Clique em **"Add New"**

### **Passo 3: Adicionar MONGODB_URI**
- **Key (Name)**: `MONGODB_URI`
- **Value**: Cole a string de conexão que você editou
- **Environment**: Marque todas (Production, Preview, Development)
- Clique em **"Save"**

**Deve ficar assim:**
```
Key: MONGODB_URI
Value: mongodb+srv://cuidar-admin:aBc123XyZ@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 🚀 ETAPA 6: FAZER DEPLOY

### **Opção A: Pelo Git (Recomendado)**

```bash
git add .
git commit -m "feat: Integração com MongoDB Atlas"
git push
```

O Vercel faz deploy automático!

### **Opção B: Redeploy Manual**
1. No Vercel, vá em **"Deployments"**
2. Clique nos **três pontos** (⋯) do último deploy
3. Clique em **"Redeploy"**

---

## 🧪 ETAPA 7: TESTAR!

### **Aguarde 1-2 minutos** (deploy completo)

Então teste:

1. **No celular**: `https://cuidar-pt.vercel.app/cadastro.html`
2. Preencha o formulário
3. Clique em **"Criar Minha Conta"**
4. **DEVE FUNCIONAR!** ✅

### **Verificar se salvou:**
1. Volte pro MongoDB Atlas
2. Clique em **"Browse Collections"**
3. Você verá:
   - Database: `cuidar-pt`
   - Collection: `users`
   - Documentos: O usuário que você cadastrou!

---

## 🎯 PRONTO!

Agora seu sistema está usando MongoDB Atlas:
- ✅ Dados **persistem** para sempre
- ✅ **Grátis** até 512MB
- ✅ Funciona no **celular e PC**
- ✅ Sistema **profissional**

---

## ❓ PROBLEMAS?

### **"Authentication failed"**
- Senha errada na string de conexão
- Certifique-se que substituiu `<password>` corretamente

### **"IP not whitelisted"**
- No MongoDB Atlas, vá em **Network Access**
- Adicione `0.0.0.0/0`

### **"Cannot connect"**
- Aguarde 1-2 minutos (cluster pode estar iniciando)
- Verifique se MONGODB_URI está no Vercel

---

## 📊 VISUALIZAR DADOS

Para ver seus dados no MongoDB:

1. MongoDB Atlas → **Database**
2. Clique em **"Browse Collections"**
3. Veja todos os usuários cadastrados!

É como um Excel dos seus dados! 😊

---

**Qualquer dúvida, me chame!** 🚀

