/**
 * Cuidar.pt - Backend Server
 * Servidor Node.js para processamento de cadastros e envio de emails
 */

const path = require('path');

// Carrega variáveis de ambiente do arquivo server.env (na raiz do projeto)
require('dotenv').config({ path: path.join(__dirname, '..', 'server.env') });

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================================================
// MIDDLEWARES
// =============================================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta raiz do projeto
app.use(express.static(path.join(__dirname, '..')));

// Log de requisições para debug
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// =============================================================================
// CONFIGURAÇÃO DE EMAIL
// =============================================================================

// Configuração do Mailtrap usando variáveis de ambiente
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'live.smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true para 465, false para outras portas
    auth: {
        user: process.env.SMTP_USER || 'api',
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false // Para desenvolvimento
    }
});

// Verifica a conexão do email
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Erro na configuração de email:', error.message);
        console.log('ℹ️ Verifique as credenciais no arquivo server.env');
        console.log(`📧 Host: ${process.env.SMTP_HOST}`);
        console.log(`🔧 User: ${process.env.SMTP_USER}`);
    } else {
        console.log('✅ Servidor de email pronto e conectado!');
        console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`);
    }
});

// =============================================================================
// BANCO DE DADOS (JSON SIMPLES)
// =============================================================================

const DB_FILE = path.join(__dirname, 'database.json');

/**
 * Inicializa o banco de dados
 */
const initDatabase = async () => {
    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, JSON.stringify({ users: [] }, null, 2));
        console.log('✅ Banco de dados criado');
    }
};

/**
 * Lê o banco de dados
 * @returns {Object}
 */
const readDatabase = async () => {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler banco de dados:', error);
        return { users: [] };
    }
};

/**
 * Escreve no banco de dados
 * @param {Object} data
 */
const writeDatabase = async (data) => {
    try {
        await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Erro ao escrever no banco de dados:', error);
        throw error;
    }
};

/**
 * Verifica se email já existe
 * @param {string} email
 * @returns {boolean}
 */
const emailExists = async (email) => {
    const db = await readDatabase();
    return db.users.some(user => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Salva usuário no banco de dados
 * @param {Object} userData
 */
const saveUser = async (userData) => {
    const db = await readDatabase();
    
    // Define role baseado no userType
    let role = 'cliente'; // padrão
    if (userData.userType === 'cuidador') {
        role = 'cuidador';
    } else if (userData.userType === 'admin') {
        role = 'admin';
    }
    
    const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    await writeDatabase(db);
    
    return newUser;
};

/**
 * Busca usuário por ID
 * @param {string} userId
 * @returns {Object|null}
 */
const getUserById = async (userId) => {
    const db = await readDatabase();
    return db.users.find(u => u.id === userId);
};

/**
 * Atualiza usuário
 * @param {string} userId
 * @param {Object} updates
 */
const updateUser = async (userId, updates) => {
    const db = await readDatabase();
    const userIndex = db.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
    }
    
    // Campos que não podem ser alterados
    const protectedFields = ['id', 'role', 'createdAt', 'email'];
    protectedFields.forEach(field => delete updates[field]);
    
    db.users[userIndex] = {
        ...db.users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    
    await writeDatabase(db);
    return db.users[userIndex];
};

// =============================================================================
// TEMPLATES DE EMAIL
// =============================================================================

/**
 * Template de email de boas-vindas
 * @param {Object} userData
 * @returns {string}
 */
const getWelcomeEmailHTML = (userData) => {
    const isCuidador = userData.userType === 'cuidador';
    
    return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao Cuidar.pt</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e5ede 0%, #3abebd 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Bem-vindo ao Cuidar.pt!</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #1e3a5f; margin-top: 0;">Olá, ${userData.nome}!</h2>
                            
                            <p style="color: #5a7184; font-size: 16px; line-height: 1.6;">
                                Estamos muito felizes em tê-lo conosco! Seu cadastro foi realizado com sucesso.
                            </p>
                            
                            ${isCuidador ? `
                            <p style="color: #5a7184; font-size: 16px; line-height: 1.6;">
                                Como <strong>cuidador profissional</strong>, você agora faz parte de uma comunidade dedicada 
                                a proporcionar cuidados de qualidade para famílias em todo Portugal.
                            </p>
                            ` : `
                            <p style="color: #5a7184; font-size: 16px; line-height: 1.6;">
                                Agora você pode encontrar <strong>cuidadores qualificados</strong> para seus entes queridos 
                                com facilidade e segurança.
                            </p>
                            `}
                            
                            <div style="background-color: #f0f7ff; border-left: 4px solid #1e5ede; padding: 20px; margin: 30px 0;">
                                <h3 style="color: #1e3a5f; margin-top: 0; font-size: 18px;">Suas Credenciais de Acesso</h3>
                                <p style="color: #5a7184; margin: 10px 0;"><strong>Email:</strong> ${userData.email}</p>
                                <p style="color: #5a7184; margin: 10px 0;"><strong>Senha:</strong> <code style="background-color: #e0e0e0; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${userData.senha}</code></p>
                                <p style="color: #e67e22; font-size: 14px; margin-top: 15px;">
                                    ⚠️ Por segurança, recomendamos que você altere sua senha após o primeiro login.
                                </p>
                            </div>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:5500/login.html" style="display: inline-block; background: linear-gradient(135deg, #1e5ede 0%, #3abebd 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                    Fazer Login Agora
                                </a>
                            </div>
                            
                            <h3 style="color: #1e3a5f; font-size: 18px; margin-top: 30px;">Próximos Passos:</h3>
                            <ul style="color: #5a7184; line-height: 1.8;">
                                ${isCuidador ? `
                                <li>Complete seu perfil profissional</li>
                                <li>Adicione suas qualificações e experiência</li>
                                <li>Configure sua disponibilidade</li>
                                <li>Comece a receber solicitações de famílias</li>
                                ` : `
                                <li>Explore os perfis de cuidadores disponíveis</li>
                                <li>Filtre por localização e especialidade</li>
                                <li>Agende uma consulta</li>
                                <li>Avalie os serviços recebidos</li>
                                `}
                            </ul>
                            
                            <p style="color: #5a7184; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                                Se tiver alguma dúvida, nossa equipe está disponível 24/7 para ajudá-lo.
                            </p>
                            
                            <p style="color: #5a7184; font-size: 16px; line-height: 1.6;">
                                Atenciosamente,<br>
                                <strong>Equipe Cuidar.pt</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="color: #8898aa; font-size: 14px; margin: 0;">
                                © 2024 Cuidar.pt - Todos os direitos reservados
                            </p>
                            <p style="color: #8898aa; font-size: 12px; margin: 10px 0 0 0;">
                                Este é um email automático, por favor não responda.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

// =============================================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// =============================================================================

/**
 * Middleware para verificar se usuário está autenticado
 */
const authenticateUser = async (req, res, next) => {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Não autorizado'
        });
    }
    
    const user = await getUserById(userId);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Usuário não encontrado'
        });
    }
    
    req.user = user;
    next();
};

/**
 * Middleware para verificar permissões de admin
 */
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado. Apenas administradores.'
        });
    }
    next();
};

/**
 * Middleware para verificar se usuário pode modificar o recurso
 */
const canModifyResource = (req, res, next) => {
    const targetUserId = req.params.userId || req.body.userId;
    
    // Admin pode modificar qualquer coisa
    if (req.user.role === 'admin') {
        return next();
    }
    
    // Usuário só pode modificar seus próprios dados
    if (req.user.id !== targetUserId) {
        return res.status(403).json({
            success: false,
            message: 'Você só pode modificar seus próprios dados'
        });
    }
    
    next();
};

// =============================================================================
// ROTAS PÚBLICAS
// =============================================================================

/**
 * Rota de health check
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando' });
});

/**
 * Rota de login
 */
app.post('/api/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Validação básica
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }
        
        // Busca usuário no banco
        const db = await readDatabase();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }
        
        // Verifica senha (em produção, use bcrypt!)
        if (user.senha !== senha) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }
        
        // Login bem-sucedido
        console.log(`✅ Login realizado: ${email}`);
        
        // Remove a senha da resposta
        const { senha: _, ...userWithoutPassword } = user;
        
        res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso!',
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao processar login'
        });
    }
});

/**
 * Rota de cadastro
 */
app.post('/api/cadastro', async (req, res) => {
    try {
        const { nome, email, telefone, cidade, userType, senha } = req.body;
        
        // Validação básica
        if (!nome || !email || !telefone || !cidade || !userType || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
        }
        
        // Verifica se email já existe
        if (await emailExists(email)) {
            return res.status(400).json({
                success: false,
                message: 'Este email já está cadastrado'
            });
        }
        
        // Salva o usuário
        const userData = {
            nome,
            email,
            telefone,
            cidade,
            userType,
            senha // Em produção, hash a senha!
        };
        
        const newUser = await saveUser(userData);
        
        // Envia email de boas-vindas
        try {
            const emailHTML = getWelcomeEmailHTML(userData);
            const emailFrom = `"${process.env.EMAIL_FROM_NAME || 'Cuidar.pt'}" <${process.env.EMAIL_FROM || 'noreply@demomailtrap.co'}>`;
            
            await transporter.sendMail({
                from: emailFrom,
                to: email,
                subject: 'Bem-vindo ao Cuidar.pt! 🎉',
                html: emailHTML
            });
            
            console.log(`✅ Cadastro realizado para ${email}`);
            console.log(`📧 Email de boas-vindas enviado com sucesso!`);
            console.log(`🔑 Senha gerada: ${senha}`);
        } catch (emailError) {
            console.error('❌ Erro ao enviar email:', emailError.message);
            console.error('Detalhes:', emailError);
            // Não falha o cadastro se o email falhar
            console.log(`⚠️ Cadastro realizado mas email não foi enviado para: ${email}`);
            console.log(`💡 Verifique as credenciais no arquivo server.env`);
        }
        
        res.status(201).json({
            success: true,
            message: 'Cadastro realizado com sucesso! Verifique seu email.',
            userId: newUser.id
        });
        
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao processar cadastro'
        });
    }
});

// =============================================================================
// ROTAS PROTEGIDAS
// =============================================================================

/**
 * Rota para atualizar dados do usuário
 */
app.put('/api/users/:userId', authenticateUser, canModifyResource, async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        
        const updatedUser = await updateUser(userId, updates);
        
        // Remove senha da resposta
        const { senha: _, ...userWithoutPassword } = updatedUser;
        
        res.status(200).json({
            success: true,
            message: 'Dados atualizados com sucesso',
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar dados'
        });
    }
});

/**
 * Rota para listar todos os usuários (apenas admin)
 */
app.get('/api/users', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const db = await readDatabase();
        
        // Remove senhas da resposta
        const users = db.users.map(({ senha, ...user }) => user);
        
        res.status(200).json({
            success: true,
            users: users
        });
        
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar usuários'
        });
    }
});

/**
 * Rota para obter dados do próprio usuário
 */
app.get('/api/users/:userId', authenticateUser, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Só pode ver seus próprios dados (a menos que seja admin)
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado'
            });
        }
        
        const user = await getUserById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        // Remove senha da resposta
        const { senha, ...userWithoutPassword } = user;
        
        res.status(200).json({
            success: true,
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar usuário'
        });
    }
});

/**
 * Rota para listar cuidadores disponíveis
 */
app.get('/api/cuidadores', async (req, res) => {
    try {
        const { cidade, distrito, valorMax, dia, qualificacao } = req.query;
        const db = await readDatabase();
        
        let cuidadores = db.users.filter(u => 
            (u.role === 'cuidador' || u.userType === 'cuidador') && 
            (u.isActive !== false) // Considera ativo se isActive não está definido ou é true
        );
        
        // Filtrar por cidade (busca em cidade ou areasAtuacao)
        if (cidade) {
            cuidadores = cuidadores.filter(c => {
                const cidadeLower = cidade.toLowerCase();
                const temNaCidade = c.cidade && c.cidade.toLowerCase().includes(cidadeLower);
                const temNasAreas = c.areasAtuacao && Array.isArray(c.areasAtuacao) && 
                    c.areasAtuacao.some(area => area.toLowerCase().includes(cidadeLower));
                return temNaCidade || temNasAreas;
            });
        }
        
        // Filtrar por distrito
        if (distrito) {
            cuidadores = cuidadores.filter(c => 
                c.distrito && c.distrito.toLowerCase() === distrito.toLowerCase()
            );
        }
        
        // Filtrar por valor máximo
        if (valorMax) {
            const maxValue = parseFloat(valorMax);
            cuidadores = cuidadores.filter(c => 
                c.valorHora && c.valorHora <= maxValue
            );
        }
        
        // Filtrar por disponibilidade em dia específico
        if (dia) {
            cuidadores = cuidadores.filter(c => {
                if (!c.disponibilidade || !Array.isArray(c.disponibilidade)) return false;
                return c.disponibilidade.some(disp => disp.dia === dia);
            });
        }
        
        // Filtrar por qualificação
        if (qualificacao) {
            const qualLower = qualificacao.toLowerCase();
            cuidadores = cuidadores.filter(c => {
                if (!c.qualificacoes || !Array.isArray(c.qualificacoes)) return false;
                return c.qualificacoes.some(q => q.toLowerCase().includes(qualLower));
            });
        }
        
        // Remove senhas da resposta
        cuidadores = cuidadores.map(({ senha, ...cuidador }) => cuidador);
        
        console.log(`🔍 Busca de cuidadores: ${cuidadores.length} resultado(s) | Filtros: ${JSON.stringify(req.query)}`);
        
        res.status(200).json({
            success: true,
            cuidadores: cuidadores,
            total: cuidadores.length
        });
        
    } catch (error) {
        console.error('Erro ao listar cuidadores:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar cuidadores'
        });
    }
});

// =============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// =============================================================================

const startServer = async () => {
    await initDatabase();
    
    app.listen(PORT, () => {
        console.log('='.repeat(50));
        console.log(`🚀 Servidor Cuidar.pt rodando na porta ${PORT}`);
        console.log(`📍 API: http://localhost:${PORT}/api`);
        console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
        console.log('='.repeat(50));
    });
};

startServer();

