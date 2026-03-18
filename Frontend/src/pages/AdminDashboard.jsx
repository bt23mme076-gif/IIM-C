import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { FiSave, FiPlus, FiTrash2, FiEdit, FiX, FiBookOpen, FiYoutube, FiFileText, FiDownload, FiStar, FiImage, FiUpload, FiUsers, FiBriefcase, FiExternalLink, FiMail, FiSend, FiInbox, FiRefreshCw } from 'react-icons/fi';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import ResearchEditor from '../components/admin/ResearchEditor';
import ConsultingEditor from '../components/admin/ConsultingEditor';
import OpinionsEditor from '../components/admin/OpinionsEditor';

// Add mobile responsive styles
const mobileStyles = `
  @media (max-width: 768px) {
    .admin-tabs {
      flex-wrap: nowrap !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
    }
    
    .admin-tab {
      flex-shrink: 0 !important;
      padding: 0.75rem 1rem !important;
      font-size: 0.875rem !important;
    }
    
    .admin-header {
      padding: 1.5rem 0 !important;
    }
    
    .admin-header h1 {
      font-size: 1.5rem !important;
    }
    
    .admin-header-content, .admin-content-wrapper {
      padding: 0 1rem !important;
    }
    
    .admin-button-group {
      flex-direction: column !important;
      width: 100% !important;
    }
    
    .admin-button-group button {
      width: 100% !important;
      justify-content: center !important;
    }
    
    .admin-card {
      padding: 1rem !important;
    }
    
    .admin-form-row {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    
    .admin-form-row > div:first-child {
      width: 100% !important;
    }
    
    .logo-preview-container {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 120px !important;
      margin-bottom: 1rem !important;
    }
    
    .logo-card-content {
      width: 100% !important;
    }
    
    .logo-url-text {
      display: none !important;
    }
    
    .logo-info-wrapper {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
    }
    
    .admin-editor-actions {
      flex-direction: column !important;
      gap: 0.5rem !important;
    }
    
    .admin-editor-actions button {
      width: 100% !important;
    }
    
    .admin-content-section {
      padding: 1rem !important;
    }
  }
  
  @media (max-width: 480px) {
    .admin-header h1 {
      font-size: 1.25rem !important;
    }
    
    .admin-tab {
      font-size: 0.8rem !important;
      padding: 0.6rem 0.8rem !important;
    }
  }
`;

// Initial data deleted

// Initial data deleted

export default function AdminDashboard() {
  // Inject mobile styles for responsive admin dashboard
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = mobileStyles;
    document.head.appendChild(styleTag);
    return () => { document.head.removeChild(styleTag); };
  }, []);
  const { isAdmin, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [homeContent, setHomeContent] = useState({});
  const [aboutContent, setAboutContent] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Newsletter state
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');
  const [newsletterSending, setNewsletterSending] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [newsletterResult, setNewsletterResult] = useState(null); // { sent, failed }
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const loadSubscribers = async () => {
    setSubscribersLoading(true);
    try {
      const snap = await getDocs(collection(db, 'newsletter_subscribers'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.subscribedAt || 0) - new Date(a.subscribedAt || 0));
      setSubscribers(list);
    } catch (err) {
      alert('Error loading subscribers: ' + err.message);
    } finally {
      setSubscribersLoading(false);
    }
  };

  const exportSubscribersCSV = () => {
    if (!subscribers.length) return;
    const rows = [['#', 'Email', 'Status', 'Subscribed On', 'Source']];
    subscribers.forEach((s, i) => {
      rows.push([
        i + 1,
        s.email,
        s.status || 'active',
        s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString('en-IN') : '',
        s.source || 'website'
      ]);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `newsletter_subscribers_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // Blog comments state
  const [blogComments, setBlogComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  
  // Home content image upload states
  const [homeImageUploading, setHomeImageUploading] = useState({});
  const [homeImageProgress, setHomeImageProgress] = useState({});

  // Redirect if not admin
  useEffect(() => {
    console.log('Admin Dashboard - isAdmin:', isAdmin, 'currentUser:', currentUser?.email);
    if (!isAdmin && currentUser !== null) {
      console.log('Redirecting to home - not admin');
      navigate('/admin');
    }
  }, [isAdmin, currentUser, navigate]);

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-load subscribers & campaigns when newsletter tab is opened
  useEffect(() => {
    if (activeTab === 'newsletter') {
      if (subscribers.length === 0) loadSubscribers();
      if (campaigns.length === 0) {
        getDocs(collection(db, 'newsletter_campaigns')).then(snap => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          setCampaigns(list);
        }).catch(() => {});
      }
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin dashboard data...');
      
      // Fetch home content
      const homeDoc = await getDoc(doc(db, 'content', 'home'));
      if (homeDoc.exists()) {
        setHomeContent(homeDoc.data());
        console.log('Home content loaded');
      } else {
        console.log('No home content found');
        setHomeContent({});
      }

      // Fetch about content
      const aboutDoc = await getDoc(doc(db, 'content', 'about'));
      if (aboutDoc.exists()) {
        setAboutContent(aboutDoc.data());
        console.log('About content loaded');
      } else {
        console.log('About content not found, initializing...');
        const defaultAbout = {
          hero_heading: "Creating Happy Leaders",
          hero_subtitle: "Professor of Organizational Behavior at IIM Calcutta.",
          bio_heading: "Bridging Engineering and Behavior",
        };
        await setDoc(doc(db, 'content', 'about'), defaultAbout);
        setAboutContent(defaultAbout);
      }


      // Fetch blogs
      const blogsSnapshot = await getDocs(collection(db, 'blogs'));
      const blogsData = blogsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogsData);
      console.log('Blogs loaded:', blogsData.length);

      // Fetch courses
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
      console.log('Courses loaded:', coursesData.length);

      setLoading(false);
      console.log('All data loaded successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ text: `Error loading data: ${error.message}`, type: 'error' });
      setLoading(false);
    }
  };

  // Fetch blog comments (all - for admin moderation)
  const fetchBlogComments = async () => {
    setCommentsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'blog_comments'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
        const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
        return bTime - aTime;
      });
      setBlogComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const approveComment = async (commentId) => {
    try {
      await updateDoc(doc(db, 'blog_comments', commentId), { approved: true });
      setBlogComments(prev => prev.map(c => c.id === commentId ? { ...c, approved: true } : c));
      setMessage({ text: 'Comment approved!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2000);
    } catch (err) {
      setMessage({ text: 'Error approving comment', type: 'error' });
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteDoc(doc(db, 'blog_comments', commentId));
      setBlogComments(prev => prev.filter(c => c.id !== commentId));
      setMessage({ text: 'Comment deleted!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2000);
    } catch (err) {
      setMessage({ text: 'Error deleting comment', type: 'error' });
    }
  };

  // Save home content
  const saveHomeContent = async () => {
    try {
      setSaving(true);
      await updateDoc(doc(db, 'content', 'home'), homeContent);
      setMessage({ text: 'Home content saved successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error saving home content:', error);
      setMessage({ text: 'Error saving content', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Upload image for home content
  const handleHomeImageUpload = async (file, fieldName) => {
    if (!file) return;
    
    try {
      setHomeImageUploading({ ...homeImageUploading, [fieldName]: true });
      setHomeImageProgress({ ...homeImageProgress, [fieldName]: 'Uploading...' });
      
      const imageUrl = await uploadToCloudinary(file, 'home');
      
      setHomeContent({ ...homeContent, [fieldName]: imageUrl });
      setHomeImageProgress({ ...homeImageProgress, [fieldName]: 'Upload successful!' });
      setTimeout(() => {
        setHomeImageProgress({ ...homeImageProgress, [fieldName]: '' });
      }, 2000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setHomeImageProgress({ ...homeImageProgress, [fieldName]: 'Upload failed. Please try again.' });
    } finally {
      setHomeImageUploading({ ...homeImageUploading, [fieldName]: false });
    }
  };

  // Add new blog
  const addBlog = async () => {
    try {
      const newBlog = {
        title: 'New Blog Post',
        excerpt: 'Blog excerpt...',
        content: 'Blog content here...',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        author: currentUser.displayName || 'Prof. Bodhibrata Nag',
        date: new Date().toISOString(),
        published: false
      };
      const docRef = await addDoc(collection(db, 'blogs'), newBlog);
      setBlogs([...blogs, { id: docRef.id, ...newBlog }]);
      setMessage({ text: 'Blog added!', type: 'success' });
    } catch (error) {
      console.error('Error adding blog:', error);
      setMessage({ text: 'Error adding blog', type: 'error' });
    }
  };

  // Update blog
  const updateBlog = async (blogId, updatedData) => {
    try {
      await updateDoc(doc(db, 'blogs', blogId), updatedData);
      setBlogs(blogs.map(blog => blog.id === blogId ? { ...blog, ...updatedData } : blog));
      setMessage({ text: 'Blog updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error updating blog:', error);
      setMessage({ text: 'Error updating blog', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Delete blog
  const deleteBlog = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      await deleteDoc(doc(db, 'blogs', blogId));
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      setMessage({ text: 'Blog deleted successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error deleting blog:', error);
      setMessage({ text: 'Error deleting blog', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Add new course
  const addCourse = async () => {
    try {
      const newCourse = {
        title: 'New Course',
        description: 'Course description...',
        youtubeUrl: 'https://www.youtube.com/embed/VIDEO_ID',
        thumbnail: '', // Optional custom thumbnail
        duration: '8 weeks',
        level: 'Intermediate',
        published: false
      };
      const docRef = await addDoc(collection(db, 'courses'), newCourse);
      setCourses([...courses, { id: docRef.id, ...newCourse }]);
      setMessage({ text: 'Course added!', type: 'success' });
    } catch (error) {
      console.error('Error adding course:', error);
      setMessage({ text: 'Error adding course', type: 'error' });
    }
  };

  // Update course
  const updateCourse = async (courseId, updatedData) => {
    try {
      await updateDoc(doc(db, 'courses', courseId), updatedData);
      setCourses(courses.map(course => course.id === courseId ? { ...course, ...updatedData } : course));
      setMessage({ text: 'Course updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error updating course:', error);
      setMessage({ text: 'Error updating course', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Delete course
  const deleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      setCourses(courses.filter(course => course.id !== courseId));
      setMessage({ text: 'Course deleted successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error deleting course:', error);
      setMessage({ text: 'Error deleting course', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Don't show anything if not admin
  if (!isAdmin && currentUser !== null) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#666', marginBottom: '1rem' }}>Loading Dashboard...</div>
          <div style={{ fontSize: '0.9rem', color: '#999' }}>Fetching data from Firestore</div>
          {currentUser && (
            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
              Logged in as: {currentUser.email}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{mobileStyles}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingTop: '72px' }}>
        {/* Header */}
        <div className="admin-header" style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '0.1rem 0' }}>
          <div className="admin-header-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <h1 style={{ fontSize: '5rem', fontWeight: 800, marginBottom: '0.1rem',color: 'white' }}>Admin Dashboard</h1>
          </div>
        </div>

      {/* Message Banner */}
      {message.text && (
        <div style={{
          backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '1rem 2rem',
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      <div className="admin-content-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Tabs */}
        <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e5e5' }}>
          <button
            className="admin-tab"
            onClick={() => setActiveTab('home')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'home' ? '3px solid #1a1a1a' : 'none',
              fontWeight: activeTab === 'home' ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiFileText /> <span>Home Content</span>
          </button>
          <button
            className="admin-tab"
            onClick={() => setActiveTab('blogs')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'blogs' ? '3px solid #1a1a1a' : 'none',
              fontWeight: activeTab === 'blogs' ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiBookOpen /> <span>Blogs</span>
          </button>
          <button
            className="admin-tab"
            onClick={() => setActiveTab('courses')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'courses' ? '3px solid #1a1a1a' : 'none',
              fontWeight: activeTab === 'courses' ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiYoutube /> <span>Courses</span>
          </button>
          
          <button
            className="admin-tab"
            onClick={() => setActiveTab('research')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'research' ? '3px solid #1a1a1a' : 'none',
              fontWeight: activeTab === 'research' ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiFileText /> <span>Research</span>
          </button>

          <button
            className="admin-tab"
            onClick={() => setActiveTab('consulting')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'consulting' ? '3px solid #1a1a1a' : 'none',
              fontWeight: activeTab === 'consulting' ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiBriefcase /> <span>Consulting</span>
          </button>

          <button
            className="admin-tab"
            onClick={() => setActiveTab('opinions')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'opinions' ? '3px solid #1a1a1a' : 'none',
              fontWeight: activeTab === 'opinions' ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiEdit /> <span>Opinions</span>
          </button>

          <button
            className="admin-tab"
            onClick={() => setActiveTab('newsletter')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'newsletter' ? '3px solid #1a1a1a' : 'none',
              fontWeight: activeTab === 'newsletter' ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiMail /> <span>Newsletter</span>
          </button>
          <button
            className="admin-tab"
            onClick={() => setActiveTab('comments')}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'comments' ? '3px solid #1a1a1a' : 'none',
              fontWeight: activeTab === 'comments' ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiInbox /> <span>Comments</span>
          </button>
        </div>

        {/* Home Content Tab */}
        {activeTab === 'home' && (
          <div className="admin-card admin-content-section" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Edit Home Page Content</h2>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Hero Section */}
              <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Hero Section</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Greeting</label>
                    <input
                      type="text"
                      value={homeContent.hero_greeting || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, hero_greeting: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
                    <input
                      type="text"
                      value={homeContent.hero_name || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, hero_name: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Subtitle</label>
                    <input
                      type="text"
                      value={homeContent.hero_subtitle || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, hero_subtitle: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                    <textarea
                      value={homeContent.hero_description || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, hero_description: e.target.value })}
                      rows={4}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                      <FiImage style={{ display: 'inline', marginRight: '0.5rem' }} />
                      Hero Image
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <label
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: homeImageUploading.hero_image ? '#9ca3af' : '#1a1a1a',
                          color: 'white',
                          borderRadius: '4px',
                          cursor: homeImageUploading.hero_image ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <FiUpload />
                        {homeImageUploading.hero_image ? 'Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files[0] && handleHomeImageUpload(e.target.files[0], 'hero_image')}
                          disabled={homeImageUploading.hero_image}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {homeImageProgress.hero_image && (
                        <span style={{ 
                          padding: '0.5rem', 
                          color: homeImageProgress.hero_image.includes('failed') ? '#ef4444' : '#10b981',
                          fontSize: '0.9rem'
                        }}>
                          {homeImageProgress.hero_image}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={homeContent.hero_image || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, hero_image: e.target.value })}
                      placeholder="Or paste image URL"
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    {homeContent.hero_image && (
                      <img 
                        src={homeContent.hero_image} 
                        alt="Hero preview" 
                        style={{ marginTop: '0.5rem', maxWidth: '200px', height: 'auto', borderRadius: '4px' }}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Blog Images Section */}
              <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Blog Section (Static Fallback)</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Section Heading</label>
                    <input
                      type="text"
                      value={homeContent.blog_heading || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, blog_heading: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  {[1, 2, 3].map(num => (
                    <div key={num} style={{ display: 'grid', gap: '0.5rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                      <h4 style={{ fontWeight: 600 }}>Blog {num}</h4>
                      <input
                        type="text"
                        placeholder="Title"
                        value={homeContent[`blog${num}_title`] || ''}
                        onChange={(e) => setHomeContent({ ...homeContent, [`blog${num}_title`]: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <input
                        type="text"
                        placeholder="Excerpt"
                        value={homeContent[`blog${num}_excerpt`] || ''}
                        onChange={(e) => setHomeContent({ ...homeContent, [`blog${num}_excerpt`]: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <label
                            style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: homeImageUploading[`blog${num}_image`] ? '#9ca3af' : '#1a1a1a',
                              color: 'white',
                              borderRadius: '4px',
                              cursor: homeImageUploading[`blog${num}_image`] ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.875rem'
                            }}
                          >
                            <FiUpload size={14} />
                            {homeImageUploading[`blog${num}_image`] ? 'Uploading...' : 'Upload'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files[0] && handleHomeImageUpload(e.target.files[0], `blog${num}_image`)}
                              disabled={homeImageUploading[`blog${num}_image`]}
                              style={{ display: 'none' }}
                            />
                          </label>
                          {homeImageProgress[`blog${num}_image`] && (
                            <span style={{ 
                              color: homeImageProgress[`blog${num}_image`].includes('failed') ? '#ef4444' : '#10b981',
                              fontSize: '0.8rem'
                            }}>
                              {homeImageProgress[`blog${num}_image`]}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Or paste image URL"
                          value={homeContent[`blog${num}_image`] || ''}
                          onChange={(e) => setHomeContent({ ...homeContent, [`blog${num}_image`]: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                      {homeContent[`blog${num}_image`] && (
                        <img 
                          src={homeContent[`blog${num}_image`]} 
                          alt={`Blog ${num} preview`}
                          style={{ marginTop: '0.5rem', maxWidth: '150px', height: 'auto', borderRadius: '4px' }}
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses Section (Static Fallback) */}
              <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Courses Section (Static Fallback)</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Section Heading</label>
                    <input
                      type="text"
                      value={homeContent.courses_heading || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, courses_heading: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  {[1, 2].map(num => (
                    <div key={num} style={{ display: 'grid', gap: '0.5rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                      <h4 style={{ fontWeight: 600 }}>Course {num}</h4>
                      <input
                        type="text"
                        placeholder="Title"
                        value={homeContent[`course${num}_title`] || ''}
                        onChange={(e) => setHomeContent({ ...homeContent, [`course${num}_title`]: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <textarea
                        placeholder="Description"
                        value={homeContent[`course${num}_description`] || ''}
                        onChange={(e) => setHomeContent({ ...homeContent, [`course${num}_description`]: e.target.value })}
                        rows={2}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <input
                        type="text"
                        placeholder="YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
                        value={homeContent[`course${num}_youtube`] || ''}
                        onChange={(e) => setHomeContent({ ...homeContent, [`course${num}_youtube`]: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      {homeContent[`course${num}_youtube`] && (
                        <div style={{ marginTop: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                              src={homeContent[`course${num}_youtube`].includes('embed') 
                                ? homeContent[`course${num}_youtube`] 
                                : `https://www.youtube.com/embed/${extractVideoId(homeContent[`course${num}_youtube`])}`
                              }
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Books Section */}
              <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Books Section</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Section Heading</label>
                    <input
                      type="text"
                      value={homeContent.books_heading || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, books_heading: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  {[1, 2, 3].map(num => (
                    <div key={num} style={{ display: 'grid', gap: '0.75rem', padding: '1.25rem', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', margin: 0 }}>📚 Book {num}</h4>

                      {/* Title */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</label>
                        <input
                          type="text"
                          placeholder="e.g. The Art of Leadership"
                          value={homeContent[`book${num}_title`] || ''}
                          onChange={(e) => setHomeContent({ ...homeContent, [`book${num}_title`]: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                        <textarea
                          placeholder="Short description of the book..."
                          value={homeContent[`book${num}_description`] || ''}
                          onChange={(e) => setHomeContent({ ...homeContent, [`book${num}_description`]: e.target.value })}
                          rows={3}
                          style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                      </div>

                      {/* Amazon Link */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          🛒 Amazon Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://www.amazon.in/dp/XXXXXXXXXX"
                          value={homeContent[`book${num}_link`] || ''}
                          onChange={(e) => setHomeContent({ ...homeContent, [`book${num}_link`]: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                        />
                        {homeContent[`book${num}_link`] && (
                          <a
                            href={homeContent[`book${num}_link`]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem', fontSize: '0.78rem', color: '#1a1a1a', textDecoration: 'underline' }}
                          >
                            <FiExternalLink size={12} /> Open link
                          </a>
                        )}
                      </div>

                      {/* Book Cover Image Upload */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          🖼️ Book Cover Image
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                          <label
                            style={{
                              padding: '0.45rem 1rem',
                              backgroundColor: homeImageUploading[`book${num}_image`] ? '#9ca3af' : '#1a1a1a',
                              color: 'white',
                              borderRadius: '6px',
                              cursor: homeImageUploading[`book${num}_image`] ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              flexShrink: 0
                            }}
                          >
                            <FiUpload size={13} />
                            {homeImageUploading[`book${num}_image`] ? 'Uploading...' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files[0] && handleHomeImageUpload(e.target.files[0], `book${num}_image`)}
                              disabled={homeImageUploading[`book${num}_image`]}
                              style={{ display: 'none' }}
                            />
                          </label>
                          {homeImageProgress[`book${num}_image`] && (
                            <span style={{
                              color: homeImageProgress[`book${num}_image`].includes('failed') ? '#ef4444' : '#10b981',
                              fontSize: '0.82rem',
                              fontWeight: 500
                            }}>
                              {homeImageProgress[`book${num}_image`].includes('failed') ? '✗' : '✓'} {homeImageProgress[`book${num}_image`]}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Or paste image URL directly"
                          value={homeContent[`book${num}_image`] || ''}
                          onChange={(e) => setHomeContent({ ...homeContent, [`book${num}_image`]: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                        />
                        {homeContent[`book${num}_image`] && (
                          <img
                            src={homeContent[`book${num}_image`]}
                            alt={`Book ${num} cover preview`}
                            style={{ marginTop: '0.6rem', width: '90px', height: '120px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e5e5', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact/Map Section */}
              <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Contact Section</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Contact Map/Image URL</label>
                    <input
                      type="text"
                      value={homeContent.contact_map_image || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, contact_map_image: e.target.value })}
                      placeholder="https://example.com/map-image.jpg"
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    {homeContent.contact_map_image && (
                      <img 
                        src={homeContent.contact_map_image} 
                        alt="Contact map preview"
                        style={{ marginTop: '0.5rem', maxWidth: '200px', height: 'auto', borderRadius: '4px' }}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Newsletter Section */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Newsletter Section</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Heading</label>
                    <input
                      type="text"
                      value={homeContent.newsletter_heading || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, newsletter_heading: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                    <textarea
                      value={homeContent.newsletter_description || ''}
                      onChange={(e) => setHomeContent({ ...homeContent, newsletter_description: e.target.value })}
                      rows={3}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={saveHomeContent}
              disabled={saving}
              style={{
                marginTop: '2rem',
                padding: '0.75rem 2rem',
                backgroundColor: '#1a1a1a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="admin-card admin-content-section" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div className="admin-button-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Manage Blogs</h2>
              <button
                onClick={addBlog}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FiPlus /> Add Blog
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {blogs.map(blog => (
                <BlogEditor
                  key={blog.id}
                  blog={blog}
                  onUpdate={(data) => updateBlog(blog.id, data)}
                  onDelete={() => deleteBlog(blog.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="admin-card admin-content-section" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div className="admin-button-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Manage Courses</h2>
              <button
                onClick={addCourse}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FiPlus /> Add Course
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {courses.map(course => (
                <CourseEditor
                  key={course.id}
                  course={course}
                  onUpdate={(data) => updateCourse(course.id, data)}
                  onDelete={() => deleteCourse(course.id)}
                />
              ))}
            </div>
          </div>
        )}





        {/* Research Tab */}
        {activeTab === 'research' && (
          <div className="admin-card admin-content-section">
             <ResearchEditor />
          </div>
        )}

        {/* Consulting Tab */}
        {activeTab === 'consulting' && (
          <div className="admin-card admin-content-section">
             <ConsultingEditor />
          </div>
        )}

        {/* Opinions Tab */}
        {activeTab === 'opinions' && (
          <div className="admin-card admin-content-section">
             <OpinionsEditor />
          </div>
        )}
        
        {/* ═══════════════════════════════════════════════════════
            NEWSLETTER TAB
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'newsletter' && (
          <div className="admin-card admin-content-section" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Subject *</label>
                  <input
                    type="text"
                    value={newsletterSubject}
                    onChange={(e) => { setNewsletterSubject(e.target.value); setNewsletterSent(false); }}
                    placeholder="e.g. New research on leadership mindfulness..."
                    style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Message Body *</label>
                  <p style={{ margin: '0 0 0.5rem', color: '#888', fontSize: '0.8rem' }}>HTML is supported. Use &lt;p&gt;, &lt;b&gt;, &lt;a href="..."&gt; etc.</p>
                  <textarea
                    value={newsletterBody}
                    onChange={(e) => { setNewsletterBody(e.target.value); setNewsletterSent(false); }}
                    placeholder={`<p>Dear Subscriber,</p>\n<p>I'm excited to share...</p>\n<p>Best regards,<br/>Prof. Bodhibrata Nag</p>`}
                    rows={12}
                    style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #ddd', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Preview */}
                {newsletterBody && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#666' }}>Preview</label>
                    <div
                      style={{ border: '1.5px solid #e5e5e5', borderRadius: '6px', padding: '1.5rem', background: '#fafafa', maxHeight: 280, overflowY: 'auto' }}
                      dangerouslySetInnerHTML={{ __html: newsletterBody }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={async () => {
                      if (!newsletterSubject.trim() || !newsletterBody.trim()) {
                        alert('Please fill in both Subject and Message Body.');
                        return;
                      }
                      if (!window.confirm(`Send this email to ALL active subscribers?`)) return;
                      setNewsletterSending(true);
                      setNewsletterSent(false);
                      try {
                        // Fetch active subscribers
                        const subSnap = await getDocs(
                          query(collection(db, 'newsletter_subscribers'), where('status', '==', 'active'))
                        );
                        const emails = subSnap.docs.map(d => d.data().email).filter(Boolean);

                        if (!emails.length) {
                          alert('No active subscribers found.');
                          setNewsletterSending(false);
                          return;
                        }

                        // Send emails via backend
                        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                        const sendRes = await fetch(`${apiBase}/newsletter/send`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            subject: newsletterSubject.trim(),
                            body: newsletterBody.trim(),
                            subscribers: emails
                          })
                        });
                        const sendData = await sendRes.json();
                        if (!sendRes.ok) throw new Error(sendData.error || 'Send failed');

                        // Log campaign to Firestore
                        await addDoc(collection(db, 'newsletter_campaigns'), {
                          subject: newsletterSubject.trim(),
                          body: newsletterBody.trim(),
                          status: 'sent',
                          sentCount: sendData.sent,
                          failedCount: sendData.failed || 0,
                          createdAt: new Date()
                        });
                        setNewsletterResult({ sent: sendData.sent, failed: sendData.failed || 0 });
                        setNewsletterSent(true);
                        setNewsletterSubject('');
                        setNewsletterBody('');
                        // Refresh campaigns list
                        const snap = await getDocs(collection(db, 'newsletter_campaigns'));
                        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                        setCampaigns(list);
                      } catch (err) {
                        alert('Failed to send: ' + err.message);
                      } finally {
                        setNewsletterSending(false);
                      }
                    }}
                    disabled={newsletterSending}
                    style={{ padding: '0.75rem 2rem', background: newsletterSending ? '#888' : '#1a1a1a', color: 'white', border: 'none', borderRadius: '6px', cursor: newsletterSending ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <FiSend /> {newsletterSending ? 'Sending...' : 'Send to All Subscribers'}
                  </button>
                  <span style={{ color: '#888', fontSize: '0.85rem' }}>Sends via Gmail through the backend server to all <strong>{subscribers.filter(s => s.status !== 'unsubscribed').length}</strong> active subscriber(s).</span>
                </div>
              </div>

            {/* Past Campaigns */}
            <div className="admin-card" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, background: '#333333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><FiInbox /></div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Past Campaigns</h3>
                </div>
                <button
                  onClick={async () => {
                    const snap = await getDocs(collection(db, 'newsletter_campaigns'));
                    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                    list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                    setCampaigns(list);
                  }}
                  style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <FiRefreshCw /> Refresh
                </button>
              </div>
              {campaigns.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', padding: '2rem 0' }}>No campaigns yet. Click Refresh to load.</p>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {campaigns.map(c => (
                    <div key={c.id} style={{ padding: '1rem', border: '1px solid #e5e5e5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{c.subject}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
                          {c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000).toLocaleString('en-IN') : 'Unknown date'}
                        </p>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, background: c.status === 'sent' ? '#d1fae5' : '#fef3c7', color: c.status === 'sent' ? '#065f46' : '#92400e' }}>
                        {c.status === 'sent' ? '✅ Sent' : c.status === 'send' ? '⏳ Queued' : c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subscriber List */}
            <div className="admin-card" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, background: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><FiUsers /></div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Subscribers</h3>
                    {subscribers.length > 0 && <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{subscribers.filter(s => s.status === 'active').length} active · {subscribers.length} total</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={loadSubscribers}
                    style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                  >
                    <FiRefreshCw /> {subscribersLoading ? 'Loading...' : 'Refresh'}
                  </button>
                  {subscribers.length > 0 && (
                    <button
                      onClick={exportSubscribersCSV}
                      style={{ padding: '0.5rem 1rem', border: '1px solid #10b981', borderRadius: '6px', cursor: 'pointer', background: '#f0fdf4', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      <FiDownload /> Export CSV
                    </button>
                  )}
                </div>
              </div>

              {subscribers.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', padding: '2rem 0' }}>Click "Load Subscribers" to view the list.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e5e5', textAlign: 'left' }}>
                        <th style={{ padding: '0.6rem 1rem', fontWeight: 600 }}>#</th>
                        <th style={{ padding: '0.6rem 1rem', fontWeight: 600 }}>Email</th>
                        <th style={{ padding: '0.6rem 1rem', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.6rem 1rem', fontWeight: 600 }}>Subscribed On</th>
                        <th style={{ padding: '0.6rem 1rem', fontWeight: 600 }}>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((s, i) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fafafa' : 'white' }}>
                          <td style={{ padding: '0.6rem 1rem', color: '#888' }}>{i + 1}</td>
                          <td style={{ padding: '0.6rem 1rem', fontWeight: 500 }}>{s.email}</td>
                          <td style={{ padding: '0.6rem 1rem' }}>
                            <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, background: s.status === 'active' ? '#d1fae5' : '#fef3c7', color: s.status === 'active' ? '#065f46' : '#92400e' }}>
                              {s.status || 'active'}
                            </span>
                          </td>
                          <td style={{ padding: '0.6rem 1rem', color: '#666' }}>
                            {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                          <td style={{ padding: '0.6rem 1rem', color: '#888', fontSize: '0.85rem' }}>{s.source || 'website'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            COMMENTS TAB
        ════════════════════════════════════════════════════════ */}
        {activeTab === 'comments' && (
          <div className="admin-card admin-content-section" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Blog Comments</h2>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '4px 0 0' }}>Approve or delete reader comments</p>
              </div>
              <button
                onClick={fetchBlogComments}
                disabled={commentsLoading}
                style={{ padding: '0.6rem 1.2rem', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <FiRefreshCw size={13} /> {commentsLoading ? 'Loading…' : 'Refresh'}
              </button>
            </div>

            {commentsLoading ? (
              <p style={{ color: '#9ca3af', padding: '2rem 0', textAlign: 'center' }}>Loading comments…</p>
            ) : blogComments.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', background: '#f9fafb', borderRadius: '8px' }}>
                <FiInbox size={32} style={{ color: '#d1d5db', marginBottom: 12 }} />
                <p style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif', margin: 0 }}>No comments yet. Click Refresh to load.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Pending first */}
                {[false, true].map(isApproved => {
                  const group = blogComments.filter(c => !!c.approved === isApproved);
                  if (group.length === 0) return null;
                  return (
                    <div key={String(isApproved)}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: isApproved ? '#065f46' : '#92400e', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isApproved ? '✅ Approved' : '⏳ Pending Moderation'} ({group.length})
                      </h3>
                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {group.map(c => (
                          <div key={c.id} style={{ border: `1px solid ${isApproved ? '#d1fae5' : '#fde68a'}`, borderRadius: '8px', padding: '1rem 1.25rem', background: isApproved ? '#f0fdf4' : '#fffbeb', display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 200 }}>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 6 }}>
                                <strong style={{ fontSize: '0.9rem' }}>{c.name}</strong>
                                {c.email && <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>&lt;{c.email}&gt;</span>}
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>on <em>{c.blogSlug || c.blogId}</em></span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', lineHeight: 1.6 }}>{c.comment}</p>
                              <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>
                                {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString('en-IN') : 'Unknown date'}
                              </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                              {!c.approved && (
                                <button onClick={() => approveComment(c.id)} style={{ padding: '6px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                  Approve
                                </button>
                              )}
                              <button onClick={() => deleteComment(c.id)} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                <FiTrash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
      </div>
    </>
  );
}

// Blog Editor Component
function BlogEditor({ blog, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState(blog);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // Sync local state with prop changes
  useEffect(() => {
    setEditedBlog(blog);
  }, [blog]);

  const handleSave = () => {
    onUpdate(editedBlog);
    setEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress('Uploading image...');
      
      const imageUrl = await uploadToCloudinary(file, 'blogs');
      
      setEditedBlog({ ...editedBlog, imageUrl: imageUrl });
      setUploadProgress('Image uploaded successfully! ✓');
      
      setTimeout(() => setUploadProgress(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress('Upload failed: ' + error.message);
      setTimeout(() => setUploadProgress(''), 5000);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-card" style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1.5rem' }}>
      {editing ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <input
            type="text"
            value={editedBlog.title}
            onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
            style={{ fontSize: '1.2rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Blog Title"
          />
          <textarea
            value={editedBlog.excerpt}
            onChange={(e) => setEditedBlog({ ...editedBlog, excerpt: e.target.value })}
            rows={2}
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Excerpt"
          />
          <textarea
            value={editedBlog.content}
            onChange={(e) => setEditedBlog({ ...editedBlog, content: e.target.value })}
            rows={6}
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Full Content"
          />
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              <FiImage style={{ display: 'inline', marginRight: '0.5rem' }} />
              Blog Image
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <label
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: uploading ? '#9ca3af' : '#1a1a1a',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FiUpload />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>
              {uploadProgress && (
                <span style={{ 
                  padding: '0.5rem', 
                  color: uploadProgress.includes('failed') ? '#ef4444' : '#10b981',
                  fontSize: '0.9rem'
                }}>
                  {uploadProgress}
                </span>
              )}
            </div>
            <input
              type="text"
              value={editedBlog.imageUrl || ''}
              onChange={(e) => setEditedBlog({ ...editedBlog, imageUrl: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.5rem' }}
              placeholder="Or paste image URL"
            />
            {editedBlog.imageUrl && (
              <div style={{ marginTop: '1rem' }}>
                <img 
                  src={editedBlog.imageUrl} 
                  alt="Blog preview"
                  style={{ maxWidth: '300px', height: 'auto', borderRadius: '8px', border: '2px solid #e5e5e5' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
                <button
                  onClick={() => setEditedBlog({ ...editedBlog, imageUrl: '' })}
                  style={{ 
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'block'
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={editedBlog.published}
                onChange={(e) => setEditedBlog({ ...editedBlog, published: e.target.checked })}
              />
              Published
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px' }}>
              <input
                type="checkbox"
                checked={!!editedBlog.showOnHome}
                onChange={(e) => setEditedBlog({ ...editedBlog, showOnHome: e.target.checked })}
                style={{ accentColor: '#1a1a1a' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>Show on Home</span>
            </label>
          </div>
          <div className="admin-editor-actions" style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleSave}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FiSave /> Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FiX /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-form-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{blog.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{blog.excerpt}</p>
              <span style={{ 
                display: 'inline-block', 
                marginTop: '0.5rem', 
                padding: '0.25rem 0.75rem', 
                backgroundColor: blog.published ? '#10b981' : '#6b7280',
                color: 'white',
                borderRadius: '999px',
                fontSize: '0.75rem'
              }}>                {blog.published ? 'Published' : 'Draft'}
              </span>
              {blog.showOnHome && (
                <span style={{ display: 'inline-block', marginTop: '0.5rem', marginLeft: '0.5rem', padding: '0.25rem 0.75rem', backgroundColor: '#1a1a1a', color: 'white', borderRadius: '999px', fontSize: '0.75rem' }}>
                  🏠 Home
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setEditing(true)}
                style={{ padding: '0.5rem', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                <FiEdit />
              </button>
              <button
                onClick={onDelete}
                style={{ padding: '0.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Course Editor Component
function CourseEditor({ course, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState(course);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // Sync local state with prop changes
  useEffect(() => {
    setEditedCourse(course);
  }, [course]);

  const handleSave = () => {
    onUpdate(editedCourse);
    setEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress('Uploading image...');
      
      const imageUrl = await uploadToCloudinary(file, 'courses');
      
      setEditedCourse({ ...editedCourse, thumbnail: imageUrl });
      setUploadProgress('Image uploaded successfully! ✓');
      
      setTimeout(() => setUploadProgress(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress('Upload failed: ' + error.message);
      setTimeout(() => setUploadProgress(''), 5000);
    } finally {
      setUploading(false);
    }
  };

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div className="admin-card" style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1.5rem' }}>
      {editing ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <input
            type="text"
            value={editedCourse.title}
            onChange={(e) => setEditedCourse({ ...editedCourse, title: e.target.value })}
            style={{ fontSize: '1.2rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Course Title"
          />
          <textarea
            value={editedCourse.description}
            onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
            rows={3}
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Course Description"
          />
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              YouTube URL (full URL or embed URL)
            </label>
            <input
              type="text"
              value={editedCourse.youtubeUrl}
              onChange={(e) => setEditedCourse({ ...editedCourse, youtubeUrl: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://www.youtube.com/embed/VIDEO_ID"
            />
          </div>
          
          {/* Image Upload Field */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              <FiImage style={{ display: 'inline', marginRight: '0.5rem' }} />
              Course Thumbnail Image (Optional)
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <label
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: uploading ? '#9ca3af' : '#1a1a1a',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FiUpload />
                {uploading ? 'Uploading...' : 'Choose Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>
              {uploadProgress && (
                <span style={{ 
                  padding: '0.5rem', 
                  color: uploadProgress.includes('failed') ? '#ef4444' : '#10b981',
                  fontSize: '0.9rem'
                }}>
                  {uploadProgress}
                </span>
              )}
            </div>
            {editedCourse.thumbnail && (
              <div style={{ marginTop: '1rem' }}>
                <img
                  src={editedCourse.thumbnail}
                  alt="Course thumbnail preview"
                  style={{ 
                    maxWidth: '300px', 
                    maxHeight: '200px', 
                    borderRadius: '8px',
                    border: '2px solid #e5e5e5',
                    objectFit: 'cover'
                  }}
                />
                <button
                  onClick={() => setEditedCourse({ ...editedCourse, thumbnail: '' })}
                  style={{ 
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Recommended: 1280x720px, max 5MB. If not provided, YouTube thumbnail will be used.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              type="text"
              value={editedCourse.duration}
              onChange={(e) => setEditedCourse({ ...editedCourse, duration: e.target.value })}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Duration (e.g., 8 weeks)"
            />
            <input
              type="text"
              value={editedCourse.level}
              onChange={(e) => setEditedCourse({ ...editedCourse, level: e.target.value })}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Level (e.g., Intermediate)"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={editedCourse.published}
                onChange={(e) => setEditedCourse({ ...editedCourse, published: e.target.checked })}
              />
              Published
            </label>
          </div>
          <div className="admin-editor-actions" style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleSave}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FiSave /> Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FiX /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-form-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{course.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{course.description}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
                <span>Duration: {course.duration}</span>
                <span>Level: {course.level}</span>
              </div>
              <span style={{ 
                display: 'inline-block', 
                marginTop: '0.5rem', 
                padding: '0.25rem 0.75rem', 
                backgroundColor: course.published ? '#10b981' : '#6b7280',
                color: 'white',
                borderRadius: '999px',
                fontSize: '0.75rem'
              }}>                {course.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setEditing(true)}
                style={{ padding: '0.5rem', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                <FiEdit />
              </button>
              <button
                onClick={onDelete}
                style={{ padding: '0.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
          {course.youtubeUrl && (
            <div style={{ marginTop: '1rem' }}>
              <iframe
                width="100%"
                height="200"
                src={course.youtubeUrl.includes('embed') ? course.youtubeUrl : `https://www.youtube.com/embed/${extractVideoId(course.youtubeUrl)}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: '8px' }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}



