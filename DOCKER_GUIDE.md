# PLN AP2T Chatbot - Docker Deployment Guide

## 🐳 Docker Hub Deployment Guide

This guide will help you containerize and deploy the PLN AP2T Chatbot to Docker Hub for easy distribution and deployment.

## 📋 Prerequisites

- Docker installed on your system
- Docker Hub account (free at [hub.docker.com](https://hub.docker.com))
- Your OpenRouter API key

## 🔧 Quick Setup

### 1. Environment Configuration

First, set up your environment variables:

```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your OpenRouter API key
OPENROUTER_API_KEY=your-actual-api-key-here
```

### 2. Build and Push to Docker Hub

#### For Linux/macOS:
```bash
# Make script executable
chmod +x docker-build-push.sh

# Run build and push script
./docker-build-push.sh your-dockerhub-username
```

#### For Windows:
```batch
# Run build and push script
docker-build-push.bat your-dockerhub-username
```

### 3. Manual Build (Alternative)

If you prefer manual steps:

```bash
# Build the image
docker build -t your-dockerhub-username/pln-ap2t-chatbot:latest .

# Tag with version
docker tag your-dockerhub-username/pln-ap2t-chatbot:latest your-dockerhub-username/pln-ap2t-chatbot:v1.0.0

# Push to Docker Hub
docker push your-dockerhub-username/pln-ap2t-chatbot:latest
docker push your-dockerhub-username/pln-ap2t-chatbot:v1.0.0
```

## 🚀 Running the Container

### Basic Run
```bash
docker run -p 3030:3030 --env-file .env your-dockerhub-username/pln-ap2t-chatbot:latest
```

### With Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production with Nginx
```bash
# Start with nginx reverse proxy
docker-compose --profile production up -d
```

## 🔍 Verification

After running, verify the deployment:

1. **Health Check**: Visit http://localhost:3030/health
2. **Chat Interface**: Visit http://localhost:3030
3. **API Test**: Use curl or Postman to test the API

```bash
# Test API endpoint
curl -X POST http://localhost:3030/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "sessionId": "test-123"}'
```

## 📊 Docker Hub Repository Structure

Your Docker Hub repository will have:

```
your-dockerhub-username/pln-ap2t-chatbot
├── latest (always points to newest)
├── v1.0.0 (specific version)
└── [other-version-tags]
```

## 🔧 Advanced Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | ✅ |
| `NODE_ENV` | Environment mode (production/development) | ❌ |
| `PORT` | Server port (default: 3030) | ❌ |

### Volume Mounts

For persistent logs:
```bash
docker run -p 3030:3030 \
  --env-file .env \
  -v $(pwd)/logs:/app/logs \
  your-dockerhub-username/pln-ap2t-chatbot:latest
```

### Custom Network

Create custom Docker network:
```bash
docker network create chatbot-network
docker run --network chatbot-network -p 3030:3030 --env-file .env your-dockerhub-username/pln-ap2t-chatbot:latest
```

## 🛠️ Development Workflow

### Local Development with Hot Reload
```bash
# For development with volume mounting
docker run -p 3030:3030 \
  --env-file .env \
  -v $(pwd):/app \
  -v /app/node_modules \
  your-dockerhub-username/pln-ap2t-chatbot:latest
```

### Multi-stage Build (Optimized)
The Dockerfile uses multi-stage builds for:
- **Smaller image size** (~100MB vs 1GB+)
- **Security** (non-root user)
- **Performance** (production dependencies only)

## 🔒 Security Best Practices

1. **Non-root user**: Container runs as `nextjs` user
2. **Minimal base image**: Alpine Linux for security
3. **Health checks**: Built-in container health monitoring
4. **Environment isolation**: Secrets via environment variables

## 📈 Monitoring & Logs

### View Container Logs
```bash
# Real-time logs
docker logs -f container-name

# Search logs
docker logs container-name | grep "ERROR"
```

### Health Status
```bash
# Check container health
docker ps

# Detailed health info
docker inspect --format='{{.State.Health.Status}}' container-name
```

## 🔄 Update Process

### Update to New Version
```bash
# Pull latest image
docker pull your-dockerhub-username/pln-ap2t-chatbot:latest

# Stop old container
docker stop old-container-name

# Run new container
docker run -p 3030:3030 --env-file .env your-dockerhub-username/pln-ap2t-chatbot:latest
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 3030
   lsof -i :3030
   # or on Windows
   netstat -ano | findstr :3030
   ```

2. **API Key Issues**
   ```bash
   # Check if API key is loaded
docker exec container-name env | grep OPENROUTER
   ```

3. **Container Won't Start**
   ```bash
   # Check logs
docker logs container-name
   ```

### Debug Mode
```bash
# Run with debug logs
docker run -p 3030:3030 \
  --env-file .env \
  -e NODE_ENV=development \
  your-dockerhub-username/pln-ap2t-chatbot:latest
```

## 📚 Additional Resources

- [Docker Hub](https://hub.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/dev-best-practices/)

## 📞 Support

If you encounter issues:
1. Check container logs: `docker logs [container-name]`
2. Verify environment variables are loaded
3. Test API endpoints directly
4. Check Docker Hub repository status

---

**Ready to deploy?** Follow the steps above and your PLN AP2T Chatbot will be containerized and ready for Docker Hub distribution! 🚀