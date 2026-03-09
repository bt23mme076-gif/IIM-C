import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { FiExternalLink, FiBookOpen, FiUsers, FiFileText, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiSearch } from 'react-icons/fi';
import { useFirestoreDoc } from '../hooks/useFirestoreDoc';
import { useAuth } from '../context/useAuth';
import EditableText from '../components/EditableText';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Research() {
  const { isAdmin } = useAuth() || {};
  const [editingPub, setEditingPub] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingCase, setEditingCase] = useState(null);
  const [showAddPub, setShowAddPub] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showAddCase, setShowAddCase] = useState(false);
  const [pubSearch, setPubSearch] = useState('');
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

  // Fetch research content from Firestore (optional - will use hardcoded data as fallback)
  const { data: researchData, loading } = useFirestoreDoc('content', 'research', {});

  // Publications will be added by admin
  const featuredPublications = [];

  // Admin functions for managing publications
  const addPublication = async (newPub) => {
    try {
      const pubWithId = { ...newPub, id: Date.now() };
      let currentPubs = researchData?.featured_publications;
      // If Firestore has no publications or an empty array, merge with hardcoded 25
      if (!currentPubs || currentPubs.length === 0) {
        currentPubs = featuredPublications;
      }
      await updateDoc(doc(db, 'content', 'research'), {
        featured_publications: [...currentPubs, pubWithId]
      });
      setShowAddPub(false);
      alert('Publication added successfully!');
    } catch (error) {
      console.error('Error adding publication:', error);
      alert('Failed to add publication');
    }
  };

  const updatePublication = async (updatedPub) => {
    try {
      const currentPubs = researchData?.featured_publications || featuredPublications;
      const updatedPubs = currentPubs.map(p => p.id === updatedPub.id ? updatedPub : p);
      await updateDoc(doc(db, 'content', 'research'), {
        featured_publications: updatedPubs
      });
      setEditingPub(null);
      alert('Publication updated successfully!');
    } catch (error) {
      console.error('Error updating publication:', error);
      alert('Failed to update publication');
    }
  };

  const deletePublication = async (pub) => {
    if (!confirm('Delete this publication?')) return;
    try {
      const currentPubs = researchData?.featured_publications || featuredPublications;
      const updatedPubs = currentPubs.filter(p => p.id !== pub.id);
      await updateDoc(doc(db, 'content', 'research'), {
        featured_publications: updatedPubs
      });
      alert('Publication deleted successfully!');
    } catch (error) {
      console.error('Error deleting publication:', error);
      alert('Failed to delete publication');
    }
  };

  const addBookChapter = async (newChapter) => {
    try {
      const chapterWithId = { ...newChapter, id: Date.now() };
      const currentChapters = researchData?.book_chapters || bookChapters;
      await updateDoc(doc(db, 'content', 'research'), {
        book_chapters: [...currentChapters, chapterWithId]
      });
      setShowAddChapter(false);
      alert('Chapter added successfully!');
    } catch (error) {
      console.error('Error adding chapter:', error);
      alert('Failed to add chapter');
    }
  };

  const deleteBookChapter = async (chapter) => {
    if (!confirm('Delete this book chapter?')) return;
    try {
      const currentChapters = researchData?.book_chapters || bookChapters;
      const updatedChapters = currentChapters.filter(c => c.id !== chapter.id);
      await updateDoc(doc(db, 'content', 'research'), {
        book_chapters: updatedChapters
      });
      alert('Chapter deleted successfully!');
    } catch (error) {
      console.error('Error deleting chapter:', error);
      alert('Failed to delete chapter');
    }
  };

  const addCase = async (newCase) => {
    try {
      const caseWithId = { ...newCase, id: Date.now() };
      const currentCases = researchData?.cases || cases;
      await updateDoc(doc(db, 'content', 'research'), {
        cases: [...currentCases, caseWithId]
      });
      setShowAddCase(false);
      alert('Case added successfully!');
    } catch (error) {
      console.error('Error adding case:', error);
      alert('Failed to add case');
    }
  };

  const deleteCase = async (caseItem) => {
    if (!confirm('Delete this case?')) return;
    try {
      const currentCases = researchData?.cases || cases;
      const updatedCases = currentCases.filter(c => c.id !== caseItem.id);
      await updateDoc(doc(db, 'content', 'research'), {
        cases: updatedCases
      });
      alert('Case deleted successfully!');
    } catch (error) {
      console.error('Error deleting case:', error);
      alert('Failed to delete case');
    }
  };

  const phdStudents = { chairperson: [], member: [] };

  const bookChapters = [];

  const specialIssues = [];

  const cases = [];

  const technicalNotes = [];

  // Use Firestore data if available, otherwise use hardcoded data
  const displayPublications = (researchData?.featured_publications && researchData.featured_publications.length > 0)
    ? researchData.featured_publications
    : featuredPublications;

  const filteredPublications = useMemo(() => {
    const q = pubSearch.trim().toLowerCase();
    if (!q) return displayPublications;
    return displayPublications.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.authors?.toLowerCase().includes(q) ||
      p.year?.toString().includes(q) ||
      p.journal?.toLowerCase().includes(q)
    );
  }, [pubSearch, displayPublications]);
  const displayBookChapters = researchData?.book_chapters || bookChapters;
  const displayCases = researchData?.cases || cases;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f0f0f0] to-[#ffffff] py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <div className="w-20 h-1 bg-[#333333] mb-8 rounded-full mx-auto"></div>
            <h1 className="text-5xl lg:text-7xl font-['Playfair_Display'] font-bold text-[#1a1a1a] mb-6">
              <EditableText
                collection="content"
                docId="research"
                field="page_heading"
                defaultValue={researchData?.page_heading || "Research"}
                className="text-5xl lg:text-7xl font-['Playfair_Display'] font-bold text-[#1a1a1a]"
              />
            </h1>
            <p className="text-xl lg:text-2xl font-['Inter'] text-gray-600 max-w-3xl mx-auto">
              <EditableText
                collection="content"
                docId="research"
                field="page_description"
                defaultValue={researchData?.page_description || "Advancing knowledge in leadership, organizational behavior, and human resource management"}
                className="text-xl lg:text-2xl font-['Inter'] text-gray-600"
                multiline
              />
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-6 lg:px-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-['Inter'] font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <FiExternalLink /> Google Scholar Citations
            </a>
            <a 
              href="https://www.researchgate.net/profile/YOUR_PROFILE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#333333] hover:bg-[#000000] text-white px-6 py-3 rounded-lg font-['Inter'] font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <FiExternalLink /> ResearchGate Profile
            </a>
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="py-16 px-6 lg:px-16 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={fadeInUp}
            className="mb-12"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-[#1a1a1a] mb-4">
                  Featured Peer-reviewed Publications
                </h2>
                <div className="w-24 h-1 bg-[#1a1a1a] rounded-full"></div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowAddPub(true)}
                  className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  <FiPlus /> Add Publication
                </button>
              )}
            </div>

            {/* Search bar */}
            <div className="mt-6 relative max-w-xl">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={pubSearch}
                onChange={e => setPubSearch(e.target.value)}
                placeholder="Search by title, author, year, or journal…"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] text-sm"
              />
              {pubSearch && (
                <button
                  onClick={() => setPubSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
            {pubSearch && (
              <p className="mt-2 text-sm text-gray-500">
                {filteredPublications.length} result{filteredPublications.length !== 1 ? 's' : ''} for &ldquo;{pubSearch}&rdquo;
              </p>
            )}
          </motion.div>

          {showAddPub && isAdmin && (
            <div className="mb-6 p-6 bg-white rounded-xl border-2 border-[#1a1a1a] shadow-lg">
              <PublicationForm
                onSave={addPublication}
                onCancel={() => setShowAddPub(false)}
              />
            </div>
          )}

          <div className="space-y-6">
            {filteredPublications.map((pub, index) => (
              <motion.div
                key={pub.id || index}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
                variants={fadeInUp}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#1a1a1a] relative group"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingPub(pub)}
                      className="p-2 bg-[#1a1a1a] hover:bg-[#000000] text-white rounded-lg"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => deletePublication(pub)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
                <p className="font-['Inter'] text-gray-700 mb-2">
                  <span className="font-semibold text-[#1a1a1a]">{pub.authors}</span> ({pub.year}). {pub.title}
                </p>
                <p className="font-['Inter'] text-gray-600 italic mb-2">{pub.journal}</p>
                {pub.doi && (
                  <a 
                    href={pub.doi} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1a1a1a] hover:text-[#000000] font-['Inter'] text-sm inline-flex items-center gap-1"
                  >
                    <FiExternalLink size={14} /> View Publication
                  </a>
                )}
              </motion.div>
            ))}

            {editingPub && isAdmin && (
              <div className="mt-6 p-6 bg-white rounded-xl border-2 border-[#1a1a1a] shadow-lg">
                <PublicationForm
                  publication={editingPub}
                  onSave={updatePublication}
                  onCancel={() => setEditingPub(null)}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cases and Technical Notes */}
      <section className="py-16 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Cases */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#555555] rounded-lg flex items-center justify-center">
                  <FiFileText className="text-white text-xl" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-['Playfair_Display'] font-bold text-[#1a1a1a]">
                  Cases
                </h2>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowAddCase(true)}
                  className="flex items-center gap-2 bg-[#555555] hover:bg-[#222222] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                >
                  <FiPlus size={16} /> Add Case
                </button>
              )}
            </div>

            {showAddCase && isAdmin && (
              <div className="mb-4 p-4 bg-white rounded-lg border-2 border-[#555555]">
                <CaseForm
                  onSave={addCase}
                  onCancel={() => setShowAddCase(false)}
                />
              </div>
            )}

            <ul className="space-y-3">
              {displayCases.map((caseItem, index) => (
                <li key={caseItem.id || index} className="font-['Inter'] text-gray-700 pl-4 border-l-2 border-[#555555] hover:bg-[#ffffff] p-2 transition-colors relative group">
                  {isAdmin && (
                    <button
                      onClick={() => deleteCase(caseItem)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{caseItem.title}</span>
                    <span className="text-sm text-gray-500">({caseItem.code})</span>
                    {caseItem.link && (
                      <a 
                        href={caseItem.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#555555] hover:text-[#222222] text-sm inline-flex items-center gap-1 mt-1"
                      >
                        <FiExternalLink size={12} /> View Case
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Technical Notes */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={fadeInUp}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                <FiBookOpen className="text-white text-xl" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-['Playfair_Display'] font-bold text-[#1a1a1a]">
                Technical Notes
              </h2>
            </div>
            <ul className="space-y-3">
              {technicalNotes.map((note, index) => (
                <li key={index} className="font-['Inter'] text-gray-700 pl-4 border-l-2 border-[#1a1a1a] hover:bg-[#f0f0f0] p-2 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{note.title}</span>
                    <span className="text-sm text-gray-500">({note.code})</span>
                    {note.link && (
                      <a 
                        href={note.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#1a1a1a] hover:text-[#000000] text-sm inline-flex items-center gap-1 mt-1"
                      >
                        <FiExternalLink size={12} /> View Note
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Book Chapters */}
      <section className="py-16 px-6 lg:px-16 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={fadeInUp}
            className="mb-12"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-[#1a1a1a] mb-4">
                  Book Chapters & Conference Proceedings
                </h2>
                <div className="w-24 h-1 bg-[#1a1a1a] rounded-full"></div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowAddChapter(true)}
                  className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  <FiPlus /> Add Chapter
                </button>
              )}
            </div>
          </motion.div>

          {showAddChapter && isAdmin && (
            <div className="mb-6 p-6 bg-white rounded-xl border-2 border-[#1a1a1a] shadow-lg">
              <BookChapterForm
                onSave={addBookChapter}
                onCancel={() => setShowAddChapter(false)}
              />
            </div>
          )}

          <div className="space-y-6">
            {displayBookChapters.map((chapter, index) => (
              <motion.div
                key={chapter.id || index}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
                variants={fadeInUp}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#1a1a1a] relative group"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteBookChapter(chapter)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
                <p className="font-['Inter'] text-gray-700 mb-2">
                  <span className="font-semibold text-[#1a1a1a]">{chapter.authors}</span> ({chapter.year}). {chapter.title}
                </p>
                <p className="font-['Inter'] text-gray-600 italic mb-2">{chapter.book}</p>
                {chapter.doi && (
                  <a 
                    href={chapter.doi} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1a1a1a] hover:text-[#000000] font-['Inter'] text-sm inline-flex items-center gap-1"
                  >
                    <FiExternalLink size={14} /> View Chapter
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Issues */}
      <section className="py-16 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={fadeInUp}
            className="mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-[#1a1a1a] mb-4">
              Special Issues Edited
            </h2>
            <div className="w-24 h-1 bg-[#333333] rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {specialIssues.map((issue, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
                variants={fadeInUp}
                className="bg-gradient-to-br from-[#ffffff] to-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#333333]"
              >
                <h3 className="text-xl font-['Playfair_Display'] font-bold text-[#1a1a1a] mb-2">
                  {issue.title}
                </h3>
                <p className="font-['Inter'] text-gray-600 mb-3">{issue.description}</p>
                {issue.link !== "#" && (
                  <a 
                    href={issue.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#333333] hover:text-[#222222] font-['Inter'] text-sm inline-flex items-center gap-1 font-semibold"
                  >
                    <FiExternalLink size={14} /> View Journal
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PhD Students */}
      <section className="py-16 px-6 lg:px-16 bg-[#f0f0f0]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                <FiUsers className="text-white text-2xl" />
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-[#1a1a1a] mb-4">
              PhD Students Guided
            </h2>
            <div className="w-24 h-1 bg-[#1a1a1a] rounded-full mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* TAC Chairperson */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
              variants={fadeInUp}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-['Playfair_Display'] font-bold text-[#1a1a1a] mb-6">
                As TAC Chairperson
              </h3>
              <div className="space-y-4">
                {phdStudents.chairperson.map((student, index) => (
                  <div key={index} className="border-l-4 border-[#1a1a1a] pl-4 py-2 hover:bg-[#f0f0f0] transition-colors">
                    <p className="font-['Inter'] font-semibold text-[#1a1a1a]">{student.name}</p>
                    <p className="font-['Inter'] text-sm text-gray-600">{student.position}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* TAC Member */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
              variants={fadeInUp}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-['Playfair_Display'] font-bold text-[#1a1a1a] mb-6">
                As TAC Member
              </h3>
              <div className="space-y-3">
                {phdStudents.member.map((student, index) => (
                  <div key={index} className="border-l-4 border-[#555555] pl-4 py-2 hover:bg-[#ffffff] transition-colors">
                    <p className="font-['Inter'] text-gray-700">{student}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Publication Form Component
function PublicationForm({ publication, onSave, onCancel }) {
  const [formData, setFormData] = useState(publication || {
    authors: '',
    year: new Date().getFullYear().toString(),
    title: '',
    journal: '',
    doi: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-2xl font-bold mb-4">
        {publication ? 'Edit Publication' : 'Add New Publication'}
      </h3>
      <div>
        <label className="block text-sm font-semibold mb-2">Authors</label>
        <input
          type="text"
          value={formData.authors}
          onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Year</label>
        <input
          type="text"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Title</label>
        <textarea
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a]"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Journal</label>
        <input
          type="text"
          value={formData.journal}
          onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">DOI/Link (optional)</label>
        <input
          type="url"
          value={formData.doi}
          onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a]"
        />
      </div>
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold transition-colors"
        >
          <FiX className="inline mr-2" /> Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#1a1a1a] hover:bg-[#000000] text-white rounded-lg font-semibold transition-colors"
        >
          <FiSave className="inline mr-2" /> Save
        </button>
      </div>
    </form>
  );
}

// Book Chapter Form Component
function BookChapterForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    authors: '',
    year: new Date().getFullYear().toString(),
    title: '',
    book: '',
    doi: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ authors: '', year: new Date().getFullYear().toString(), title: '', book: '', doi: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-xl font-bold mb-3">Add New Book Chapter</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1">Authors</label>
          <input
            type="text"
            value={formData.authors}
            onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Year</label>
          <input
            type="text"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Book/Conference</label>
        <input
          type="text"
          value={formData.book}
          onChange={(e) => setFormData({ ...formData, book: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">DOI/Link (optional)</label>
        <input
          type="url"
          value={formData.doi}
          onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#000000] text-white rounded-lg text-sm font-semibold"
        >
          Save Chapter
        </button>
      </div>
    </form>
  );
}

// Case Form Component
function CaseForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    link: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ title: '', code: '', link: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-lg font-bold mb-3">Add New Case</h3>
      <div>
        <label className="block text-sm font-semibold mb-1">Case Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Case Code</label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          placeholder="e.g. IIMC/OB0230"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Link (optional)</label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#555555] hover:bg-[#222222] text-white rounded-lg text-sm font-semibold"
        >
          Save Case
        </button>
      </div>
    </form>
  );
}
