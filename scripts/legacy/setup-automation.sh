#!/bin/bash
# 🔧 SETUP AUTOMATION - Universal Setup Script
# Installs and configures universal automation for any project type
# Universal Automation Setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
HOOKS_DIR=".githooks"
AUTOMATION_DIR=".automation"
GITHUB_DIR=".github"

print_header() {
    echo -e "${PURPLE}🤖 Universal Automation Setup${NC}"
    echo -e "${PURPLE}==============================${NC}\n"
}

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create necessary directories
setup_directories() {
    print_step "Creating automation directories..."
    
    mkdir -p "$AUTOMATION_DIR"
    mkdir -p "$HOOKS_DIR"
    mkdir -p "$GITHUB_DIR/workflows"
    mkdir -p "$GITHUB_DIR/ISSUE_TEMPLATE"
    mkdir -p "scripts"
    
    print_success "Directories created"
}

# Install Git hooks
install_git_hooks() {
    print_step "Installing Git hooks..."
    
    if [ -d "$HOOKS_DIR" ]; then
        # Make hooks executable
        chmod +x "$HOOKS_DIR"/*
        
        # Install hooks to .git/hooks
        if [ -d ".git/hooks" ]; then
            for hook in "$HOOKS_DIR"/*; do
                hook_name=$(basename "$hook")
                cp "$hook" ".git/hooks/$hook_name"
                chmod +x ".git/hooks/$hook_name"
                print_success "Installed hook: $hook_name"
            done
        else
            print_warning "Not a git repository, skipping git hooks installation"
        fi
    else
        print_warning "No git hooks found in $HOOKS_DIR"
    fi
}

# Setup automation config
setup_automation_config() {
    print_step "Setting up automation configuration..."
    
    # Detect project type
    if [ -f "scripts/project-detector.sh" ]; then
        chmod +x scripts/project-detector.sh
        ./scripts/project-detector.sh
        print_success "Project type detected and configuration saved"
    else
        print_warning "Project detector script not found"
    fi
}

# Make scripts executable
setup_scripts() {
    print_step "Making scripts executable..."
    
    if [ -d "scripts" ]; then
        chmod +x scripts/*.sh
        print_success "All scripts are now executable"
    else
        print_warning "Scripts directory not found"
    fi
}

# Install commitlint (if Node.js project)
setup_commitlint() {
    print_step "Setting up commit linting..."
    
    if [ -f "package.json" ]; then
        if command -v npm &> /dev/null; then
            npm install --save-dev @commitlint/cli @commitlint/config-conventional
            echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
            print_success "Commitlint installed and configured"
        else
            print_warning "npm not found, skipping commitlint setup"
        fi
    else
        print_success "Not a Node.js project, commitlint not needed"
    fi
}

# Setup GitHub configuration
setup_github_config() {
    print_step "Setting up GitHub configuration..."
    
    # Create release.yml if it doesn't exist
    if [ ! -f "$GITHUB_DIR/release.yml" ]; then
        cat > "$GITHUB_DIR/release.yml" << 'EOF'
changelog:
  categories:
    - title: '🚀 Features'
      labels:
        - 'feature'
        - 'enhancement'
    - title: '🐛 Bug Fixes'
      labels:
        - 'bug'
        - 'bugfix'
    - title: '📚 Documentation'
      labels:
        - 'documentation'
    - title: '🔧 Maintenance'
      labels:
        - 'maintenance'
        - 'dependencies'
  exclude:
    labels:
      - 'skip-changelog'
EOF
        print_success "GitHub release configuration created"
    fi
}

# Setup issue templates
setup_issue_templates() {
    print_step "Setting up issue templates..."
    
    # Bug report template
    cat > "$GITHUB_DIR/ISSUE_TEMPLATE/bug-report.yml" << 'EOF'
name: 🐛 Bug Report
description: Report a bug to help us improve
title: '[BUG] '
labels: ['bug']
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
        
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear and concise description of what the bug is
      placeholder: Describe the bug...
    validations:
      required: true
      
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true
      
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What you expected to happen
      placeholder: Describe what you expected...
    validations:
      required: true
      
  - type: textarea
    id: environment
    attributes:
      label: Environment
      description: Your environment details
      placeholder: |
        - OS: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
        - Browser: [e.g. Chrome 95, Firefox 94]
        - Version: [e.g. 1.0.0]
    validations:
      required: false
EOF

    # Feature request template
    cat > "$GITHUB_DIR/ISSUE_TEMPLATE/feature-request.yml" << 'EOF'
name: 🚀 Feature Request
description: Suggest a new feature or enhancement
title: '[FEATURE] '
labels: ['enhancement']
body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a new feature!
        
  - type: textarea
    id: problem
    attributes:
      label: Problem Description
      description: What problem does this feature solve?
      placeholder: Describe the problem or need...
    validations:
      required: true
      
  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: What would you like to see implemented?
      placeholder: Describe your proposed solution...
    validations:
      required: true
      
  - type: textarea
    id: alternatives
    attributes:
      label: Alternative Solutions
      description: Have you considered any alternative solutions?
      placeholder: Describe alternatives you've considered...
    validations:
      required: false
EOF

    print_success "Issue templates created"
}

# Verify installation
verify_installation() {
    print_step "Verifying installation..."
    
    # Check if key files exist
    local errors=0
    
    if [ ! -f "scripts/project-detector.sh" ]; then
        print_error "Missing: scripts/project-detector.sh"
        ((errors++))
    fi
    
    if [ ! -f "scripts/auto-release.sh" ]; then
        print_error "Missing: scripts/auto-release.sh"
        ((errors++))
    fi
    
    if [ ! -f "$GITHUB_DIR/workflows/ci.yml" ]; then
        print_warning "Missing: .github/workflows/ci.yml"
    fi
    
    if [ ! -f "$GITHUB_DIR/workflows/release.yml" ]; then
        print_warning "Missing: .github/workflows/release.yml"
    fi
    
    if [ $errors -eq 0 ]; then
        print_success "Installation verification passed!"
        return 0
    else
        print_error "Installation verification failed with $errors errors"
        return 1
    fi
}

# Show usage instructions
show_usage() {
    echo -e "\n${PURPLE}📋 Next Steps:${NC}"
    echo -e "${BLUE}1.${NC} Test project detection: ${GREEN}./scripts/project-detector.sh${NC}"
    echo -e "${BLUE}2.${NC} Make your first automated commit: ${GREEN}./scripts/commit-helper.sh \"feat: your message\"${NC}"
    echo -e "${BLUE}3.${NC} Create an automated release: ${GREEN}./scripts/auto-release.sh patch${NC}"
    echo -e "${BLUE}4.${NC} Check automation status: ${GREEN}cat .automation/project.env${NC}"
    echo ""
    echo -e "${YELLOW}💡 Pro tip:${NC} Use ${BLUE}./scripts/commit-helper.sh${NC} for all commits to maintain consistency!"
}

# Main execution
main() {
    print_header
    
    setup_directories
    install_git_hooks
    setup_scripts
    setup_automation_config
    setup_commitlint
    setup_github_config
    setup_issue_templates
    
    echo ""
    if verify_installation; then
        print_success "🎉 Universal Automation setup completed successfully!"
        show_usage
    else
        print_error "Setup completed with warnings. Please check the errors above."
        exit 1
    fi
}

# Help function
show_help() {
    echo -e "${BLUE}🤖 Universal Automation Setup${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo -e "  $0 [OPTIONS]"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo -e "  -h, --help     Show this help message"
    echo -e "  --verify-only  Only verify existing installation"
    echo -e "  --hooks-only   Only install git hooks"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0              # Full setup"
    echo -e "  $0 --verify-only   # Just verify"
    echo -e "  $0 --hooks-only    # Only git hooks"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    --verify-only)
        print_header
        verify_installation
        exit $?
        ;;
    --hooks-only)
        print_header
        install_git_hooks
        print_success "Git hooks installation completed!"
        exit 0
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac 