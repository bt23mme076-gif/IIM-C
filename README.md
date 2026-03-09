# IIM-A Professor Website

A modern, high-end personal branding website for an IIM Ahmedabad Professor, featuring inline editing capabilities, YouTube integration, newsletter system, and more.

## 🌟 Project Overview

This project is inspired by [drlauriesantos.com](https://drlauriesantos.com) and built specifically for academic professionals who want a minimalist, elegant online presence with powerful content management features.

### Key Features

✅ **Inline Editing** - No separate admin dashboard; edit content directly on the page  
✅ **Firebase Integration** - Firestore, Authentication, and Storage  
✅ **YouTube Integration** - Display latest videos from your channel  
✅ **Newsletter System** - Subscribe and manage newsletters  
✅ **Books Showcase** - Display published works  
✅ **Contact Form** - Direct communication with visitors  
✅ **Responsive Design** - Mobile-first, fully responsive  
✅ **Smooth Animations** - Framer Motion throughout  
✅ **SEO Optimized** - Clean, semantic HTML structure  

## 🏗️ Project Structure

```
IIM-A/
├── Frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── EditableText.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/         # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── firebase/        # Firebase configuration
│   │   │   └── config.js
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useApi.js
│   │   ├── pages/           # Page components
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── SETUP_GUIDE.md       # Detailed setup instructions
│
└── Backend/                  # Node.js + Express backend
    ├── server.js            # Main server file
    ├── package.json
    ├── .env.example         # Environment variable template
    └── .gitignore
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Firebase account (free tier works)
- Google Cloud account (for YouTube API)

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd IIM-A

# Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd ../Backend
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable:
   - **Firestore Database**
   - **Authentication** (Google provider)
   - **Storage**
4. Copy your config to `Frontend/src/firebase/config.js`
5. Create Firestore document: `content/home` with fields:
   - `heroTitle`: "Your Name"
   - `heroSubtitle`: "Your Title"
   - `aboutText`: "Your bio"
   - `youtubeChannelId`: "Your channel ID"
   - `profileImage`: "Image URL"

### 3. Environment Variables

```bash
# Frontend/.env
VITE_API_URL=http://localhost:5000/api

# Backend/.env
YOUTUBE_API_KEY=your_youtube_api_key
PORT=5000
```

### 4. Run the Project

```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

Visit `http://localhost:5173`

## 📖 Detailed Documentation

For detailed setup instructions, see [SETUP_GUIDE.md](Frontend/SETUP_GUIDE.md)

## 🎨 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **React Router** - Routing
- **Firebase SDK** - Backend services

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Axios** - HTTP client
- **YouTube Data API v3** - Video integration

### Database & Auth
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User management
- **Firebase Storage** - File storage

## 🔑 Admin Features

### How to Use Admin Panel

1. Click "Admin Login" in navbar
2. Sign in with authorized Google account (prof-email@iima.ac.in)
3. Once logged in:
   - **Edit Text**: Hover over any text → Click pencil icon → Edit → Save
   - **Upload Image**: Hover over profile image → Click to upload
   - **Update YouTube ID**: Edit the channel ID field when logged in

### Admin Email Configuration

Update in `Frontend/src/context/AuthContext.jsx`:
```javascript
const ADMIN_EMAIL = 'prof-email@iima.ac.in';
```

## 📱 Pages & Sections

### Home Page (/)
- ✅ Hero Section with profile image
- ✅ About Section
- ✅ Latest YouTube Videos
- ✅ Newsletter Subscription
- ✅ Books Gallery
- ✅ Contact Form

### Future Pages
- About - Detailed biography
- Research - Publications and projects
- Books - Extended book showcase
- Courses - Teaching materials
- Newsletter - Archive
- Contact - Extended contact options

## 🎯 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'off-white': '#fdfcfb',
}
```

### Fonts
Current: Playfair Display (headings) + Inter (body)  
Change in `src/index.css`

### Content
All content is managed through:
1. **Firestore** - Text content
2. **Firebase Storage** - Images/PDFs
3. **Admin Panel** - Inline editing

## 🔒 Security

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /content/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.auth.token.email == 'prof-email@iima.ac.in';
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.auth.token.email == 'prof-email@iima.ac.in';
    }
  }
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd Frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Render/Railway/Heroku)
```bash
cd Backend
# Set environment variables in hosting platform
# Deploy
```

## 🐛 Troubleshooting

### Issue: Videos not loading
- Check YouTube API key in backend `.env`
- Verify channel ID is correct
- Check API quota limits in Google Cloud Console

### Issue: Images not uploading
- Verify Firebase Storage is enabled
- Check storage rules allow uploads for admin
- Ensure file size is under limit

### Issue: Authentication not working
- Verify Google auth is enabled in Firebase
- Check admin email is correct
- Clear browser cache and try again

## 📞 Support

For issues or questions:
- Email: [your-email@example.com]
- GitHub Issues: [repo-url]/issues

## 📄 License

Private project - All rights reserved.

## 🙏 Acknowledgments

- Inspired by [Dr. Laurie Santos](https://drlauriesantos.com)
- Built for IIM Ahmedabad faculty

---

**Built with ❤️ for Academic Excellence**
