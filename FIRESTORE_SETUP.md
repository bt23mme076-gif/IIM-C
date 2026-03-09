# Firebase Firestore Setup Guide

This document provides the exact structure needed in your Firestore database for the website to function properly.

## 📋 Required Collections & Documents

### Collection: `content`

This collection stores all editable content for the website.

#### Document: `home`

```javascript
{
  // Hero Section
  "heroTitle": "Dr. [Your Name]",
  "heroSubtitle": "Professor of [Your Subject] at IIM Ahmedabad",
  
  // About Section
  "aboutText": "Enter your professional biography here. This can be multiple paragraphs describing your academic journey, research interests, teaching philosophy, and professional achievements.",
  
  // Profile Image
  "profileImage": "", // Will be auto-populated when you upload via admin panel
  
  // YouTube Integration
  "youtubeChannelId": "", // Your YouTube channel ID (e.g., "UCxxxxxxxxxxxxxxxx")
  
  // Social Media (optional)
  "twitter": "https://twitter.com/yourhandle",
  "linkedin": "https://linkedin.com/in/yourprofile",
  "github": "https://github.com/yourhandle",
  
  // Contact Information (optional)
  "email": "your.email@iima.ac.in",
  "office": "IIMA Campus, Ahmedabad",
  "phone": "+91-XXXXXXXXXX"
}
```

## 🔧 How to Set Up Firestore

### Method 1: Using Firebase Console (Recommended for beginners)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on "Firestore Database" in the left sidebar
4. Click "Create database"
5. Choose "Start in production mode" (we'll set rules later)
6. Select a Cloud Firestore location (choose closest to your users)
7. Click "Enable"

Once enabled:

1. Click "+ Start collection"
2. Enter Collection ID: `content`
3. Click "Next"
4. Enter Document ID: `home`
5. Add fields one by one:
   - Field: `heroTitle`, Type: string, Value: "Dr. Your Name"
   - Field: `heroSubtitle`, Type: string, Value: "Your Title"
   - Field: `aboutText`, Type: string, Value: "Your bio"
   - Field: `youtubeChannelId`, Type: string, Value: ""
   - Field: `profileImage`, Type: string, Value: ""
6. Click "Save"

### Method 2: Using Firebase Admin SDK (Advanced)

Create a file `initFirestore.js` in your backend:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initializeData() {
  try {
    await db.collection('content').doc('home').set({
      heroTitle: "Dr. Your Name",
      heroSubtitle: "Professor of [Subject] at IIM Ahmedabad",
      aboutText: "Enter your professional biography here...",
      profileImage: "",
      youtubeChannelId: "",
      twitter: "",
      linkedin: "",
      github: "",
      email: "your.email@iima.ac.in",
      office: "IIMA Campus, Ahmedabad",
      phone: ""
    });
    
    console.log('✓ Firestore initialized successfully!');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
  }
}

initializeData();
```

Run with: `node initFirestore.js`

## 🔒 Security Rules

After setting up the data structure, configure your security rules:

1. Go to Firebase Console > Firestore Database > Rules
2. Replace with the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Content collection - read by all, write by admin only
    match /content/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.auth.token.email == 'prof-email@iima.ac.in';
    }
    
    // Newsletter subscriptions (if you add this collection)
    match /newsletter/{document=**} {
      allow read: if request.auth != null && 
                   request.auth.token.email == 'prof-email@iima.ac.in';
      allow create: if true; // Anyone can subscribe
      allow update, delete: if request.auth != null && 
                             request.auth.token.email == 'prof-email@iima.ac.in';
    }
    
    // Contact messages (if you add this collection)
    match /messages/{document=**} {
      allow read: if request.auth != null && 
                   request.auth.token.email == 'prof-email@iima.ac.in';
      allow create: if true; // Anyone can send messages
      allow update, delete: if request.auth != null && 
                             request.auth.token.email == 'prof-email@iima.ac.in';
    }
  }
}
```

3. Replace `'prof-email@iima.ac.in'` with your actual admin email
4. Click "Publish"

## 🗄️ Storage Rules

For Firebase Storage (images, PDFs):

1. Go to Firebase Console > Storage > Rules
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile images
    match /profile/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.auth.token.email == 'prof-email@iima.ac.in';
    }
    
    // Newsletter PDFs
    match /newsletters/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.auth.token.email == 'prof-email@iima.ac.in';
    }
    
    // Book covers
    match /books/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.auth.token.email == 'prof-email@iima.ac.in';
    }
  }
}
```

3. Replace `'prof-email@iima.ac.in'` with your actual admin email
4. Click "Publish"

## 📊 Optional Collections

### Newsletter Subscriptions

```javascript
// Collection: newsletter
// Document: auto-generated ID
{
  "email": "subscriber@example.com",
  "subscribedAt": firebase.firestore.FieldValue.serverTimestamp(),
  "status": "active" // or "unsubscribed"
}
```

### Contact Messages

```javascript
// Collection: messages
// Document: auto-generated ID
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Message content...",
  "createdAt": firebase.firestore.FieldValue.serverTimestamp(),
  "read": false
}
```

### Books (if you want to manage books via Firestore)

```javascript
// Collection: books
// Document: auto-generated ID
{
  "title": "Book Title",
  "description": "Brief description...",
  "coverImage": "URL to cover image",
  "amazonLink": "https://amazon.com/...",
  "publishedDate": "2024",
  "order": 1 // for sorting
}
```

## ✅ Verification

To verify your setup:

1. Go to Firestore Database in Firebase Console
2. You should see:
   - Collection: `content`
   - Document: `home`
   - Fields: heroTitle, heroSubtitle, aboutText, etc.

3. Visit your website
4. The content should load (even if it's placeholder text)
5. If you see "Loading..." forever, check:
   - Firebase config in `config.js`
   - Firestore rules allow read access
   - Browser console for errors

## 🆘 Troubleshooting

### Error: "Missing or insufficient permissions"
- Check Firestore security rules
- Ensure `allow read: if true;` is set for content collection

### Error: "Firebase not initialized"
- Verify `firebase/config.js` has correct credentials
- Check if Firebase packages are installed

### Data not updating
- Check if logged in as admin
- Verify admin email in AuthContext matches Firestore rules
- Check browser console for errors

## 📞 Need Help?

If you encounter issues:
1. Check Firebase Console > Firestore Database > Usage tab
2. Look for error messages in browser console (F12)
3. Verify all environment variables are set correctly
4. Ensure internet connection is stable

---

**Next Steps**: After setting up Firestore, configure Firebase Authentication for admin login.
