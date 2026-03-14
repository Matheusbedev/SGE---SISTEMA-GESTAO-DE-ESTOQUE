@echo off
cd /d "%~dp0"
git add .
git commit -m "feat: custom favicon SGE"
git push
