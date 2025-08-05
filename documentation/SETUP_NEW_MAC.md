# 🚀 Tamazight MultiLingo App - New Mac Setup Guide

Quick setup guide for running the Tamazight MultiLingo App on your new **Intel-based iMac** with more RAM.

## 🖥️ Target System
- **Intel-based iMac** (confirmed)
- **Higher RAM** for optimal TFLite model performance
- **macOS** (any version)

## 📋 Prerequisites Checklist

- [ ] macOS (any version)
- [ ] Internet connection
- [ ] Terminal access
- [ ] Admin privileges (for Java system symlink)

## ⚡ Quick Setup (Recommended)

### Option 1: Automated Script Setup

```bash
# 1. Navigate to the project directory
cd /path/to/Tamazight_MultiLingo_App

# 2. Run the automated Java setup script
./scripts/setup-java-macos.sh

# 3. Restart terminal or reload shell
source ~/.zshrc

# 4. Verify everything is working
./scripts/verify-setup.sh
```

### Option 2: Manual Setup

If you prefer manual installation, follow: `documentation/JAVA_SETUP_GUIDE.md`

## 🔧 Complete Development Environment Setup

### Step 1: Install Java 17 (Required for Android)

```bash
# Run the automated script (detects Intel vs Apple Silicon automatically)
./scripts/setup-java-macos.sh
```

**Note for Intel iMac:** The script will automatically detect your Intel architecture and use the correct paths (`/usr/local/opt/openjdk@17`) instead of Apple Silicon paths.

### Step 2: Install Node.js (if not already installed)

```bash
# Install Node.js via Homebrew
brew install node

# Verify installation
node --version
npm --version
```

### Step 3: Install Project Dependencies

```bash
# Install all npm dependencies
npm install

# Install Expo CLI globally (if needed)
npm install -g @expo/cli
```

### Step 4: Configure Environment Variables

```bash
# Copy your .env file from the previous machine
# Or create a new one with your Gemini API key:

cat > .env << EOF
# Google Gemini API Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here

# App Configuration
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_API_URL=https://your-api-url.com

# TFLite Model Configuration
EXPO_PUBLIC_GEMMA_MODEL_PATH=./models/gemma-3n
# EXPO_PUBLIC_GEMMA_MODEL_PATH=./models/gemma-3n-4b-tamazight-ft.tflite
EOF
```

### Step 5: Start Development

```bash
# Start the Expo development server
npx expo start

# Choose your platform:
# - Press 'w' for web
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code for physical device
```

## 🧪 Verification Tests

### Test Java Installation

```bash
java -version
# Expected: openjdk version "17.0.16" 2025-07-15

javac -version
# Expected: javac 17.0.16
```

### Test Node.js Installation

```bash
node --version
# Expected: v18.x.x or higher

npm --version
# Expected: 9.x.x or higher
```

### Test App Startup

```bash
npx expo start
# Expected: Metro bundler starts successfully
# Expected: QR code appears
# Expected: No Java-related errors
```

## 🔄 Migration from Previous Machine

### Files to Copy

1. **Environment Configuration**:
   ```bash
   # Copy your .env file with API keys
   scp user@old-mac:/path/to/project/.env ./
   ```

2. **TFLite Model (when ready)**:
   ```bash
   # Copy the TFLite model file
   mkdir -p assets/ml/
   scp user@old-mac:/path/to/model.tflite ./assets/ml/
   ```

3. **Custom Audio Files (if any)**:
   ```bash
   # Copy any custom audio recordings
   scp -r user@old-mac:/path/to/project/assets/audio/ ./assets/
   ```

## 🚨 Troubleshooting

### Issue: "Unable to locate a Java Runtime"

**Solution for Intel iMac:**
```bash
# Re-run the Java setup script
./scripts/setup-java-macos.sh

# Or manually set PATH for Intel Mac
export PATH="/usr/local/opt/openjdk@17/bin:$PATH"
export JAVA_HOME="/usr/local/opt/openjdk@17"
source ~/.zshrc
```

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Expo start fails

**Solution:**
```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Clear Expo cache
npx expo install --fix
```

### Issue: VS Code shows "Java: Error" in status bar

**Explanation:** This is normal for React Native/Expo projects. VS Code's Java extension tries to analyze the Android folder but gets confused by the project structure.

**Solution:** The project includes `.vscode/settings.json` that disables Java analysis for this project. If you don't see this file:

```bash
# Create VS Code settings directory
mkdir -p .vscode

# The settings are already included in the project
# If missing, they disable Java extension interference with React Native development
```

**Note:** This error is purely cosmetic and doesn't affect your app development at all.

## 📱 Platform-Specific Setup

### For iOS Development

```bash
# Install Xcode from App Store
# Install iOS Simulator
# No additional setup needed for this project
```

### For Android Development

```bash
# Java 17 is already installed via our script
# Install Android Studio (optional)
# The project uses Expo, so no additional Android setup needed
```

## 🎯 Performance Optimization for High-RAM Machine

### Increase Node.js Memory Limit

```bash
# Add to your .zshrc for better performance
echo 'export NODE_OPTIONS="--max-old-space-size=8192"' >> ~/.zshrc
source ~/.zshrc
```

### Enable Faster Builds

```bash
# Use faster Metro bundler settings
export EXPO_USE_FAST_RESOLVER=1
```

### VS Code Optimization

The project includes optimized VS Code settings (`.vscode/settings.json`) that:
- ✅ **Disable Java errors** for React Native projects
- ✅ **Exclude build folders** from search and file explorer
- ✅ **Enable auto-formatting** with Prettier
- ✅ **Configure TypeScript** for optimal React Native development
- ✅ **Set up ESLint** for code quality

**Note:** If you see "Java: Error" in VS Code status bar, it's normal and will be hidden by these settings.

## 🏆 Success Checklist

- [ ] Java 17 installed and verified
- [ ] Node.js and npm working
- [ ] Project dependencies installed
- [ ] .env file configured with API keys
- [ ] App starts without errors
- [ ] Can switch between online/offline modes
- [ ] Ready for TFLite model integration

## 📞 Next Steps

1. **Test the app thoroughly** on your new machine
2. **Prepare for TFLite integration** when your model is ready
3. **Follow the TFLite guide**: `documentation/TFLITE_INTEGRATION_GUIDE.md`
4. **Submit to the hackathon** with confidence! 🎉

---

**🎯 Goal**: Have your Tamazight MultiLingo App running perfectly on your high-RAM Mac for optimal TFLite model performance and hackathon submission!
