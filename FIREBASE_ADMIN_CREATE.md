# 🔥 Firebase Admin Account Setup Guide

## Option 1: Firebase Console Se Admin User Banao (Recommended)

### Step-by-Step:

1. **Firebase Console Kholo**
   - https://console.firebase.google.com/ pe jao
   - Apna project select karo: **iim-a-website**

2. **Authentication Section Me Jao**
   - Left sidebar me **Authentication** click karo
   - **Users** tab pe click karo

3. **Admin User Add Karo**
   - **Add User** button click karo
   - Fill karo:
     ```
     Email: admin@iima.ac.in
     Password: YourSecurePassword123
     ```
   - **Add User** click karo

4. **Code Me Email Update Karo**
   - File kholo: `Frontend/src/context/AuthContext.jsx`
   - Line 21 pe jao:
     ```javascript
     const ADMIN_EMAIL = 'admin@iima.ac.in';
     ```

5. **Sign-in Method Enable Karo**
   - Authentication → **Sign-in method** tab
   - **Email/Password** provider click karo
   - **Enable** toggle karo
   - **Save** karo

6. **Login Karo**
   - Website pe jao: http://localhost:5175
   - Footer me scroll karo → bottom-right user icon click karo
   - Email: `admin@iima.ac.in`
   - Password: `YourSecurePassword123`
   - **Sign In** click karo

---

## Option 2: Firebase CLI Se Admin Banao (Advanced)

```bash
# Firebase CLI install karo (agar nahi hai)
npm install -g firebase-tools

# Login karo
firebase login

# Project me jao
cd Frontend

# Firebase init karo (agar nahi kiya)
firebase init

# Admin user create karne ke liye script:
# (Create a file: scripts/createAdmin.js)
```

**File: `scripts/createAdmin.js`**
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createAdmin() {
  try {
    const user = await admin.auth().createUser({
      email: 'admin@iima.ac.in',
      password: 'YourSecurePassword123',
      emailVerified: true,
      disabled: false
    });
    console.log('✅ Admin created:', user.email);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdmin();
```

Run karo:
```bash
node scripts/createAdmin.js
```

---

## 🔒 Firestore Security Rules (Important!)

Firebase Console → **Firestore Database** → **Rules** tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Content collection - everyone read, only admin write
    match /content/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.email == 'admin@iima.ac.in';
    }
    
    // Images collection - same rules
    match /images/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.email == 'admin@iima.ac.in';
    }
  }
}
```

**Publish** click karo!

---

## 🧪 Test Admin Login

1. **Server Start Karo:**
   ```bash
   cd Frontend
   npm run dev
   ```

2. **Website Kholo:** http://localhost:5175

3. **Admin Login:**
   - Footer scroll karo
   - Bottom-right user icon hover → click
   - Email: `admin@iima.ac.in`
   - Password: `YourSecurePassword123`
   - **Sign In**

4. **Verify:**
   - Navbar me **✦ Admin** badge dikhna chahiye
   - Kisi bhi heading pe click karo → edit box khulna chahiye

---

## 🎯 Default Credentials (Update These!)

```
Email: admin@example.com
Password: Admin@123
```

⚠️ **Production me strong password use karo!**

---

## ❓ Troubleshooting

### Error: "Invalid email or password"
- Firebase Console → Authentication → Users check karo
- Email sahi likha hai ya nahi verify karo
- Password minimum 6 characters hona chahiye

### Error: "Email already exists"
- User pahle se exist karta hai
- Firebase Console me dekho existing users

### Admin badge nahi dikh raha
- `AuthContext.jsx` me `ADMIN_EMAIL` check karo
- Firebase me login kiye hue user ka email match karna chahiye

### Edit nahi ho raha
- Firestore Rules check karo
- Console me errors dekho (F12)
- Admin email match kar raha hai ya nahi verify karo

---

**Done! Ab aap admin ban gaye! 🎉**
