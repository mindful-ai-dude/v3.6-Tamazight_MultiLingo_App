# 🚀 QUICK REFERENCE CARD
**Tamazight MultiLingo App - Essential Commands & Links**

---

## 📱 **EXPO COMMANDS**

### **Basic Testing:**
```bash
# Start development server
npx expo start

# Start with tunnel (if QR code doesn't work)
npx expo start --tunnel

# Clear cache and restart
npx expo start --clear

# Open in web browser
npx expo start --web
```

### **Development Build:**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android --profile development

# Build for iOS
eas build --platform ios --profile development
```

---

## 🌐 **NETLIFY DEPLOYMENT**

### **Build Commands:**
```bash
# Primary build command
npx convex deploy --cmd 'npm run build'

# Alternative build commands
npm run build
npx expo export -p web
expo build:web
```

### **Environment Variables:**
- **Key**: `CONVEX_DEPLOY_KEY`
- **Value**: [Your production deploy key from Convex dashboard]

### **Build Settings:**
- **Base directory**: (leave empty)
- **Build command**: `npx convex deploy --cmd 'npm run build'`
- **Publish directory**: `dist`

---

## 🔗 **IMPORTANT LINKS**

### **Download Apps:**
- **Expo Go (Android)**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **Expo Go (iPhone)**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### **Documentation:**
- **Expo Docs**: [https://docs.expo.dev/](https://docs.expo.dev/)
- **Convex Docs**: [https://docs.convex.dev/](https://docs.convex.dev/)
- **Netlify Docs**: [https://docs.netlify.com/](https://docs.netlify.com/)

### **Dashboards:**
- **Expo Dashboard**: [https://expo.dev/accounts/[username]/projects](https://expo.dev/)
- **Convex Dashboard**: [https://dashboard.convex.dev/](https://dashboard.convex.dev/)
- **Netlify Dashboard**: [https://app.netlify.com/](https://app.netlify.com/)

---

## 🔧 **TROUBLESHOOTING QUICK FIXES**

### **📱 Mobile Issues:**
```bash
# QR code not working
npx expo start --tunnel

# App crashes
npx expo start --clear

# Can't connect
# Check same WiFi network
# Try manual URL: exp://[YOUR_IP]:8081
```

### **💻 Build Issues:**
```bash
# Reset everything
rm -rf node_modules package-lock.json
npm install
npx expo install --fix

# Update tools
npm install -g @expo/eas-cli@latest
npm install -g @expo/cli@latest
```

### **🌐 Deployment Issues:**
```bash
# Test locally first
npm run build
npx convex deploy

# Check environment variables in Netlify
# Verify CONVEX_DEPLOY_KEY is set correctly
```

---

## 📊 **STATUS INDICATORS**

### **✅ Success Indicators:**
- QR code appears in terminal
- App loads on mobile device
- "Real-time DB Connected" message
- Smooth UI interactions
- No red error messages

### **❌ Problem Indicators:**
- Red error messages in terminal
- App crashes on mobile
- "Network Error" messages
- QR code doesn't appear
- Build fails in Netlify

---

## 🆘 **EMERGENCY CONTACTS**

### **If You're Stuck:**
1. **Check terminal output** for error messages
2. **Restart development server** with `npx expo start --clear`
3. **Try web version** by pressing `w` in terminal
4. **Use tunnel mode** with `npx expo start --tunnel`
5. **Reset everything** with the nuclear option commands above

### **Testing Priorities:**
1. **Basic UI** - Does the app load and look correct?
2. **Navigation** - Can you tap buttons and change languages?
3. **Online Features** - Do real-time features work?
4. **Performance** - Is the app responsive and smooth?

---

## 🎯 **HACKATHON DEMO CHECKLIST**

### **Before Demo:**
- [ ] App running on Intel iMac
- [ ] All features tested and working
- [ ] Netlify deployment successful
- [ ] Mobile testing completed
- [ ] Documentation reviewed

### **During Demo:**
- [ ] Show beautiful UI with Tifinagh symbols
- [ ] Demonstrate real-time translation features
- [ ] Show emergency broadcasting system
- [ ] Explain dual-database architecture
- [ ] Highlight cultural preservation features

### **Key Talking Points:**
- **Revolutionary**: First real-time collaborative Tamazight platform
- **Life-saving**: Emergency communication for Moroccan Berbers
- **Technical**: Dual-database architecture with AI translation
- **Cultural**: Tifinagh script and regional dialect preservation
- **Functional**: 100% working features (not mocked)

---

## 🏆 **SUCCESS METRICS**

### **Technical Success:**
- App loads in <5 seconds
- Translations process in <3 seconds
- Real-time features work instantly
- No crashes during demo
- All 18 test cases pass

### **Demo Success:**
- Judges understand the innovation
- Cultural impact is clear
- Technical complexity is appreciated
- Emergency use case resonates
- Questions answered confidently

**🎉 You're ready to win this hackathon!**
