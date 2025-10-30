/**
 * Script de migração de usuários do database.json para MongoDB Atlas
 * Execute: node api/migrar-usuarios.js
 */

require('dotenv').config({ path: './server.env' });
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI não encontrada no server.env');
    process.exit(1);
}

const client = new MongoClient(MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function migrarUsuarios() {
    try {
        console.log('🔄 Conectando ao MongoDB Atlas...\n');
        await client.connect();
        
        const database = client.db("cuidar-pt");
        const usersCollection = database.collection("users");
        
        console.log('✅ Conectado ao MongoDB!\n');
        
        // Ler database.json
        const databasePath = path.join(__dirname, '..', 'server', 'database.json');
        const data = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
        const usuarios = data.users;
        
        console.log(`📦 Encontrados ${usuarios.length} usuários no database.json\n`);
        
        let migrados = 0;
        let pulados = 0;
        
        for (const usuario of usuarios) {
            // Verificar se já existe (por email)
            const existe = await usersCollection.findOne({ email: usuario.email });
            
            if (existe) {
                console.log(`⏭️  Pulando: ${usuario.nome} (${usuario.email}) - já existe`);
                pulados++;
                continue;
            }
            
            // Inserir no MongoDB
            await usersCollection.insertOne(usuario);
            console.log(`✅ Migrado: ${usuario.nome} (${usuario.email}) - Role: ${usuario.role || usuario.userType}`);
            migrados++;
        }
        
        console.log('\n' + '='.repeat(60));
        console.log(`📊 RESUMO DA MIGRAÇÃO:`);
        console.log(`   ✅ Migrados: ${migrados}`);
        console.log(`   ⏭️  Pulados (já existiam): ${pulados}`);
        console.log(`   📦 Total: ${usuarios.length}`);
        console.log('='.repeat(60) + '\n');
        
        // Mostrar todos os usuários no MongoDB
        console.log('👥 USUÁRIOS NO MONGODB ATLAS:\n');
        const todosUsuarios = await usersCollection.find({}).toArray();
        
        todosUsuarios.forEach((user, index) => {
            console.log(`${index + 1}. ${user.nome}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   👤 Role: ${user.role || user.userType}`);
            console.log(`   🆔 ID: ${user.id}`);
            console.log('');
        });
        
        console.log('✅ Migração concluída com sucesso!\n');
        
    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('🔌 Conexão com MongoDB fechada.');
    }
}

migrarUsuarios();

