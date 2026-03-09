# Admin Panel Guide

## Overview
The Admin Panel now provides comprehensive control over all pages of the website. You can manage content for:
- **Home Page** - Hero section, courses, blogs, books, testimonials
- **Blogs** - Create, edit, and manage blog posts
- **Courses** - Add and manage courses with YouTube integration
- **Testimonials** - Manage customer testimonials
- **Training Logos** - Upload and organize partner logos
- **About Page** - Edit bio, achievements, work history
- **Research Page** - Manage publications, cases, PhD students
- **Trainings Page** - Edit training programs and descriptions

## Accessing the Admin Panel

1. Navigate to `/admin` and log in with your admin credentials
2. Once logged in, you'll see the Admin Dashboard with multiple tabs

## Current Features

### Fully Editable
✅ **Home Content** - All hero, course, blog, and book content
✅ **Blogs** - Full CRUD operations with image upload
✅ **Courses** - Full CRUD with YouTube integration
✅ **Testimonials** - Full CRUD operations
✅ **Training Logos** - Full CRUD with image upload

### Basic Editing (More Features Coming Soon)
⚠️ **About Page** - Basic text editing available
⚠️ **Research Page** - Heading and description editing
⚠️ **Trainings Page** - Page headings and descriptions

## How to Edit Content

### Home, Blogs, Courses, Testimonials, Logos
1. Click on the respective tab
2. Use the "Add New" button to create content
3. Edit existing items by clicking the edit icon
4. Delete items by clicking the trash icon
5. Click "Save" to persist changes to Firestore

### About, Research, Trainings Pages

**Current Capability:**
- Edit basic text fields like headings and descriptions
- Changes save directly to Firestore

**Advanced Editing:**
For detailed content like publications, work experience, achievements:
1. Go to Firebase Console → Firestore Database
2. Navigate to `content` collection
3. Edit the respective document (`about`, `research`, or `trainings`)
4. Modify the nested arrays and objects directly

**Coming Soon:**
- Visual editors for arrays (publications, work experience, etc.)
- Drag-and-drop reordering
- Inline image upload for all pages
- Rich text editing

## Data Structure

### Firestore Collections
```
content/
  ├── home          # Home page content
  ├── about         # About page content
  ├── research      # Research page content
  └── trainings     # Trainings page content

blogs/              # Individual blog posts
courses/            # Individual courses
testimonials/       # Individual testimonials
trainingLogos/      # Individual partner logos
```

### Example: About Page Structure
```json
{
  "hero_heading": "Creating Happy Leaders",
  "hero_subtitle": "Professor of Organizational Behavior at IIM Ahmedabad.",
  "bio_heading": "Bridging Engineering and Behavior",
  "achievements": [
    {
      "id": 1,
      "icon": "award",
      "title": "Academic Leader",
      "description": "..."
    }
  ],
  "awards": ["Award 1", "Award 2"],
  "work_experience": [...]
}
```

## Automatic Initialization

The Admin Panel automatically creates default content for About, Research, and Trainings pages if they don't exist in Firestore. This happens when you first visit the admin dashboard.

Default values are set for:
- Page headings
- Page descriptions  
- Subtitles

## Next Steps for Full Admin Control

To enable complete editing without touching Firestore directly:

1. **Update Page Components**: Modify About.jsx, Research.jsx, and Trainings.jsx to fetch content from Firestore instead of using hardcoded data
2. **Build Advanced Editors**: Create array/object editors in AdminDashboard for complex nested data
3. **Add Validation**: Implement form validation for required fields
4. **Image Upload**: Add Cloudinary integration for all image fields

## Recommended Workflow

1. **For quick text changes**: Use the Admin Panel tabs
2. **For structural changes**: Edit directly in Firestore Console
3. **For adding new features**: Update the initialization scripts in `src/scripts/`

## Troubleshooting

**Problem**: Changes don't appear on the live site
**Solution**: The pages currently use hardcoded data. They need to be updated to fetch from Firestore (see "Next Steps")

**Problem**: Content doesn't save
**Solution**: Check browser console for errors. Ensure you're logged in as admin.

**Problem**: Missing fields in admin panel
**Solution**: Some complex fields require Firestore direct editing for now

## Support

For questions or issues, check:
- Browser console for error messages
- Firestore Console to verify data structure
- ADMIN_USER_GUIDE.md for general admin instructions
