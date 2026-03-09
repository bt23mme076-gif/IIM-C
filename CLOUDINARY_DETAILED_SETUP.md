# 🎯 Cloudinary Upload Preset - Step by Step Guide

## **Step 3: Upload Preset Configuration (Screenshots Guide)**

### **Method 1: Browser-Based Setup (5 Minutes)**

#### **Step-by-Step Instructions:**

1. **Open Cloudinary Console:**
   ```
   URL: https://console.cloudinary.com/
   ```
   - Login with your Cloudinary account
   - You should see your dashboard

2. **Navigate to Settings:**
   - Look at the **bottom-left corner** of the page
   - Click on the **⚙️ Settings (gear icon)**
   - Settings page will open

3. **Go to Upload Tab:**
   - On the left sidebar, you'll see multiple tabs
   - Click on **"Upload"** tab
   - Scroll down to find **"Upload presets"** section

4. **Add Upload Preset:**
   - In the "Upload presets" section
   - Click **"Add upload preset"** button (blue button)
   - A new form will appear

5. **Configure Upload Preset:**
   
   **Basic Settings:**
   ```
   ┌─────────────────────────────────────┐
   │ Upload preset name:                 │
   │ ┌─────────────────────────────────┐ │
   │ │ iima_courses                    │ │
   │ └─────────────────────────────────┘ │
   │                                     │
   │ Signing mode:                       │
   │ ○ Signed                            │
   │ ● Unsigned  ← SELECT THIS!          │
   │                                     │
   │ Folder:                             │
   │ ┌─────────────────────────────────┐ │
   │ │ iima-courses                    │ │
   │ └─────────────────────────────────┘ │
   └─────────────────────────────────────┘
   ```

   **Important Fields:**
   - **Upload preset name:** `iima_courses` (exact spelling)
   - **Signing mode:** Select **"Unsigned"** (this is CRITICAL!)
   - **Folder:** `iima-courses` (optional but recommended)

6. **Advanced Settings (Optional but Recommended):**
   
   Scroll down to find these options:
   
   ```
   ✅ Unique filename: ON
   ✅ Use filename or externally defined Public ID: OFF
   ✅ Discard original filename: ON
   
   Media analysis:
   ✅ Quality analysis: ON
   ✅ Accessibility analysis: OFF
   
   Upload controls:
   Max file size: 5 MB
   Allowed formats: jpg, png, jpeg, gif, webp
   ```

7. **Save Upload Preset:**
   - Scroll to the bottom
   - Click **"Save"** button (blue)
   - You should see "Upload preset created successfully"

8. **Verify Upload Preset:**
   - Go back to Upload tab
   - In "Upload presets" section, you should see:
     ```
     Name: iima_courses
     Mode: unsigned
     Folder: iima-courses
     ```

---

## **Method 2: Quick Setup via URL (2 Minutes)**

1. **Direct Link to Upload Settings:**
   ```
   https://console.cloudinary.com/settings/upload
   ```
   - This takes you directly to the upload settings page

2. **Click "Add upload preset"**

3. **Fill the form:**
   - Name: `iima_courses`
   - Mode: `Unsigned` ✓
   - Folder: `iima-courses`

4. **Click Save**

---

## **Method 3: Using Cloudinary API (Advanced)**

If you prefer command line, you can use this Node.js script:

```javascript
// Create file: setup-cloudinary-preset.js
const https = require('https');

const cloudName = 'URvRGQtLejhcD8mBpW2k17SUDBQ';
const apiKey = '898784168144989';
const apiSecret = 'YOUR_API_SECRET'; // Get from Cloudinary dashboard

const options = {
  hostname: 'api.cloudinary.com',
  path: `/v1_1/${cloudName}/upload_presets`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Buffer.from(apiKey + ':' + apiSecret).toString('base64')
  }
};

const data = JSON.stringify({
  name: 'iima_courses',
  unsigned: true,
  folder: 'iima-courses'
});

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
```

Run: `node setup-cloudinary-preset.js`

---

## **✅ Verification Steps:**

### **Test Upload Preset:**

1. **Go to Cloudinary Media Library:**
   ```
   https://console.cloudinary.com/console/media_library
   ```

2. **Click "Upload"** (top right)

3. **In Upload widget:**
   - Look for **"Upload preset"** dropdown
   - You should see **"iima_courses"** in the list
   - Select it and try uploading a test image

4. **Check Folder:**
   - After upload, image should appear in `iima-courses` folder
   - If you see it there, setup is successful! ✅

---

## **🔧 Troubleshooting:**

### **Problem 1: "Upload preset not found"**
**Solution:**
- Double-check preset name is exactly: `iima_courses` (with underscore)
- Verify it's set to "Unsigned" mode
- Wait 1-2 minutes after creation for it to activate

### **Problem 2: "Invalid signature" error**
**Solution:**
- Upload preset MUST be "Unsigned"
- Go back to Settings → Upload → Edit preset
- Change "Signed" to "Unsigned"
- Save again

### **Problem 3: "Access denied"**
**Solution:**
- Check if your Cloudinary account is active
- Verify you're logged in to the correct account
- Try logging out and back in

### **Problem 4: Can't find Settings button**
**Solution:**
- Look at **bottom-left corner** of dashboard
- It's a small gear/cog icon
- Click on your account name → Settings

---

## **📱 Mobile/Tablet Setup:**

If using mobile browser:
1. Use desktop mode in browser
2. Or use Cloudinary mobile app (if available)
3. Or ask someone to do it on desktop

---

## **🎬 Video Tutorial Reference:**

Search on YouTube:
- "Cloudinary upload preset setup"
- "How to create unsigned upload preset Cloudinary"
- "Cloudinary settings upload configuration"

Official Docs:
https://cloudinary.com/documentation/upload_presets

---

## **⚡ Quick Checklist:**

Before testing your website:
- [ ] Cloudinary account created
- [ ] Logged into console.cloudinary.com
- [ ] Went to Settings (gear icon)
- [ ] Clicked Upload tab
- [ ] Created preset named: `iima_courses`
- [ ] Set mode to: **Unsigned**
- [ ] Set folder to: `iima-courses`
- [ ] Clicked Save
- [ ] Verified preset appears in list

---

## **🚀 After Setup - Test Upload:**

1. **Start your website:**
   ```bash
   cd Frontend
   npm run dev
   ```

2. **Login as admin:**
   - Go to: `http://localhost:5173/admin`
   - Enter admin credentials

3. **Test image upload:**
   - Go to Courses tab
   - Click "Add Course" or Edit existing
   - Click "Choose Image"
   - Select a small image (< 1MB)
   - Watch for "Image uploaded successfully! ✓"

4. **Verify in Cloudinary:**
   - Go to: https://console.cloudinary.com/console/media_library
   - Check `iima-courses` folder
   - Your uploaded image should be there!

---

## **✨ Done!**

Once you see the upload preset in your Cloudinary dashboard, you're ready to start uploading images from your website!

**Next:** Use admin panel to upload course images, blog images, testimonial photos, and training partner logos!
