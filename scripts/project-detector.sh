#!/bin/bash
# 🤖 PROJECT DETECTOR - Universal Language Detection
# Automatically detects project type based on files present
# Universal Project Detection and Automation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detection results
PROJECT_TYPE=""
PACKAGE_MANAGER=""
BUILD_TOOL=""
VERSION_FILE=""

# Detection functions
detect_javascript() {
    if [[ -f "package.json" ]]; then
        PROJECT_TYPE="javascript"
        if [[ -f "yarn.lock" ]]; then
            PACKAGE_MANAGER="yarn"
        elif [[ -f "pnpm-lock.yaml" ]]; then
            PACKAGE_MANAGER="pnpm"
        else
            PACKAGE_MANAGER="npm"
        fi
        VERSION_FILE="package.json"
        return 0
    fi
    return 1
}

detect_python() {
    if [[ -f "pyproject.toml" ]]; then
        PROJECT_TYPE="python"
        PACKAGE_MANAGER="poetry"
        VERSION_FILE="pyproject.toml"
        return 0
    elif [[ -f "requirements.txt" ]] || [[ -f "setup.py" ]]; then
        PROJECT_TYPE="python"
        PACKAGE_MANAGER="pip"
        VERSION_FILE="setup.py"
        return 0
    fi
    return 1
}

detect_go() {
    if [[ -f "go.mod" ]]; then
        PROJECT_TYPE="go"
        PACKAGE_MANAGER="go"
        BUILD_TOOL="go"
        VERSION_FILE="go.mod"
        return 0
    fi
    return 1
}

detect_rust() {
    if [[ -f "Cargo.toml" ]]; then
        PROJECT_TYPE="rust"
        PACKAGE_MANAGER="cargo"
        BUILD_TOOL="cargo"
        VERSION_FILE="Cargo.toml"
        return 0
    fi
    return 1
}

detect_php() {
    if [[ -f "composer.json" ]]; then
        PROJECT_TYPE="php"
        PACKAGE_MANAGER="composer"
        VERSION_FILE="composer.json"
        return 0
    fi
    return 1
}

detect_java() {
    if [[ -f "pom.xml" ]]; then
        PROJECT_TYPE="java"
        PACKAGE_MANAGER="maven"
        BUILD_TOOL="mvn"
        VERSION_FILE="pom.xml"
        return 0
    elif [[ -f "build.gradle" ]] || [[ -f "build.gradle.kts" ]]; then
        PROJECT_TYPE="java"
        PACKAGE_MANAGER="gradle"
        BUILD_TOOL="gradle"
        VERSION_FILE="build.gradle"
        return 0
    fi
    return 1
}

detect_csharp() {
    if [[ -f "*.csproj" ]] || [[ -f "*.sln" ]]; then
        PROJECT_TYPE="csharp"
        PACKAGE_MANAGER="dotnet"
        BUILD_TOOL="dotnet"
        VERSION_FILE="*.csproj"
        return 0
    fi
    return 1
}

detect_ruby() {
    if [[ -f "Gemfile" ]]; then
        PROJECT_TYPE="ruby"
        PACKAGE_MANAGER="gem"
        BUILD_TOOL="bundle"
        VERSION_FILE="Gemfile"
        return 0
    fi
    return 1
}

# Main detection logic
detect_project_type() {
    echo -e "${BLUE}🔍 Detecting project type...${NC}"
    
    # Try each detector
    if detect_javascript; then
        echo -e "${GREEN}✅ JavaScript/Node.js project detected${NC}"
    elif detect_python; then
        echo -e "${GREEN}✅ Python project detected${NC}"
    elif detect_go; then
        echo -e "${GREEN}✅ Go project detected${NC}"
    elif detect_rust; then
        echo -e "${GREEN}✅ Rust project detected${NC}"
    elif detect_php; then
        echo -e "${GREEN}✅ PHP project detected${NC}"
    elif detect_java; then
        echo -e "${GREEN}✅ Java project detected${NC}"
    elif detect_csharp; then
        echo -e "${GREEN}✅ C# project detected${NC}"
    elif detect_ruby; then
        echo -e "${GREEN}✅ Ruby project detected${NC}"
    else
        echo -e "${YELLOW}⚠️  Generic project detected (no specific language files found)${NC}"
        PROJECT_TYPE="generic"
        PACKAGE_MANAGER="git"
        VERSION_FILE="VERSION"
    fi
}

# Output results
output_results() {
    echo -e "\n${BLUE}📋 Detection Results:${NC}"
    echo -e "  Project Type: ${GREEN}${PROJECT_TYPE}${NC}"
    echo -e "  Package Manager: ${GREEN}${PACKAGE_MANAGER}${NC}"
    echo -e "  Build Tool: ${GREEN}${BUILD_TOOL:-N/A}${NC}"
    echo -e "  Version File: ${GREEN}${VERSION_FILE}${NC}"
    
    # Export for other scripts
    echo "PROJECT_TYPE=${PROJECT_TYPE}" > .automation/project.env
    echo "PACKAGE_MANAGER=${PACKAGE_MANAGER}" >> .automation/project.env
    echo "BUILD_TOOL=${BUILD_TOOL}" >> .automation/project.env
    echo "VERSION_FILE=${VERSION_FILE}" >> .automation/project.env
}

# Main execution
main() {
    echo -e "${BLUE}🤖 Universal Project Detector${NC}"
    echo -e "${BLUE}=============================${NC}\n"
    
    detect_project_type
    output_results
    
    echo -e "\n${GREEN}✅ Detection complete! Results saved to .automation/project.env${NC}"
}

# Run if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 