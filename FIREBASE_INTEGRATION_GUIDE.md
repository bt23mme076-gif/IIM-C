# Firebase Integration Guide - IIM A Website

## ✅ What's Already Done

Your website is now **fully connected to Firebase Firestore**! All content from your website dynamically loads from Firebase and can be edited in real-time.

## 🔥 Firebase Structure

Your Firestore database has this structure:
```
content/ (collection)
  └── home (document)
      ├── hero_greeting: "Hey there! Meet"
      ├── hero_name: "Prof. Vishal Gupta"
      ├── hero_subtitle: "IIM Ahmedabad Professor. Researcher. Thought Leader."
      ├── hero_description: "Leading expert in strategic..."
      ├── courses_heading: "Management Courses"
      ├── course1_title: "The Science of Leadership"
      ├── course1_description: "Master the art and science..."
      ├── course2_title: "Strategy for Executives"
      ├── course2_description: "Develop strategic thinking..."
      ├── blog_heading: "Recent Reflections"
      ├── blog1_title: "..." 
      ├── blog1_excerpt: "..."
      ├── blog2_title: "..."
      ├── blog2_excerpt: "..."
      ├── blog3_title: "..."
      ├── blog3_excerpt: "..."
      ├── testimonial_quote: "Creating Happy Leaders"
      ├── testimonial_author: "— Prof. Vishal Gupta, IIM Ahmedabad"
      ├── books_heading: "Published Works"
      ├── book1_title: "Leading Through Complexity"
      ├── book1_description: "..."
      ├── book2_title: "The Strategic Mindset"  
      ├── book2_description: "..."
      ├── book3_title: "Organizational Behavior in Practice"
      ├── book3_description: "..."
      ├── speaking_heading: "Speaking Engagements with Prof. Gupta"
      ├── speaking_description: "Prof. Gupta delivers keynotes..."
      ├── newsletter_heading: "Wisdom delivered to your inbox."
      └── newsletter_description: "Don't miss out on new insights..."
```

---

## 🔐 Step 1: Enable Firebase Authentication

### Go to Firebase Console:
1. Open https://console.firebase.google.com/
2. Click on your project: **IIM A Website**
3. Click **Authentication** from left sidebar
4. Click **Get Started**
5. Click **Email/Password** tab
6. **Enable** Email/Password authentication
7. Click **Save**

### Optional: Enable Google Sign-In
1. Still in **Authentication** > **Sign-in method**
2. Click **Google**
3. **Enable** Google sign-in
4. Enter support email
5. Click **Save**

---

## 👤 Step 2: Create Admin User

### Method 1: Using Firebase Console (Recommended)
1. In Firebase Console → **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - **Email**: `your-email@example.com` (use your real email)
   - **Password**: Create a strong password (min 6 characters)
4. Click **Add User**
5. **Copy the email** you just created

### Method 2: Using Auth Emulator (for testing)
Skip this if you created a user above.

---

## ⚙️ Step 3: Update Admin Email in Code

Open this file:
```
Frontend/src/context/AuthContext.jsx
```

Find line 23 and **replace** with your actual admin email:

```javascript
// BEFORE:
const ADMIN_EMAIL = 'jatin@example.com'; // Change this to your Firebase Admin email

// AFTER:
const ADMIN_EMAIL = 'your-actual-email@gmail.com'; // The email you created in Step 2
```

**Save the file.**

---

## 🧪 Step 4: Test the Integration

### Start the Development Server
```powershell
cd Frontend
npm run dev
```

### Access Admin Login
1. Open: http://localhost:5173
2. Click **Admin Login** in the top-right corner
3. Enter the credentials you created in Step 2
4. Click **Sign In**

### If Login is Successful:
- You'll see a green **✦ Admin** badge in the navbar
- Hover over any text on the page → You'll see a blue border and pencil icon ✏️
- Click any text → A floating edit box appears
- Edit the text and press Enter or click ✓
- **The text is saved to Firebase instantly!**

---

## 🎨 Step 5: Edit Your Website Content

### How to Edit Text:
1. **Login** as Admin (see Step 4)
2. **Hover** over any text element
3. **Click** to open the editor
4. **Edit** the text
5. Press **Enter** (single line) or click **✓** (multiline)
6. Changes are **saved to Firestore instantly**
7. **Refresh** the page → Your changes persist!

### What Can You Edit?
✅ Hero section (name, title, description)
✅ Course titles and descriptions  
✅ Blog post titles and excerpts
✅ Testimonials
✅ Book titles and descriptions
✅ Speaking section content
✅ Newsletter section text

---

## 🔒 Firestore Security Rules (Important!)

By default, your Firestore might be in **test mode** (anyone can read/write). Let's secure it:

### Go to Firestore Rules:
1. Firebase Console → **Firestore Database** → **Rules** tab
2. Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow everyone to READ the content
    match /content/{document=**} {
      allow read: true;
    }
    
    // Only authenticated admin can WRITE/UPDATE
    match /content/{document=**} {
      allow write: if request.auth != null && 
                      request.auth.token.email == 'your-actual-email@gmail.com';
    }
    
    // Newsletter subscribers collection (if you add it later)
    match /newsletter_subscribers/{email} {
      allow create: true;
      allow read, write: if request.auth != null;
    }
  }
}
```

3. **Replace** `'your-actual-email@gmail.com'` with your admin email
4. Click **Publish**

---

## 📁 Project Files Overview

### Key Files Created/Modified:
- ✅ `Frontend/src/hooks/useFirestoreDoc.js` - Fetches data from Firestore
- ✅ `Frontend/src/pages/Home.jsx` - Now uses Firebase data
- ✅ `Frontend/src/pages/AdminLogin.jsx` - Admin login page
- ✅ `Frontend/src/components/EditableText.jsx` - Inline editing component
- ✅ `Frontend/src/context/AuthContext.jsx` - Authentication logic
- ✅ `Frontend/src/firebase/config.js` - Firebase credentials

---

## 🐛 Troubleshooting

### Issue: "Cannot read properties of undefined"
**Solution**: Make sure Firestore has the `content/home` document with all fields.

### Issue: "Login doesn't work"
**Solution**: 
1. Check Firebase Authentication is enabled
2. Verify email/password are correct
3. Check browser console for errors

### Issue: "Text changes don't save"
**Solution**:
1. Make sure you're logged in as admin
2. Check Firestore Rules allow your email to write
3. Check browser console for errors

### Issue: "Admin badge doesn't show after login"
**Solution**: Update `ADMIN_EMAIL` in `AuthContext.jsx` to match your Firebase user email exactly.

---

## 🎯 Next Steps

### Add Newsletter Functionality
Create a collection to store email subscribers:
1. Go to Firestore → **Start collection**
2. Collection ID: `newsletter_subscribers`
3. First document ID: `test@example.com`
4. Fields: `email` (string), `subscribedAt` (timestamp)

### Add Image Upload
You can use Firebase Storage to let admins upload images:
- Profile pictures
- Blog post images
- Book covers

### Add Blog Posts Collection
Create dynamic blog posts instead of hardcoded ones.

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Check Firebase Console → Firestore → Check if data exists
3. Verify Authentication → Users → Admin user exists
4. Check Firestore Rules are published

---

**🎉 Congratulations! Your website is now fully dynamic with Firebase!**
