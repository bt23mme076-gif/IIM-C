import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiUsers, FiBookOpen, FiBriefcase, FiTrendingUp, FiHeart, FiPlus, FiTrash2, FiSave, FiX, FiEdit2 } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useFirestoreDoc } from '../hooks/useFirestoreDoc';
import EditableText from '../components/EditableText';
import SEO from '../components/SEO';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const DEFAULT_AWARDS = [
  'First Position in Triple Connection Global Educator Challenge, Inchainge, The Netherlands, 2023',
  'The Union Ministry of Energy-Department of Power" Gold Medal for the best paper published on Power Development and Utilization, Institution of Engineers(India), 2014',
  'Fulbright Senior Research Fellowship, United States Department of State -Bureau of Educational and Cultural Affairs, 2009',
  'Elected Senior Member IEEE, IEEE, 2008',
  'Elected Fellow and Chartered Engineer, Institution of Engineers(India), 2003',
  "General Manager's Best Officer Award and Efficiency Medal, South Eastern Railway (Ministry of Railways), 2000",
  'National Second Rank in Indian Engineering Services (Electrical) Examination, Union Public Service Commission, 1984',
  'First Rank in Pre-University Science Examination, North Eastern Hill University, 1978',
  'IIT Joint Entrance Exam All India Rank 231, IIT, 1978'
];

const DEFAULT_WORK_EXPERIENCE = [
  { period: '2021 - Present', role: 'Professor', organization: 'Indian Institute of Management, Calcutta', type: 'academic' },
  { period: '2019 - 2021', role: 'Dean', organization: 'Indian Institute of Management, Calcutta', type: 'academic' },
  { period: '2015 - 2019', role: 'Professor', organization: 'Indian Institute of Management Calcutta', type: 'academic' },
  { period: '2006 - 2015', role: 'Associate Professor', organization: 'Indian Institute of Management Calcutta', type: 'academic' },
  { period: '2005 - 2006', role: 'Director', organization: 'Research Design & Standards Organization, Ministry of Railways, Lucknow', type: 'professional' },
  { period: '2003 - 2005', role: 'Professor', organization: 'Indian Railway Institute of Electrical Engineering, Ministry of Railways, Nasik', type: 'academic' },
  { period: '1997 - 2003', role: 'Deputy Chief Electrical Engineer', organization: 'South Eastern Railway, Ministry of Railways, Kolkata', type: 'professional' },
  { period: '1996 - 1997', role: 'Senior Divisional Engineer', organization: 'East Coast Railways, Ministry of Railways, Visakhaptnam', type: 'professional' },
  { period: '1995 - 1996', role: 'Divisional Engineer', organization: 'East Coast Railway, Ministry of Railways, Visakhapatnam', type: 'professional' },
  { period: '1991 - 1995', role: 'Assistant Divisional Engineer', organization: 'East Coast Railway, Ministry of Railways, Visakhapatnam', type: 'professional' },
  { period: '1989 - 1991', role: 'Assistant Engineer', organization: 'Indian Railway Institute of Electrical Engineering, Ministry of Railways, Nasik', type: 'professional' },
  { period: '1985 - 1989', role: 'Assistant Director', organization: 'Central Electricity Authority, Ministry of Power, New Delhi', type: 'professional' }
];

const DEFAULT_BOARD_POSITIONS = [
  { title: 'Dean-Academic', period: '2019', active: false },
  { title: 'Member of Board of Directors', period: '2019', active: false },
  { title: 'Member, IIM Calcutta Board Committee on Regulations', period: '2019', active: false },
  { title: 'Member, IIM Calcutta Board Committee for Building & Works', period: '2019', active: false },
  { title: 'Chairperson, Fellow Program & Research Committee, IIM Calcutta', period: '2015', active: false },
  { title: 'Member, IIM Calcutta Placement Committee', period: '2014', active: false },
  { title: 'Member, IIM Calcutta Publications Committee', period: '2012', active: false },
  { title: 'Chairperson, Students Activities Committee, IIM Calcutta', period: '2007', active: false },
  { title: 'Institute Coordinator, PGPEX-VLM Committee, IIM Calcutta', period: '2007', active: false },
  { title: 'Institute Coordinator, Visionary Leadership in Manufacturing Committee', period: '2007', active: false }
];

const DEFAULT_MEDIA = [];

const DEFAULT_OTHER_ACTIVITIES = [
  'Certified Independent Director, World Council of Directors & Indian Institute of Corporate Affairs(Ministry of Corporate Affairs, Government of India) empanelled Independent Director (Registration No  IDDB-DI-202408-063840)',
  'Member, Advisory Board, IFPPM (Institute for Practical Project Management), Canada',
  "Paper setter for Union Public Service Commission's Civil Service Examination",
  "Paper setter for IIM’s Common Admission Test(CAT)",
  'Member, United States of America & India Educational Foundation (USIEF) Fulbright Senior Research Fellowship Screening Committee',
  'Member, Faculty Selection Committee, IIIT-Bangalore',
  'Member, Faculty Selection Committee, Indian Statistical Institute',
  'Member, Faculty Selection Board, BITS Pilani',
  'Member, Faculty Selection Board, Rajiv Gandhi Institute of Petroleum Technology',
  'Member, Logistics Committee, Confederation of Indian Industries(Eastern Region)',
  'Research grants reviewer for Ministry of Science & Technology, Government of India',
  'Served as a judge of the QS (Quacquarelli Symonds, London) Reimagine Education Awards 2024, 2025',
  'Member of Board of Trustees of The Future Foundation School (Sri Aurobindo Institute of Culture), Kolkata.',
  'Member of Academic Council, Bharathidesan Institute of Management, Tiruchirappalli',
  "External Expert of Amity University's Academic and Administrative Development Centre Advisory Committee",
  'Member, 11th Plan Working Group on Logistics, Planning Commission, Government of India 2006-07',
  'Course Director, Indian Railway Service of Electrical Engineers Probationer Officers, IRIEEN, 2003-05',
  'Functioned as Sole & Joint Arbitrator for Indian Railway contractual disputes, 1997-2003'
];
export default function About() {
  const { isAdmin } = useAuth();

  // --- Edit states for each dynamic list ---
  const [editingAwardIdx, setEditingAwardIdx] = useState(null);
  const [addingAward, setAddingAward] = useState(false);
  const [draftAward, setDraftAward] = useState('');

  const [editingExpIdx, setEditingExpIdx] = useState(null);
  const [addingExp, setAddingExp] = useState(false);
  const [draftExp, setDraftExp] = useState({ period: '', role: '', organization: '', type: 'academic' });

  const [editingBoardIdx, setEditingBoardIdx] = useState(null);
  const [addingBoard, setAddingBoard] = useState(false);
  const [draftBoard, setDraftBoard] = useState({ title: '', period: '', active: false });

  const [editingMediaIdx, setEditingMediaIdx] = useState(null);
  const [addingMedia, setAddingMedia] = useState(false);
  const [draftMedia, setDraftMedia] = useState('');

  const [saving, setSaving] = useState(false);

  const defaultAboutData = {
    header: {
      title: "About",
      subtitle: "Professor at Indian Institute of Management Calcutta (IIMC).",
    },
    hero: {
      mainHeading: "Prof. Bodhibrata Nag",
      subtitle: "Professor at IIM Calcutta.",
      description: "Researcher and Author.",
      linkedinUrl: "https://facultylive.iimcal.ac.in/users/bnag",
    },
    journey: {
      heading: "About Prof. Bodhibrata Nag",
      paragraph1: "Prof. Bodhibrata Nag is a Professor in the Operations Management Group at the Indian Institute of Management Calcutta (IIMC). His areas of interest include Operations Research, Simulation, Data Analytics, Operations Management, Supply Chain Management, Logistics, Project Management, Quality Management, Procurement, Contracts and Arbitration.",
      paragraph2: "He holds a Bachelor of Technology from the Indian Institute of Technology Madras and a Ph.D. from the Indian Institute of Management Calcutta.",
      paragraph3: ""
    },
    awards: DEFAULT_AWARDS,
    workExperience: DEFAULT_WORK_EXPERIENCE,
    boardPositions: DEFAULT_BOARD_POSITIONS,
    mediaOutlets: DEFAULT_MEDIA,
    otherActivities: DEFAULT_OTHER_ACTIVITIES,
  };

  const { data: aboutData, loading } = useFirestoreDoc('content', 'about', defaultAboutData);

  // --- Firestore save helper ---
  const saveField = async (field, value) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'about'), { [field]: value }, { merge: true });
    } catch (e) {
      console.error('Save failed:', e);
      alert('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // --- Awards CRUD ---
  const awards = aboutData?.awards?.length ? aboutData.awards : DEFAULT_AWARDS;
  const commitAward = async (idx) => {
    if (!draftAward.trim()) return;
    const updated = [...awards];
    if (idx === 'new') updated.push(draftAward.trim());
    else updated[idx] = draftAward.trim();
    await saveField('awards', updated);
    setEditingAwardIdx(null); setAddingAward(false); setDraftAward('');
  };
  const deleteAward = async (idx) => {
    if (!confirm('Delete this award?')) return;
    await saveField('awards', awards.filter((_, i) => i !== idx));
  };

  // --- Work Experience CRUD ---
  const workExperience = aboutData?.workExperience?.length ? aboutData.workExperience : DEFAULT_WORK_EXPERIENCE;
  const commitExp = async (idx) => {
    if (!draftExp.role.trim()) return;
    const updated = [...workExperience];
    if (idx === 'new') updated.push({ ...draftExp });
    else updated[idx] = { ...draftExp };
    await saveField('workExperience', updated);
    setEditingExpIdx(null); setAddingExp(false);
    setDraftExp({ period: '', role: '', organization: '', type: 'academic' });
  };
  const deleteExp = async (idx) => {
    if (!confirm('Delete this experience entry?')) return;
    await saveField('workExperience', workExperience.filter((_, i) => i !== idx));
  };

  // --- Board Positions CRUD ---
  const boardPositions = aboutData?.boardPositions?.length ? aboutData.boardPositions : DEFAULT_BOARD_POSITIONS;
  const commitBoard = async (idx) => {
    if (!draftBoard.title.trim()) return;
    const updated = [...boardPositions];
    if (idx === 'new') updated.push({ ...draftBoard });
    else updated[idx] = { ...draftBoard };
    await saveField('boardPositions', updated);
    setEditingBoardIdx(null); setAddingBoard(false);
    setDraftBoard({ title: '', period: '', active: false });
  };
  const deleteBoard = async (idx) => {
    if (!confirm('Delete this board position?')) return;
    await saveField('boardPositions', boardPositions.filter((_, i) => i !== idx));
  };

  // --- Media Outlets CRUD ---
  const mediaOutlets = aboutData?.mediaOutlets?.length ? aboutData.mediaOutlets : DEFAULT_MEDIA;
  const commitMedia = async (idx) => {
    if (!draftMedia.trim()) return;
    const updated = [...mediaOutlets];
    if (idx === 'new') updated.push(draftMedia.trim());
    else updated[idx] = draftMedia.trim();
    await saveField('mediaOutlets', updated);
    setEditingMediaIdx(null); setAddingMedia(false); setDraftMedia('');
  };
  const deleteMedia = async (idx) => {
    await saveField('mediaOutlets', mediaOutlets.filter((_, i) => i !== idx));
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const viewportOptions = { once: true, margin: "0px 0px -50px 0px", amount: 0.2 };

  const achievements = [
    { icon: <FiAward />, title: "Academic", desc: "Faculty at IIM Calcutta." },
    { icon: <FiBriefcase />, title: "Researcher", desc: "Research coming soon." },
    { icon: <FiBookOpen />, title: "Author", desc: "Publications coming soon." }
  ];

  const INVITED_TALKS_RECENT = [
    'Smart Chains: Leveraging AI in Supply Chain Management — Xavier Business School MBA Induction Program (2025)',
    'Artificial Intelligence for Healthcare — KPC Medical College & Hospital (2025)',
    'AI and Analytics in Supply Chain Optimization — ICDTBESDVB 2025, IIT(ISM) Dhanbad (2025)',
    'Building the backbone of Bharat: Infrastructure as the catalyst for National progress — Army Institute of Management (2025) — https://youtu.be/Vq_iYkz32So',
    'Harnessing Artificial Intelligence for Effective Management — ICFAI Business School (2025)',
    'Industry Magnates Premier Podcast: FaceTime with Leaders — https://www.youtube.com/watch?v=OfBfJJrk9KU (2025)'
  ];

  const INVITED_TALKS_EARLIER_SUMMARY = 'Selected earlier invited talks include presentations at IIT Roorkee, IIT Kharagpur, University of Michigan (Ann Arbor), Variable Energy Cyclotron Centre, IIM Rohtak, IIT Bombay, IBM Project Management forum, and various national seminars (2006–2024).';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }
  
  // Page-level SEO
  const seoTitle = `${aboutData?.header?.title || 'About'} - Prof. Bodhibrata Nag`;
  const seoDesc = aboutData?.journey?.paragraph1 || 'Profile of Prof. Bodhibrata Nag, IIM Calcutta.';

  return (
    <div className="bg-[#F7F4EE]">
      <SEO
        title={seoTitle}
        description={seoDesc}
        url={`https://www.profnag.com/about`}
        breadcrumbs={[
          { name: 'Home', item: 'https://www.profnag.com/' },
          { name: 'About', item: 'https://www.profnag.com/about' }
        ]}
      />
      {/* Admin save indicator */}
      {isAdmin && saving && (
        <div className="fixed top-20 right-4 z-50 bg-[#1E2A38] text-white px-4 py-2 rounded-lg text-sm font-['Inter'] shadow-lg animate-pulse">
          Savingâ€¦
        </div>
      )}

      {/* Page Header */}
      <section className="bg-[#F7F4EE] py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center">
            <div className="w-20 h-1 bg-[#B9975B] mb-8 rounded-full mx-auto"></div>
            <h1 className="text-5xl lg:text-7xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] mb-6">
              <EditableText
                collection="content"
                docId="about"
                field="header.title"
                defaultValue={aboutData?.header?.title || "About"}
                className="text-5xl lg:text-7xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38]"
              />
            </h1>
            <div className="text-xl lg:text-2xl font-['Inter'] text-gray-600 max-w-3xl mx-auto">
              <EditableText
                collection="content"
                docId="about"
                field="header.subtitle"
                defaultValue={aboutData?.header?.subtitle || "Professor of Organizational Behavior at IIM Calcutta — Researcher, Author, and Leadership Coach."}
                className="text-xl lg:text-2xl font-['Inter'] text-gray-600"
                multiline
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Expertise Cards */}
      <section className="py-16 px-6 lg:px-20 bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOptions} variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((item, i) => (
              <div key={i} className="border-t-4 border-[#B9975B] pt-8 space-y-4 group hover:border-[#1E2A38] transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-[#1E2A38] to-[#2d3f54] rounded-xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-sm uppercase tracking-widest font-bold text-gray-500">{item.title}</h4>
                <p className="text-lg font-['Inter'] font-medium text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-16 px-6 lg:px-20 bg-[#F7F4EE]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOptions} variants={fadeInUp}
            className="text-center space-y-8">
            <h2 className="text-5xl lg:text-6xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38]">
              <EditableText collection="content" docId="about" field="journey.heading"
                defaultValue={aboutData?.journey?.heading || "About Prof. Bodhibrata Nag"}
                className="text-5xl lg:text-6xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38]" />
            </h2>
            <div className="w-24 h-1 bg-[#B9975B] rounded-full mx-auto"></div>
            <div className="space-y-6 text-left">
              <div className="text-lg lg:text-xl font-['Inter'] text-gray-700 leading-relaxed">
                <EditableText collection="content" docId="about" field="journey.paragraph1"
                  defaultValue={aboutData?.journey?.paragraph1}
                  className="text-lg lg:text-xl font-['Inter'] text-gray-700 leading-relaxed" multiline />
              </div>
              <div className="text-lg lg:text-xl font-['Inter'] text-gray-700 leading-relaxed">
                <EditableText collection="content" docId="about" field="journey.paragraph2"
                  defaultValue={aboutData?.journey?.paragraph2}
                  className="text-lg lg:text-xl font-['Inter'] text-gray-700 leading-relaxed" multiline />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 px-6 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOptions} variants={fadeInUp}>
            <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#B9975B] to-[#1E2A38] rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">
                  <FiAward />
                </div>
                <h2 className="text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38]">Awards & Recognition</h2>
              </div>
              {isAdmin && (
                <button onClick={() => { setAddingAward(true); setDraftAward(''); }}
                  className="flex items-center gap-2 bg-[#333333] text-white px-4 py-2 rounded-lg text-sm font-['Inter'] font-semibold hover:bg-[#333333] transition-colors shadow-md">
                  <FiPlus size={14} /> Add Award
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatePresence>
                {awards.map((award, index) => (
                  <motion.div key={index} layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-gradient-to-br from-[#F7F4EE] to-white p-6 rounded-xl border-l-4 border-[#B9975B] shadow-md hover:shadow-xl transition-shadow relative">
                    {editingAwardIdx === index ? (
                      <div className="space-y-3">
                        <textarea value={draftAward} onChange={e => setDraftAward(e.target.value)} rows={3} autoFocus
                          className="w-full px-3 py-2 border-2 border-[#D9D6CF] rounded-lg font-['Inter'] text-sm focus:outline-none resize-none" />
                        <div className="flex gap-2">
                          <button onClick={() => commitAward(index)}
                            className="flex items-center gap-1 bg-[#1E2A38] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#2d3f54]">
                            <FiSave size={12} /> Save
                          </button>
                          <button onClick={() => { setEditingAwardIdx(null); setDraftAward(''); }}
                            className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-300">
                            <FiX size={12} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-['Inter'] text-gray-800 font-medium pr-16">{award}</p>
                        {isAdmin && (
                          <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingAwardIdx(index); setDraftAward(award); }}
                              className="bg-[#1E2A38] text-white p-1.5 rounded hover:bg-[#2d3f54]"><FiEdit2 size={12} /></button>
                            <button onClick={() => deleteAward(index)}
                              className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"><FiTrash2 size={12} /></button>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                ))}
                {isAdmin && addingAward && (
                  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#ffffff] p-6 rounded-xl border-2 border-dashed border-[#B9975B] shadow-md">
                    <p className="text-xs font-['Inter'] font-bold text-[#1E2A38] uppercase tracking-wider mb-3">New Award</p>
                    <textarea value={draftAward} onChange={e => setDraftAward(e.target.value)} rows={3} autoFocus
                      placeholder="Enter award / recognition..."
                      className="w-full px-3 py-2 border-2 border-[#D9D6CF] rounded-lg font-['Inter'] text-sm focus:outline-none resize-none mb-3" />
                    <div className="flex gap-2">
                      <button onClick={() => commitAward('new')}
                        className="flex items-center gap-1 bg-[#1E2A38] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#2d3f54]">
                        <FiSave size={12} /> Save
                      </button>
                      <button onClick={() => { setAddingAward(false); setDraftAward(''); }}
                        className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-300">
                        <FiX size={12} /> Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Work Experience Timeline */}
      <section className="py-16 px-6 lg:px-20 bg-[#F7F4EE]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOptions} variants={fadeInUp}>
            <div className="flex items-center justify-between gap-4 mb-12 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E2A38] to-[#2d3f54] rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">
                  <FiTrendingUp />
                </div>
                <h2 className="text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38]">Professional Journey</h2>
              </div>
              {isAdmin && (
                <button onClick={() => { setAddingExp(true); setDraftExp({ period: '', role: '', organization: '', type: 'academic' }); }}
                  className="flex items-center gap-2 bg-[#1E2A38] text-white px-4 py-2 rounded-lg text-sm font-['Inter'] font-semibold hover:bg-[#2d3f54] transition-colors shadow-md">
                  <FiPlus size={14} /> Add Entry
                </button>
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-8 pl-16">
              <span className="flex items-center gap-2 text-sm font-['Inter'] text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[#1E2A38] inline-block"></span> Academic
              </span>
              <span className="flex items-center gap-2 text-sm font-['Inter'] text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[#333333] inline-block"></span> Industry
              </span>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#1E2A38] via-[#B9975B] to-[#1E2A38] opacity-20" />
              <div className="space-y-3">
                <AnimatePresence>
                  {workExperience.map((exp, index) => (
                    <motion.div key={index} layout
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      className="group relative pl-16 pb-2">
                      {/* Dot */}
                      <div className={`absolute left-[18px] top-4 w-5 h-5 rounded-full border-[3px] border-white shadow-md z-10 transition-all duration-300 group-hover:scale-125 ${exp.type === 'industry' ? 'bg-[#5B6472]' : 'bg-[#1E2A38]'}`} />

                      {editingExpIdx === index ? (
                        <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-[#D9D6CF] space-y-3">
                          <input value={draftExp.period} onChange={e => setDraftExp(d => ({ ...d, period: e.target.value }))}
                            placeholder="Period (e.g. Jan 2020 – Present)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38]" />
                          <input value={draftExp.role} onChange={e => setDraftExp(d => ({ ...d, role: e.target.value }))}
                            placeholder="Role / Position *"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38]" autoFocus />
                          <input value={draftExp.organization} onChange={e => setDraftExp(d => ({ ...d, organization: e.target.value }))}
                            placeholder="Organization"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38]" />
                          <select value={draftExp.type} onChange={e => setDraftExp(d => ({ ...d, type: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38] bg-white">
                            <option value="academic">Academic</option>
                            <option value="industry">Industry</option>
                          </select>
                          <div className="flex gap-2">
                            <button onClick={() => commitExp(index)}
                              className="flex items-center gap-1 bg-[#1E2A38] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#2d3f54]">
                              <FiSave size={12} /> Save
                            </button>
                            <button onClick={() => setEditingExpIdx(null)}
                              className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-300">
                              <FiX size={12} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.2 }}
                          className="bg-white rounded-2xl px-5 py-4 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-[#1E2A38]/30">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className={`text-xs font-['Inter'] font-bold px-2.5 py-0.5 rounded-full ${exp.type === 'industry' ? 'bg-[#ffffff] text-[#5B6472] ring-1 ring-[#5B6472]/30' : 'bg-[#F7F4EE] text-[#1E2A38] ring-1 ring-[#1E2A38]/30'}`}>
                                  {exp.type === 'industry' ? 'Industry' : 'Academic'}
                                </span>
                                <span className="text-xs font-['Inter'] text-gray-400 font-medium">{exp.period}</span>
                              </div>
                              <h3 className="text-[17px] font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] leading-snug mb-0.5">{exp.role}</h3>
                              <p className="text-sm font-['Inter'] text-gray-500">{exp.organization}</p>
                            </div>
                            {isAdmin && (
                              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">
                                <button onClick={() => { setEditingExpIdx(index); setDraftExp({ period: exp.period || '', role: exp.role || '', organization: exp.organization || '', type: exp.type || 'academic' }); }}
                                  className="bg-[#1E2A38] text-white p-1.5 rounded hover:bg-[#2d3f54]"><FiEdit2 size={12} /></button>
                                <button onClick={() => deleteExp(index)}
                                  className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"><FiTrash2 size={12} /></button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}

                  {isAdmin && addingExp && (
                    <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      className="relative pl-16 pb-2">
                      <div className="absolute left-[18px] top-4 w-5 h-5 rounded-full bg-gray-300 border-[3px] border-white shadow-md z-10" />
                      <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-dashed border-[#B9975B] space-y-3">
                        <p className="text-xs font-['Inter'] font-bold text-[#1E2A38] uppercase tracking-wider">New Entry</p>
                        <input value={draftExp.period} onChange={e => setDraftExp(d => ({ ...d, period: e.target.value }))}
                          placeholder="Period (e.g. Jan 2020 – Present)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38]" autoFocus />
                        <input value={draftExp.role} onChange={e => setDraftExp(d => ({ ...d, role: e.target.value }))}
                          placeholder="Role / Position *"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38]" />
                        <input value={draftExp.organization} onChange={e => setDraftExp(d => ({ ...d, organization: e.target.value }))}
                          placeholder="Organization"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38]" />
                        <select value={draftExp.type} onChange={e => setDraftExp(d => ({ ...d, type: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38] bg-white">
                          <option value="academic">Academic</option>
                          <option value="industry">Industry</option>
                        </select>
                        <div className="flex gap-2">
                          <button onClick={() => commitExp('new')}
                            className="flex items-center gap-1 bg-[#1E2A38] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#2d3f54]">
                            <FiSave size={12} /> Save
                          </button>
                          <button onClick={() => setAddingExp(false)}
                            className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-300">
                            <FiX size={12} /> Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Board Positions & Media Coverage */}
      <section className="py-16 px-6 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Board Positions */}
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOptions} variants={fadeInUp}>
            <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1E2A38] rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                  <FiUsers />
                </div>
                <h3 className="text-3xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38]">Board Positions</h3>
              </div>
              {isAdmin && (
                <button onClick={() => { setAddingBoard(true); setDraftBoard({ title: '', period: '', active: false }); }}
                  className="flex items-center gap-1 bg-[#1E2A38] text-white px-3 py-1.5 rounded-lg text-xs font-['Inter'] font-semibold hover:bg-[#2d3f54]">
                  <FiPlus size={12} /> Add
                </button>
              )}
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {boardPositions.map((pos, index) => (
                  <motion.div key={index} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`group bg-white p-6 rounded-xl shadow-md border-l-4 ${pos.active ? 'border-[#B9975B]' : 'border-gray-200'} relative`}>
                    {editingBoardIdx === index ? (
                      <div className="space-y-2">
                        <input value={draftBoard.title} onChange={e => setDraftBoard(d => ({ ...d, title: e.target.value }))}
                          placeholder="Title / Organization *" autoFocus
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38]" />
                        <input value={draftBoard.period} onChange={e => setDraftBoard(d => ({ ...d, period: e.target.value }))}
                          placeholder="Period (e.g. Present / Aug 2017 – Aug 2021)"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38]" />
                        <label className="flex items-center gap-2 text-sm font-['Inter'] text-gray-700 cursor-pointer select-none">
                          <input type="checkbox" checked={draftBoard.active} onChange={e => setDraftBoard(d => ({ ...d, active: e.target.checked }))} />
                          Current / Active position
                        </label>
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => commitBoard(index)}
                            className="flex items-center gap-1 bg-[#1E2A38] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#2d3f54]">
                            <FiSave size={12} /> Save
                          </button>
                          <button onClick={() => setEditingBoardIdx(null)}
                            className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-300">
                            <FiX size={12} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {pos.active && (
                          <span className="inline-block mb-2 text-xs font-['Inter'] font-bold text-[#1E2A38] uppercase tracking-wider bg-[#F7F4EE] px-2.5 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                        <p className={`font-['Inter'] font-semibold leading-snug pr-16 ${pos.active ? 'text-[#1E2A38]' : 'text-gray-700'}`}>{pos.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{pos.period}</p>
                        {isAdmin && (
                          <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingBoardIdx(index); setDraftBoard({ title: pos.title || '', period: pos.period || '', active: !!pos.active }); }}
                              className="bg-[#1E2A38] text-white p-1.5 rounded hover:bg-[#2d3f54]"><FiEdit2 size={12} /></button>
                            <button onClick={() => deleteBoard(index)}
                              className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"><FiTrash2 size={12} /></button>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                ))}
                {isAdmin && addingBoard && (
                  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-[#F7F4EE] p-5 rounded-xl border-2 border-dashed border-[#B9975B] space-y-2">
                    <p className="text-xs font-['Inter'] font-bold text-[#1E2A38] uppercase tracking-wider">New Position</p>
                    <input value={draftBoard.title} onChange={e => setDraftBoard(d => ({ ...d, title: e.target.value }))}
                      placeholder="Title / Organization *" autoFocus
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38]" />
                    <input value={draftBoard.period} onChange={e => setDraftBoard(d => ({ ...d, period: e.target.value }))}
                      placeholder="Period"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-['Inter'] focus:outline-none focus:border-[#1E2A38]" />
                    <label className="flex items-center gap-2 text-sm font-['Inter'] text-gray-700 cursor-pointer select-none">
                      <input type="checkbox" checked={draftBoard.active} onChange={e => setDraftBoard(d => ({ ...d, active: e.target.checked }))} />
                      Current / Active position
                    </label>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => commitBoard('new')}
                        className="flex items-center gap-1 bg-[#1E2A38] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#2d3f54]">
                        <FiSave size={12} /> Save
                      </button>
                      <button onClick={() => setAddingBoard(false)}
                        className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-300">
                        <FiX size={12} /> Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Media Coverage */}
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOptions} variants={fadeInUp}>
            <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#5B6472] rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                  <FiHeart />
                </div>
                <h3 className="text-3xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38]">Media Coverage</h3>
              </div>
              {isAdmin && (
                <button onClick={() => { setAddingMedia(true); setDraftMedia(''); }}
                  className="flex items-center gap-1 bg-[#5B6472] text-white px-3 py-1.5 rounded-lg text-xs font-['Inter'] font-semibold hover:bg-[#1E2A38]">
                  <FiPlus size={12} /> Add
                </button>
              )}
            </div>
            <p className="text-lg font-['Inter'] text-gray-700 mb-6 leading-relaxed">
              My research has been published in prestigious international journals and featured in major media outlets:
            </p>
            <div className="flex flex-wrap gap-3">
              <AnimatePresence>
                {mediaOutlets.map((media, index) => (
                  <motion.div key={index} layout
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                    className="group relative">
                    {editingMediaIdx === index ? (
                      <div className="flex items-center gap-1">
                        <input value={draftMedia} onChange={e => setDraftMedia(e.target.value)} autoFocus
                          className="w-32 px-2 py-1.5 border-2 border-[#D9D6CF] rounded-full text-sm font-['Inter'] focus:outline-none"
                          onKeyDown={e => { if (e.key === 'Enter') commitMedia(index); if (e.key === 'Escape') setEditingMediaIdx(null); }} />
                        <button onClick={() => commitMedia(index)} className="bg-[#1E2A38] text-white p-1.5 rounded-full"><FiSave size={11} /></button>
                        <button onClick={() => setEditingMediaIdx(null)} className="bg-gray-200 text-gray-600 p-1.5 rounded-full"><FiX size={11} /></button>
                      </div>
                    ) : (
                      <span className="bg-white px-4 py-2 rounded-full text-sm font-['Inter'] font-semibold text-[#1E2A38] shadow-md border border-[#1E2A38]/30 hover:border-[#1E2A38] transition-colors inline-flex items-center gap-1.5">
                        {media}
                        {isAdmin && (
                          <span className="inline-flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5">
                            <button onClick={() => { setEditingMediaIdx(index); setDraftMedia(media); }}
                              className="text-[#1E2A38] hover:text-[#B9975B]"><FiEdit2 size={10} /></button>
                            <button onClick={() => deleteMedia(index)}
                              className="text-red-400 hover:text-red-600"><FiTrash2 size={10} /></button>
                          </span>
                        )}
                      </span>
                    )}
                  </motion.div>
                ))}
                {isAdmin && addingMedia && (
                  <motion.div layout initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1">
                    <input value={draftMedia} onChange={e => setDraftMedia(e.target.value)} placeholder="Outlet nameâ€¦" autoFocus
                      className="w-32 px-2 py-1.5 border-2 border-[#333333] rounded-full text-sm font-['Inter'] focus:outline-none"
                      onKeyDown={e => { if (e.key === 'Enter') commitMedia('new'); if (e.key === 'Escape') setAddingMedia(false); }} />
                    <button onClick={() => commitMedia('new')} className="bg-[#333333] text-white p-1.5 rounded-full"><FiSave size={11} /></button>
                    <button onClick={() => setAddingMedia(false)} className="bg-gray-200 text-gray-600 p-1.5 rounded-full"><FiX size={11} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-lg font-['Inter'] text-gray-700 mt-8 leading-relaxed">
              Academic publications in <span className="font-semibold">Academy of Management Journal</span>, <span className="font-semibold">Human Resource Management</span>, <span className="font-semibold">Personnel Review</span>, and more.
            </p>

            {/* Invited Talks (summarized) */}
            <div className="mt-8">
              <h4 className="text-2xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38]">Invited Talks</h4>
              <div className="w-24 h-1 bg-[#B9975B] rounded-full mb-4"></div>
              <p className="text-md font-['Inter'] text-gray-700 mb-4">Selected recent and notable invited talks (concise):</p>
              <div className="flex flex-col gap-3">
                {INVITED_TALKS_RECENT.map((t, i) => (
                  <span key={i} className="bg-white px-4 py-2 rounded-full text-sm font-['Inter'] font-semibold text-[#1E2A38] shadow-md border border-[#1E2A38]/30 inline-flex items-center gap-1.5 break-words whitespace-normal">
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4 break-words whitespace-normal">{INVITED_TALKS_EARLIER_SUMMARY}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Activities */}
      <section className="py-16 px-6 lg:px-20 bg-[#F7F4EE]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOptions} variants={fadeInUp} className="mb-8">
            <h2 className="text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38]">Other Activities</h2>
            <div className="w-24 h-1 bg-[#B9975B] rounded-full mb-6"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {(aboutData?.otherActivities || DEFAULT_OTHER_ACTIVITIES).map((act, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#1E2A38] text-sm text-gray-700">
                {act}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

