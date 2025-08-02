#!/bin/bash

# Tamazight MultiLingo App - Java 17 Setup Script for macOS
# Run this script on your new Mac machine to set up Java for Android development

set -e  # Exit on any error

echo "🚀 Tamazight MultiLingo App - Java 17 Setup"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
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

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is designed for macOS only!"
    exit 1
fi

print_status "Checking system requirements..."

# Detect Mac architecture
if [[ $(uname -m) == "arm64" ]]; then
    print_status "Detected: Apple Silicon Mac (M1/M2/M3)"
    MAC_ARCH="apple_silicon"
else
    print_status "Detected: Intel-based Mac"
    MAC_ARCH="intel"
fi

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    print_warning "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add Homebrew to PATH based on architecture
    if [[ $MAC_ARCH == "apple_silicon" ]]; then
        print_status "Configuring Homebrew for Apple Silicon..."
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        print_status "Configuring Homebrew for Intel Mac..."
        # Intel Macs use /usr/local/bin/brew (usually already in PATH)
    fi
else
    print_success "Homebrew is already installed"
fi

# Update Homebrew
print_status "Updating Homebrew..."
brew update

# Check if Java 17 is already installed
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    if [[ $JAVA_VERSION == 17.* ]]; then
        print_success "Java 17 is already installed: $JAVA_VERSION"
        echo ""
        print_status "Skipping Java installation..."
    else
        print_warning "Different Java version found: $JAVA_VERSION"
        print_status "Installing Java 17 alongside existing version..."
    fi
else
    print_status "Java not found. Installing Java 17..."
fi

# Install OpenJDK 17
print_status "Installing OpenJDK 17..."
brew install openjdk@17

# Determine the correct path based on architecture
if [[ $MAC_ARCH == "apple_silicon" ]]; then
    # Apple Silicon Mac - Homebrew installs to /opt/homebrew
    JAVA_PATH="/opt/homebrew/opt/openjdk@17"
    JAVA_BIN_PATH="/opt/homebrew/opt/openjdk@17/bin"
    print_status "Using Apple Silicon paths: $JAVA_PATH"
else
    # Intel Mac - Homebrew installs to /usr/local
    JAVA_PATH="/usr/local/opt/openjdk@17"
    JAVA_BIN_PATH="/usr/local/opt/openjdk@17/bin"
    print_status "Using Intel Mac paths: $JAVA_PATH"
fi

# Configure shell environment
print_status "Configuring shell environment..."

# Backup existing .zshrc
if [[ -f ~/.zshrc ]]; then
    cp ~/.zshrc ~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)
    print_status "Backed up existing .zshrc"
fi

# Add Java to PATH and set JAVA_HOME
{
    echo ""
    echo "# Java 17 Configuration for Tamazight MultiLingo App"
    echo "export JAVA_HOME=\"$JAVA_PATH\""
    echo "export PATH=\"$JAVA_BIN_PATH:\$PATH\""
    echo "export CPPFLAGS=\"-I$JAVA_PATH/include\""
} >> ~/.zshrc

# Apply changes to current session
export JAVA_HOME="$JAVA_PATH"
export PATH="$JAVA_BIN_PATH:$PATH"
export CPPFLAGS="-I$JAVA_PATH/include"

# Create system symlink (requires sudo)
print_status "Creating system-wide Java symlink (requires sudo)..."
if sudo ln -sfn "$JAVA_PATH/libexec/openjdk.jdk" /Library/Java/JavaVirtualMachines/openjdk-17.jdk; then
    print_success "System symlink created successfully"
else
    print_warning "Failed to create system symlink (this is optional)"
fi

# Verify installation
print_status "Verifying Java installation..."

if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    print_success "Java installed successfully!"
    echo "  $JAVA_VERSION"
else
    print_error "Java installation verification failed!"
    exit 1
fi

if command -v javac &> /dev/null; then
    JAVAC_VERSION=$(javac -version 2>&1)
    print_success "Java compiler available!"
    echo "  $JAVAC_VERSION"
else
    print_warning "Java compiler not found in PATH"
fi

# Check JAVA_HOME
if [[ -n "$JAVA_HOME" ]]; then
    print_success "JAVA_HOME is set: $JAVA_HOME"
else
    print_warning "JAVA_HOME is not set"
fi

echo ""
echo "============================================="
print_success "Java 17 setup completed successfully!"
echo ""
print_status "Next steps:"
echo "  1. Restart your terminal or run: source ~/.zshrc"
echo "  2. Clone/copy the Tamazight MultiLingo App project"
echo "  3. Install Node.js and npm (if not already installed)"
echo "  4. Run 'npm install' in the project directory"
echo "  5. Copy your .env file with the Gemini API key"
echo "  6. Start development with 'npx expo start'"
echo ""
print_status "For TFLite integration, follow: documentation/TFLITE_INTEGRATION_GUIDE.md"
echo ""
print_success "Your Mac is now ready for Tamazight MultiLingo App development! 🎉"
