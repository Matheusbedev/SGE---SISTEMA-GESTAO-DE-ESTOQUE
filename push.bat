@echo off
cd /d "%~dp0"
git add .
git commit -m "ci: force redeploy"
git push
