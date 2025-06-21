#!/bin/bash
# 🚀 Deploy Script - Automatic Deployment

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration (modify these variables for your deployment)
DEPLOY_TARGET=${DEPLOY_TARGET:-"local"}
DEPLOY_HOST=${DEPLOY_HOST:-""}
DEPLOY_PATH=${DEPLOY_PATH:-"/var/www/html"}
DEPLOY_USER=${DEPLOY_USER:-""}

# Deployment start time
DEPLOY_START=$(date +%s)

print_status "Deployment configuration:"
echo "  Target: $DEPLOY_TARGET"
echo "  Host: ${DEPLOY_HOST:-'local'}"
echo "  Path: $DEPLOY_PATH"
echo "  User: ${DEPLOY_USER:-'current'}"
echo ""

# 1. Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if build exists
if [ ! -d "dist" ]; then
    print_error "Build not found. Run './scripts/build.sh' first"
    exit 1
fi
print_success "Build directory found"

# Check deployment target
case $DEPLOY_TARGET in
    "local")
        print_status "Local deployment selected"
        ;;
    "remote")
        print_status "Remote deployment selected"
        if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ]; then
            print_error "Remote deployment requires DEPLOY_HOST and DEPLOY_USER"
            exit 1
        fi
        ;;
    "docker")
        print_status "Docker deployment selected"
        if ! command -v docker >/dev/null 2>&1; then
            print_error "Docker not found"
            exit 1
        fi
        ;;
    *)
        print_error "Invalid deployment target: $DEPLOY_TARGET"
        echo "Valid targets: local, remote, docker"
        exit 1
        ;;
esac

# 2. Backup current deployment (if exists)
if [ "$DEPLOY_TARGET" = "local" ] && [ -d "$DEPLOY_PATH" ]; then
    print_status "Creating backup of current deployment..."
    BACKUP_DIR="${DEPLOY_PATH}.backup.$(date +%Y%m%d_%H%M%S)"
    if cp -r "$DEPLOY_PATH" "$BACKUP_DIR" 2>/dev/null; then
        print_success "Backup created: $BACKUP_DIR"
    else
        print_warning "Could not create backup"
    fi
fi

# 3. Deploy based on target
case $DEPLOY_TARGET in
    "local")
        print_status "Deploying locally to $DEPLOY_PATH..."
        
        # Create target directory
        mkdir -p "$DEPLOY_PATH" || {
            print_error "Cannot create deploy directory: $DEPLOY_PATH"
            exit 1
        }
        
        # Copy files
        if cp -r dist/* "$DEPLOY_PATH/" 2>/dev/null; then
            print_success "Files copied to $DEPLOY_PATH"
        else
            print_error "Failed to copy files"
            exit 1
        fi
        ;;
        
    "remote")
        print_status "Deploying to remote server $DEPLOY_HOST..."
        
        # Test SSH connection
        if ssh -o ConnectTimeout=10 "$DEPLOY_USER@$DEPLOY_HOST" "exit" 2>/dev/null; then
            print_success "SSH connection successful"
        else
            print_error "Cannot connect to $DEPLOY_HOST"
            exit 1
        fi
        
        # Create remote directory
        ssh "$DEPLOY_USER@$DEPLOY_HOST" "mkdir -p $DEPLOY_PATH"
        
        # Sync files using rsync
        if rsync -avz --delete dist/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"; then
            print_success "Files synced to remote server"
        else
            print_error "Remote deployment failed"
            exit 1
        fi
        ;;
        
    "docker")
        print_status "Building and deploying Docker container..."
        
        # Check if Dockerfile exists
        if [ ! -f "Dockerfile" ]; then
            print_status "Creating basic Dockerfile..."
            cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY dist/package*.json ./
RUN npm ci --only=production

# Copy application files
COPY dist/ .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

CMD ["node", "index.js"]
EOF
            print_success "Dockerfile created"
        fi
        
        # Build Docker image
        IMAGE_NAME=$(grep '"name"' package.json | cut -d'"' -f4 | tr '/' '-')
        IMAGE_TAG=$(grep '"version"' package.json | cut -d'"' -f4)
        
        if docker build -t "$IMAGE_NAME:$IMAGE_TAG" -t "$IMAGE_NAME:latest" .; then
            print_success "Docker image built: $IMAGE_NAME:$IMAGE_TAG"
        else
            print_error "Docker build failed"
            exit 1
        fi
        
        # Stop existing container
        docker stop "$IMAGE_NAME" 2>/dev/null || true
        docker rm "$IMAGE_NAME" 2>/dev/null || true
        
        # Run new container
        if docker run -d --name "$IMAGE_NAME" -p 3000:3000 "$IMAGE_NAME:latest"; then
            print_success "Docker container started"
        else
            print_error "Failed to start Docker container"
            exit 1
        fi
        ;;
esac

# 4. Post-deployment tasks
print_status "Running post-deployment tasks..."

# Install production dependencies if package.json exists in deployment
if [ "$DEPLOY_TARGET" = "local" ] && [ -f "$DEPLOY_PATH/package.json" ]; then
    print_status "Installing production dependencies..."
    (cd "$DEPLOY_PATH" && npm ci --only=production --silent) || {
        print_warning "Could not install dependencies"
    }
fi

# Set correct permissions (local deployment)
if [ "$DEPLOY_TARGET" = "local" ]; then
    print_status "Setting file permissions..."
    find "$DEPLOY_PATH" -type f -exec chmod 644 {} \; 2>/dev/null || true
    find "$DEPLOY_PATH" -type d -exec chmod 755 {} \; 2>/dev/null || true
    [ -f "$DEPLOY_PATH/index.js" ] && chmod +x "$DEPLOY_PATH/index.js"
fi

# 5. Health check
print_status "Running health check..."

case $DEPLOY_TARGET in
    "local")
        if [ -f "$DEPLOY_PATH/package.json" ]; then
            print_success "Deployment validation passed"
        else
            print_error "Deployment validation failed"
            exit 1
        fi
        ;;
    "remote")
        if ssh "$DEPLOY_USER@$DEPLOY_HOST" "test -f $DEPLOY_PATH/package.json"; then
            print_success "Remote deployment validation passed"
        else
            print_error "Remote deployment validation failed"
            exit 1
        fi
        ;;
    "docker")
        sleep 2  # Wait for container to start
        if docker ps | grep -q "$IMAGE_NAME"; then
            print_success "Docker container health check passed"
        else
            print_error "Docker container health check failed"
            exit 1
        fi
        ;;
esac

# 6. Update deployment info
print_status "Updating deployment info..."
DEPLOY_INFO_FILE="deployment-info.json"

cat > "$DEPLOY_INFO_FILE" << EOF
{
  "deploymentTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "deploymentTarget": "$DEPLOY_TARGET",
  "deploymentHost": "${DEPLOY_HOST:-'local'}",
  "deploymentPath": "$DEPLOY_PATH",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "version": "$(grep '"version"' package.json | cut -d'"' -f4)"
}
EOF

# Copy deployment info to target
case $DEPLOY_TARGET in
    "local")
        cp "$DEPLOY_INFO_FILE" "$DEPLOY_PATH/"
        ;;
    "remote")
        scp "$DEPLOY_INFO_FILE" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"
        ;;
esac

# 7. Final summary
DEPLOY_END=$(date +%s)
DEPLOY_TIME=$((DEPLOY_END - DEPLOY_START))

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "  ⏱️  Deploy time: ${DEPLOY_TIME}s"
echo "  🎯 Target: $DEPLOY_TARGET"
echo "  📁 Location: ${DEPLOY_HOST:-'local'}:$DEPLOY_PATH"
echo "  🔄 Version: $(grep '"version"' package.json | cut -d'"' -f4)"
echo ""

case $DEPLOY_TARGET in
    "local")
        echo "🌐 Local access:"
        echo "  File path: $DEPLOY_PATH"
        echo "  Run: cd $DEPLOY_PATH && node index.js"
        ;;
    "remote")
        echo "🌐 Remote access:"
        echo "  SSH: ssh $DEPLOY_USER@$DEPLOY_HOST"
        echo "  Path: $DEPLOY_PATH"
        ;;
    "docker")
        echo "🐳 Docker access:"
        echo "  Container: $IMAGE_NAME"
        echo "  URL: http://localhost:3000"
        echo "  Logs: docker logs $IMAGE_NAME"
        ;;
esac

echo ""
echo "💡 Useful commands:"
echo "  Rollback: mv ${DEPLOY_PATH}.backup.* $DEPLOY_PATH"
echo "  Monitor: tail -f /var/log/your-app.log"
echo "  Status: curl http://your-app/health"
echo ""
print_success "Deployment ready! 🎉" 