/**
 * Seed script for Prof. Bodhibrata Nag's website data
 * Run from the Frontend folder: node src/scripts/seedNagData.js
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAm5OW08cPCt-pPNioqQOOhbvumy0wATVY",
  authDomain: "iim-c-a4d73.firebaseapp.com",
  projectId: "iim-c-a4d73",
  storageBucket: "iim-c-a4d73.firebasestorage.app",
  messagingSenderId: "463874064270",
  appId: "1:463874064270:web:b01d62e07a959745326edf",
  measurementId: "G-KGG0MJ7B98"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedData = async () => {
  try {
    console.log("Seeding Firestore for Prof. Bodhibrata Nag...");

    await setDoc(doc(db, "siteConfig", "main"), {
      siteTitle: "Bodhibrata Nag",
      siteSubtitle: "Professor of Operations Management, IIM Calcutta",
      institution: "Indian Institute of Management Calcutta",
      theme: "academic",
      isPublished: true
    });
    console.log("✓ siteConfig/main");

    await setDoc(doc(db, "content", "home"), {
      hero_greeting: "PROFESSOR • RESEARCHER • AUTHOR",
      hero_title: "Prof. Bodhibrata Nag",
      hero_name: "Professor of Operations Management",
      hero_subtitle: "IIM Calcutta Professor. Researcher. Author.",
      hero_description: "Professor Bodhibrata Nag is a distinguished academic with extensive experience in operations management, transportation, energy systems, sustainable supply chains, and cybersecurity at IIM Calcutta.",
      hero_credential1: "Professor, IIM Calcutta",
      hero_credential2: "PhD, IIM Calcutta | B.Tech, IIT Madras",
      hero_linkedin: "https://www.linkedin.com/in/bodhibrata-nag/",
      hero_address: "Indian Institute of Management Calcutta, Kolkata",
      hero_phone: "91-33-24678300 Ext 752",
      courses_heading: "Management Courses",
      course1_title: "Business Applications of Operations Research",
      course1_description: "Master analytical and optimization techniques to solve complex business and public-sector decision problems.",
      course1_youtube: "",
      course2_title: "Operations & Supply Chain Management",
      course2_description: "Develop expertise in designing and managing resilient, sustainable supply chains and operational systems.",
      course2_youtube: "",
      blog_heading: "Recent Blogs",
      blog1_title: "Systemic Cyber Risk — the growing threat to global supply chains",
      blog1_excerpt: "How interconnected digital infrastructure amplifies cyber vulnerabilities across global supply networks.",
      blog1_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
      blog2_title: "Synthetic Data — The new backbone of next gen cybersecurity",
      blog2_excerpt: "Exploring how synthetic data is reshaping threat modelling and AI-driven security frameworks.",
      blog2_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
      blog3_title: "Cyber Risk in the Boardroom — Why Judgment Matters More Than Numbers",
      blog3_excerpt: "A framework for executives to reason about cyber risk beyond metrics and dashboards.",
      blog3_image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
      books_heading: "Published Books",
      book1_title: "Business Applications of Operations Research",
      book1_description: "A comprehensive guide to applying OR techniques to real-world business and management problems.",
      book1_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      book2_title: "Optimal Design of Timetables for Large Railways",
      book2_description: "Research-based framework for large-scale railway timetable optimization.",
      book2_image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      book3_title: "Introduction to Operations Research (Indian Edition)",
      book3_description: "Co-authored special Indian edition of the foundational operations research textbook.",
      book3_image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
      speaking_heading: "Speaking Engagements with Prof. Nag",
      speaking_description: "Prof. Nag delivers keynotes, executive workshops, and thought-provoking talks at leading organizations, government bodies, conferences, and academic events worldwide.",
      newsletter_heading: "Wisdom delivered to your inbox.",
      newsletter_description: "Stay updated on the latest research in operations management, supply chain resilience, cyber risk, and sustainable systems. Sign up for insights and thought leadership from Prof. Nag."
    });
    console.log("✓ content/home");

    await setDoc(doc(db, "content", "about"), {
      pageTitle: "About",
      hero_mainHeading: "Prof. Bodhibrata Nag",
      hero_subtitle: "Professor of Operations Management, IIM Calcutta",
      hero_description: "Professor Bodhibrata Nag serves at the Indian Institute of Management Calcutta. His work spans operations research, transportation, energy, logistics, and cybersecurity—backed by decades of academic leadership and public-sector experience.",
      journey_heading: "About Prof. Bodhibrata Nag",
      journey_para1: "Professor Bodhibrata Nag is a Professor in the Operations Management Group at IIM Calcutta. He holds a Fellow (PhD) degree from IIM Calcutta (2003) in Operations Research and Systems Analysis, and a B.Tech in Electrical Engineering from IIT Madras (1983).",
      journey_para2: "Before joining academia, he served in senior roles at the Research Design and Standards Organisation (RDSO) under the Ministry of Railways, the Indian Railway Institute of Electrical Engineering, the South Eastern Railway, and the Central Electricity Authority under the Ministry of Power.",
      journey_para3: "At IIM Calcutta, he has served as Acting Director, Dean Academic, Provost, Chairperson of Doctoral Programs, Director of IIM Calcutta Innovation Park, and Founder Coordinator of the PGPEX-VLM Programme.",
      linkedin_url: "https://www.linkedin.com/in/bodhibrata-nag/"
    });
    console.log("✓ content/about");

    await setDoc(doc(db, "content", "navbar"), {
      professorName: "PROF. BODHIBRATA NAG",
      subtitle: "IIM Calcutta"
    });
    console.log("✓ content/navbar");

    await setDoc(doc(db, "content", "research"), {
      pageTitle: "Research",
      google_scholar_url: "https://scholar.google.com/",
      page_subtitle: "Applying analytical, simulation, and optimization techniques to real-world systems and policy challenges."
    });
    console.log("✓ content/research");

    await setDoc(doc(db, "content", "courses"), {
      pageTitle: "Courses",
      page_subtitle: "By Prof. Bodhibrata Nag",
      institution: "IIM Calcutta"
    });
    console.log("✓ content/courses");

    await setDoc(doc(db, "content", "trainings"), {
      pageTitle: "Executive Training",
      page_subtitle: "By Prof. Bodhibrata Nag",
      institution: "IIM Calcutta"
    });
    console.log("✓ content/trainings");

    await setDoc(doc(db, "content", "contact"), {
      email: "bnag@iimcal.ac.in",
      phone: "91-33-24678300 to 06, Ext 752",
      institution: "Indian Institute of Management Calcutta",
      address: "Kolkata, West Bengal, India",
      contactText: "For academic collaboration, invited talks, executive education, consulting, and research-related communication, please connect through institutional channels."
    });
    console.log("✓ content/contact");

    console.log("\n✅ Firestore seeded successfully for Prof. Bodhibrata Nag!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    process.exit(1);
  }
};

seedData();
