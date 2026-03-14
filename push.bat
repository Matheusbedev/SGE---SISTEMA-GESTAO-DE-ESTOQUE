@echo off
cd /d "%~dp0"
git add .
git commit -m "fix: simplify build script and fix deploy workflow"
git push
