#!/bin/bash

# PLN AP2T Chatbot - Docker Build & Push Script
# Usage: ./docker-build-push.sh [your-dockerhub-username]

set -e

# Docker Hub username
DOCKER_USERNAME=${1:-"your-dockerhub-username"}
IMAGE_NAME="pln-ap2t-chatbot"
TAG="latest"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Building and pushing PLN AP2T Chatbot Docker image...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Copying from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file and add your OPENROUTER_API_KEY before proceeding${NC}"
    exit 1
fi

# Check if OPENROUTER_API_KEY is set
if ! grep -q "OPENROUTER_API_KEY=" .env; then
    echo -e "${RED}❌ OPENROUTER_API_KEY not found in .env file${NC}"
    exit 1
fi

# Build the Docker image
echo -e "${GREEN}🔨 Building Docker image...${NC}"
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} .

# Tag with additional version tags
docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} ${DOCKER_USERNAME}/${IMAGE_NAME}:v1.0.0
docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest

# Push to Docker Hub
echo -e "${GREEN}📤 Pushing to Docker Hub...${NC}"
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:v1.0.0

echo -e "${GREEN}✅ Successfully built and pushed!${NC}"
echo -e "${GREEN}📦 Image: ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}${NC}"
echo -e "${GREEN}🐳 Run with: docker run -p 3030:3030 --env-file .env ${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}${NC}"