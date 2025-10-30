/**
 * Cuidar.pt - API Serverless para Vercel
 * Funções serverless com MongoDB Atlas
 */

const nodemailer = require('nodemailer');
const db = require('./db');

// Usa MongoDB se MONGODB_URI estiver configurado, senão usa fallback em memória
const USE_MONGODB = !!process.env.MONGODB_URI;

// Fallback em memória (apenas para desenvolvimento/teste)
let memoryDB = {
    users: [
        {
            id: "admin-1730000000000",
            nome: "Administrador",
            email: "admin@cuidar.pt",
            telefone: "+351000000000",
            distrito: "Lisboa",
            cidade: "Lisboa",
            userType: "admin",
            role: "admin",
            senha: "Admin@2024",
            isActive: true,
            createdAt: "2024-10-30T00:00:00.000Z",
            updatedAt: "2024-10-30T00:00:00.000Z"
        }
    ]
};

console.log(`🗄️  Usando banco: ${USE_MONGODB ? 'MongoDB Atlas' : 'Memória (temporário)'}`);

// Helper para obter usuários
async function getAllUsers() {
    if (USE_MONGODB) {
        return await db.getAllUsers();
    }
    return memoryDB.users;
}

// Helper para buscar usuário por email
async function getUserByEmail(email) {
    if (USE_MONGODB) {
        return await db.getUserByEmail(email);
    }
    return memoryDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Helper para buscar usuário por ID
async function getUserById(id) {
    if (USE_MONGODB) {
        return await db.getUserById(id);
    }
    return memoryDB.users.find(u => u.id === id);
}

// Helper para criar usuário
async function createUser(userData) {
    if (USE_MONGODB) {
        return await db.createUser(userData);
    }
    memoryDB.users.push(userData);
    return userData;
}

// Helper para atualizar usuário
async function updateUser(id, updateData) {
    if (USE_MONGODB) {
        return await db.updateUser(id, updateData);
    }
    const index = memoryDB.users.findIndex(u => u.id === id);
    if (index !== -1) {
        memoryDB.users[index] = { ...memoryDB.users[index], ...updateData };
        return memoryDB.users[index];
    }
    return null;
}

// Helper para listar cuidadores
async function getActiveCuidadores() {
    if (USE_MONGODB) {
        return await db.getActiveCuidadores();
    }
    return memoryDB.users.filter(u => 
        (u.role === 'cuidador' || u.userType === 'cuidador') && 
        (u.isActive !== false)
    );
}

// Configuração do email
function getEmailTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
        port: parseInt(process.env.SMTP_PORT || '2525'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

// Handler principal da API
module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url, method, query } = req;
    
    // Extrai o path removendo /api e query params
    let path = url.split('?')[0].replace('/api', '') || '/';
    
    // Se não tem path, usa a raiz
    if (!path || path === '/api') {
        path = '/';
    }

    console.log(`📥 ${method} ${path}`);

    try {
        // Root / Health check
        if (method === 'GET' && (path === '/' || path === '/health')) {
            return res.status(200).json({ 
                status: 'ok', 
                message: 'API Cuidar.pt está funcionando!',
                timestamp: new Date().toISOString(),
                path: path,
                url: url
            });
        }

        // Login
        if (method === 'POST' && path === '/login') {
            const { email, senha } = req.body;
            
            const user = await getUserByEmail(email);

            if (!user || user.senha !== senha) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou senha incorretos'
                });
            }

            if (user.isActive === false) {
                return res.status(403).json({
                    success: false,
                    message: 'Usuário desativado. Entre em contato com o suporte.'
                });
            }

            console.log(`✅ Login realizado: ${email}`);

            const { senha: _, ...userWithoutPassword } = user;
            return res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso!',
                user: userWithoutPassword
            });
        }

        // Cadastro
        if (method === 'POST' && path === '/cadastro') {
            const { nome, email, telefone, distrito, cidade, userType, senha } = req.body;

            // Verifica se o email já existe
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Este email já está cadastrado'
                });
            }

            // Determina o role baseado no userType
            let role = 'cliente';
            if (userType === 'cuidador') role = 'cuidador';
            if (userType === 'admin') role = 'admin';

            // Cria novo usuário
            const newUser = {
                id: Date.now().toString(),
                nome,
                email: email.toLowerCase(),
                telefone,
                distrito,
                cidade,
                userType,
                senha,
                role,
                isActive: true
            };

            await createUser(newUser);

            console.log(`✅ Cadastro realizado para ${email}`);

            // Enviar email (apenas se as credenciais estiverem configuradas)
            if (process.env.SMTP_USER && process.env.SMTP_PASS) {
                try {
                    const transporter = getEmailTransporter();
                    await transporter.sendMail({
                        from: `"${process.env.EMAIL_FROM_NAME || 'Cuidar.pt'}" <${process.env.EMAIL_FROM || 'noreply@cuidar.pt'}>`,
                        to: email,
                        subject: 'Bem-vindo ao Cuidar.pt! 🎉',
                        html: `
                            <h1>Bem-vindo(a), ${nome}!</h1>
                            <p>Seu cadastro foi realizado com sucesso na plataforma Cuidar.pt.</p>
                            <p><strong>Sua senha de acesso:</strong> ${senha}</p>
                            <p>Acesse agora: <a href="https://cuidar-pt.vercel.app/login.html">Fazer Login</a></p>
                        `
                    });
                    console.log('📧 Email de boas-vindas enviado com sucesso!');
                } catch (emailError) {
                    console.error('Erro ao enviar email:', emailError);
                }
            }

            const { senha: _, ...userWithoutPassword } = newUser;
            return res.status(201).json({
                success: true,
                message: 'Cadastro realizado com sucesso! Verifique seu email.',
                user: userWithoutPassword
            });
        }

        // Listar usuários (admin)
        if (method === 'GET' && path === '/users') {
            const users = await getAllUsers();
            const usersWithoutPasswords = users.map(({ senha, _id, ...user }) => user);
            return res.status(200).json({
                success: true,
                users: usersWithoutPasswords
            });
        }

        // Listar cuidadores
        if (method === 'GET' && path.startsWith('/cuidadores')) {
            const cuidadores = await getActiveCuidadores();

            const cuidadoresWithoutPasswords = cuidadores.map(({ senha, _id, ...cuidador }) => cuidador);
            return res.status(200).json({
                success: true,
                cuidadores: cuidadoresWithoutPasswords,
                total: cuidadoresWithoutPasswords.length
            });
        }

        // Buscar usuário específico
        if (method === 'GET' && path.startsWith('/users/')) {
            const userId = path.split('/users/')[1];
            const user = await getUserById(userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            const { senha, _id, ...userWithoutPassword } = user;
            return res.status(200).json({
                success: true,
                user: userWithoutPassword
            });
        }

        // Atualizar usuário
        if (method === 'PUT' && path.startsWith('/users/')) {
            const userId = path.split('/users/')[1];
            
            const updatedUser = await updateUser(userId, req.body);
            
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            const { senha, _id, ...userWithoutPassword } = updatedUser;
            return res.status(200).json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                user: userWithoutPassword
            });
        }

        // Rota não encontrada
        return res.status(404).json({
            success: false,
            message: 'Rota não encontrada',
            debug: {
                path: path,
                method: method,
                url: url
            }
        });

    } catch (error) {
        console.error('Erro na API:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

