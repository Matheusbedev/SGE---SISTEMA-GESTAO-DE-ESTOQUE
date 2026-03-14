@echo off
cd /d "%~dp0"
git add .
git commit -m "fix: disable noUnusedLocals to fix vercel build"
git push
