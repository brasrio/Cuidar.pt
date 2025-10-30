/**
 * Cuidar.pt - API Serverless para Vercel
 * Funções serverless para processamento de cadastros, login e API
 */

const path = require('path');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');

// Helper para ler o banco de dados
async function readDatabase() {
    try {
        const dbPath = path.join(process.cwd(), 'server', 'database.json');
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler database.json:', error);
        return { users: [] };
    }
}

// Helper para salvar no banco de dados
async function saveDatabase(data) {
    try {
        const dbPath = path.join(process.cwd(), 'server', 'database.json');
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Erro ao salvar database.json:', error);
        return false;
    }
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
            const db = await readDatabase();
            
            const user = db.users.find(u => 
                u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
            );

            if (!user) {
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
            const db = await readDatabase();

            // Verifica se o email já existe
            const emailExists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (emailExists) {
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
                email,
                telefone,
                distrito,
                cidade,
                userType,
                senha,
                role,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            db.users.push(newUser);
            await saveDatabase(db);

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
            const db = await readDatabase();
            const usersWithoutPasswords = db.users.map(({ senha, ...user }) => user);
            return res.status(200).json({
                success: true,
                users: usersWithoutPasswords
            });
        }

        // Listar cuidadores
        if (method === 'GET' && path.startsWith('/cuidadores')) {
            const db = await readDatabase();
            let cuidadores = db.users.filter(u => 
                (u.role === 'cuidador' || u.userType === 'cuidador') && 
                (u.isActive !== false)
            );

            const cuidadoresWithoutPasswords = cuidadores.map(({ senha, ...cuidador }) => cuidador);
            return res.status(200).json({
                success: true,
                cuidadores: cuidadoresWithoutPasswords,
                total: cuidadoresWithoutPasswords.length
            });
        }

        // Buscar usuário específico
        if (method === 'GET' && path.startsWith('/users/')) {
            const userId = path.split('/users/')[1];
            const db = await readDatabase();
            const user = db.users.find(u => u.id === userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            const { senha, ...userWithoutPassword } = user;
            return res.status(200).json({
                success: true,
                user: userWithoutPassword
            });
        }

        // Atualizar usuário
        if (method === 'PUT' && path.startsWith('/users/')) {
            const userId = path.split('/users/')[1];
            const db = await readDatabase();
            const userIndex = db.users.findIndex(u => u.id === userId);
            
            if (userIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            // Atualiza os dados do usuário
            db.users[userIndex] = {
                ...db.users[userIndex],
                ...req.body,
                updatedAt: new Date().toISOString()
            };

            await saveDatabase(db);

            const { senha, ...userWithoutPassword } = db.users[userIndex];
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

