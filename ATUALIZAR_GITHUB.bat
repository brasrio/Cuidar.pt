@echo off
chcp 65001 >nul
color 0B
cls
echo.
echo ========================================
echo   ATUALIZANDO REPOSITÓRIO NO GITHUB
echo ========================================
echo.
echo 📂 Enviando alterações para o GitHub...
echo.

cd /d "C:\Users\BrasrioCG_02\Desktop\Cuidar.pt"

echo 📦 Adicionando arquivos...
git add .

echo.
echo 💾 Criando commit...
git commit -m "feat: Migração completa para MongoDB Atlas - usuarios migrados"

echo.
echo 📤 Enviando para o GitHub...
git push origin main

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ Erro ao enviar para o GitHub!
    echo.
    echo Possíveis causas:
    echo - Precisa fazer login no GitHub
    echo - Sem conexão com internet
    echo - Repositório sem permissão
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Alterações enviadas para o GitHub!
echo.
echo ========================================
echo   ATUALIZANDO PASTA EM DOCUMENTOS
echo ========================================
echo.

cd /d "%USERPROFILE%\Documents\GitHub\Cuidar.pt"

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ Pasta não encontrada em Documentos\GitHub\Cuidar.pt
    echo.
    echo Verifique se o caminho está correto!
    echo.
    pause
    exit /b 1
)

echo 📥 Baixando atualizações do GitHub...
echo.

git pull origin main

if %errorlevel% neq 0 (
    color 0E
    echo.
    echo ⚠️  Aviso: Pode ter conflitos ou já estar atualizado
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ TUDO ATUALIZADO COM SUCESSO!
echo ========================================
echo.
echo 📍 Pasta do GitHub atualizada em:
echo    %USERPROFILE%\Documents\GitHub\Cuidar.pt
echo.
echo 🗑️  Agora você pode excluir a pasta do Desktop!
echo.
echo ========================================
echo.
pause

