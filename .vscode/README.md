# VS Code Configuration for Tamazight MultiLingo App

This directory contains optimized VS Code settings for React Native/Expo development.

## 📁 Files

### `settings.json`
Optimized workspace settings that provide:

#### 🚫 **Java Error Suppression**
- Disables Java analysis for React Native projects
- Prevents "Java: Error" in status bar
- Excludes Android/iOS folders from Java processing

#### 🔍 **File Management**
- Hides build folders and cache directories
- Excludes unnecessary files from search
- Improves IDE performance

#### ✨ **Code Formatting**
- Auto-format on save with Prettier
- TypeScript/JavaScript optimization
- ESLint integration for code quality

#### 🚀 **React Native Optimization**
- Proper import suggestions
- Emmet support for JSX
- Relative import preferences

## 🎯 **Why These Settings?**

React Native/Expo projects have a unique structure:
- **JavaScript/TypeScript** for app logic
- **Java files** in `android/` for native Android code
- **Not a traditional Java project**

VS Code's Java extension gets confused and shows errors. These settings tell VS Code:
- "This is a React Native project, not a Java project"
- "Focus on JavaScript/TypeScript development"
- "Ignore the Android Java files for IDE analysis"

## ✅ **Result**

- No more "Java: Error" in status bar
- Faster IDE performance
- Better code completion and formatting
- Optimized for mobile app development

## 🔧 **Troubleshooting**

### Clear TypeScript Cache Issues
If you see persistent TypeScript errors for files that don't exist (like `docs-3n-finetuning`):

1. **Command Palette** (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Run: `TypeScript: Restart TS Server`
3. Or run: `Developer: Reload Window`

### Clear All Caches
```bash
rm -rf .expo node_modules/.cache .metro-cache
npm run dev
```

## 🔧 **Customization**

Feel free to modify `settings.json` to match your preferences while keeping the Java exclusions for error-free development.
