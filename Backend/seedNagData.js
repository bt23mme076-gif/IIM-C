/**
 * Seed script for Prof. Bodhibrata Nag — uses Firebase Admin SDK (bypasses rules)
 * 
 * BEFORE running:
 * 1. Go to Firebase Console → iim-c-a4d73 → Project Settings → Service Accounts
 * 2. Click "Generate new private key" and save as Backend/serviceAccountKey.json
 * 3. Then run: node seedNagData.js
 */

const admin = require('firebase-admin');

let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
} catch {
  console.error('ERROR: serviceAccountKey.json not found in Backend folder.');
  console.error('Download it from Firebase Console → Project Settings → Service Accounts');
  process.exit(1);
}

if (serviceAccount.project_id !== 'iim-c-a4d73') {
  console.error(`ERROR: serviceAccountKey.json belongs to project "${serviceAccount.project_id}", not "iim-c-a4d73".`);
  console.error('Please download the service account key for the iim-c-a4d73 project.');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const seedData = async () => {
  try {
    console.log('Seeding Firestore for Prof. Bodhibrata Nag...\n');

    await db.collection('content').doc('navbar').set({
      professorName: 'PROF. BODHIBRATA NAG',
      subtitle: 'IIM Calcutta'
    });
    console.log('✓ content/navbar');

    await db.collection('content').doc('home').set({
      hero_greeting: 'PROFESSOR • RESEARCHER • AUTHOR',
      hero_title: 'Prof. Bodhibrata Nag',
      hero_name: 'Professor of Operations Management',
      hero_subtitle: 'IIM Calcutta Professor. Researcher. Author.',
      hero_description: 'Professor Bodhibrata Nag is a distinguished academic with extensive experience in operations management, transportation, energy systems, sustainable supply chains, and cybersecurity at IIM Calcutta.',
      hero_credential1: 'Professor, IIM Calcutta',
      hero_credential2: 'PhD, IIM Calcutta | B.Tech, IIT Madras',
      hero_linkedin: 'https://www.linkedin.com/in/bodhibrata-nag/',
      hero_address: 'Indian Institute of Management Calcutta, Kolkata',
      hero_phone: '91-33-24678300 Ext 752',
      courses_heading: 'Management Courses',
      course1_title: 'Business Applications of Operations Research',
      course1_description: 'Master analytical and optimization techniques to solve complex business and public-sector decision problems.',
      course1_youtube: '',
      course2_title: 'Operations & Supply Chain Management',
      course2_description: 'Develop expertise in designing and managing resilient, sustainable supply chains and operational systems.',
      course2_youtube: '',
      blog_heading: 'Recent Blogs',
      blog1_title: 'Systemic Cyber Risk — the growing threat to global supply chains',
      blog1_excerpt: 'How interconnected digital infrastructure amplifies cyber vulnerabilities across global supply networks.',
      blog1_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      blog2_title: 'Synthetic Data — The new backbone of next gen cybersecurity',
      blog2_excerpt: 'Exploring how synthetic data is reshaping threat modelling and AI-driven security frameworks.',
      blog2_image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
      blog3_title: 'Cyber Risk in the Boardroom — Why Judgment Matters More Than Numbers',
      blog3_excerpt: 'A framework for executives to reason about cyber risk beyond metrics and dashboards.',
      blog3_image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
      books_heading: 'Published Books',
      book1_title: 'Business Applications of Operations Research',
      book1_description: 'A comprehensive guide to applying OR techniques to real-world business and management problems.',
      book1_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      book2_title: 'Optimal Design of Timetables for Large Railways',
      book2_description: 'Research-based framework for large-scale railway timetable optimization.',
      book2_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
      book3_title: 'Introduction to Operations Research (Indian Edition)',
      book3_description: 'Co-authored special Indian edition of the foundational operations research textbook.',
      book3_image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
      speaking_heading: 'Speaking Engagements with Prof. Nag',
      speaking_description: 'Prof. Nag delivers keynotes, executive workshops, and thought-provoking talks at leading organizations, government bodies, conferences, and academic events worldwide.',
      newsletter_heading: 'Wisdom delivered to your inbox.',
      newsletter_description: 'Stay updated on the latest research in operations management, supply chain resilience, cyber risk, and sustainable systems. Sign up for insights and thought leadership from Prof. Nag.'
    });
    console.log('✓ content/home');

    await db.collection('content').doc('about').set({
      pageTitle: 'About',
      hero_mainHeading: 'Prof. Bodhibrata Nag',
      hero_subtitle: 'Professor of Operations Management, IIM Calcutta',
      hero_description: 'Professor Bodhibrata Nag serves at IIM Calcutta. His work spans operations research, transportation, energy, logistics, and cybersecurity—backed by decades of academic leadership and public-sector experience.',
      journey_heading: 'About Prof. Bodhibrata Nag',
      journey_para1: 'Professor Bodhibrata Nag is a Professor in the Operations Management Group at IIM Calcutta. He holds a Fellow (PhD) degree from IIM Calcutta (2003) in Operations Research and Systems Analysis, and a B.Tech in Electrical Engineering from IIT Madras (1983).',
      journey_para2: 'Before joining academia, he served in senior roles at the Research Design and Standards Organisation (RDSO) under the Ministry of Railways, the Indian Railway Institute of Electrical Engineering, the South Eastern Railway, and the Central Electricity Authority under the Ministry of Power.',
      journey_para3: 'At IIM Calcutta, he has served as Acting Director, Dean Academic, Provost, Chairperson of Doctoral Programs, Director of IIM Calcutta Innovation Park, and Founder Coordinator of the PGPEX-VLM Programme.',
      linkedin_url: 'https://www.linkedin.com/in/bodhibrata-nag/'
    });
    console.log('✓ content/about');

    await db.collection('content').doc('research').set({
      pageTitle: 'Research',
      google_scholar_url: 'https://scholar.google.com/',
      page_subtitle: 'Applying analytical, simulation, and optimization techniques to real-world systems and policy challenges.'
    });
    console.log('✓ content/research');

    await db.collection('content').doc('courses').set({
      pageTitle: 'Courses',
      page_subtitle: 'By Prof. Bodhibrata Nag',
      institution: 'IIM Calcutta'
    });
    console.log('✓ content/courses');


    await db.collection('siteConfig').doc('main').set({
      siteTitle: 'Bodhibrata Nag',
      siteSubtitle: 'Professor of Operations Management, IIM Calcutta',
      institution: 'Indian Institute of Management Calcutta',
      isPublished: true
    });
    console.log('✓ siteConfig/main');

    console.log('\n✅ Firestore seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Firestore:', error.message);
    process.exit(1);
  }
};

seedData();
