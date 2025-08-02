#!/bin/bash

# Tamazight MultiLingo App - Setup Verification Script
# Run this script to verify your development environment is properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

echo "🔍 Tamazight MultiLingo App - Environment Verification"
echo "===================================================="
echo ""

ERRORS=0
WARNINGS=0

# Check Java installation
print_status "Checking Java installation..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    if [[ $JAVA_VERSION == 17.* ]]; then
        print_success "Java 17 is installed: $JAVA_VERSION"
    else
        print_warning "Java is installed but not version 17: $JAVA_VERSION"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    print_error "Java is not installed or not in PATH"
    ERRORS=$((ERRORS + 1))
fi

# Check Java compiler
print_status "Checking Java compiler..."
if command -v javac &> /dev/null; then
    JAVAC_VERSION=$(javac -version 2>&1)
    print_success "Java compiler available: $JAVAC_VERSION"
else
    print_error "Java compiler (javac) not found"
    ERRORS=$((ERRORS + 1))
fi

# Check JAVA_HOME
print_status "Checking JAVA_HOME..."
if [[ -n "$JAVA_HOME" ]]; then
    print_success "JAVA_HOME is set: $JAVA_HOME"
else
    print_warning "JAVA_HOME is not set"
    WARNINGS=$((WARNINGS + 1))
fi

# Check Node.js
print_status "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is not installed"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
print_status "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: v$NPM_VERSION"
else
    print_error "npm is not installed"
    ERRORS=$((ERRORS + 1))
fi

# Check Expo CLI
print_status "Checking Expo CLI..."
if command -v expo &> /dev/null; then
    EXPO_VERSION=$(expo --version)
    print_success "Expo CLI is installed: $EXPO_VERSION"
elif npx expo --version &> /dev/null; then
    EXPO_VERSION=$(npx expo --version)
    print_success "Expo CLI available via npx: $EXPO_VERSION"
else
    print_warning "Expo CLI not found (will use npx)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check project dependencies
print_status "Checking project dependencies..."
if [[ -f "package.json" ]]; then
    print_success "package.json found"
    
    if [[ -d "node_modules" ]]; then
        print_success "node_modules directory exists"
    else
        print_warning "node_modules not found - run 'npm install'"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    print_error "package.json not found - are you in the project directory?"
    ERRORS=$((ERRORS + 1))
fi

# Check .env file
print_status "Checking environment configuration..."
if [[ -f ".env" ]]; then
    print_success ".env file found"
    
    if grep -q "EXPO_PUBLIC_GEMINI_API_KEY" .env; then
        if grep -q "your-gemini-api-key-here" .env; then
            print_warning "Gemini API key needs to be configured in .env"
            WARNINGS=$((WARNINGS + 1))
        else
            print_success "Gemini API key is configured"
        fi
    else
        print_warning "EXPO_PUBLIC_GEMINI_API_KEY not found in .env"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    print_warning ".env file not found - create one with your API keys"
    WARNINGS=$((WARNINGS + 1))
fi

# Check key project files
print_status "Checking project structure..."
KEY_FILES=(
    "app/(tabs)/index.tsx"
    "services/geminiService.ts"
    "services/offlineAIService.ts"
    "documentation/TFLITE_INTEGRATION_GUIDE.md"
)

for file in "${KEY_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        print_success "$file exists"
    else
        print_error "$file is missing"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check Android development readiness
print_status "Checking Android development readiness..."
if [[ -d "android" ]]; then
    print_success "Android directory exists"
    
    if [[ -f "android/build.gradle" ]]; then
        print_success "Android build configuration found"
    else
        print_warning "Android build.gradle not found"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    print_warning "Android directory not found (will be created by Expo)"
    WARNINGS=$((WARNINGS + 1))
fi

# Test basic app startup (dry run)
print_status "Testing app configuration..."
if command -v node &> /dev/null && [[ -f "package.json" ]] && [[ -d "node_modules" ]]; then
    if node -e "require('./package.json')" &> /dev/null; then
        print_success "App configuration is valid"
    else
        print_error "App configuration has issues"
        ERRORS=$((ERRORS + 1))
    fi
else
    print_warning "Cannot test app configuration (missing dependencies)"
    WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
echo "===================================================="
echo "📊 Verification Summary"
echo "===================================================="

if [[ $ERRORS -eq 0 && $WARNINGS -eq 0 ]]; then
    print_success "Perfect! Your environment is fully configured ✨"
    echo ""
    echo "🚀 You're ready to:"
    echo "   • Start development: npx expo start"
    echo "   • Integrate TFLite models"
    echo "   • Submit to the hackathon"
elif [[ $ERRORS -eq 0 ]]; then
    print_warning "Good! Minor issues found: $WARNINGS warnings"
    echo ""
    echo "✅ You can start development, but consider fixing warnings"
    echo "🚀 Run: npx expo start"
else
    print_error "Issues found: $ERRORS errors, $WARNINGS warnings"
    echo ""
    echo "❌ Please fix the errors before proceeding"
    echo "📖 Check the setup guides:"
    echo "   • SETUP_NEW_MAC.md"
    echo "   • documentation/JAVA_SETUP_GUIDE.md"
fi

echo ""
exit $ERRORS
