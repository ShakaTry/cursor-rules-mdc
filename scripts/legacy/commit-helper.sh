#!/bin/bash
# 🤖 COMMIT HELPER - Universal Commit Assistant
# Validates conventional commits and manages automated workflow
# Universal Commit Helper with Intelligence

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMMIT_TYPES=("feat" "fix" "docs" "style" "refactor" "perf" "test" "build" "ci" "chore" "revert")
BREAKING_CHANGE_INDICATOR="!"

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

# Validate conventional commit format
validate_commit_format() {
    local commit_msg="$1"
    
    # Check basic format: type(scope): description
    if [[ ! "$commit_msg" =~ ^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?:\ .+ ]]; then
        echo -e "${RED}❌ Invalid commit format!${NC}"
        echo -e "${YELLOW}Expected format: type(scope): description${NC}"
        echo -e "${YELLOW}Example: feat(auth): add login functionality${NC}"
        echo -e "${YELLOW}Valid types: ${COMMIT_TYPES[*]}${NC}"
        return 1
    fi
    
    # Check description length (min 10 chars)
    local description=$(echo "$commit_msg" | sed 's/^[^:]*: //')
    if [[ ${#description} -lt 10 ]]; then
        echo -e "${RED}❌ Description too short! Minimum 10 characters.${NC}"
        return 1
    fi
    
    # Check description length (max 72 chars for first line)
    if [[ ${#commit_msg} -gt 72 ]]; then
        echo -e "${YELLOW}⚠️  Commit message is long (${#commit_msg} chars). Consider shortening.${NC}"
    fi
    
    echo -e "${GREEN}✅ Commit format is valid${NC}"
    return 0
}

# Determine version bump type
get_version_bump_type() {
    local commit_msg="$1"
    
    # Breaking change (major)
    if [[ "$commit_msg" =~ $BREAKING_CHANGE_INDICATOR ]]; then
        echo "major"
        return
    fi
    
    # Feature (minor)
    if [[ "$commit_msg" =~ ^feat ]]; then
        echo "minor"
        return
    fi
    
    # Fix (patch)
    if [[ "$commit_msg" =~ ^fix ]]; then
        echo "patch"
        return
    fi
    
    # Other types (patch)
    echo "patch"
}

# Run pre-commit checks
run_pre_commit_checks() {
    echo -e "${BLUE}🔍 Running pre-commit checks...${NC}"
    
    # Check if there are staged files
    if [[ -z "$(git diff --cached --name-only)" ]]; then
        echo -e "${RED}❌ No staged files found!${NC}"
        echo -e "${YELLOW}Use: git add <files> before committing${NC}"
        return 1
    fi
    
    # Run linting based on project type
    case "$PROJECT_TYPE" in
        "javascript")
            if [[ -f "package.json" ]] && grep -q "lint" package.json; then
                echo -e "${BLUE}📋 Running ESLint...${NC}"
                npm run lint || {
                    echo -e "${YELLOW}⚠️  Linting issues found. Fix them or use --no-verify to skip${NC}"
                    return 1
                }
            fi
            ;;
        "python")
            if command -v flake8 &> /dev/null; then
                echo -e "${BLUE}📋 Running flake8...${NC}"
                flake8 . || {
                    echo -e "${YELLOW}⚠️  Python linting issues found${NC}"
                    return 1
                }
            fi
            ;;
        "go")
            echo -e "${BLUE}📋 Running go fmt...${NC}"
            go fmt ./... || return 1
            echo -e "${BLUE}📋 Running go vet...${NC}"
            go vet ./... || return 1
            ;;
        "rust")
            echo -e "${BLUE}📋 Running cargo fmt...${NC}"
            cargo fmt --check || {
                echo -e "${YELLOW}⚠️  Code formatting issues found. Run: cargo fmt${NC}"
                return 1
            }
            echo -e "${BLUE}📋 Running cargo clippy...${NC}"
            cargo clippy -- -D warnings || return 1
            ;;
    esac
    
    echo -e "${GREEN}✅ Pre-commit checks passed${NC}"
    return 0
}

# Execute commit with automatic workflow
execute_commit() {
    local commit_msg="$1"
    local skip_checks="$2"
    
    echo -e "${BLUE}🚀 Executing automated commit workflow...${NC}"
    
    # Run pre-commit checks unless skipped
    if [[ "$skip_checks" != "--no-verify" ]]; then
        run_pre_commit_checks || return 1
    fi
    
    # Commit the changes
    git commit -m "$commit_msg"
    
    # Get version bump type
    local bump_type=$(get_version_bump_type "$commit_msg")
    echo -e "${BLUE}📦 Version bump type: ${GREEN}${bump_type}${NC}"
    
    # Version bump based on project type
    case "$PROJECT_TYPE" in
        "javascript")
            if [[ -f "package.json" ]]; then
                npm version "$bump_type" --no-git-tag-version
                echo -e "${GREEN}✅ package.json version updated${NC}"
            fi
            ;;
        "python")
            if [[ -f "pyproject.toml" ]]; then
                # Update version in pyproject.toml (simplified)
                echo -e "${YELLOW}⚠️  Manual version update needed in pyproject.toml${NC}"
            fi
            ;;
        "generic")
            if [[ -f "VERSION" ]]; then
                # Simple version bump for VERSION file
                local current_version=$(cat VERSION)
                echo -e "${BLUE}Current version: ${current_version}${NC}"
                echo -e "${YELLOW}⚠️  Manual version update needed in VERSION file${NC}"
            fi
            ;;
    esac
    
    echo -e "${GREEN}✅ Commit completed successfully!${NC}"
}

# Show usage
show_usage() {
    echo -e "${BLUE}🤖 Universal Commit Helper${NC}"
    echo -e "${BLUE}=========================${NC}"
    echo ""
    echo "Usage: $0 \"commit message\" [--no-verify]"
    echo ""
    echo "Examples:"
    echo "  $0 \"feat(auth): add login functionality\""
    echo "  $0 \"fix: resolve memory leak issue\""
    echo "  $0 \"docs: update installation guide\""
    echo "  $0 \"feat!: breaking change in API\" --no-verify"
    echo ""
    echo "Valid commit types: ${COMMIT_TYPES[*]}"
    echo "Use ! after type for breaking changes"
}

# Main execution
main() {
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 1
    fi
    
    local commit_msg="$1"
    local skip_checks="$2"
    
    echo -e "${BLUE}🤖 Universal Commit Helper${NC}"
    echo -e "${BLUE}=========================${NC}\n"
    
    # Load project configuration
    load_project_config
    echo -e "${BLUE}📋 Project type: ${GREEN}${PROJECT_TYPE}${NC}\n"
    
    # Validate commit format
    validate_commit_format "$commit_msg" || exit 1
    
    # Execute commit workflow
    execute_commit "$commit_msg" "$skip_checks"
    
    echo -e "\n${GREEN}🎉 Commit workflow completed successfully!${NC}"
    echo -e "${YELLOW}💡 Next: Push changes with 'git push'${NC}"
}

# Run if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 