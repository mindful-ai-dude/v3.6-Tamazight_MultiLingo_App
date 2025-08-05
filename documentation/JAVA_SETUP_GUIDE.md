# Java Development Kit (JDK) Setup Guide for macOS

This guide will help you install and configure Java 17 on your Mac for Android development with the Tamazight MultiLingo app.

## 🎯 Overview

Java 17 is required for:
- Android development and building
- TensorFlow Lite Android integration
- React Native Android compilation

## 📋 Prerequisites

- macOS (any version)
- Homebrew package manager
- Terminal access

## 🚀 Installation Steps

### Step 1: Install Homebrew (if not already installed)

```bash
# Check if Homebrew is installed
brew --version

# If not installed, install Homebrew:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Java 17

```bash
# Install OpenJDK 17 via Homebrew
brew install openjdk@17
```

**Expected Output:**
- Download and installation progress bars
- Installation of dependencies (libpng, freetype, etc.)
- Final installation confirmation

### Step 3: Configure Java PATH

**For Intel-based Macs:**
```bash
# Add Java to your PATH (for current session)
export PATH="/usr/local/opt/openjdk@17/bin:$PATH"

# Add Java to your PATH permanently
echo 'export PATH="/usr/local/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME="/usr/local/opt/openjdk@17"' >> ~/.zshrc

# Reload your shell configuration
source ~/.zshrc
```

**For Apple Silicon Macs (M1/M2/M3):**
```bash
# Add Java to your PATH (for current session)
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

# Add Java to your PATH permanently
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc

# Reload your shell configuration
source ~/.zshrc
```

### Step 4: Create System Symlink (Optional but Recommended)

**For Intel-based Macs:**
```bash
# Create system-wide Java symlink
sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

**For Apple Silicon Macs:**
```bash
# Create system-wide Java symlink
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

### Step 5: Set Environment Variables for Compilers

**For Intel-based Macs:**
```bash
# Add compiler flags to your shell profile
echo 'export CPPFLAGS="-I/usr/local/opt/openjdk@17/include"' >> ~/.zshrc

# Reload configuration
source ~/.zshrc
```

**For Apple Silicon Macs:**
```bash
# Add compiler flags to your shell profile
echo 'export CPPFLAGS="-I/opt/homebrew/opt/openjdk@17/include"' >> ~/.zshrc

# Reload configuration
source ~/.zshrc
```

## ✅ Verification

### Test Java Installation

```bash
# Check Java version
java -version

# Expected output:
# openjdk version "17.0.16" 2025-07-15
# OpenJDK Runtime Environment Homebrew (build 17.0.16+0)
# OpenJDK 64-Bit Server VM Homebrew (build 17.0.16+0, mixed mode, sharing)

# Check Java compiler
javac -version

# Expected output:
# javac 17.0.16
```

### Test JAVA_HOME (if needed)

```bash
# Check JAVA_HOME
echo $JAVA_HOME

# If empty, set it:
echo 'export JAVA_HOME="/usr/local/opt/openjdk@17"' >> ~/.zshrc
source ~/.zshrc
```

## 🔧 Android Studio Integration (Optional)

If you plan to use Android Studio:

1. **Open Android Studio**
2. **Go to**: File → Project Structure → SDK Location
3. **Set JDK Location**: `/usr/local/opt/openjdk@17`

## 🚨 Troubleshooting

### Issue: "Unable to locate a Java Runtime"

**Solution:**
```bash
# Ensure PATH is correctly set
export PATH="/usr/local/opt/openjdk@17/bin:$PATH"

# Verify installation location
ls -la /usr/local/opt/openjdk@17/bin/java
```

### Issue: Permission Denied

**Solution:**
```bash
# Fix permissions
sudo chown -R $(whoami) /usr/local/opt/openjdk@17
```

### Issue: Multiple Java Versions

**Solution:**
```bash
# List all Java installations
ls -la /Library/Java/JavaVirtualMachines/

# Use specific Java version
export JAVA_HOME="/usr/local/opt/openjdk@17"
```

### Issue: VS Code Shows "Java: Error"

**Problem:** VS Code's Java extension tries to analyze the React Native project as a Java project and fails.

**Solution:** The project includes `.vscode/settings.json` that disables Java analysis:
```json
{
  "java.compile.nullAnalysis.mode": "disabled",
  "java.configuration.detectJavaRuntime": false,
  "java.import.exclusions": ["**/android/**", "**/node_modules/**"]
}
```

**Note:** This is purely cosmetic and doesn't affect development. The error appears because React Native projects have Android Java files but aren't traditional Java projects.

## 📱 React Native Android Setup

After Java installation, ensure Android development is ready:

```bash
# Navigate to your project
cd /path/to/Tamazight_MultiLingo_App

# Install dependencies
npm install

# Start the development server
npx expo start

# For Android builds (when ready)
npx expo run:android
```

## 🎯 Quick Setup Script

For faster setup, you can run this all-in-one script:

```bash
#!/bin/bash
echo "🚀 Setting up Java 17 for Tamazight MultiLingo App..."

# Install Java 17
brew install openjdk@17

# Configure PATH
echo 'export PATH="/usr/local/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME="/usr/local/opt/openjdk@17"' >> ~/.zshrc
echo 'export CPPFLAGS="-I/usr/local/opt/openjdk@17/include"' >> ~/.zshrc

# Create system symlink
sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# Reload configuration
source ~/.zshrc

# Verify installation
echo "✅ Java installation complete!"
java -version
```

## 📋 Next Steps

After Java installation:

1. **Clone/Copy the Tamazight MultiLingo App** to your new machine
2. **Install Node.js and npm** (if not already installed)
3. **Run `npm install`** in the project directory
4. **Copy your `.env` file** with the Gemini API key
5. **Follow the TFLite integration guide** when your model is ready

## 🏆 Success Indicators

You'll know Java is properly installed when:
- ✅ `java -version` shows OpenJDK 17.0.16
- ✅ `javac -version` shows javac 17.0.16
- ✅ No "Unable to locate Java Runtime" errors
- ✅ Android builds work without Java-related errors

---

**📞 Support**: If you encounter any issues, refer to the troubleshooting section or check the official OpenJDK documentation.
