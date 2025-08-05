# 🚀 CONVEX + NETLIFY DEPLOYMENT GUIDE
**Latest Official Instructions - August 1, 2025**  
**Based on Official Convex Documentation**

---

## 🎯 **OVERVIEW**

This guide provides the **official Convex + Netlify deployment process** for your Tamazight MultiLingo App, ensuring your real-time database and web app work perfectly together in production.

---

## 📋 **PREREQUISITES**

### **✅ What You Need:**
- GitHub repository with your project
- Netlify account (free)
- Convex project already set up and working locally
- Internet connection

### **✅ What Should Already Work:**
- `npx convex dev` runs successfully locally
- Your app connects to Convex in development
- All Convex functions tested and working

---

## 🚀 **STEP-BY-STEP DEPLOYMENT**

### **Step 1: Prepare Your Repository**

#### **📁 Verify Project Structure:**
```
v3.6-Tamazight_MultiLingo_App-main/
├── package.json
├── app.json
├── convex/
│   ├── _generated/
│   ├── translations.ts
│   ├── emergency.ts
│   └── convex.config.ts
├── app/
├── components/
└── services/
```

#### **📝 Update package.json Scripts:**
Ensure your `package.json` has the correct build script:
```json
{
  "scripts": {
    "build": "expo export -p web",
    "start": "expo start",
    "web": "expo start --web"
  }
}
```

#### **🔄 Push to GitHub:**
```bash
# Add all files
git add .

# Commit changes
git commit -m "Ready for Netlify deployment with Convex"

# Push to GitHub
git push origin main
```

---

### **Step 2: Create Netlify Site**

#### **🌐 Import Your Project:**
1. Go to [https://app.netlify.com/start](https://app.netlify.com/start)
2. Click **"Import from Git"**
3. Choose **"GitHub"** and authorize Netlify
4. Select your repository: `tamazight-multilingo-app`

#### **⚙️ Configure Build Settings:**
**CRITICAL**: Use these exact settings from official Convex docs:

- **Base directory**: (leave empty unless project is in subdirectory)
- **Build command**: `npx convex deploy --cmd 'npm run build'`
- **Publish directory**: `dist`

![Build Settings Example](https://docs.convex.dev/assets/images/netlify_build_settings-3003b87fdb3b152f78ef5e794fb43c4c.png)

---

### **Step 3: Set Up Convex Production Deploy Key**

#### **🔑 Generate Production Deploy Key:**
1. Go to [Convex Dashboard](https://dashboard.convex.dev/)
2. Select your Tamazight MultiLingo project
3. Click **"Settings"** tab
4. Under **"Production Deploy Key"**, click **"Generate"**
5. Click the **copy button** to copy the key

#### **🔧 Add Environment Variable in Netlify:**
1. In Netlify, go to **"Site configuration"** → **"Environment variables"**
2. Click **"Add environment variable"**
3. **Key**: `CONVEX_DEPLOY_KEY` (exactly this name)
4. **Value**: Paste your production deploy key
5. Click **"Create variable"**

![Environment Variable Example](https://docs.convex.dev/assets/images/netlify_prod_deploy_key-e92a5b4d1f17a3c7df3612f3574f3cdf.png)

---

### **Step 4: Deploy Your Site**

#### **🚀 Initial Deployment:**
1. Click **"Deploy site"** in Netlify
2. Wait for build to complete (5-15 minutes for first build)
3. Monitor build logs for any errors

#### **📊 What Happens During Build:**
1. **Convex Deploy**: `npx convex deploy` pushes your functions to production
2. **Environment Setup**: Sets `CONVEX_URL` to point to production deployment
3. **Frontend Build**: `npm run build` creates optimized web app
4. **Site Publish**: Netlify publishes to `https://your-site-name.netlify.app`

---

### **Step 5: Verify Deployment**

#### **✅ Check Your Live Site:**
1. Visit your Netlify URL: `https://your-site-name.netlify.app`
2. Verify the app loads correctly
3. Test Convex features:
   - Real-time translation storage
   - Emergency broadcasting
   - Community verification system

#### **✅ Check Convex Dashboard:**
1. Go to [Convex Dashboard](https://dashboard.convex.dev/)
2. Select your project
3. Verify **"Production"** deployment is active
4. Check that functions are deployed

---

## 🔧 **TROUBLESHOOTING**

### **❌ Build Fails:**

#### **Common Issues & Solutions:**
```bash
# Issue: "convex command not found"
# Solution: Ensure Convex is in dependencies
npm install convex

# Issue: "CONVEX_DEPLOY_KEY not found"
# Solution: Check environment variable is set correctly in Netlify

# Issue: "npm run build fails"
# Solution: Test build locally first
npm run build
```

#### **Alternative Build Commands:**
If the primary build command fails, try these in order:
1. `npx convex deploy --cmd 'npx expo export -p web'`
2. `npx convex deploy --cmd 'expo build:web'`
3. `npm run build` (without Convex deploy)

### **❌ Site Loads But Convex Doesn't Work:**

#### **Check These:**
1. **Environment Variable**: `CONVEX_DEPLOY_KEY` must be exactly this name
2. **Deploy Key Type**: Must be **Production** key, not Development
3. **Convex URL**: Check browser console for connection errors
4. **CORS Settings**: Verify Netlify domain is allowed in Convex

### **❌ Functions Not Working:**

#### **Verify Convex Deployment:**
```bash
# Test locally first
npx convex dev

# Check function exists
npx convex run translations:getRecentTranslations

# Redeploy if needed
npx convex deploy
```

---

## 🔄 **AUTOMATIC DEPLOYMENTS**

### **🎯 How It Works:**
Every time you push to GitHub:
1. **Netlify detects** the push automatically
2. **Convex functions** are deployed to production
3. **Frontend is rebuilt** with latest code
4. **Site is published** with new changes

### **📝 Best Practices:**
- Test changes locally with `npx convex dev` first
- Use meaningful commit messages
- Monitor build logs for any issues
- Test the live site after each deployment

---

## 🌟 **ADVANCED FEATURES**

### **🔄 Preview Deployments (Optional):**
For testing changes before they go live:
1. Generate **Preview Deploy Key** in Convex Dashboard
2. Set up different `CONVEX_DEPLOY_KEY` for deploy previews
3. Each PR gets its own Convex backend for testing

### **🌐 Custom Domain (Optional):**
1. Add custom domain in Netlify settings
2. Configure DNS records
3. Update Convex CORS settings for new domain

---

## ✅ **SUCCESS CHECKLIST**

### **📋 Pre-Deployment:**
- [ ] Project pushed to GitHub
- [ ] `npx convex dev` works locally
- [ ] All Convex functions tested
- [ ] `npm run build` works locally

### **📋 Netlify Setup:**
- [ ] Netlify site created and linked to GitHub
- [ ] Build command: `npx convex deploy --cmd 'npm run build'`
- [ ] Publish directory: `dist`
- [ ] `CONVEX_DEPLOY_KEY` environment variable set

### **📋 Post-Deployment:**
- [ ] Site loads at Netlify URL
- [ ] Convex real-time features work
- [ ] Translation storage functional
- [ ] Emergency broadcasting works
- [ ] No console errors

---

## 🎉 **FINAL RESULT**

When successful, you'll have:
- **Live web app** at `https://your-site-name.netlify.app`
- **Production Convex backend** with all your functions
- **Automatic deployments** on every GitHub push
- **Real-time features** working in production
- **Emergency broadcasting** system live
- **Community translation** platform operational

**🏆 Your Tamazight MultiLingo App is now live and ready for the hackathon demonstration!**

---

## 📞 **Support Resources**

- **Convex Netlify Docs**: [https://docs.convex.dev/production/hosting/netlify](https://docs.convex.dev/production/hosting/netlify)
- **Netlify Docs**: [https://docs.netlify.com/](https://docs.netlify.com/)
- **Convex Dashboard**: [https://dashboard.convex.dev/](https://dashboard.convex.dev/)
- **Netlify Dashboard**: [https://app.netlify.com/](https://app.netlify.com/)

**🎯 This deployment process is battle-tested and used by thousands of Convex applications in production!**
