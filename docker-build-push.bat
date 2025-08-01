@echo off
setlocal enabledelayedexpansion

REM PLN AP2T Chatbot - Docker Build & Push Script (Windows)
REM Usage: docker-build-push.bat [your-dockerhub-username]

echo.
echo [92m🚀 Building and pushing PLN AP2T Chatbot Docker image...[0m
echo.

REM Set Docker Hub username
set DOCKER_USERNAME=%1
if "%DOCKER_USERNAME%"=="" set DOCKER_USERNAME=your-dockerhub-username

set IMAGE_NAME=pln-ap2t-chatbot
set TAG=latest

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [91m❌ Docker is not running. Please start Docker first.[0m
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo [93m⚠️  .env file not found. Copying from .env.example...[0m
    copy .env.example .env
    echo [93m⚠️  Please edit .env file and add your OPENROUTER_API_KEY before proceeding[0m
    pause
    exit /b 1
)

REM Check if OPENROUTER_API_KEY is set in .env
findstr /C:"OPENROUTER_API_KEY=" .env >nul
if %errorlevel% neq 0 (
    echo [91m❌ OPENROUTER_API_KEY not found in .env file[0m
    pause
    exit /b 1
)

REM Build the Docker image
echo [92m🔨 Building Docker image...[0m
docker build -t %DOCKER_USERNAME%/%IMAGE_NAME%:%TAG% .

REM Tag with additional version tags
docker tag %DOCKER_USERNAME%/%IMAGE_NAME%:%TAG% %DOCKER_USERNAME%/%IMAGE_NAME%:v1.0.0
docker tag %DOCKER_USERNAME%/%IMAGE_NAME%:%TAG% %DOCKER_USERNAME%/%IMAGE_NAME%:latest

REM Push to Docker Hub
echo [92m📤 Pushing to Docker Hub...[0m
docker push %DOCKER_USERNAME%/%IMAGE_NAME%:%TAG%
docker push %DOCKER_USERNAME%/%IMAGE_NAME%:v1.0.0

echo.
echo [92m✅ Successfully built and pushed![0m
echo [92m📦 Image: %DOCKER_USERNAME%/%IMAGE_NAME%:%TAG%[0m
echo [92m🐳 Run with: docker run -p 3030:3030 --env-file .env %DOCKER_USERNAME%/%IMAGE_NAME%:%TAG%[0m
echo.
pause