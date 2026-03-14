@echo off
cd /d "%~dp0"
git init
git add .
git commit -m "feat: sistema de gestao de estoque completo"
git branch -M main
git remote add origin https://github.com/Matheusbedev/SGE---SISTEMA-GESTAO-DE-ESTOQUE.git
git push -u origin main
