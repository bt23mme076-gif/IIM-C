# Step-by-Step Installation Guide

Complete walkthrough for setting up the IIM Professor website from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Windows 10/11 with PowerShell
- [ ] Node.js 16+ ([Download here](https://nodejs.org/))
- [ ] Git installed ([Download here](https://git-scm.com/))
- [ ] A code editor (VS Code recommended)
- [ ] Firebase account (Free tier works)
- [ ] Google Cloud account (for YouTube API - Free tier available)
- [ ] Admin email address (e.g., professor@iima.ac.in)

## 🚀 Installation Steps

### Step 1: Clone/Download the Project

```powershell
# If using Git
git clone <your-repository-url>
cd IIM-A

# Or download ZIP and extract
```

### Step 2: Install Dependencies

Option A - Automated (Recommended):
```powershell
# Run the setup script
.\setup.ps1
```

Option B - Manual:
```powershell
# Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd ..\Backend
npm install

cd ..
```

### Step 3: Firebase Setup

#### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "iim-professor-website"
4. Disable Google Analytics (optional)
5. Click "Create project"

#### 3.2 Enable Required Services

**Firestore Database:**
1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location (asia-south1 for India)
5. Click "Enable"

**Authentication:**
1. Click "Authentication" in left sidebar
2. Click "Get started"
3. Click "Google" provider
4. Enable toggle
5. Enter support email
6. Click "Save"

**Storage:**
1. Click "Storage" in left sidebar
2. Click "Get started"
3. Start in production mode
4. Use same location as Firestore
5. Click "Done"

#### 3.3 Get Firebase Credentials

1. Click the gear icon ⚙️ > "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app: "IIM Professor Website"
5. Copy the firebaseConfig object

#### 3.4 Update Firebase Config

Open `Frontend/src/firebase/config.js` and replace with your config:

```javascript
const firebaseConfig = { 
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

#### 3.5 Set Up Firestore Data

Follow the complete guide in [FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md)

Quick version:
1. Go to Firestore Database
2. Create collection: `content`
3. Add document with ID: `home`
4. Add these fields:
   - `heroTitle` (string): "Dr. Your Name"
   - `heroSubtitle` (string): "Professor at IIM Ahmedabad"
   - `aboutText` (string): "Your biography..."
   - `profileImage` (string): "" (leave empty)
   - `youtubeChannelId` (string): "" (add later)

#### 3.6 Configure Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /content/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.auth.token.email == 'your-email@iima.ac.in';
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.auth.token.email == 'your-email@iima.ac.in';
    }
  }
}
```

Replace `'your-email@iima.ac.in'` with your actual email!

### Step 4: Update Admin Email

Edit `Frontend/src/context/AuthContext.jsx`:

```javascript
// Line 20 - Change this email
const ADMIN_EMAIL = 'your-actual-email@iima.ac.in';
```

### Step 5: YouTube API Setup (Optional)

#### 5.1 Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "YouTube Data API v3"
4. Go to "Credentials"
5. Create "API Key"
6. Copy the API key

#### 5.2 Configure Backend

Create `Backend/.env`:
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Step 6: Get Your YouTube Channel ID

1. Go to your YouTube channel
2. Click on your profile picture
3. Click "Your channel"
4. Copy the ID from URL: `youtube.com/channel/CHANNEL_ID_HERE`
5. Or use: `youtube.com/c/USERNAME` → View page source → Search for "channelId"

### Step 7: Configure Environment Variables

**Frontend/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend/.env:**
```env
YOUTUBE_API_KEY=your_youtube_api_key
PORT=5000
```

### Step 8: Test the Installation

#### Start Backend:
```powershell
cd Backend
npm start
```

You should see:
```
Server running on port 5000
Health check: http://localhost:5000/api/health
```

Test it: Open browser → `http://localhost:5000/api/health`  
Should show: `{"status":"OK","timestamp":"..."}`

#### Start Frontend (New Terminal):
```powershell
cd Frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 9: First Visit & Admin Login

1. Open `http://localhost:5173` in your browser
2. You should see the website with your Firestore data
3. Click "Admin Login" in navbar
4. Sign in with your Google account (must match ADMIN_EMAIL)
5. After login, hover over text to see edit buttons

### Step 10: Test Admin Features

✅ **Edit Text:**
- Hover over hero title
- Click pencil icon
- Edit and save
- Check Firestore to confirm update

✅ **Upload Profile Image:**
- Hover over profile placeholder
- Click to upload
- Select image
- Check Firebase Storage

✅ **Add YouTube Channel:**
- When logged in, edit YouTube Channel ID field
- Enter your channel ID
- Videos should load after page refresh

## 🎨 Customization

### Change Colors

Edit `Frontend/tailwind.config.js`:
```javascript
colors: {
  'off-white': '#fdfcfb', // Your custom color
}
```

### Change Fonts

Edit `Frontend/src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');

body {
  font-family: 'Your Font', sans-serif;
}
```

### Add New Pages

1. Create new page component in `Frontend/src/pages/`
2. Import in `App.jsx`
3. Add route: `<Route path="/new-page" element={<NewPage />} />`
4. Add link in Navbar and Footer

## 🐛 Common Issues & Solutions

### Issue: "Firebase: Error (auth/unauthorized-domain)"
**Solution:** 
1. Go to Firebase Console > Authentication > Settings
2. Under "Authorized domains", add: `localhost`

### Issue: npm install fails
**Solution:**
```powershell
# Clear cache
npm cache clean --force
# Delete node_modules
Remove-Item -Recurse -Force node_modules
# Reinstall
npm install
```

### Issue: Videos not loading
**Solution:**
1. Check YouTube API key is correct
2. Verify channel ID is correct
3. Check API quota in Google Cloud Console
4. Ensure backend is running

### Issue: "Cannot find module 'firebase'"
**Solution:**
```powershell
cd Frontend
npm install firebase
```

### Issue: Admin edit not saving
**Solution:**
1. Check if logged in with correct email
2. Verify Firestore rules include your email
3. Check browser console for errors

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Update Firebase config with production credentials
- [ ] Update ADMIN_EMAIL in AuthContext.jsx
- [ ] Update API URLs in .env files
- [ ] Test all features locally
- [ ] Update Firestore rules with production admin email
- [ ] Update Storage rules with production admin email
- [ ] Set up custom domain in Firebase Hosting (optional)
- [ ] Configure environment variables in hosting platform
- [ ] Test deployment thoroughly

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [YouTube Data API](https://developers.google.com/youtube/v3)

## 🆘 Getting Help

If you're stuck:

1. Check the error message in browser console (F12)
2. Review this guide step-by-step
3. Check [FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md) for database issues
4. Review [README.md](./README.md) for general information
5. Check Firebase Console for service status

## 🎉 Success!

If everything works:
- ✅ Website loads at localhost:5173
- ✅ Can login as admin
- ✅ Can edit text inline
- ✅ Can upload images
- ✅ Videos load (if YouTube configured)
- ✅ Forms submit successfully

**Congratulations! Your website is ready! 🚀**

---

**Next Steps:**
1. Customize content via admin panel
2. Upload profile picture
3. Add YouTube channel
4. Customize colors and fonts
5. Deploy to production
