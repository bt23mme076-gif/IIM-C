# 🔐 Admin Login Setup (Firebase Email/Password)

## Step 1: Create Admin Account in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **iim-a-website**
3. Go to **Authentication** → **Users** tab
4. Click **Add User**
5. Enter:
   - Email: `admin@yourdomain.com` (ya apna koi bhi email)
   - Password: `YourSecurePassword123`
6. Click **Add User**

---

## Step 2: Set Admin Email in Code

Open `Frontend/src/context/AuthContext.jsx` and update line 21:

```javascript
const ADMIN_EMAIL = 'admin@yourdomain.com'; // Firebase me jo email add kiya vo
```

**Example:**
```javascript
const ADMIN_EMAIL = 'admin@iima.ac.in';
```

---

## Step 3: Enable Email/Password Authentication

1. Firebase Console → **Authentication** → **Sign-in method**
2. Click on **Email/Password** provider
3. Toggle **Enable**
4. Click **Save**

---

## Step 4: Login as Admin

### Option 1: Secret Button in Footer (Recommended)
1. Website pe jao: http://localhost:5175
2. **Scroll to bottom** (footer)
3. **Bottom-right corner** mein chhota user icon pe **hover** karo
4. **Click** → Login modal khulega
5. **Email aur Password** enter karo (jo Firebase me add kiya)
6. **Sign In** button click karo
7. Navbar mein **✦ Admin** badge dikhega

### Option 2: Keyboard Shortcut (Coming Soon)
- Press `Ctrl + Shift + A` to open admin login

---

## Step 5: Edit Content

Once logged in:
- ✦ Admin badge dikhega navbar mein
- Kisi bhi text pe **click** karo
- Edit karo
- **Outside click** karo → auto-save Firestore mein
- Page refresh karo → changes permanent

---

## 🎯 Quick Setup Commands

```bash
# 1. Server chalu karo
cd Frontend
npm run dev

# 2. Website kholo
# http://localhost:5175

# 3. Footer me scroll karke admin login karo
```

---

## 📝 Default Admin Credentials (Update These!)

**Email:** `admin@example.com`  
**Password:** `Admin@123`

⚠️ **Security:** Production mein strong password use karo!

---

## Firebase Collections

Content save hota hai:
- Collection: `content`
- Document: `home`
- Fields:
  - `heroTitle`: "Strategy in the Digital Age."
  - `heroSubtitle`: "Professor, Researcher..."
  - `aboutText`: "With over two decades..."

---

## 🔒 Security Tips

1. **Strong Password** use karo Firebase me
2. **Admin Email** code me hardcode hai - production me environment variable use karo
3. **Firestore Rules** set karo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /content/{document=**} {
      allow read: if true;  // Everyone can read
      allow write: if request.auth != null && request.auth.token.email == 'admin@yourdomain.com';
    }
  }
}
```

---

**Test Karo:** Footer → Admin Icon → Login → Edit Content! 🎉
