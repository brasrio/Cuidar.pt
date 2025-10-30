@echo off
chcp 65001 >nul
color 0A
echo.
echo ========================================
echo   MIGRAÇÃO DE USUÁRIOS PARA MONGODB
echo ========================================
echo.
echo 📦 Instalando dependências...
echo.

npm install mongodb dotenv

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ Erro ao instalar dependências!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Dependências instaladas!
echo.
echo 🔄 Iniciando migração...
echo.

node api/migrar-usuarios.js

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ Erro durante a migração!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!
echo ========================================
echo.
pause

