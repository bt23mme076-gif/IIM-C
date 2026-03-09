/**
 * Firebase Firestore Initialization Script
 * Run this ONCE to create the initial content/home document in Firestore
 * 
 * To run: node src/scripts/initializeFirestore.js
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';

const initialData = {
  // Hero Section
  hero_greeting: "Hey there! Meet",
  hero_name: "Prof. Vishal Gupta",
  hero_subtitle: "IIM Ahmedabad Professor. Researcher. Thought Leader.",
  hero_description: "Leading expert in strategic management and organizational behavior. Prof. Gupta's research and teaching focus on helping leaders and organizations navigate complexity and drive sustainable growth.",
  
  // Courses Section
  courses_heading: "Management Courses",
  course1_title: "The Science of Leadership",
  course1_description: "Master the art and science of leading high-performing teams in complex organizational environments.",
  course2_title: "Strategy for Executives",
  course2_description: "Develop strategic thinking capabilities to drive innovation and competitive advantage in dynamic markets.",
  
  // Blog Section
  blog_heading: "Recent Reflections",
  blog1_title: "The Future of Strategic Leadership in Digital Age",
  blog1_excerpt: "Exploring how leaders can navigate uncertainty and drive transformation in rapidly evolving business landscapes.",
  blog2_title: "Building Resilient Organizations Through Adaptive Strategy",
  blog2_excerpt: "Key insights on developing organizational capabilities that enable sustainable competitive advantage.",
  blog3_title: "The Psychology of Decision-Making in Executive Teams",
  blog3_excerpt: "Understanding cognitive biases and behavioral patterns that shape strategic choices at the highest level.",
  
  // Testimonial Section
  testimonial_quote: "We're not doing our jobs educationally if 60% of students are overwhelmingly anxious",
  testimonial_author: "— Prof. Vishal Gupta, IIM Ahmedabad",
  
  // Books Section
  books_heading: "Published Works",
  book1_title: "Leading Through Complexity",
  book1_description: "A comprehensive guide to navigating uncertainty and driving organizational change.",
  book2_title: "The Strategic Mindset",
  book2_description: "Developing the cognitive capabilities required for effective strategic leadership.",
  book3_title: "Organizational Behavior in Practice",
  book3_description: "Real-world applications of behavioral science in modern organizations.",
  
  // Speaking Section
  speaking_heading: "Speaking Engagements with Prof. Gupta",
  speaking_description: "Prof. Gupta delivers keynotes, executive workshops, and thought-provoking talks at leading organizations, conferences, and academic events around the world.",
  
  // Newsletter Section
  newsletter_heading: "Wisdom delivered to your inbox.",
  newsletter_description: "Don't miss out on new insights on leadership, strategy, and organizational excellence. Sign up for the latest research findings, course updates, and thought-provoking ideas.",
  
  // Metadata
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString()
};

async function initializeFirestore() {
  try {
    console.log('🔥 Initializing Firestore with default content...');
    
    const docRef = doc(db, 'content', 'home');
    await setDoc(docRef, initialData);
    
    console.log('✅ Success! Firestore initialized with content/home document');
    console.log('📝 You can now edit this content from the admin panel');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
    process.exit(1);
  }
}

initializeFirestore();
