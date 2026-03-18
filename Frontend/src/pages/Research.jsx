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
  const featuredPublications = [
    {
      id: 1,
      title: 'Navigating the Ethereal: Ethical Frameworks in AI for Healthcare',
      authors: 'Nag B.;Devnani M.;Pal R.',
      type: 'Book Chapter',
      journal: 'Advances in Artificial Intelligence for Healthcare Applications',
      year: 2025,
      pages: '72-85',
      doi: '#'
    },
    {
      id: 2,
      title: 'The Evolution of Ethical Standards and Guidelines in AI',
      authors: 'Nag B.',
      type: 'Book Chapter',
      journal: 'Responsible Implementations of Generative AI for Multidisciplinary Use',
      year: 2024,
      pages: '45-83',
      doi: '#',
      citations: 11
    },
    {
      id: 3,
      title: 'Navigating Ethical Dilemmas in Generative AI: Case Studies and Insights',
      authors: 'Nag B.',
      type: 'Book Chapter',
      journal: 'Responsible Implementations of Generative AI for Multidisciplinary Use',
      year: 2024,
      pages: '189-221',
      doi: '#',
      citations: 33
    },
    {
      id: 4,
      title: 'Applications of Emerging Technologies and AI/ML Algorithms',
      authors: 'Samir Maity, Bodhibrata Nag, and Sushovan Khatua',
      type: 'book chapter',
      journal: 'Leveraging Machine Learning of Indian Railways Public Procurement Data for Managerial Insights',
      year: 2023,
      pages: '69-77',
      doi: '#'
    },
    {
      id: 5,
      title: '5 ways Indian medical administrations can boost hospital cyber-security',
      authors: 'Ranjan Pal and Bodhibrata Nag',
      type: 'article',
      journal: 'Forbes India',
      year: 2023,
      doi: '#'
    },
    {
      id: 6,
      title: 'Towards Green Freight Transportation Using Train Design Optimization',
      authors: 'Bodhibrata Nag, Samir Maity(Aalborg University), and Ayan Chatterjee(SPJIMR)',
      type: 'journal',
      journal: 'Global Business Review',
      year: 2022,
      doi: 'https://doi.org/10.1177/09721509221125560'
    },
    {
      id: 7,
      title: 'Will Catastrophic Cyber-Risk Aggregation Thrive in the IoT Age? An Economic Take on Managing Aggregate Heavy-Tailed Risks',
      authors: 'Ranjan Pal(University of Michigan), John Crowcroft(University of Cambridge) and Bodhibrata Nag et.al',
      type: 'journal',
      journal: 'ACM Transactions on Management Information Systems, Volume 12, Issue 2',
      year: 2021,
      pages: '1–36',
      doi: 'https://doi.org/10.1145/3446635'
    },
    {
      id: 8,
      title: 'Preference-Based Privacy Markets',
      authors: 'Ranjan Pal(University of Michigan), John Crowcroft(University of Cambridge), Yong Li (Tsinghua University), Sasu Tarkoma (University of Helsinki) and Bodhibrata Nag et.al',
      type: 'journal',
      journal: 'IEEE Access (Volume 8)',
      year: 2020,
      doi: '10.1109/ACCESS.2020.3014882'
    },
    {
      id: 9,
      title: 'When Are Cyber Blackouts in Modern Service Networks Likely?: A Network Oblivious Theory on Cyber (Re)Insurance Feasibility',
      authors: 'Ranjan Pal(University of Michigan), Konstantinos Psounis(University of Southern California), John Crowcroft(University of Cambridge), Pan Hui (University of Helsinki) and Bodhibrata Nag et.al',
      type: 'journal',
      journal: 'ACM Transactions on Management Information Systems, Vol. 11, No. 2, Article 5',
      year: 2020,
      doi: 'https://doi.org/10.1145/3386159'
    },
    {
      id: 10,
      title: 'On a few strategies for a sustainable turnaround of the Indian Railways',
      authors: 'Bodhibrata Nag and Ashok Banerjee',
      type: 'journal',
      journal: 'Journal of Institute of Public Enterprise (2016) Volume 39, Issue 1 & 2',
      year: 2016,
      pages: '16-36',
      doi: 'https://ssrn.com/abstract=2928581'
    },
    {
      id: 11,
      title: 'Combating Corruption in Indian Public Procurement- some exploratory case studies',
      authors: 'Bodhibrata Nag',
      type: 'journal',
      journal: 'Journal of Institute of Public Enterprise (2015) Volume 38, Issue 1 & 2',
      year: 2015,
      pages: '1-34',
      doi: 'https://ssrn.com/abstract=2928667'
    },
    {
      id: 12,
      title: 'A MIP model for scheduling India\'s General Elections and Police movement',
      authors: 'Bodhibrata Nag',
      type: 'journal',
      journal: 'OPSEARCH(Springer) 51(4)',
      year: 2014,
      pages: '562–576',
      doi: 'https://doi.org/10.1007/s12597-013-0160-3'
    },
    {
      id: 13,
      title: 'Public Procurement- case study of the Indian Railways',
      authors: 'Bodhibrata Nag',
      type: 'journal',
      journal: 'Journal of Institute of Public Enterprise (2013) Volume 36, Issue 1 & 2',
      year: 2013,
      pages: '45-70',
      doi: 'https://ssrn.com/abstract=2323257'
    },
    {
      id: 14,
      title: 'A Dynamic Programming Algorithm for Optimal Design of Tidal Power Plants',
      authors: 'Bodhibrata Nag',
      type: 'journal',
      journal: 'Journal of The Institution of Engineers (India): Series B(Springer)(2013) Volume 94, Issue 1',
      year: 2013,
      pages: '43-51',
      doi: 'https://doi.org/10.1007/s40031-013-0041-4'
    },
    {
      id: 15,
      title: 'Organizing National Elections in India to Elect the 543 Members of the Lok Sabha',
      authors: 'Bodhibrata Nag and Katta G.Murty(University of Michigan)',
      type: 'journal',
      journal: 'Algorithmic Operations Research 7',
      year: 2013,
      pages: '55–70',
      doi: 'http://journals.hil.unb.ca/index.php/AOR/article/view/20395'
    },
    {
      id: 16,
      title: 'Choosing the appropriate project management structure, project financing, land acquisition and contractual process for Indian railway mega-projects: a case study of the Dedicated Freight Corridor project',
      authors: 'Bodhibrata Nag, Jeetendra Singh and Ved Mani Tiwari',
      type: 'journal',
      journal: 'Journal of Project, Program & Portfolio Management, 3',
      year: 2012,
      pages: '39-54',
      doi: 'http://epress.lib.uts.edu.au/journals/index.php/pppm/article/view/2791/3487'
    },
    {
      id: 17,
      title: 'Diesel locomotive fueling problem (LFP) in railroad operations',
      authors: 'Bodhibrata Nag and Katta G. Murty(University of Michigan)',
      type: 'journal',
      journal: '49 OPSEARCH(Springer)',
      year: 2012,
      pages: '315–333',
      doi: 'https://doi.org/10.1007/s12597-012-0082-5'
    }
  ];

  const researchProjects = [
      {
          id: 1,
          title: 'Business Process Reengineering and Change Management for the Department of Health and Family Welfare, Govt. of West Bengal',
          fundingAgency: 'Govt of West Bengal',
          role: 'Co-Investigator',
          amount: 5000000,
          period: '2019 - 2021'
      },
      {
          id: 2,
          title: 'Designing a Central Public Sector Enterprises Scorecard Index',
          fundingAgency: 'Comptroller & Auditor General of India',
          role: 'Co-Investigator',
          amount: 300000,
          period: '2019 - 2020'
      },
      {
          id: 3,
          title: 'Rail capacity modeling for Indian Railways using GIS',
          fundingAgency: 'World Bank and Deloitte',
          role: 'Co-Investigator',
          amount: 500000,
          period: '2019 - 2020'
      },
      {
          id: 4,
          title: 'Formulation of Business and Marketing Plan for Dedicated Freight Corridors of Indian Railways',
          fundingAgency: 'Ministry of Railways',
          role: 'Co-Investigator',
          amount: 5000000,
          period: '2007 - 2009'
      },
      {
          id: 5,
          title: 'Independent Evaluation of Procurement and Supply Chain of National AIDS Control Program',
          fundingAgency: 'Ministry of Health & Family Welfare, Government of India',
          role: 'Co-Investigator',
          amount: 1500000,
          period: '2007 - 2009'
      }
  ]

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

  const recentPhdScholars = [
    {
      name: 'Ayan Chatterjee',
      affiliation: 'Operations & Supply Chain Management Department, SP Jain Institute of Management & Research, Mumbai',
      thesis: 'BDT-MCDM Synergy in Improving the Attractiveness of a Business School'
    },
    {
      name: 'Somu Gorai',
      affiliation: 'OM Group, IIM Calcutta',
      thesis: 'Essays on the modeling of Integrated Production & Procurement, Distribution and Routing of Perishable Products'
    },
    {
      name: 'Utsav Pandey',
      affiliation: 'OM Group, IIM Calcutta',
      thesis: 'A study of environmental efficiency in a multi-level production system using Data Envelopment Analysis'
    },
    {
      name: 'Vallurupalli Vamsi',
      affiliation: 'MIS Group, IIM Calcutta',
      thesis: 'Understanding Influencers and Influential Content in Electronic Word of Mouth Communication: An Analytics Approach'
    },
    {
      name: 'Abhishek Shinde',
      affiliation: 'OM Group, IIM Calcutta',
      thesis: 'Stochastic Inventory Decisions Under Ambiguity: An Experimental Study'
    },
    {
      name: 'Sourav Saha',
      affiliation: 'MIS Group, IIM Calcutta',
      thesis: 'Heuristically guided Recommender Systems in Social Media using a Cloud Computing Platform and application to Computational Advertising'
    },
    {
      name: 'Sourav Basu',
      affiliation: 'OM Group, IIM Calcutta',
      thesis: 'On optimal location of inter-modal terminals'
    },
    {
      name: 'Rahul Thakurta',
      affiliation: 'MIS Group, IIM Calcutta',
      thesis: 'A Study on the Dynamics of Software Requirement Volatility, and Strategies for its Management'
    }
  ];

  const recentDissertations = [
    {
      institution: 'Indian Maritime University',
      thesis: 'A critical evaluation of Multimodal Freight Transportation in India – A case study based approach'
    },
    {
      institution: 'IIM Bangalore',
      thesis: 'Improving the Solvability of Combinatorial Optimization Problems'
    },
    {
      institution: 'IIT Bombay',
      thesis: 'Routing and Scheduling of Trains in a Railway Network'
    },
    {
      institution: 'IIT Madras',
      thesis: 'Coordinating raw material discounts in a Global supply chain for deteriorating items under price dependent demand'
    },
    {
      institution: 'IIT Madras',
      thesis: 'Capacity Reservation and Multi-Period Order Lot Sizing Under Dynamic Demand Conditions for Supplier Selection'
    },
    {
      institution: 'IIT Madras',
      thesis: 'Modeling Capacitated Lot-Sizing Problem with Setup Carryover and Setup Splitting'
    },
    {
      institution: 'NIT Agartala',
      thesis: 'Study on forward and reverse green supply chain management in different environment'
    },
    {
      institution: 'IIM Calcutta',
      thesis: 'Efficiency Measurement of Higher Education Sector in India: Evaluation with DEA'
    },
    {
      institution: 'IIM Bangalore',
      thesis: 'Workforce planning for professional service projects: a branch-and-cut approach'
    },
    {
      institution: 'IIM Calcutta',
      thesis: 'DEA models & methods for efficiency improvement under constant sum of inputs/outputs'
    }
  ];

  const corporatePrograms = [
    'Joint Program Director for Management Development Program on Advanced Supply Chain Management',
    'Joint Program Director for Management Development Program on Project Management for Officers of Directorate General of Lighthouses and Lightships (Ministry of Ports, Shipping & Waterways)',
    'Joint Program Director for Executive General Management Program for Executives of Accenture',
    'Joint Program Director for Management Development Program on Financial Decision Making for West Bengal Revenue Service & West Bengal Audit & Accounts Service Officers',
    'Joint Program Director for Management Development Program on Lean Management',
    'Joint Program Director for Management Development Program on Quality Analytics',
    'Joint Program Director for Management Development Program on Theory of Constraints & Lean Management',
    'Joint Program Director for Executive General Management Program for Executives of AstraZeneca',
    'Program Director for Advanced Project Management for Scientists of Defence Research and Development Organization (Ministry of Defence)',
    'Joint Program Director for Executive General Management Program for Executives of Nestle',
    'Joint Program Director for General Management Program for Executives of Delhi Metro Rail Corporation',
    'Program Director for Ministry of Heavy Industries & Public Enterprises (Department of Public Enterprises) sponsored training program on Project Management for Senior Executives of State Level Public Enterprises',
    'Joint Program Director for NIIT Imperia Executive Program in Advanced Supply Chain Management',
    'Program Director for Project Management Institute and Ministry of Statistics and Program Implementation sponsored Project Management Across Borders for Central Public Sector Enterprise Officers',
    'Joint Program Director for Management Development Program in Project Management',
    'Joint Program Director for Railway Board sponsored Executive General Management Program for Indian Railway Service Probationer Officers',
    'Joint Program Director for Department for North Eastern Region sponsored Management Development Program on Customer Orientation in Public Services',
    'Joint Program Director for Pradhan Mantri Gram Sadak Yojana (PMGSY) sponsored Management Development Program for Executives on Maintenance Management'
  ];

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

  const allPublications = useMemo(() => {
    const firestorePubs = researchData?.featured_publications || [];
    const hardcodedPubs = featuredPublications;
    const combined = [...firestorePubs, ...hardcodedPubs];
    const unique = Array.from(new Set(combined.map(p => p.id))).map(id => combined.find(p => p.id === id));
    return unique.filter(p => p.title.toLowerCase().includes(pubSearch.toLowerCase()));
  }, [researchData, pubSearch]);

  const allProjects = useMemo(() => {
    const firestoreProjects = researchData?.research_projects || [];
    const hardcodedProjects = researchProjects;
    const combined = [...firestoreProjects, ...hardcodedProjects];
    return Array.from(new Set(combined.map(p => p.id))).map(id => combined.find(p => p.id === id));
  }, [researchData]);

  if (loading) {
    return (
      <div className="bg-[#F7F4EE]">
        <div className="flex items-center justify-center h-screen">
          <div className="text-4xl font-bold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F4EE]">
      {/* Hero Section */}
      <section className="bg-[#1E2A38] py-20 px-4 sm:px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-xs font-['Inter'] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-4">
              Prof. Bodhibrata Nag
            </p>
            <h1 className="text-4xl sm:text-6xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-white mb-6">
              <EditableText
                collection="content"
                docId="research"
                field="page_heading"
                defaultValue={researchData?.page_heading || "Research"}
                className="text-4xl sm:text-6xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-white"
              />
            </h1>
            <div className="w-20 h-1 bg-white rounded-full mb-6" />
            <p className="text-base sm:text-lg font-['Inter'] text-gray-300 max-w-3xl leading-relaxed">
              <EditableText
                collection="content"
                docId="research"
                field="page_description"
                defaultValue={researchData?.page_description || "Advancing knowledge in leadership, organizational behavior, and human resource management"}
                className="text-base sm:text-lg font-['Inter'] text-gray-300"
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
              className="inline-flex items-center gap-2 bg-[#1E2A38] hover:bg-[#2d3f54] text-white px-6 py-3 rounded-lg font-['Inter'] font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <FiExternalLink /> Google Scholar Citations
            </a>
            <a 
              href="https://www.researchgate.net/profile/YOUR_PROFILE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#5B6472] hover:bg-[#1E2A38] text-white px-6 py-3 rounded-lg font-['Inter'] font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <FiExternalLink /> ResearchGate Profile
            </a>
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="py-16 px-6 lg:px-16 bg-[#F7F4EE]">
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
                <h2 className="text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] mb-4">
                  Featured Peer-reviewed Publications
                </h2>
                <div className="w-24 h-1 bg-[#B9975B] rounded-full"></div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowAddPub(true)}
                  className="flex items-center gap-2 bg-[#1E2A38] hover:bg-[#2d3f54] text-white px-4 py-2 rounded-lg font-semibold transition-all"
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
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E2A38] text-sm"
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
            <div className="mb-6 p-6 bg-white rounded-xl border-2 border-[#D9D6CF] shadow-lg">
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
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#B9975B] border border-[#D9D6CF] relative group"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingPub(pub)}
                      className="p-2 bg-[#1E2A38] hover:bg-[#2d3f54] text-white rounded-lg"
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
                  <span className="font-semibold text-[#1E2A38]">{pub.authors}</span> ({pub.year}). {pub.title}
                </p>
                <p className="font-['Inter'] text-gray-600 italic mb-2">{pub.journal}</p>
                {pub.doi && (
                  <a 
                    href={pub.doi} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#B9975B] hover:text-[#1E2A38] font-['Inter'] text-sm inline-flex items-center gap-1"
                  >
                    <FiExternalLink size={14} /> View Publication
                  </a>
                )}
              </motion.div>
            ))}

            {editingPub && isAdmin && (
              <div className="mt-6 p-6 bg-white rounded-xl border-2 border-[#D9D6CF] shadow-lg">
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

        {/* Recent PhD Scholars Guided */}
      <section className="py-16 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={fadeInUp}
            className="mb-8 text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] mb-4">
              Recent PhD Scholars Guided
            </h2>
            <div className="w-24 h-1 bg-[#B9975B] rounded-full mx-auto mb-6"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentPhdScholars.map((s, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
                variants={fadeInUp}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-[#1E2A38]"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#1E2A38] rounded-full flex items-center justify-center">
                    <FiUsers className="text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-[#1E2A38]">{s.name}</div>
                    <div className="text-sm text-gray-600">{s.affiliation}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 italic"><span className="font-semibold">Thesis:</span> {s.thesis}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Projects Section */}
      {/* Recent PhD Dissertations Examined */}
      <section className="py-16 px-6 lg:px-16 bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={fadeInUp}
            className="mb-8"
          >
            <h2 className="text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] mb-4">Recent PhD Dissertations Examined</h2>
            <div className="w-24 h-1 bg-[#B9975B] rounded-full mb-6"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentDissertations.map((d, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={viewportOptions} variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#B9975B]">
                <div className="text-lg font-semibold text-[#1E2A38] mb-1">{d.institution}</div>
                <div className="text-sm text-gray-700 italic">{d.thesis}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Corporate Training Programs Directed at IIM Calcutta */}
      <section className="py-16 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOptions} variants={fadeInUp} className="mb-8">
            <h2 className="text-4xl lg:text-5xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] mb-4">Recent Corporate Training Programs Directed at IIM Calcutta</h2>
            <div className="w-24 h-1 bg-[#B9975B] rounded-full mb-6"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {corporatePrograms.map((p, i) => (
                <li key={i} className="text-sm">{p}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <motion.section 
        className="py-20 px-4 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1E2A38] mb-4">Research Projects</h2>
          <div className="h-1 w-24 bg-[#D5A135] mb-12"></div>
          
          <div className="space-y-8">
            {allProjects.map((project, index) => (
              <motion.div 
                key={project.id || index}
                className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-gray-50"
                variants={fadeInUp}
              >
                <h3 className="text-xl font-semibold text-[#1E2A38] mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-1"><span className="font-semibold">Funding Agency:</span> {project.fundingAgency}</p>
                <p className="text-gray-600 mb-1"><span className="font-semibold">Role:</span> {project.role}</p>
                <p className="text-gray-600 mb-1"><span className="font-semibold">Amount:</span> ₹{project.amount.toLocaleString('en-IN')}</p>
                <p className="text-gray-500 text-sm"><span className="font-semibold">Period:</span> {project.period}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2A38]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Year</label>
        <input
          type="text"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2A38]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">Title</label>
        <textarea
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2A38]"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2A38]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">DOI/Link (optional)</label>
        <input
          type="url"
          value={formData.doi}
          onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E2A38]"
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
          className="px-6 py-2 bg-[#1E2A38] hover:bg-[#2d3f54] text-white rounded-lg font-semibold transition-colors"
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
          className="px-4 py-2 bg-[#1E2A38] hover:bg-[#2d3f54] text-white rounded-lg text-sm font-semibold"
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
