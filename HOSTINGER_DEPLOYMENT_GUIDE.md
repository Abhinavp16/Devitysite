# 🚀 DevityClub Hostinger Deployment Guide

## 📋 **Prerequisites**
- Hostinger hosting account (Premium or Business plan recommended)
- Domain name configured
- FTP/SFTP access credentials
- Node.js support (check with Hostinger support)

## 🏗️ **Part 1: Prepare Your Application**

### **1. Build the React Frontend**
```bash
cd devitysite
npm run build
```
This creates a `build` folder with optimized production files.

### **2. Prepare Backend for Production**
Update your backend environment variables:

**Edit `devitysite/server/.env`:**
```env
# Production Configuration
NODE_ENV=production
PORT=5000

# Database (use absolute path for production)
DB_PATH=/home/yourusername/public_html/api/database/devityclub.db

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_change_this_in_production
JWT_EXPIRES_IN=24h

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword2024

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### **3. Update API URL in Frontend**
**Edit `devitysite/src/services/apiService.js`:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://yourdomain.com/api';
```

**Create `devitysite/.env.production`:**
```env
REACT_APP_API_URL=https://yourdomain.com/api
```

### **4. Rebuild Frontend with Production Settings**
```bash
npm run build
```

## 🌐 **Part 2: Hostinger Deployment**

### **Method A: Using Hostinger File Manager (Recommended)**

#### **Step 1: Access Hostinger Control Panel**
1. Login to your Hostinger account
2. Go to "Hosting" → Select your hosting plan
3. Click "Manage" next to your domain

#### **Step 2: Upload Frontend Files**
1. Open "File Manager"
2. Navigate to `public_html` folder
3. Upload all contents from `devitysite/build/` folder
4. Extract if uploaded as ZIP

#### **Step 3: Create API Directory**
1. In `public_html`, create folder: `api`
2. Upload your entire `devitysite/server/` contents to `api/` folder

#### **Step 4: Install Backend Dependencies**
1. Go to "Advanced" → "SSH Access" (if available)
2. Or use Hostinger's Node.js manager
3. Navigate to `/public_html/api/`
4. Run: `npm install --production`

### **Method B: Using FTP/SFTP**

#### **Step 1: Get FTP Credentials**
1. In Hostinger panel → "Advanced" → "FTP Accounts"
2. Note down: Host, Username, Password, Port

#### **Step 2: Upload via FTP Client (FileZilla)**
1. Connect to your hosting account
2. Upload `build/` contents to `/public_html/`
3. Upload `server/` contents to `/public_html/api/`

## ⚙️ **Part 3: Server Configuration**

### **1. Configure Node.js (if supported)**
1. In Hostinger panel → "Advanced" → "Node.js"
2. Enable Node.js for your domain
3. Set startup file: `api/server.js`
4. Set Node.js version: 18.x or latest

### **2. Database Setup**
```bash
# SSH into your server
cd /home/yourusername/public_html/api
npm run init-db
```

### **3. Create .htaccess for React Routing**
**Create `/public_html/.htaccess`:**
```apache
# React Router Support
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Handle Angular and React Routes
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options nosniff
  Header always set X-Frame-Options DENY
  Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### **4. API .htaccess Configuration**
**Create `/public_html/api/.htaccess`:**
```apache
# Node.js API Routes
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ server.js [L]

# CORS Headers
<IfModule mod_headers.c>
  Header always set Access-Control-Allow-Origin "*"
  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

## 🔧 **Part 4: Alternative Backend Hosting**

### **If Hostinger doesn't support Node.js:**

#### **Option 1: Use Hostinger + External API**
1. Host frontend on Hostinger
2. Deploy backend to:
   - **Heroku** (Free tier available)
   - **Railway** (Simple deployment)
   - **Render** (Free tier)
   - **Vercel** (Serverless functions)

#### **Option 2: Convert to PHP Backend**
Create PHP equivalents of your Node.js API endpoints using:
- **Database:** SQLite or MySQL
- **Authentication:** PHP JWT libraries
- **CRUD Operations:** PHP with PDO

## 📁 **Final File Structure on Hostinger**
```
public_html/
├── index.html (React app)
├── static/ (CSS, JS, images)
├── .htaccess
└── api/
    ├── server.js
    ├── package.json
    ├── .env
    ├── .htaccess
    ├── config/
    ├── database/
    ├── middleware/
    ├── routes/
    └── node_modules/
```

## 🧪 **Part 5: Testing Deployment**

### **1. Test Frontend**
- Visit: `https://yourdomain.com`
- Check all pages load correctly
- Test navigation and responsive design

### **2. Test Backend API**
- Visit: `https://yourdomain.com/api/health`
- Should return: `{"status":"OK"}`

### **3. Test Admin Dashboard**
- Visit: `https://yourdomain.com/dashboard`
- Login with your credentials
- Test CRUD operations

## 🔒 **Part 6: Security & Performance**

### **1. SSL Certificate**
- Enable SSL in Hostinger panel
- Force HTTPS redirects

### **2. Environment Security**
- Change default passwords
- Use strong JWT secrets
- Enable rate limiting

### **3. Performance Optimization**
- Enable Gzip compression
- Use CDN if available
- Optimize images

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **Node.js not supported:** Use external API hosting
2. **Database permissions:** Check file permissions (755 for folders, 644 for files)
3. **CORS errors:** Update API CORS settings
4. **Routing issues:** Verify .htaccess configuration

### **Support Resources:**
- Hostinger Knowledge Base
- Contact Hostinger support for Node.js setup
- Check server error logs in control panel

## 📞 **Need Help?**
If you encounter issues:
1. Check Hostinger's Node.js documentation
2. Contact Hostinger support for server configuration
3. Consider using external API hosting for backend

---

**🎉 Your DevityClub website will be live at: `https://yourdomain.com`**
**🔧 Admin dashboard accessible at: `https://yourdomain.com/dashboard`**