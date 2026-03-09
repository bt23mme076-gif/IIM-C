# Testimonials & Training Logos Setup Guide

## What's Been Added

### 1. **Two New Scrolling Sections on Homepage**
   - **Testimonials Strip**: Horizontally scrolling testimonials with yellow/white gradient cards
   - **Training Partners Strip**: Horizontally scrolling company logos with golden yellow background
   - Both sections auto-scroll right-to-left and pause on hover

### 2. **Admin Dashboard Enhancements**
   Two new tabs have been added to the Admin Dashboard:
   
   - **Testimonials Tab**: Add, edit, delete, and reorder testimonials
   - **Training Logos Tab**: Add, edit, delete, and reorder company logos
   
   Each testimonial includes:
   - Quote text
   - Author name
   - Role/Position
   - Organization
   - Display order
   - Published status

   Each training partner includes:
   - Company/Organization name
   - Logo URL (from /public folder)
   - Display order
   - Published status

### 3. **Logo Files**
   All company logos are already uploaded to `/Frontend/public/` folder:
   - Ambuja_Cements.svg.png
   - bpcl.jpg
   - Defence_Research_and_Development_Organisation.svg.png
   - Hindalco_Logo.svg.png
   - Hindustan_Petroleum_Logo.svg
   - Honeywell_logo.svg.png
   - ias.jpg
   - Indian_police_service_logo.jpeg
   - Indian_Revenue_Service_Logo.png
   - Indian_Space_Research_Organisation_Logo.svg.png
   - JLL_logo.svg.png
   - Larsen&Toubro_logo.svg.png
   - NHPC_official_logo.svg.png
   - Novartis-Logo.svg.png
   - primarc.png

## Initial Data Setup

### Quick Setup via Admin Dashboard (Recommended - One Click!)

1. Login to admin dashboard at `/admin-login`
2. Go to the **Testimonials** tab
3. Click the green **"Import Initial Data (13 items)"** button
4. Confirm the import
5. Go to the **Training Logos** tab
6. Click the green **"Import Initial Data (15 logos)"** button
7. Confirm the import

**Done!** All testimonials and logos are now live on your homepage.

### Alternative: Manual Setup via Admin Dashboard

If you prefer to add items manually or want to customize before adding:

1. Login to admin dashboard at `/admin-login`
2. Go to **Testimonials** tab
3. Click "Add Testimonial" for each testimonial
4. Fill in:
   - Quote
   - Author name
   - Role
   - Organization
   - Order (0, 1, 2, etc.)
   - Check "Published"

5. Go to **Training Logos** tab
6. Click "Add Training Partner" for each company
7. Fill in:
   - Company name
   - Logo URL (e.g., `/Ambuja_Cements.svg.png`)
   - Order (0, 1, 2, etc.)
   - Check "Published"

## Features

### Testimonials Section
- ✅ Auto-scrolling horizontal carousel
- ✅ Yellow & white gradient cards with golden borders
- ✅ Pause on hover
- ✅ Seamless infinite loop
- ✅ Fully responsive
- ✅ Dynamic data from Firestore
- ✅ Fallback to static content if no data

### Training Logos Section
- ✅ Auto-scrolling horizontal carousel (slower than testimonials)
- ✅ Golden yellow gradient background
- ✅ White cards with company logos
- ✅ Pause on hover
- ✅ Seamless infinite loop
- ✅ Fully responsive
- ✅ Dynamic data from Firestore
- ✅ Fallback to static content if no data

### Admin Features
- ✅ **One-click bulk import** of initial data (13 testimonials, 15 logos)
- ✅ Import button only shows when collection is empty
- ✅ Add/Edit/Delete testimonials
- ✅ Add/Edit/Delete training partners
- ✅ Reorder items (change display order)
- ✅ Toggle published status
- ✅ Live preview of logos
- ✅ List of available logos in public folder
- ✅ Real-time updates to website

## Firestore Collections

### `testimonials` Collection
```javascript
{
  quote: "Testimonial text...",
  author: "Author Name",
  role: "Position/Title",
  organization: "Company/Institution",
  order: 0,
  published: true
}
```

### `training_partners` Collection
```javascript
{
  name: "Company Name",
  logoUrl: "/logo-filename.png",
  order: 0,
  published: true
}
```

## Color Scheme Applied

The entire homepage now uses a vibrant white and yellow color scheme:

- **Hero Section**: Yellow accent line, gradient background, golden border on image
- **Courses Section**: Yellow gradient backgrounds on cards with golden borders
- **Blog Section**: Light yellow background
- **Testimonials**: Yellow/white gradient cards
- **Training Logos**: Golden yellow background
- **Books Section**: Yellow borders on book covers
- **Buttons**: Golden yellow with hover effects
- **Focus States**: Yellow outlines

## CSS Animations

New animations added to `App.css`:
- `animate-scroll-left`: 40s duration for testimonials
- `animate-scroll-left-slow`: 60s duration for logos
- Both pause on hover

## Next Steps

1. Run the initialization script to populate data
2. Visit homepage to see the new sections
3. Login to admin dashboard to manage content
4. Customize testimonials and logos as needed
5. Add more testimonials/partners anytime via admin panel

## Need Help?

- To adjust scroll speed: Edit animation duration in `App.css`
- To change colors: Update the gradient classes in `Home.jsx`
- To add more logos: Upload to `/public` folder and add via admin dashboard
- To reorder items: Change the "order" field in admin dashboard
