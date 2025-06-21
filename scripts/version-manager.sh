#!/bin/bash
# 🤖 VERSION MANAGER - Universal Version Management
# Manages versions across different project types
# Universal Version Management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Get current version based on project type
get_current_version() {
    case "$PROJECT_TYPE" in
        "javascript")
            if [[ -f "package.json" ]]; then
                node -p "require('./package.json').version"
            fi
            ;;
        "python")
            if [[ -f "pyproject.toml" ]]; then
                grep -E '^version = ' pyproject.toml | sed 's/version = "\(.*\)"/\1/'
            elif [[ -f "setup.py" ]]; then
                grep -E 'version=' setup.py | sed 's/.*version="\(.*\)".*/\1/'
            fi
            ;;
        "go")
            if [[ -f "go.mod" ]]; then
                # Go modules don't have version in go.mod, check git tags
                git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"
            fi
            ;;
        "rust")
            if [[ -f "Cargo.toml" ]]; then
                grep -E '^version = ' Cargo.toml | sed 's/version = "\(.*\)"/\1/'
            fi
            ;;
        "php")
            if [[ -f "composer.json" ]]; then
                node -p "JSON.parse(require('fs').readFileSync('composer.json')).version" 2>/dev/null || echo "0.0.0"
            fi
            ;;
        "java")
            if [[ -f "pom.xml" ]]; then
                grep -E '<version>' pom.xml | head -1 | sed 's/.*<version>\(.*\)<\/version>.*/\1/'
            fi
            ;;
        "generic")
            if [[ -f "VERSION" ]]; then
                cat VERSION
            else
                echo "0.0.0"
            fi
            ;;
        *)
            echo "0.0.0"
            ;;
    esac
}

# Increment version based on bump type
increment_version() {
    local current_version="$1"
    local bump_type="$2"
    
    # Remove 'v' prefix if present
    current_version=${current_version#v}
    
    # Split version into parts
    IFS='.' read -ra VERSION_PARTS <<< "$current_version"
    local major=${VERSION_PARTS[0]:-0}
    local minor=${VERSION_PARTS[1]:-0}
    local patch=${VERSION_PARTS[2]:-0}
    
    case "$bump_type" in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch")
            patch=$((patch + 1))
            ;;
        *)
            echo -e "${RED}❌ Invalid bump type: $bump_type${NC}"
            return 1
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

# Update version in project files
update_version() {
    local new_version="$1"
    
    echo -e "${BLUE}📦 Updating version to: ${GREEN}$new_version${NC}"
    
    case "$PROJECT_TYPE" in
        "javascript")
            if [[ -f "package.json" ]]; then
                # Use npm version command (safer than manual edit)
                npm version "$new_version" --no-git-tag-version
                echo -e "${GREEN}✅ Updated package.json${NC}"
            fi
            ;;
        "python")
            if [[ -f "pyproject.toml" ]]; then
                sed -i "s/^version = .*/version = \"$new_version\"/" pyproject.toml
                echo -e "${GREEN}✅ Updated pyproject.toml${NC}"
            elif [[ -f "setup.py" ]]; then
                sed -i "s/version=\".*\"/version=\"$new_version\"/" setup.py
                echo -e "${GREEN}✅ Updated setup.py${NC}"
            fi
            ;;
        "rust")
            if [[ -f "Cargo.toml" ]]; then
                sed -i "s/^version = .*/version = \"$new_version\"/" Cargo.toml
                echo -e "${GREEN}✅ Updated Cargo.toml${NC}"
            fi
            ;;
        "php")
            if [[ -f "composer.json" ]]; then
                # Use jq if available, otherwise manual edit
                if command -v jq &> /dev/null; then
                    jq ".version = \"$new_version\"" composer.json > tmp.json && mv tmp.json composer.json
                else
                    sed -i "s/\"version\": \".*\"/\"version\": \"$new_version\"/" composer.json
                fi
                echo -e "${GREEN}✅ Updated composer.json${NC}"
            fi
            ;;
        "java")
            if [[ -f "pom.xml" ]]; then
                sed -i "0,/<version>.*<\/version>/s/<version>.*<\/version>/<version>$new_version<\/version>/" pom.xml
                echo -e "${GREEN}✅ Updated pom.xml${NC}"
            fi
            ;;
        "generic")
            echo "$new_version" > VERSION
            echo -e "${GREEN}✅ Updated VERSION file${NC}"
            ;;
    esac
    
    # Also update VERSION file if it exists (for consistency)
    if [[ -f "VERSION" ]] && [[ "$PROJECT_TYPE" != "generic" ]]; then
        echo "$new_version" > VERSION
        echo -e "${GREEN}✅ Updated VERSION file${NC}"
    fi
}

# Create git tag
create_git_tag() {
    local version="$1"
    local tag_name="v$version"
    
    echo -e "${BLUE}🏷️  Creating git tag: ${GREEN}$tag_name${NC}"
    
    # Check if tag already exists
    if git tag -l | grep -q "^$tag_name$"; then
        echo -e "${YELLOW}⚠️  Tag $tag_name already exists${NC}"
        return 1
    fi
    
    # Create annotated tag
    git tag -a "$tag_name" -m "Release version $version"
    echo -e "${GREEN}✅ Created git tag: $tag_name${NC}"
}

# Show current version info
show_version_info() {
    local current_version=$(get_current_version)
    
    echo -e "${BLUE}📋 Version Information:${NC}"
    echo -e "  Project Type: ${GREEN}$PROJECT_TYPE${NC}"
    echo -e "  Current Version: ${GREEN}$current_version${NC}"
    echo -e "  Version File: ${GREEN}$VERSION_FILE${NC}"
    
    # Show available bump types
    echo -e "\n${BLUE}Available bump types:${NC}"
    echo -e "  ${YELLOW}patch${NC} - Bug fixes (x.x.X)"
    echo -e "  ${YELLOW}minor${NC} - New features (x.X.x)"
    echo -e "  ${YELLOW}major${NC} - Breaking changes (X.x.x)"
}

# Show usage
show_usage() {
    echo -e "${BLUE}🤖 Universal Version Manager${NC}"
    echo -e "${BLUE}============================${NC}"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  info                 - Show current version information"
    echo "  bump <type>         - Bump version (patch|minor|major)"
    echo "  set <version>       - Set specific version"
    echo "  tag                 - Create git tag for current version"
    echo ""
    echo "Examples:"
    echo "  $0 info"
    echo "  $0 bump patch"
    echo "  $0 bump minor"
    echo "  $0 set 2.1.0"
    echo "  $0 tag"
}

# Main execution
main() {
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 1
    fi
    
    local command="$1"
    
    echo -e "${BLUE}🤖 Universal Version Manager${NC}"
    echo -e "${BLUE}============================${NC}\n"
    
    # Load project configuration
    load_project_config
    
    case "$command" in
        "info")
            show_version_info
            ;;
        "bump")
            if [[ $# -lt 2 ]]; then
                echo -e "${RED}❌ Bump type required (patch|minor|major)${NC}"
                exit 1
            fi
            
            local bump_type="$2"
            local current_version=$(get_current_version)
            local new_version=$(increment_version "$current_version" "$bump_type")
            
            if [[ $? -eq 0 ]]; then
                echo -e "${BLUE}Version bump: ${GREEN}$current_version${NC} → ${GREEN}$new_version${NC}"
                update_version "$new_version"
                echo -e "\n${GREEN}✅ Version bumped successfully!${NC}"
            fi
            ;;
        "set")
            if [[ $# -lt 2 ]]; then
                echo -e "${RED}❌ Version required${NC}"
                exit 1
            fi
            
            local new_version="$2"
            update_version "$new_version"
            echo -e "\n${GREEN}✅ Version set successfully!${NC}"
            ;;
        "tag")
            local current_version=$(get_current_version)
            create_git_tag "$current_version"
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $command${NC}"
            show_usage
            exit 1
            ;;
    esac
}

# Run if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 