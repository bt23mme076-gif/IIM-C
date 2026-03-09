# IIM Professor Personal Branding Website

A high-end, minimalist personal branding website built with React, Vite, Firebase, and Tailwind CSS. Features inline editing for admin users.

## 🚀 Features

- **Inline Editing**: No separate admin dashboard - edit content directly on the page when logged in as admin
- **Firebase Integration**: Firestore for content management, Firebase Auth for authentication, Storage for images
- **Responsive Design**: Fully responsive, mobile-first design
- **Smooth Animations**: Framer Motion animations throughout
- **YouTube Integration**: Display latest videos from YouTube channel
- **Newsletter System**: Subscribe and download past issues
- **Books Showcase**: Display published books with Amazon links
- **Contact Form**: Get in touch section

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Google Cloud Console account (for YouTube API)

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable the following services:
   - **Authentication**: Enable Google Sign-In provider
   - **Firestore Database**: Create in production mode
   - **Storage**: Enable Firebase Storage

4. Update `src/firebase/config.js` with your Firebase credentials

### 3. Firestore Database Structure

Create the following collections and documents in Firestore:

**Collection: `content`**

**Document: `home`**
```json
{
  "heroTitle": "Dr. [Professor Name]",
  "heroSubtitle": "Professor of [Subject] at IIM Ahmedabad",
  "aboutText": "Brief bio about the professor...",
  "youtubeChannelId": "YOUR_YOUTUBE_CHANNEL_ID",
  "profileImage": "URL_TO_PROFILE_IMAGE"
}
```

### 4. Firebase Authentication Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to everyone
    match /content/{document=**} {
      allow read: if true;
      // Only allow write to authenticated admin
      allow write: if request.auth != null && request.auth.token.email == 'prof-email@iima.ac.in';
    }
  }
}
```

### 5. Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'prof-email@iima.ac.in';
    }
    match /newsletters/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'prof-email@iima.ac.in';
    }
  }
}
```

### 6. Update Admin Email

In `src/context/AuthContext.jsx`, update the admin email:

```javascript
const ADMIN_EMAIL = 'prof-email@iima.ac.in';
```

Replace with the actual professor's email address.

## 🎨 Customization

### Fonts
The site uses:
- **Playfair Display** for headings (serif)
- **Inter** for body text (sans-serif)

These are loaded via Google Fonts in `src/index.css`.

### Colors
Main color scheme defined in `tailwind.config.js`:
- Background: `#fdfcfb` (off-white)
- Primary text: `#1a1a1a` (dark gray)
- Accent: Gray-900 for buttons and CTAs

### Adding New Sections

1. Create editable fields in Firestore `content/home` document
2. Use the `EditableText` component in your JSX:

```jsx
<EditableText 
  value={data.fieldName} 
  field="fieldName"
  multiline={true} // for paragraphs
  className="your-custom-classes"
/>
```

## 🔧 Development

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
npm run preview
```

## 🎯 How to Use Admin Features

1. Click "Admin Login" in the navbar
2. Sign in with the authorized Google account
3. Once logged in, hover over any editable text to see the edit icon
4. Click the pencil icon to edit
5. Make changes and click "Save"
6. Changes are immediately saved to Firestore

### Profile Image Upload
- When logged in as admin, hover over the profile image
- Click to upload a new image
- Image is stored in Firebase Storage

### YouTube Channel ID
- When logged in as admin, you can edit the YouTube Channel ID
- The site will fetch the latest 3 videos from that channel (requires backend setup)

## 🌐 Backend Setup (Optional)

For YouTube API integration, set up the backend:

```bash
cd Backend
npm install
```

Create `.env` file:
```
YOUTUBE_API_KEY=your_youtube_api_key
PORT=5000
```

Run backend:
```bash
npm start
```

## 📚 Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Node.js + Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Routing**: React Router DOM

## 🤝 Contributing

This is a custom project for IIM Professor. For any issues or improvements, please contact the development team.

## 📄 License

Private project - All rights reserved.

## 📞 Support

For technical support, contact: [your-email@example.com]
