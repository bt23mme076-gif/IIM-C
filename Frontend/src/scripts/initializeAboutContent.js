import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const aboutContent = {
  // Hero Section with nested structure
  hero: {
    mainHeading: "Creating Happy Leaders",
    subtitle: "Professor of Organizational Behavior at IIM Ahmedabad.",
    description: "Researcher, Author, and Leadership Coach bridging engineering precision with behavioral science.",
    profileImage: "https://i.ibb.co/WvvwbZBt/prof-gupta-jpg.png",
    linkedinUrl: "https://www.linkedin.com/in/gvishal/"
  },
  
  // Journey/Biography Section with nested structure
  journey: {
    heading: "Bridging Engineering and Behavior",
    paragraph1: "I obtained my doctorate in Human Resource Management from the Indian Institute of Management Lucknow in 2013. I hold a Bachelor's degree in Electrical and Electronics Engineering from BITS-Pilani, Pilani Campus, India.",
    paragraph2: "Prior to joining IIMA, I worked as a Hardware Design Engineer with ST Microelectronics Pvt Ltd., Greater Noida and with Infineon Technologies AG, Munich, Germany where I was involved in the design of high-performance Application-Specific Integrated Circuits (ASICs).",
    paragraph3: "This unique blend of technical precision and behavioral insight fuels my research in leadership development, mindfulness, emotional intelligence, organization development, and R&D management."
  },
  
  // Awards
  awards: [
    "Outstanding Doctoral Dissertation Award - EFMD/Emerald (2013-14)",
    "Young Scientist Award - National Academy of Sciences India & Scopus (2016)",
    "India's 25 Young HR Leaders - People Matters (2013)",
    "Emerging Psychologist - National Academy of Psychology India (2014)"
  ],
  
  // Books
  books: [
    {
      id: 1,
      title: "First Among Equals",
      subtitle: "T-R-E-A-T Leadership for L-E-A-P in a Knowledge-based World",
      publisher: "Published by Bloomsbury India (2020)"
    },
    {
      id: 2,
      title: "Demystifying Leadership",
      subtitle: "Unveiling the Mahabharata Code",
      publisher: "Published by Bloomsbury India (2021)"
    }
  ],
  
  // Work Experience
  work_experience: [
    {
      id: 1,
      period: "September 2022 – Present",
      role: "Professor in Organizational Behavior Area",
      organization: "Indian Institute of Management Ahmedabad"
    },
    {
      id: 2,
      period: "May 2016 – August 2022",
      role: "Associate Professor in Organizational Behavior Area",
      organization: "Indian Institute of Management Ahmedabad"
    },
    {
      id: 3,
      period: "March 2013 – May 2016",
      role: "Assistant Professor in Organizational Behavior Area",
      organization: "Indian Institute of Management Ahmedabad"
    },
    {
      id: 4,
      period: "July 2012 – February 2013",
      role: "Assistant Professor in HRM Group",
      organization: "Indian Institute of Management Calcutta"
    },
    {
      id: 5,
      period: "September 2005 – June 2008",
      role: "VLSI Design Engineer in Hardware Design Group",
      organization: "ST Microelectronics Pvt Ltd, Noida"
    },
    {
      id: 6,
      period: "January 2005 – June 2005",
      role: "Student Intern in Wireline Group",
      organization: "Infineon Technologies AG, Munich, Germany"
    }
  ],
  
  // Board Positions
  board_positions: [
    {
      id: 1,
      role: "Independent Director - Gujarat Industries Power Company Limited (GIPCL)",
      period: "Present",
      active: true
    },
    {
      id: 2,
      role: "Independent Director - Gujarat Gas Limited",
      period: "August 2017 - August 2021",
      active: false
    },
    {
      id: 3,
      role: "Board of Governors Member - IIM Ahmedabad",
      period: "December 2020 - February 2022",
      active: false
    }
  ],
  
  // Media Coverage
  media_outlets: ['Times of India', 'Economic Times', 'Business Line', 'Ahmedabad Mirror', 'Mint', 'DNA'],
  media_description: "My research has been published in prestigious international journals and featured in major media outlets:"
};

async function initializeAboutContent() {
  try {
    console.log('Initializing About page content...');
    await setDoc(doc(db, 'content', 'about'), aboutContent);
    console.log('About content successfully initialized!');
    return { success: true, message: 'About content initialized' };
  } catch (error) {
    console.error('Error initializing About content:', error);
    return { success: false, error: error.message };
  }
}

// If running directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeAboutContent().then(result => {
    console.log(result);
    process.exit(result.success ? 0 : 1);
  });
}

export { initializeAboutContent, aboutContent };
