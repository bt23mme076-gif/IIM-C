import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const researchContent = {
  // Page header
  page_heading: "Research & Publications",
  page_description: "Explore my academic contributions spanning leadership, organizational behavior, and management research.",
  
  // Featured Publications
  featured_publications: [
    {
      id: 1,
      authors: "Kuril, S., Gupta, V., Kakkar, S., & Gupta, R.",
      year: "2025",
      title: "Public Sector Motivation: Construct Definition, Measurement, and Validation.",
      journal: "Public Administration Quarterly, 0(0).",
      doi: "https://doi.org/10.1177/07349149251359153"
    },
    {
      id: 2,
      authors: "Gupta, V., Makhecha, U. P., & Shaik, F. H.",
      year: "2021",
      title: "Era of Disruption: Opportunities and Challenges for Businesses in India.",
      journal: "Business Perspectives and Research, 9(2), 192-194.",
      doi: "https://journals.sagepub.com/doi/full/10.1177/2278533721989828"
    },
    {
      id: 3,
      authors: "Chattopadhyay, P, George, E., Li, J. & Gupta, V.",
      year: "2020",
      title: "Geographical dissimilarity and team member influence: Do emotions experienced in the initial team meeting matter?",
      journal: "Academy of Management Journal, 63(6), 1807-1839.",
      doi: "https://journals.aom.org/doi/10.5465/amj.2017.0744"
    }
  ],
  
  // Book Chapters
  book_chapters: [
    {
      id: 1,
      authors: "Gupta, V. and Basant, A.",
      year: "2025",
      title: "HEAL: Defining a new POB construct.",
      book: "In C. L. Cooper, S. Pattnaik & R. V. Rodriguez (Eds.) Advancing Positive Organizational Behaviour. Routledge.",
      doi: ""
    },
    {
      id: 2,
      authors: "Gupta, V.",
      year: "2023",
      title: "TREAT Leadership Framework: A Knowledge-Based Theory of the Global Firm.",
      book: "In A. Akande (Ed.). Springer Handbook on Globalization, Politics in Organizations, Human Rights, and Populism: Reimagining People, Power, and Places. Springer.",
      doi: "https://link.springer.com/chapter/10.1007/978-3-031-17203-8_28"
    }
  ],
  
  // Cases
  cases: [
    {
      id: 1,
      title: "Tata vs Mistry: Struggle for Succession and Governance",
      code: "IIMA/0246 - A, B, C, D",
      link: "https://cases.iima.ac.in/index.php/tata-vs-mistry-a-struggle-for-succession-and-governance.html"
    },
    {
      id: 2,
      title: "VIKAS and SAVE: Combining cause with commerce",
      code: "IIMA/OB0239",
      link: "https://cases.iima.ac.in/index.php/vikas-and-save-combining-cause-with-commerce.html"
    }
  ],
  
  // Technical Notes
  technical_notes: [
    {
      id: 1,
      title: "A Note on Decision-Making",
      code: "IIMA/OB0232TEC",
      link: "https://cases.iima.ac.in/index.php/performance-management-at-ird-corporation-a.html"
    },
    {
      id: 2,
      title: "Understanding the Design of Organizations",
      code: "IIMA/OB0226TEC",
      link: "https://cases.iima.ac.in/index.php/new-age-organisations-managing-matrix-structures.html"
    }
  ],
  
  // Special Issues
  special_issues: [
    {
      id: 1,
      title: "IIMB Management Review Special Issue",
      description: "Based on the Seventh Indian Academy of Management (INDAM) conference",
      link: "https://www.sciencedirect.com/journal/iimb-management-review"
    },
    {
      id: 2,
      title: "Business Perspectives and Research Special Issue",
      description: "Based on the Sixth INDAM conference",
      link: "https://journals.sagepub.com/toc/bpra/9/2"
    }
  ],
  
  // PhD Students
  phd_students_chairperson: [
    {
      id: 1,
      name: "Ananya Syal (IIMA)",
      position: "Assistant Professor, IIM Amritsar"
    },
    {
      id: 2,
      name: "Vedant Dev (IIMA)",
      position: "Faculty, Ahmedabad University"
    },
    {
      id: 3,
      name: "Lokesh Malviya",
      position: "ABD (IIMA, OB area)"
    }
  ],
  
  phd_students_member: [
    {
      id: 1,
      name: "Bhumi Trivedi (HRM, IIMA)",
      position: ""
    },
    {
      id: 2,
      name: "Furkan Khan (RJMCEI, IIMA)",
      position: ""
    }
  ]
};

async function initializeResearchContent() {
  try {
    console.log('Initializing Research page content...');
    await setDoc(doc(db, 'content', 'research'), researchContent);
    console.log('Research content successfully initialized!');
    return { success: true, message: 'Research content initialized' };
  } catch (error) {
    console.error('Error initializing Research content:', error);
    return { success: false, error: error.message };
  }
}

// If running directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeResearchContent().then(result => {
    console.log(result);
    process.exit(result.success ? 0 : 1);
  });
}

export { initializeResearchContent, researchContent };
