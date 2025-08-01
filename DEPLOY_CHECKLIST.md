# ✅ Netlify Deployment Checklist

## Pre-Deployment Checklist

### 📁 Required Files
- [ ] `index.html` - Main chatbot interface
- [ ] `netlify.toml` - Netlify configuration
- [ ] `netlify/functions/chat.js` - Serverless function
- [ ] `netlify/functions/package.json` - Function dependencies
- [ ] `favicon.ico` - Site favicon
- [ ] `manifest.json` - PWA manifest
- [ ] `.env.example` - Environment variables template

### 🔧 Configuration
- [ ] OpenRouter API key obtained from [openrouter.ai/keys](https://openrouter.ai/keys)
- [ ] Repository created on GitHub/GitLab
- [ ] All files committed to repository
- [ ] Netlify account created

### 🚀 Deployment Steps

#### 1. Connect Repository to Netlify
```bash
# Option 1: GitHub (Recommended)
1. Go to netlify.com
2. Click "New site from Git"
3. Choose GitHub
4. Select your repository
5. Deploy settings will auto-configure from netlify.toml

# Option 2: Manual Upload
1. Go to netlify.com
2. Click "New site from Git"
3. Choose "Deploy manually"
4. Drag and drop your project folder
```

#### 2. Configure Environment Variables
1. Go to **Site Settings > Environment Variables**
2. Add:
   - `OPENROUTER_API_KEY` = `your_actual_api_key_here`

#### 3. Test Deployment
1. Visit your deployed site URL
2. Test chatbot functionality
3. Verify API responses are working
4. Check mobile responsiveness

### 🔍 Post-Deployment Verification

#### Function Testing
- [ ] Send test messages
- [ ] Verify AI responses
- [ ] Check fallback responses work
- [ ] Test quick replies functionality

#### Error Handling
- [ ] Test with invalid API key (should show fallback)
- [ ] Test empty messages
- [ ] Check browser console for errors
- [ ] Verify CORS is working

#### Performance
- [ ] Page loads quickly
- [ ] Images load properly
- [ ] Mobile responsive design
- [ ] Touch interactions work

### 📱 Custom Domain (Optional)
1. Go to **Site Settings > Domain Management**
2. Click **Add custom domain**
3. Follow DNS setup instructions

### 📊 Monitoring Setup
1. **Netlify Analytics**: Enable in site settings
2. **Uptime Monitoring**: Use external service like UptimeRobot
3. **Error Tracking**: Monitor function logs in Netlify dashboard

### 🔄 Continuous Deployment
- **Auto-deploy**: Enabled by default on git push
- **Deploy previews**: Available for pull requests
- **Branch deploys**: Can be configured for staging

### 🆘 Troubleshooting

#### Common Issues & Solutions

**Issue: 404 on API calls**
- Solution: Ensure `netlify.toml` is in root directory
- Check function file exists at `netlify/functions/chat.js`

**Issue: CORS errors**
- Solution: Netlify functions handle CORS automatically
- Check browser console for specific error messages

**Issue: API key not working**
- Solution: Verify key is set in Netlify environment variables
- Check OpenRouter account for usage limits

**Issue: Function timeout**
- Solution: Netlify functions have 10-second timeout
- Check function logs for performance issues

### 📞 Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **OpenRouter Docs**: https://openrouter.ai/docs
- **Community**: Netlify Community forums
- **Logs**: Check function logs in Netlify dashboard

### 🎉 Success Criteria

Your deployment is successful when:
- [ ] Chatbot loads at your Netlify URL
- [ ] AI responses are working
- [ ] Fallback responses work if API fails
- [ ] Mobile design is responsive
- [ ] Quick replies are functional
- [ ] No console errors in browser

## 🚀 Ready to Deploy!

Your PLN AP2T chatbot is now ready for Netlify deployment with full OpenRouter API integration and intelligent fallback responses.