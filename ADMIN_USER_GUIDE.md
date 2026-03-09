# Admin Panel User Guide

## 🔐 Logging In

### Access the Admin Panel
1. Click **"Admin Login"** in the top-right corner of the website
2. Or directly visit: `http://localhost:5173/admin` (or your domain)

### Login Methods
- **Email/Password**: Use the credentials you created in Firebase Console
- **Google Sign-In**: Click "Sign in with Google" (if enabled)

---

## ✏️ Editing Website Content

### Step 1: Confirm You're Logged In
After successful login, you should see:
- A green **"✦ Admin"** badge in the navigation bar
- **"Logout"** button appears

### Step 2: Find Content to Edit
1. Scroll through the website
2. **Hover** your mouse over any text
3. You'll see:
   - Blue border around editable text
   - Small pencil icon ✏️ appears

### Step 3: Edit the Content
1. **Click** on the text you want to edit
2. A **floating edit box** appears
3. Make your changes
4. **Save options**:
   - Press **Enter** (for single-line text)
   - Click **✓ checkmark** button
   - Press **Esc** to cancel

### Step 4: Changes Auto-Save
- Changes save to Firebase **instantly**
- **Refresh** the page to confirm changes persisted
- Other visitors will see updates immediately

---

## 📝 What You Can Edit

### Hero Section
- Greeting text ("Hey there! Meet")
- Professor name
- Subtitle (position/title)
- Description paragraph

### Courses Section
- Section heading
- Course 1 title & description
- Course 2 title & description

### Blog/Reflections Section
- Section heading
- Article 1 title & excerpt
- Article 2 title & excerpt
- Article 3 title & excerpt

### Testimonials
- Quote text
- Author attribution

### Books Section
- Section heading
- Book 1 title & description
- Book 2 title & description
- Book 3 title & description

### Speaking Engagements
- Section heading
- Description text

### Newsletter
- Heading text
- Description text

---

## 📊 Viewing Newsletter Subscribers

### Option 1: Firebase Console (Recommended)
1. Go to: https://console.firebase.google.com/project/iim-a-website/firestore
2. Click **"newsletter_subscribers"** collection
3. View all subscriber emails and timestamps

### Option 2: Export Data
```javascript
// Coming soon - dashboard feature
```

---

## 🎨 Best Practices

### ✅ DO:
- Keep headlines short and impactful
- Use clear, concise language
- Preview changes before logging out
- Save frequently (auto-saves on edit)
- Use consistent tone across sections

### ❌ DON'T:
- Delete all text (leave at least one character)
- Use special characters that might break formatting
- Copy-paste from Word (formatting issues)
- Edit while on slow internet (changes might not save)

---

## 🚨 Troubleshooting

### Problem: "Changes don't save"
**Solution**:
1. Check internet connection
2. Verify you're logged in (see Admin badge)
3. Try logging out and back in
4. Check browser console (F12) for errors

### Problem: "Can't see edit button"
**Solution**:
1. Confirm you're logged in as admin
2. Check that admin email in code matches your login email
3. Try hard refresh: Ctrl + Shift + R

### Problem: "Accidentally deleted text"
**Solution**:
1. Go to Firebase Console
2. Navigate to: Firestore → content → home
3. Find the field you deleted
4. Click and restore the previous value
5. Or refresh page (might revert to last saved state)

---

## 🔒 Security Tips

### Keep Your Login Safe
- ✅ Use strong password (12+ characters)
- ✅ Enable 2-Factor Authentication in Firebase
- ✅ Don't share admin credentials
- ✅ Log out when done editing
- ✅ Use private/incognito window on shared computers

### Who Can See What?
| User Type | Can View Website | Can Edit | Can Login |
|-----------|-----------------|----------|-----------|
| Public Visitor | ✅ Yes | ❌ No | ❌ No |
| Logged-in Non-Admin | ✅ Yes | ❌ No | ✅ Yes |
| Admin (You) | ✅ Yes | ✅ Yes | ✅ Yes |

---

## 💡 Pro Tips

### Keyboard Shortcuts
- **Enter**: Save single-line edits
- **Esc**: Cancel edit without saving
- **Tab**: Move between fields (future feature)

### Workflow Suggestions
1. **Plan changes**: Write them down first
2. **Edit in batches**: Update related content together
3. **Preview**: Check on mobile view too
4. **Backup**: Take screenshots before major changes

### Content Writing Tips
- **Headlines**: 6-10 words max
- **Descriptions**: 2-3 sentences
- **Excerpts**: 1-2 sentences
- **Use action words**: "Discover", "Learn", "Build"
- **Stay professional**: Match IIM-A brand

---

## 📞 Getting Help

### Check These First
1. **Setup Guide**: `COMPLETE_SETUP_GUIDE.md`
2. **Firebase Console**: Check for error messages
3. **Browser Console**: Press F12, check Console tab

### Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| "Permission denied" | Not logged in as admin | Login again |
| "Document not found" | Firestore not initialized | Run init script |
| "Network error" | Connection issue | Check internet |

---

## 🎯 Next Steps

### Future Features (Coming Soon)
- [ ] Image upload capability
- [ ] Blog post management
- [ ] Analytics dashboard
- [ ] Bulk export/import
- [ ] Revision history
- [ ] Multi-language support

---

**Need Help?** Check the browser console (F12) or Firebase Console for detailed error messages.
