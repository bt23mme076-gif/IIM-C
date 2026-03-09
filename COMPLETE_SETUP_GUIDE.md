# 🚀 Complete Firebase Setup & Deployment Guide

## 📋 Prerequisites Checklist

- [x] Firebase project created: "IIM A Website"
- [ ] Firebase Authentication enabled
- [ ] Admin user created
- [ ] Firestore initialized
- [ ] Security rules deployed
- [ ] Admin email updated in code

---

## STEP 1: Enable Firebase Authentication

### 1.1 Enable Email/Password Authentication
```bash
1. Go to: https://console.firebase.google.com/project/iim-a-website/authentication
2. Click "Get Started" (if first time)
3. Click "Sign-in method" tab
4. Click "Email/Password"
5. Toggle "Enable"
6. Click "Save"
```

### 1.2 Enable Google Sign-In (Optional)
```bash
1. Still in "Sign-in method" tab
2. Click "Google"
3. Toggle "Enable"
4. Enter support email: your-email@gmail.com
5. Click "Save"
```

✅ **Authentication is now enabled!**

---

## STEP 2: Create Admin User

### Option A: Firebase Console (Recommended)
```bash
1. Go to: Authentication → Users → Add User
2. Enter Email: your-email@gmail.com
3. Enter Password: YourSecurePassword123
4. Click "Add User"
5. ✅ Copy this email - you'll need it in Step 3
```

### Option B: Sign Up via Website
```bash
1. Start dev server: npm run dev
2. Go to: http://localhost:5173/admin
3. Click "Sign in with Google" (if enabled)
4. OR enter email/password and sign up
```

---

## STEP 3: Update Admin Email in Code

### Open: `Frontend/src/context/AuthContext.jsx`

Find line ~23 and update:

```javascript
// BEFORE:
const ADMIN_EMAIL = 'jatin@example.com';

// AFTER:
const ADMIN_EMAIL = 'your-actual-email@gmail.com'; // Email from Step 2
```

**Save the file!**

---

## STEP 4: Initialize Firestore Database

### 4.1 Update Firebase Config (if needed)
Check `Frontend/src/firebase/config.js` - make sure credentials are correct.

### 4.2 Update package.json to support ES modules
Open `Frontend/package.json` and add this line at the top:

```json
{
  "type": "module",
  "name": "frontend",
  ...
}
```

### 4.3 Run Initialization Script

```powershell
cd Frontend
node src/scripts/initializeFirestore.js
```

**Expected Output:**
```
🔥 Initializing Firestore with default content...
✅ Success! Firestore initialized with content/home document
📝 You can now edit this content from the admin panel
```

✅ **Firestore database is now populated!**

---

## STEP 5: Deploy Firestore Security Rules

### 5.1 Update rules with your admin email

Open: `firestore.rules`

Find line ~8 and update:

```javascript
function isAdmin() {
  return request.auth != null && 
         request.auth.token.email == 'your-actual-email@gmail.com'; // YOUR EMAIL HERE
}
```

### 5.2 Deploy rules to Firebase

#### Option A: Firebase Console (Easiest)
```bash
1. Go to: https://console.firebase.google.com/project/iim-a-website/firestore/rules
2. Copy entire content from firestore.rules file
3. Paste in the Firebase Console editor
4. Click "Publish"
```

#### Option B: Firebase CLI
```powershell
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init firestore
# Select: Use existing project
# Choose: iim-a-website
# Accept default file names

# Deploy rules
firebase deploy --only firestore:rules
```

✅ **Security rules deployed!**

---

## STEP 6: Test Everything

### 6.1 Start Development Server
```powershell
cd Frontend
npm run dev
```

### 6.2 Test Public Website
```bash
1. Open: http://localhost:5173
2. ✅ Website should load with Firebase data
3. ✅ All sections should display content
```

### 6.3 Test Admin Login
```bash
1. Click "Admin Login" in navbar
2. Enter credentials from Step 2
3. Click "Sign In"
4. ✅ Should see "✦ Admin" badge in navbar
5. ✅ Should be redirected to home page
```

### 6.4 Test Inline Editing
```bash
1. After logging in as admin
2. Hover over any text on page
3. ✅ Should see blue border and pencil icon ✏️
4. Click text → Edit box opens
5. Change text → Press Enter
6. ✅ Text should update in Firestore
7. Refresh page → Changes should persist
```

### 6.5 Test Newsletter Subscription
```bash
1. Scroll to Newsletter section
2. Enter email: test@example.com
3. Click "Sign Up"
4. ✅ Should see green success message
5. Go to Firebase Console → Firestore → newsletter_subscribers
6. ✅ Should see new document with email
```

---

## STEP 7: Verify Firestore Data Structure

Go to: https://console.firebase.google.com/project/iim-a-website/firestore

You should see:

```
📁 content
  └── 📄 home
      ├── hero_greeting: "Hey there! Meet"
      ├── hero_name: "Prof. Vishal Gupta"
      ├── hero_subtitle: "IIM Ahmedabad..."
      └── ... (all other fields)

📁 newsletter_subscribers
  └── 📄 [auto-generated-id]
      ├── email: "test@example.com"
      ├── subscribedAt: "2026-02-11T..."
      ├── status: "active"
      └── source: "website"
```

---

## 🎨 Customization Guide

### Change Website Content
1. Login as admin
2. Click any text element
3. Edit and save
4. Changes appear instantly

### Change Images
Replace placeholder image URLs in `Home.jsx` with your own:

```javascript
// Find these lines and update URLs:
src="https://images.unsplash.com/photo-..."

// Change to:
src="/images/your-image.jpg"
```

Then add images to `Frontend/public/images/`

### Change Colors
Update colors in `tailwind.config.js`:

```javascript
colors: {
  primary: '#ffcc00',    // Yellow accent
  secondary: '#1a1a1a',  // Dark text
}
```

### Change Fonts
Update fonts in `index.html` Google Fonts link and `tailwind.config.js`

---

## 🚀 Production Deployment

### Deploy to Firebase Hosting

#### 1. Build Production Version
```powershell
cd Frontend
npm run build
```

#### 2. Install Firebase CLI (if not done)
```powershell
npm install -g firebase-tools
firebase login
```

#### 3. Initialize Hosting
```powershell
firebase init hosting
# Choose: Use existing project
# Select: iim-a-website
# Public directory: dist
# Single-page app: Yes
# Overwrite index.html: No
```

#### 4. Deploy
```powershell
firebase deploy --only hosting
```

#### 5. Access Your Live Site
```
✅ Deployed to: https://iim-a-website.web.app
```

---

## 🐛 Troubleshooting

### Issue: "Cannot read properties of undefined"
**Fix**: Run initialization script again:
```powershell
node src/scripts/initializeFirestore.js
```

### Issue: "Permission denied" when editing
**Fix**: 
1. Check Firestore rules are deployed
2. Verify admin email matches in rules AND AuthContext.jsx
3. Make sure you're logged in

### Issue: Newsletter doesn't save
**Fix**:
1. Check Firestore rules allow newsletter_subscribers creation
2. Check browser console for errors
3. Verify Firebase config is correct

### Issue: "Module not found" error
**Fix**:
```powershell
cd Frontend
npm install
```

---

## 📞 Support

If you encounter issues:

1. **Check Browser Console**: Press F12 → Console tab
2. **Check Firebase Console**: Look for errors in Firestore/Authentication
3. **Check Terminal**: Look for build errors

---

## ✅ Success Checklist

- [ ] Firebase Authentication enabled
- [ ] Admin user created
- [ ] Admin email updated in code
- [ ] Firestore initialized with data
- [ ] Security rules deployed
- [ ] Admin login works
- [ ] Inline editing works
- [ ] Newsletter subscription works
- [ ] Changes persist after refresh

---

**🎉 Congratulations! Your website is fully functional!**

Visit: http://localhost:5173
Login: http://localhost:5173/admin
