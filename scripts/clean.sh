#!/bin/bash
# 🧹 Clean Script - Automatic Cleanup of Temporary Files

echo "🧹 Starting cleanup process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m' 
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[CLEAN]${NC} $1"
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

# Track cleaned items
CLEANED_ITEMS=0
TOTAL_SIZE_BEFORE=0
TOTAL_SIZE_AFTER=0

# Function to get directory size
get_size() {
    if [ -d "$1" ]; then
        du -sh "$1" 2>/dev/null | cut -f1
    else
        echo "0"
    fi
}

# Function to clean directory and report
clean_directory() {
    local dir="$1"
    local description="$2"
    
    if [ -d "$dir" ]; then
        local size_before=$(du -sb "$dir" 2>/dev/null | cut -f1)
        rm -rf "$dir"
        CLEANED_ITEMS=$((CLEANED_ITEMS + 1))
        TOTAL_SIZE_BEFORE=$((TOTAL_SIZE_BEFORE + size_before))
        print_success "Cleaned $description"
    fi
}

# Function to clean files matching pattern
clean_files() {
    local pattern="$1"
    local description="$2"
    
    local count=$(find . -name "$pattern" -type f 2>/dev/null | wc -l)
    if [ "$count" -gt 0 ]; then
        find . -name "$pattern" -type f -delete 2>/dev/null
        CLEANED_ITEMS=$((CLEANED_ITEMS + count))
        print_success "Cleaned $count $description"
    fi
}

print_status "Analyzing project for cleanup..."

# Get initial project size
PROJECT_SIZE_BEFORE=$(du -sh . 2>/dev/null | cut -f1)

# 1. Node.js cleanup
print_status "Cleaning Node.js artifacts..."

clean_directory "node_modules" "Node.js modules"
clean_directory ".npm" "npm cache"
clean_files "npm-debug.log*" "npm debug logs"
clean_files ".nyc_output" "NYC coverage files"

# 2. Build artifacts cleanup
print_status "Cleaning build artifacts..."

clean_directory "dist" "build output"
clean_directory "build" "build directory"
clean_directory "out" "output directory"
clean_directory ".next" "Next.js build cache"
clean_directory ".nuxt" "Nuxt.js build cache"
clean_files "*.tgz" "package tarballs"

# 3. Test and coverage cleanup
print_status "Cleaning test artifacts..."

clean_directory "coverage" "test coverage reports"
clean_directory ".coverage" "coverage data"
clean_files "*.lcov" "LCOV coverage files"
clean_files ".jest-cache" "Jest cache"

# 4. Log files cleanup
print_status "Cleaning log files..."

clean_files "*.log" "log files"
clean_files "*.log.*" "rotated log files"
clean_directory "logs" "logs directory"
clean_files ".pnp.*" "Yarn PnP files"

# 5. Editor and IDE cleanup
print_status "Cleaning editor artifacts..."

clean_directory ".vscode/settings.json" "VS Code settings (keeping workspace)"
clean_files ".DS_Store" "macOS Finder files"
clean_files "Thumbs.db" "Windows thumbnail cache"
clean_files "*.swp" "Vim swap files"
clean_files "*.swo" "Vim swap files"
clean_files "*~" "backup files"

# 6. Temporary files cleanup
print_status "Cleaning temporary files..."

clean_directory "tmp" "temporary directory"
clean_directory "temp" "temp directory"
clean_files "*.tmp" "temporary files"
clean_files "*.temp" "temp files"
clean_files ".cache" "cache directories"

# 7. Version control cleanup
print_status "Cleaning version control artifacts..."

# Git cleanup (be careful)
if [ -d ".git" ]; then
    print_status "Running git cleanup..."
    git gc --prune=now 2>/dev/null || print_warning "Git cleanup failed"
    git prune 2>/dev/null || print_warning "Git prune failed"
    print_success "Git repository optimized"
fi

# 8. Language-specific cleanup
print_status "Cleaning language-specific artifacts..."

# Python
clean_directory "__pycache__" "Python cache"
clean_files "*.pyc" "Python bytecode"
clean_files "*.pyo" "Python optimized bytecode"
clean_directory ".pytest_cache" "Pytest cache"

# Java
clean_files "*.class" "Java class files"
clean_directory "target" "Maven target"

# C/C++
clean_files "*.o" "object files"
clean_files "*.so" "shared libraries"
clean_files "*.dylib" "dynamic libraries"

# 9. Database and backup cleanup
print_status "Cleaning database and backup files..."

clean_files "*.sqlite" "SQLite databases (be careful!)"
clean_files "*.db" "database files (be careful!)"
clean_files "*.bak" "backup files"
clean_files "*.backup" "backup files"

# 10. Package manager cleanup
print_status "Cleaning package manager caches..."

# npm cache
if command -v npm >/dev/null 2>&1; then
    npm cache clean --force 2>/dev/null || print_warning "npm cache clean failed"
    print_success "npm cache cleaned"
fi

# Yarn cache
if command -v yarn >/dev/null 2>&1; then
    yarn cache clean 2>/dev/null || print_warning "Yarn cache clean failed"
    print_success "Yarn cache cleaned"
fi

# pnpm cache
if command -v pnpm >/dev/null 2>&1; then
    pnpm store prune 2>/dev/null || print_warning "pnpm store prune failed"
    print_success "pnpm store cleaned"
fi

# 11. Docker cleanup (optional)
if command -v docker >/dev/null 2>&1; then
    print_status "Docker found - cleaning containers and images..."
    
    # Clean stopped containers
    STOPPED_CONTAINERS=$(docker ps -aq --filter "status=exited" 2>/dev/null | wc -l)
    if [ "$STOPPED_CONTAINERS" -gt 0 ]; then
        docker rm $(docker ps -aq --filter "status=exited") 2>/dev/null || true
        print_success "Removed $STOPPED_CONTAINERS stopped containers"
    fi
    
    # Clean dangling images
    DANGLING_IMAGES=$(docker images -f "dangling=true" -q 2>/dev/null | wc -l) 
    if [ "$DANGLING_IMAGES" -gt 0 ]; then
        docker rmi $(docker images -f "dangling=true" -q) 2>/dev/null || true
        print_success "Removed $DANGLING_IMAGES dangling images"
    fi
    
    # Clean build cache
    docker builder prune -f 2>/dev/null || true
    print_success "Docker build cache cleaned"
fi

# 12. System cleanup (optional)
print_status "Running system cleanup..."

# Clear system caches if on Linux/macOS
if command -v sync >/dev/null 2>&1; then
    sync
    print_success "System buffers flushed"
fi

# Get final project size
PROJECT_SIZE_AFTER=$(du -sh . 2>/dev/null | cut -f1)

# Summary
echo ""
echo "🎉 Cleanup completed successfully!"
echo ""
echo "📊 Cleanup Summary:"
echo "  🗑️  Items cleaned: $CLEANED_ITEMS"
echo "  📁 Project size before: $PROJECT_SIZE_BEFORE"
echo "  📁 Project size after: $PROJECT_SIZE_AFTER"
echo ""

# List what's left in main directories
echo "📋 Remaining project structure:"
echo "src/:"
ls -la src/ 2>/dev/null | head -5 || echo "  (empty or not found)"
echo ""
echo "docs/:"
ls -la docs/ 2>/dev/null | head -5 || echo "  (empty or not found)"
echo ""

# Final recommendations
echo "💡 Recommendations:"
echo "  1. Run 'npm install' to reinstall dependencies"
echo "  2. Run 'npm run quality' to verify project integrity"
echo "  3. Run './scripts/build.sh' to rebuild if needed"
echo ""

# Verify project still works
if [ -f "package.json" ]; then
    print_status "Verifying project integrity..."
    if npm ls >/dev/null 2>&1; then
        print_success "Project structure intact"
    else
        print_warning "You may need to run 'npm install' to restore dependencies"
    fi
fi

echo "✨ Project cleaned and optimized!"
print_success "Cleanup complete! 🎉" 