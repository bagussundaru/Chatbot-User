# PLN AP2T Chatbot - Netlify Deployment Guide

## 🚀 Quick Deploy to Netlify

### 1. One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/pln-ap2t-chatbot)

### 2. Manual Deployment Steps

#### Prerequisites
- OpenRouter API Key (get from [openrouter.ai/keys](https://openrouter.ai/keys))
- GitHub/GitLab repository with your chatbot files

#### Step-by-Step Guide

1. **Prepare Your Repository**
   ```bash
   # Ensure your project has these files:
   - index.html (main chatbot interface)
   - netlify.toml (Netlify configuration)
   - netlify/functions/chat.js (serverless function)
   - netlify/functions/package.json (function dependencies)
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Deploy settings will be automatically configured from `netlify.toml`

3. **Configure Environment Variables**
   - Go to **Site Settings > Environment Variables**
   - Add:
     - `OPENROUTER_API_KEY` = `your_actual_api_key_here`

4. **Verify Deployment**
   - Visit your deployed site URL
   - Test the chatbot functionality
   - Check the browser console for any errors

## 📁 Project Structure for Netlify

```
pln-ap2t-chatbot/
├── index.html              # Main chatbot interface
├── netlify.toml           # Netlify configuration
├── favicon.ico            # Site favicon
├── manifest.json          # PWA manifest
├── netlify/
│   └── functions/
│       ├── chat.js        # Serverless function for OpenRouter API
│       └── package.json   # Function dependencies
└── .env.example          # Environment variables template
```

## 🔧 Configuration Files

### netlify.toml
This file configures your Netlify deployment:
- Sets up serverless functions
- Configures security headers
- Sets up redirects
- Defines build settings

### netlify/functions/chat.js
The serverless function that:
- Handles API calls to OpenRouter
- Provides intelligent fallback responses
- Manages CORS headers
- Implements smart context adaptation

### netlify/functions/package.json
Defines dependencies for the serverless function:
- axios: HTTP client for API calls
- Node.js 18 runtime

## 🔐 Environment Variables Setup

### Required Variables
- `OPENROUTER_API_KEY`: Your OpenRouter API key

### How to Set in Netlify
1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site Settings > Environment Variables**
4. Click **Add environment variable**
5. Enter `OPENROUTER_API_KEY` as the key
6. Enter your actual API key as the value
7. Save changes

## 🧪 Testing Your Deployment

1. **Basic Functionality**
   - Open your deployed site
   - Send a test message
   - Verify AI responses are working

2. **Error Handling**
   - Test with invalid API key (should show fallback)
   - Test with empty messages
   - Check network tab for API calls

3. **Mobile Testing**
   - Test on mobile devices
   - Verify responsive design
   - Test touch interactions

## 📱 Features Available

- **Smart AI Responses**: Powered by GPT-3.5-turbo via OpenRouter
- **Emotional Intelligence**: Adapts responses based on user emotions
- **Contextual Quick Replies**: Provides relevant follow-up options
- **Mobile Responsive**: Works on all device sizes
- **PWA Ready**: Can be installed as a mobile app
- **Fallback System**: Works even if API is temporarily unavailable

## 🔍 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify key is correct in Netlify environment variables
   - Check OpenRouter account for usage limits
   - Ensure billing is set up on OpenRouter

2. **CORS Errors**
   - Netlify functions handle CORS automatically
   - Check browser console for specific error messages

3. **Function Errors**
   - Check Netlify function logs in dashboard
   - Verify `netlify/functions/package.json` exists
   - Ensure axios is listed as dependency

4. **Deployment Issues**
   - Check build logs in Netlify dashboard
   - Verify all required files are committed
   - Ensure `netlify.toml` is in root directory

### Getting Help

1. **Check Logs**: Netlify dashboard > Functions > Function logs
2. **Test Locally**: Use `netlify dev` command for local testing
3. **Community**: Netlify Community forums for deployment issues
4. **API Issues**: OpenRouter documentation and support

## 📊 Performance Tips

- **CDN**: Netlify automatically uses global CDN
- **Caching**: Static assets are cached for 1 year
- **Compression**: Automatic gzip compression
- **SSL**: HTTPS is automatically enabled

## 🔄 Updates and Maintenance

1. **Code Updates**: Push to your repository triggers automatic redeploy
2. **Environment Changes**: Update in Netlify dashboard
3. **API Key Rotation**: Update in environment variables
4. **Monitoring**: Use Netlify Analytics for usage insights

## 🎯 Next Steps

After successful deployment:
1. **Custom Domain**: Set up custom domain in Netlify
2. **Analytics**: Enable Netlify Analytics
3. **Monitoring**: Set up uptime monitoring
4. **Feedback**: Collect user feedback for improvements

## 📞 Support

For issues with:
- **Netlify**: Check [Netlify Documentation](https://docs.netlify.com)
- **OpenRouter**: Visit [OpenRouter Documentation](https://openrouter.ai/docs)
- **Chatbot**: Open an issue in your repository