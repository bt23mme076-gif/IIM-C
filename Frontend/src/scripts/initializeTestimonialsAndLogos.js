import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase configuration (from your config.js)
const firebaseConfig = {
  apiKey: "AIzaSyDy7NdXZlZAzzK6Ul-Wcc6MLVrI_fAohPg",
  authDomain: "iimaprofvishalgupta.firebaseapp.com",
  projectId: "iimaprofvishalgupta",
  storageBucket: "iimaprofvishalgupta.firebasestorage.app",
  messagingSenderId: "903056085098",
  appId: "1:903056085098:web:80e7b2aa0e4a7aafd8c63e",
  measurementId: "G-WLGZKT6V8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testimonials = [
  {
    quote: "I have to admit that I wasn't sure what would be involved with your course, but I consider myself very blessed to have been a part of it. The historical aspect of Mahabharata was fascinating by itself, and I enjoyed the way you incorporated the epic with current leadership practices. Thank you very much for this unique opportunity!",
    author: "Colene Sassmann",
    role: "Class Participant 2023, MBA course",
    organization: "University of Northern Iowa",
    order: 0,
    published: true
  },
  {
    quote: "Prof. Vishal, observing you from the sidelines, I learnt many things. Chief amongst them, your dhairya, humility and a steadfast bold vision. Your course and its reflections on the ego & self as a leader made a deep impression, reminded me of my MBA at Berkeley and our leadership principles. Specifically, 'Confidence Without Attitude'.",
    author: "Rupal Nayar",
    role: "Director of Industry & University Partnerships, APAC",
    organization: "Coursera",
    order: 1,
    published: true
  },
  {
    quote: "We thank you for conducting the session for the Principals of Delhi Public Schools. The session was rewarding and much appreciated by the participants of the programme.",
    author: "Vanita Sehgal",
    role: "Executive Director, HRDC",
    organization: "DPSS",
    order: 2,
    published: true
  },
  {
    quote: "Thank you for such wonderful mentor/coach/guide/teacher. I am really feeling happy to be your student. The way you put up the topic is so interesting, I am loving it.",
    author: "Vijay Vyas",
    role: "Group Head, HR",
    organization: "Rushil Decor Limited",
    order: 3,
    published: true
  },
  {
    quote: "From the theory sessions, to the exercises, to the PLPS, and to the final examination, your course design was great and above all this, your teaching style with the conviction in the subject was exemplary. Right from the word go, I found myself deeply attached to this course, and it was only because of your teaching. Many thanks Sir!",
    author: "Akshay Jain",
    role: "PGPX participant of 2018-19 batch",
    organization: "IIM Ahmedabad",
    order: 4,
    published: true
  },
  {
    quote: "Your classes were a real value addition in FDP course. Thank you for teaching us so patiently. Besides, Multivariate and R, I also learn't how to teach systematically to make students understand in a much better way. You made a complicated course quite easy for us.",
    author: "Irfana Rashid",
    role: "FDP 2017 Participant",
    organization: "IIM Ahmedabad",
    order: 5,
    published: true
  },
  {
    quote: "Just wanted to thank you for the lecture today. It was, probably, the most important lecture that I ever attended.",
    author: "Kaustubh Korde",
    role: "PGPX 2018 Participant",
    organization: "IIM Ahmedabad",
    order: 6,
    published: true
  },
  {
    quote: "I pay my humble gratitude to you for all that I learned from you while at IIM Ahmedabad. Your depth in the subject and classroom delivery is unparallel. I feel lucky to be a part of your classroom. Apart from your teaching, which is notwithstanding class apart, you are also a very humble human being which has to be reckoned with.",
    author: "Abhigyan Bhattacharjee",
    role: "FDP 2018 Participant",
    organization: "IIM Ahmedabad",
    order: 7,
    published: true
  },
  {
    quote: "In this December 2025 I joined the Leadership Skills course on Coursera, it has helped me a lot to channel my emotions as a 20 year old. After watching the lessons I have gained a lot of clarity and rationality. I really look forward to you as my Guru Dronacharya in the Kurukshetra of my life. Thank You Sir for giving directions to my dreams and aspirations.",
    author: "Bhumika Patnaik",
    role: "Leadership Skills course student",
    organization: "",
    order: 8,
    published: true
  },
  {
    quote: "It was a pleasure attending the classes that you taught. The amount of energy you bring into the class and also the smile that is always present while teaching makes the sessions special. Some of the statements that you said were like a reset button, an epiphany, that made many to reconsider their actions.",
    author: "Nimish Lalwani",
    role: "PGP (MBA) Student",
    organization: "IIM Ahmedabad",
    order: 9,
    published: true
  },
  {
    quote: "Today's session was one of the best session I have experienced since I have joined IIM Ahmedabad. There have been very few instances in my life where I have been overwhelmed by the emotions so much that they had permanently changed my perception of life in a positive sense. This was one of it. These are the moments, not the salary or networking, that make you feel happy and satisfied about the decision of coming to IIM Ahmedabad and motivates you to become a better version of yourself.",
    author: "Harsh Dewra",
    role: "PGP (MBA) Student",
    organization: "IIM Ahmedabad",
    order: 10,
    published: true
  },
  {
    quote: "Prof. Vishal is a true teacher because of traits like kind, humble, patient with knowledge at par...glad to be a part of such a well organized FDP.",
    author: "Dr. Rajanibala J. Shah",
    role: "Faculty",
    organization: "L J Institute of Management Studies",
    order: 11,
    published: true
  },
  {
    quote: "My most sincere gratitude to Prof Vishal Gupta for sparing time and selflessly sharing his vast knowledge for the benefit of young faculty and researchers!",
    author: "Kanika Khurana",
    role: "Faculty",
    organization: "University of Mumbai",
    order: 12,
    published: true
  }
];

const trainingPartners = [
  {
    name: "IIM Ahmedabad",
    logoUrl: "/prof-gupta.jpg", // Replace with actual IIM logo if available
    order: 0,
    published: true
  },
  {
    name: "Ambuja Cements",
    logoUrl: "/Ambuja_Cements.svg.png",
    order: 1,
    published: true
  },
  {
    name: "BPCL",
    logoUrl: "/bpcl.jpg",
    order: 2,
    published: true
  },
  {
    name: "Defence Research and Development Organisation",
    logoUrl: "/Defence_Research_and_Development_Organisation.svg.png",
    order: 3,
    published: true
  },
  {
    name: "Hindalco",
    logoUrl: "/Hindalco_Logo.svg.png",
    order: 4,
    published: true
  },
  {
    name: "Hindustan Petroleum",
    logoUrl: "/Hindustan_Petroleum_Logo.svg",
    order: 5,
    published: true
  },
  {
    name: "Honeywell",
    logoUrl: "/Honeywell_logo.svg.png",
    order: 6,
    published: true
  },
  {
    name: "Indian Administrative Service",
    logoUrl: "/ias.jpg",
    order: 7,
    published: true
  },
  {
    name: "Indian Police Service",
    logoUrl: "/Indian_police_service_logo.jpeg",
    order: 8,
    published: true
  },
  {
    name: "Indian Revenue Service",
    logoUrl: "/Indian_Revenue_Service_Logo.png",
    order: 9,
    published: true
  },
  {
    name: "ISRO",
    logoUrl: "/Indian_Space_Research_Organisation_Logo.svg.png",
    order: 10,
    published: true
  },
  {
    name: "JLL",
    logoUrl: "/JLL_logo.svg.png",
    order: 11,
    published: true
  },
  {
    name: "Larsen & Toubro",
    logoUrl: "/Larsen&Toubro_logo.svg.png",
    order: 12,
    published: true
  },
  {
    name: "NHPC",
    logoUrl: "/NHPC_official_logo.svg.png",
    order: 13,
    published: true
  },
  {
    name: "Novartis",
    logoUrl: "/Novartis-Logo.svg.png",
    order: 14,
    published: true
  },
  {
    name: "Primarc",
    logoUrl: "/primarc.png",
    order: 15,
    published: true
  }
];

async function initializeTestimonialsAndLogos() {
  try {
    console.log('Initializing testimonials...');
    
    // Add testimonials
    for (const testimonial of testimonials) {
      await addDoc(collection(db, 'testimonials'), testimonial);
      console.log(`Added testimonial from ${testimonial.author}`);
    }
    
    console.log('\nInitializing training partners...');
    
    // Add training partners
    for (const partner of trainingPartners) {
      await addDoc(collection(db, 'training_partners'), partner);
      console.log(`Added training partner: ${partner.name}`);
    }
    
    console.log('\n✅ All testimonials and training partners initialized successfully!');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Run the initialization
initializeTestimonialsAndLogos();
