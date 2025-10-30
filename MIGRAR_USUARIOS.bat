@echo off
chcp 65001 >nul
color 0A
cls
echo.
echo ========================================
echo   MIGRAÇÃO DE USUÁRIOS PARA MONGODB
echo ========================================
echo.
echo 📦 Instalando dependências...
echo.

call npm install mongodb dotenv 2>&1

echo.
echo ✅ Dependências instaladas!
echo.
echo 🔄 Iniciando migração...
echo.
echo.

call node api/migrar-usuarios.js 2>&1

echo.
echo.
echo ========================================
echo   PROCESSO FINALIZADO
echo ========================================
echo.
echo Pressione qualquer tecla para fechar...
pause >nul

