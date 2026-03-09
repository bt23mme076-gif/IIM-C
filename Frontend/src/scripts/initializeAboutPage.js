import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Initialize About Page Content in Firestore
 * This script sets up the initial data structure for the About page
 */
export async function initializeAboutPage() {
  const aboutData = {
    hero: {
      mainHeading: "Creating Happy Leaders",
      subtitle: "Professor of Organizational Behavior at IIM Ahmedabad.",
      description: "Researcher, Author, and Leadership Coach bridging engineering precision with behavioral science.",
      linkedinUrl: "https://www.linkedin.com/in/gvishal/",
      profileImage: "https://i.ibb.co/WvvwbZBt/prof-gupta-jpg.png"
    },
    journey: {
      heading: "Bridging Engineering and Behavior",
      paragraph1: "I obtained my doctorate in Human Resource Management from the Indian Institute of Management Lucknow in 2013. I hold a Bachelor's degree in Electrical and Electronics Engineering from BITS-Pilani, Pilani Campus, India.",
      paragraph2: "Prior to joining IIMA, I worked as a Hardware Design Engineer with ST Microelectronics Pvt Ltd., Greater Noida and with Infineon Technologies AG, Munich, Germany where I was involved in the design of high-performance Application-Specific Integrated Circuits (ASICs).",
      paragraph3: "This unique blend of technical precision and behavioral insight fuels my research in leadership development, mindfulness, emotional intelligence, organization development, and R&D management."
    }
  };

  try {
    const docRef = doc(db, 'content', 'about');
    await setDoc(docRef, aboutData, { merge: true });
    console.log('✅ About page content initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error initializing About page:', error);
    return { success: false, error };
  }
}

// Run this in browser console: import('./src/scripts/initializeAboutPage.js').then(m => m.initializeAboutPage())
