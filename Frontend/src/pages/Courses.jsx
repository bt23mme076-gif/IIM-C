import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiYoutube, FiBook, FiUsers, FiTrendingUp, FiBarChart2, FiFileText, FiExternalLink, FiPlay, FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { useFirestoreDoc } from '../hooks/useFirestoreDoc';
import EditableText from '../components/EditableText';
import { useAuth } from '../context/useAuth';
import { collection, addDoc, updateDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Courses() {
  const { isAdmin } = useAuth() || {};
  const { data: pageData } = useFirestoreDoc('content', 'courses', {
    page_heading: 'Courses',
    page_subtitle: 'Welcome to my learning hub for students, researchers, and practitioners. Explore courses on life skills, leadership, and research methods.',
    mgmt_heading: 'Management Courses',
    featured_heading: 'Featured Courses',
    featured_subtitle: 'Comprehensive online courses combining science, practice, and ancient wisdom',
    happiness_title: 'HAPPINESS: Science, Practice and Ancient Indian Wisdom',
    happiness_desc: 'Explore how to become a happy being—successful and at peace. This unique course combines evidence from science, practical well-being techniques, and lessons from Indian wisdom storehouses: the Upanishads, the Gita, and the Yoga Sutras.',
    happiness_b1: 'Evidence from science',
    happiness_b2: 'Simple well-being techniques',
    happiness_b3: 'Ancient Indian wisdom',
    leadership_title: 'Leadership Skills',
    leadership_desc: 'A beginner course for professionals from diverse backgrounds. Strengthen your capacity to lead across boundaries, with or without authority, and manage the inevitable stresses and challenges of leading a team. Drawing from business, philosophy, sports, and psychology.',
    leadership_b1: 'Lead across boundaries',
    leadership_b2: 'Lead with or without authority',
    leadership_b3: 'Manage leadership stresses',
    research_heading: 'Research Methods',
    research_subtitle: 'Comprehensive lecture series on advanced research methodologies for scholars and practitioners',
    multilevel_title: 'Multilevel Modeling',
    multilevel_desc: 'Multilevel models (also known as hierarchical linear models, linear mixed-effect model, mixed models, nested data models, or random-effects models) are statistical models of parameters that vary at more than one level. These models are particularly appropriate for research designs where data for participants are organized at more than one level (e.g., employees nested under team leaders).',
    sem_title: 'Covariance-Based SEM',
    sem_desc: 'Structural Equation Modeling (SEM) is a statistical methodology widely used in social sciences research. SEM allows researchers to test complex models with multiple pathways, model latent variables with multiple indicators, investigate mediation and moderation systematically, and adjust for measurement error in predictor variables. This series provides a general introduction to CB-SEM using AMOS software.',
    psychometrics_title: 'Psychometrics',
    psychometrics_desc: 'Introduction to central concepts of measurement covering test construction, item analysis, reliability, validity, and measurement error. Includes hands-on sessions with SPSS and AMOS.',
    conditional_title: 'Conditional Process Analysis',
    conditional_desc: 'A comprehensive three-video series explaining mediation, moderation, and conditional process analysis with practical dataset examples.',
    manuscript_title: 'Manuscript Writing & Publishing',
    manuscript_desc: 'A 16-session series covering elements of manuscript writing and strategies for high-quality academic publishing. Includes instruction files and supplementary readings.',
    cta_heading: 'Ready to Start Learning?',
    cta_subtitle: 'Explore our courses and begin your journey toward personal and professional excellence.',
  });
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [homeOverrides, setHomeOverrides] = useState({});

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const viewportOptions = {
    once: true,
    margin: "0px 0px -50px 0px",
    amount: 0.1
  };

  // Fetch published courses from Firestore
  // Note: Admins might want to see all, but for consistency we fetch published ones.
  // To fetch all for admin, you could conditionally build the query array.
  const { data: courses, loading: coursesLoading } = useFirestoreCollection('courses', [
    where('published', '==', true)
  ], true);

  // Helper function to extract YouTube video ID from various URL formats
  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Admin functions for managing dynamic courses
  const addCourse = async (newCourse) => {
    try {
      await addDoc(collection(db, 'courses'), {
        ...newCourse,
        published: true, // Auto-publish for simplicity, or add a toggle in the form
        createdAt: new Date()
      });
      setShowAddCourse(false);
      alert('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    }
  };

  const updateCourse = async (updatedCourse) => {
    try {
      const { id, ...updateData } = updatedCourse;
      await updateDoc(doc(db, 'courses', id), updateData);
      setEditingCourse(null);
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  const deleteCourse = async (courseId) => {
    if (!confirm('Delete this course?')) return;
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const toggleShowOnHome = async (course) => {
    const newVal = !(homeOverrides[course.id] ?? course.showOnHome);
    setHomeOverrides(prev => ({ ...prev, [course.id]: newVal }));
    try {
      await updateDoc(doc(db, 'courses', course.id), { showOnHome: newVal });
    } catch (error) {
      setHomeOverrides(prev => ({ ...prev, [course.id]: !newVal }));
      alert('Failed to update');
    }
  };

  // Shared Course card mimicking the Research.jsx card styling
  const CourseCard = ({ icon: Icon, title, description, link, linkText = "Access Course", badge, borderColor = "border-[#1E2A38]", children }) => (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={fadeInUp}
      className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 ${borderColor} relative group`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl ${borderColor === 'border-[#B9975B]' ? 'bg-[#F7F4EE]' : 'bg-[#eef1f5]'}`}>
          <Icon className={`w-6 h-6 ${borderColor === 'border-[#B9975B]' ? 'text-[#B9975B]' : 'text-[#1E2A38]'}`} />
        </div>
        <div className="flex-1">
          {badge && (
            <span className="inline-block px-3 py-1 bg-gray-100 text-xs font-['Inter'] font-semibold text-[#1E2A38] rounded-full mb-2">
              {badge}
            </span>
          )}
          <div className="text-2xl font-['Playfair_Display'] font-bold text-[#1E2A38] mb-2">
            {title}
          </div>
        </div>
      </div>
      <div className="text-gray-700 font-['Inter'] leading-relaxed mb-6">
        {description}
      </div>
      {children}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-6 py-3 text-white font-['Inter'] font-semibold rounded-lg transition-all shadow-md hover:shadow-lg group ${borderColor === 'border-[#B9975B]' ? 'bg-[#B9975B] hover:bg-[#1E2A38]' : 'bg-[#1E2A38] hover:bg-[#2d3f54]'}`}
        >
          {linkText}
          <FiExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      )}
    </motion.div>
  );

  const ResearchLecture = ({ title, description, driveLink }) => (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={fadeInUp}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#B9975B]"
    >
      <div className="text-xl font-['Playfair_Display'] font-bold text-[#1E2A38] mb-3">
        {title}
      </div>
      <div className="font-['Inter'] text-gray-600 mb-4">
        {description}
      </div>
      {driveLink && (
        <a
          href={driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#B9975B] hover:text-[#1E2A38] font-['Inter'] text-sm inline-flex items-center gap-1 font-semibold"
        >
          <FiExternalLink size={14} /> Download Materials
        </a>
      )}
    </motion.div>
  );

  // Static list of courses taught at IIM Calcutta
  const iimCourses = [
    'Operations Research Modeling',
    'Quality Management & Six Sigma',
    'Project Management',
    'Operations Management',
    'Supply Chain Management',
    'Sustainable Supply Chain Analytics',
    'Lean Management',
    'Management of Technology',
    'Advanced Graph Theory',
    'Simulation',
    'Business Applications of Game Theory',
    'Business Risk Management',
    'Public Systems Management',
    'Entrepreneurship for NGOs',
    'Managerial Problem Solving',
    'Business Mathematics',
    'Data Communication and networking',
    'Database Management Systems',
    'Visual Basic & VBA Programming',
    'Contracts Management & Arbitration',
    'Transport Economics',
    'Urban Transport',
    'Transport Forecasting',
    'Logistics Management',
    'Procurement & Sourcing Management',
    'Construction Management'
  ];

  return (
    <div className="bg-[#F7F4EE] min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#1E2A38] py-20 px-4 sm:px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-xs font-['Inter'] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-4">
              Prof. Bodhibrata Nag
            </p>
            <h1 className="text-4xl sm:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
              <EditableText
                collection="content"
                docId="courses"
                field="page_heading"
                defaultValue={pageData?.page_heading || 'Courses'}
                className="text-4xl sm:text-6xl font-['Playfair_Display'] font-bold text-white"
              />
            </h1>
            <div className="w-20 h-1 bg-white rounded-full mb-6" />
            <p className="text-base sm:text-lg font-['Inter'] text-gray-300 max-w-3xl leading-relaxed">
              <EditableText
                collection="content"
                docId="courses"
                field="page_subtitle"
                defaultValue={pageData?.page_subtitle || 'Welcome to my learning hub for students, researchers, and practitioners. Explore courses on life skills, leadership, and research methods.'}
                className="text-base sm:text-lg font-['Inter'] text-gray-300"
                multiline
              />
            </p>
          </motion.div>
        </div>
      </section>

      

      {/* Courses Taught at IIM Calcutta (replaces Featured Courses) */}
      <section className="py-16 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={fadeInUp}
            className="mb-8"
          >
            <h2 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-[#1E2A38] mb-4">
              Courses Taught at IIM Calcutta
            </h2>
            <div className="w-24 h-1 bg-[#B9975B] rounded-full mb-6"></div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {iimCourses.map((title, idx) => (
              <CourseCard
                key={title}
                icon={FiBook}
                title={title}
                description={<div className="text-sm text-gray-600">Taught at IIM Calcutta</div>}
                borderColor={idx % 2 === 0 ? 'border-[#1E2A38]' : 'border-[#B9975B]'}
              />
            ))}
          </div>
        </div>
      </section>

      

      {/* Call to Action */}
      <section className="py-20 px-6 lg:px-16 bg-[#1E2A38]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={fadeInUp}
          >
            <h2 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
              <EditableText
                collection="content"
                docId="courses"
                field="cta_heading"
                defaultValue={pageData?.cta_heading || 'Ready to Start Learning?'}
                className="text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-white"
              />
            </h2>
            <p className="text-xl font-['Inter'] text-gray-300 mb-8">
              <EditableText
                collection="content"
                docId="courses"
                field="cta_subtitle"
                defaultValue={pageData?.cta_subtitle || 'Explore our courses and begin your journey toward personal and professional excellence.'}
                className="text-xl font-['Inter'] text-gray-300"
                multiline
              />
            </p>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#B9975B] hover:bg-white hover:text-[#1E2A38] text-white font-['Inter'] font-bold rounded-lg transition-all shadow-xl hover:shadow-2xl text-lg"
            >
              <FiYoutube className="w-6 h-6" />
              Subscribe to YouTube Channel
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Course Form Component for Admin
function CourseForm({ course, onSave, onCancel }) {
  const [formData, setFormData] = useState(course || {
    title: '',
    description: '',
    courseLink: '',
    youtubeUrl: '',
    thumbnail: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-2xl font-bold mb-4 text-[#1a1a1a]">
        {course ? 'Edit Course' : 'Add New Course'}
      </h3>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Course Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2A38] outline-none transition-shadow"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2A38] outline-none transition-shadow"
          rows={4}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Course Link <span className="text-gray-400 font-normal">(Coursera, website, etc.)</span></label>
        <input
          type="url"
          value={formData.courseLink}
          onChange={(e) => setFormData({ ...formData, courseLink: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] outline-none transition-shadow"
          placeholder="https://www.coursera.org/learn/..."
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">YouTube URL <span className="text-gray-400 font-normal">(for video preview)</span></label>
        <input
          type="url"
          value={formData.youtubeUrl}
          onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] outline-none transition-shadow"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Custom Thumbnail URL (optional)</label>
        <input
          type="url"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] outline-none transition-shadow"
          placeholder="Will fallback to YouTube thumbnail if empty"
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="showOnHome"
          checked={!!formData.showOnHome}
          onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
          className="w-4 h-4 accent-[#1a1a1a]"
        />
        <label htmlFor="showOnHome" className="text-sm font-semibold text-gray-700">
          Show on Home page
        </label>
      </div>
      <div className="flex gap-3 justify-end mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
        >
          <FiX className="inline mr-2" /> Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#1E2A38] hover:bg-[#2d3f54] text-white rounded-lg font-semibold transition-colors shadow-md"
        >
          <FiSave className="inline mr-2" /> Save Course
        </button>
      </div>
    </form>
  );
}
