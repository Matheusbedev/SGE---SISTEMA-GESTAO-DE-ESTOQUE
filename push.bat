@echo off
cd /d "%~dp0"
git add .
git commit -m "fix: add 404.html for github pages SPA routing"
git push
