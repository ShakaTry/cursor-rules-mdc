#!/bin/bash
# 🤖 AUTO RELEASE - Universal Automated Release
# Orchestrates complete release workflow for any project type
# Universal Release Automation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
SKIP_TESTS=false
SKIP_BUILD=false
FORCE_PUSH=false

# Load project configuration
load_project_config() {
    if [[ -f ".automation/project.env" ]]; then
        source .automation/project.env
    else
        echo -e "${YELLOW}⚠️  Running project detection first...${NC}"
        ./scripts/project-detector.sh
        source .automation/project.env
    fi
}

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ Not in a git repository${NC}"
        exit 1
    fi
    
    # Check if working directory is clean
    if [[ -n "$(git status --porcelain)" ]]; then
        echo -e "${RED}❌ Working directory is not clean${NC}"
        echo -e "${YELLOW}Please commit or stash your changes first${NC}"
        exit 1
    fi
    
    # Check if we're on main/master branch
    local current_branch=$(git branch --show-current)
    if [[ "$current_branch" != "main" ]] && [[ "$current_branch" != "master" ]]; then
        echo -e "${YELLOW}⚠️  Not on main/master branch (current: $current_branch)${NC}"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Release cancelled${NC}"
            exit 1
        fi
    fi
    
    # Check project-specific prerequisites
    case "$PROJECT_TYPE" in
        "javascript")
            if ! command -v node &> /dev/null; then
                echo -e "${RED}❌ Node.js not found${NC}"
                exit 1
            fi
            if ! command -v npm &> /dev/null; then
                echo -e "${RED}❌ npm not found${NC}"
                exit 1
            fi
            ;;
        "python")
            if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
                echo -e "${RED}❌ Python not found${NC}"
                exit 1
            fi
            ;;
        "go")
            if ! command -v go &> /dev/null; then
                echo -e "${RED}❌ Go not found${NC}"
                exit 1
            fi
            ;;
        "rust")
            if ! command -v cargo &> /dev/null; then
                echo -e "${RED}❌ Cargo not found${NC}"
                exit 1
            fi
            ;;
    esac
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Run tests
run_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        echo -e "${YELLOW}⚠️  Skipping tests${NC}"
        return 0
    fi
    
    echo -e "${BLUE}🧪 Running tests...${NC}"
    
    case "$PROJECT_TYPE" in
        "javascript")
            if [[ -f "package.json" ]] && grep -q "\"test\"" package.json; then
                npm test
            else
                echo -e "${YELLOW}⚠️  No test script found in package.json${NC}"
            fi
            ;;
        "python")
            if [[ -f "pytest.ini" ]] || [[ -f "pyproject.toml" ]]; then
                if command -v pytest &> /dev/null; then
                    pytest
                else
                    echo -e "${YELLOW}⚠️  pytest not found${NC}"
                fi
            elif [[ -f "setup.py" ]]; then
                python setup.py test
            fi
            ;;
        "go")
            go test ./...
            ;;
        "rust")
            cargo test
            ;;
        *)
            echo -e "${YELLOW}⚠️  No test command defined for $PROJECT_TYPE${NC}"
            ;;
    esac
    
    echo -e "${GREEN}✅ Tests passed${NC}"
}

# Build project
build_project() {
    if [[ "$SKIP_BUILD" == "true" ]]; then
        echo -e "${YELLOW}⚠️  Skipping build${NC}"
        return 0
    fi
    
    echo -e "${BLUE}🔨 Building project...${NC}"
    
    case "$PROJECT_TYPE" in
        "javascript")
            if [[ -f "package.json" ]] && grep -q "\"build\"" package.json; then
                npm run build
            else
                echo -e "${YELLOW}⚠️  No build script found in package.json${NC}"
            fi
            ;;
        "python")
            if [[ -f "pyproject.toml" ]]; then
                if command -v poetry &> /dev/null; then
                    poetry build
                elif command -v build &> /dev/null; then
                    python -m build
                fi
            elif [[ -f "setup.py" ]]; then
                python setup.py sdist bdist_wheel
            fi
            ;;
        "go")
            go build ./...
            ;;
        "rust")
            cargo build --release
            ;;
        *)
            echo -e "${YELLOW}⚠️  No build command defined for $PROJECT_TYPE${NC}"
            ;;
    esac
    
    echo -e "${GREEN}✅ Build completed${NC}"
}

# Create release
create_release() {
    local version="$1"
    local bump_type="$2"
    
    echo -e "${BLUE}🚀 Creating release...${NC}"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}🔍 DRY RUN - Would create release v$version${NC}"
        return 0
    fi
    
    # Update version
    ./scripts/version-manager.sh set "$version"
    
    # Commit version update
    git add .
    git commit -m "chore: bump version to $version"
    
    # Create tag
    ./scripts/version-manager.sh tag
    
    # Push changes and tags
    if [[ "$FORCE_PUSH" == "true" ]]; then
        git push --force-with-lease
        git push --tags --force
    else
        git push
        git push --tags
    fi
    
    echo -e "${GREEN}✅ Release v$version created${NC}"
}

# Publish package
publish_package() {
    local version="$1"
    
    echo -e "${BLUE}📦 Publishing package...${NC}"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}🔍 DRY RUN - Would publish v$version${NC}"
        return 0
    fi
    
    case "$PROJECT_TYPE" in
        "javascript")
            if [[ -f "package.json" ]]; then
                echo -e "${YELLOW}⚠️  npm publish requires manual authentication${NC}"
                echo -e "${BLUE}Run: npm publish${NC}"
            fi
            ;;
        "python")
            if [[ -f "pyproject.toml" ]]; then
                if command -v twine &> /dev/null; then
                    echo -e "${YELLOW}⚠️  PyPI publish requires manual authentication${NC}"
                    echo -e "${BLUE}Run: twine upload dist/*${NC}"
                fi
            fi
            ;;
        "rust")
            if [[ -f "Cargo.toml" ]]; then
                echo -e "${YELLOW}⚠️  crates.io publish requires manual authentication${NC}"
                echo -e "${BLUE}Run: cargo publish${NC}"
            fi
            ;;
        *)
            echo -e "${YELLOW}⚠️  No publish command defined for $PROJECT_TYPE${NC}"
            ;;
    esac
}

# Create GitHub release
create_github_release() {
    local version="$1"
    
    echo -e "${BLUE}🐙 Creating GitHub release...${NC}"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}🔍 DRY RUN - Would create GitHub release v$version${NC}"
        return 0
    fi
    
    # Check if gh CLI is available
    if command -v gh &> /dev/null; then
        # Generate release notes from commits
        local last_tag=$(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || echo "")
        local release_notes=""
        
        if [[ -n "$last_tag" ]]; then
            release_notes=$(git log --pretty=format:"- %s" "$last_tag"..HEAD)
        else
            release_notes=$(git log --pretty=format:"- %s" --max-count=10)
        fi
        
        # Create GitHub release
        gh release create "v$version" \
            --title "Release v$version" \
            --notes "$release_notes" \
            --latest
        
        echo -e "${GREEN}✅ GitHub release created${NC}"
    else
        echo -e "${YELLOW}⚠️  GitHub CLI not found. Manual release creation required${NC}"
        echo -e "${BLUE}Visit: https://github.com/$(git config remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/releases/new${NC}"
    fi
}

# Show usage
show_usage() {
    echo -e "${BLUE}🤖 Universal Auto Release${NC}"
    echo -e "${BLUE}=========================${NC}"
    echo ""
    echo "Usage: $0 <bump_type> [options]"
    echo ""
    echo "Bump types:"
    echo "  patch    - Bug fixes (x.x.X)"
    echo "  minor    - New features (x.X.x)"
    echo "  major    - Breaking changes (X.x.x)"
    echo ""
    echo "Options:"
    echo "  --dry-run        - Show what would be done without executing"
    echo "  --skip-tests     - Skip running tests"
    echo "  --skip-build     - Skip building project"
    echo "  --force-push     - Force push changes and tags"
    echo ""
    echo "Examples:"
    echo "  $0 patch"
    echo "  $0 minor --dry-run"
    echo "  $0 major --skip-tests"
}

# Parse arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --force-push)
                FORCE_PUSH=true
                shift
                ;;
            patch|minor|major)
                BUMP_TYPE="$1"
                shift
                ;;
            *)
                echo -e "${RED}❌ Unknown option: $1${NC}"
                show_usage
                exit 1
                ;;
        esac
    done
}

# Main execution
main() {
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 1
    fi
    
    echo -e "${BLUE}🤖 Universal Auto Release${NC}"
    echo -e "${BLUE}=========================${NC}\n"
    
    # Parse arguments
    parse_arguments "$@"
    
    if [[ -z "$BUMP_TYPE" ]]; then
        echo -e "${RED}❌ Bump type required (patch|minor|major)${NC}"
        exit 1
    fi
    
    # Load project configuration
    load_project_config
    echo -e "${BLUE}📋 Project type: ${GREEN}$PROJECT_TYPE${NC}"
    
    # Get current version and calculate new version
    local current_version=$(./scripts/version-manager.sh info | grep "Current Version:" | awk '{print $3}')
    local new_version=$(./scripts/version-manager.sh bump "$BUMP_TYPE" --dry-run 2>/dev/null | grep "→" | awk '{print $3}' || echo "")
    
    if [[ -z "$new_version" ]]; then
        # Fallback: calculate version manually
        new_version=$(echo "$current_version" | awk -F. -v bump="$BUMP_TYPE" '
            {
                if (bump == "major") print ($1+1)".0.0"
                else if (bump == "minor") print $1".".($2+1)".0"
                else print $1"."$2".".($3+1)
            }
        ')
    fi
    
    echo -e "${BLUE}Version: ${GREEN}$current_version${NC} → ${GREEN}$new_version${NC}"
    echo -e "${BLUE}Bump type: ${GREEN}$BUMP_TYPE${NC}"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "\n${YELLOW}🔍 DRY RUN MODE - No changes will be made${NC}\n"
    fi
    
    # Execute release workflow
    check_prerequisites
    run_tests
    build_project
    create_release "$new_version" "$BUMP_TYPE"
    publish_package "$new_version"
    create_github_release "$new_version"
    
    echo -e "\n${GREEN}🎉 Release workflow completed successfully!${NC}"
    echo -e "${BLUE}📋 Summary:${NC}"
    echo -e "  Version: ${GREEN}$current_version${NC} → ${GREEN}$new_version${NC}"
    echo -e "  Project: ${GREEN}$PROJECT_TYPE${NC}"
    echo -e "  Tag: ${GREEN}v$new_version${NC}"
}

# Run if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 