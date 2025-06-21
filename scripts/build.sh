#!/bin/bash
# 🏗️ Build Script - Project Construction

echo "🏗️ Starting build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[BUILD]${NC} $1"
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

# Build start time
BUILD_START=$(date +%s)

# 1. Pre-build checks
print_status "Running pre-build checks..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found"
    exit 1
fi

# Check Node.js version
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
else
    print_error "Node.js not found"
    exit 1
fi

# 2. Quality checks
print_status "Running quality checks..."
if npm run quality; then
    print_success "Quality checks passed"
else
    print_error "Quality checks failed"
    echo "💡 Run 'npm run quality:fix' to auto-fix issues"
    exit 1
fi

# 3. Install/verify dependencies
print_status "Verifying dependencies..."
if npm ci --quiet; then
    print_success "Dependencies verified"
else
    print_warning "Dependencies installation failed, trying npm install..."
    if npm install; then
        print_success "Dependencies installed"
    else
        print_error "Dependencies installation failed"
        exit 1
    fi
fi

# 4. Run tests if available
if npm run test --if-present >/dev/null 2>&1; then
    print_status "Running tests..."
    if npm run test; then
        print_success "Tests passed"
    else
        print_error "Tests failed"
        exit 1
    fi
else
    print_warning "No tests configured"
fi

# 5. Security audit
print_status "Running security audit..."
if npm audit --audit-level high; then
    print_success "Security audit passed"
else
    print_warning "Security vulnerabilities found - check npm audit output"
fi

# 6. Build the project
print_status "Building project..."

# Create build directory
mkdir -p dist

# Copy source files
if [ -d "src" ]; then
    print_status "Copying source files..."
    cp -r src/* dist/ 2>/dev/null || true
    print_success "Source files copied"
fi

# Build JavaScript/TypeScript if configured
if npm run build --if-present >/dev/null 2>&1; then
    print_status "Running build script..."
    if npm run build; then
        print_success "Build script completed"
    else
        print_error "Build script failed"
        exit 1
    fi
fi

# Copy essential files to dist
print_status "Copying essential files..."
[ -f "package.json" ] && cp package.json dist/
[ -f "README.md" ] && cp README.md dist/
[ -f "LICENSE" ] && cp LICENSE dist/

# 7. Optimize build
print_status "Optimizing build..."

# Remove development files from dist
rm -rf dist/node_modules/.cache 2>/dev/null || true
rm -rf dist/**/*.test.js 2>/dev/null || true
rm -rf dist/**/*.spec.js 2>/dev/null || true

# 8. Validate build
print_status "Validating build..."

if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    DIST_SIZE=$(du -sh dist | cut -f1)
    print_success "Build directory created (size: $DIST_SIZE)"
else
    print_error "Build validation failed - dist directory empty"
    exit 1
fi

# 9. Create build info
print_status "Creating build info..."
cat > dist/build-info.json << EOF
{
  "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "buildNumber": "${BUILD_NUMBER:-local}",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)"
}
EOF
print_success "Build info created"

# 10. Generate build summary
BUILD_END=$(date +%s)
BUILD_TIME=$((BUILD_END - BUILD_START))

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "📊 Build Summary:"
echo "  ⏱️  Build time: ${BUILD_TIME}s"
echo "  📁 Output directory: dist/"
echo "  📦 Build size: $(du -sh dist | cut -f1)"
echo "  🔍 Files created: $(find dist -type f | wc -l)"
echo ""

# List main files in dist
echo "📋 Main files in dist/:"
ls -la dist/ | head -10

echo ""
echo "🚀 Next steps:"
echo "  1. Test the build: node dist/index.js"
echo "  2. Deploy: ./scripts/deploy.sh"
echo "  3. Or run manually from dist/ directory"
echo ""
print_success "Build ready for deployment! 🎉" 