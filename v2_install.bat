@echo off
echo Cleaning old state...
if exist node_modules rd /s /q node_modules
if exist package-lock.json del /f package-lock.json

echo Initializing dependencies...
npm install
