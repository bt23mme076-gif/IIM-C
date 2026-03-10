/**
 * Seed script — Prof. Bodhibrata Nag section data (Admin SDK, bypasses rules)
 * Run from Backend folder: node seedSections.js
 */

const admin = require('firebase-admin');

let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
} catch {
  console.error('ERROR: serviceAccountKey.json not found in Backend folder.');
  process.exit(1);
}

if (serviceAccount.project_id !== 'iim-c-a4d73') {
  console.error(`ERROR: serviceAccountKey.json belongs to "${serviceAccount.project_id}", not "iim-c-a4d73".`);
  process.exit(1);
}

// Avoid duplicate app init if running after seedNagData.js
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

const seed = async () => {
  try {
    console.log('Seeding section collections...\n');

    await db.collection('home').doc('main').set({
      tagLine: 'Professor • Researcher • Author',
      name: 'Prof. Bodhibrata Nag',
      title: 'Professor of Operations Management',
      subtitle: 'Indian Institute of Management Calcutta',
      description:
        'Professor Bodhibrata Nag is a distinguished academic with extensive experience in operations management, transportation, energy systems, sustainable supply chains, and cybersecurity at IIM Calcutta.',
      primaryButtonText: 'Get in Touch',
      primaryButtonLink: '/contact'
    });
    console.log('✓ home/main');

    await db.collection('research').doc('main').set({
      pageTitle: 'Research',
      intro:
        "Professor Nag's research focuses on applying simulation and analytical techniques to planning, design, and operations of energy, transportation, logistics systems, and cybersecurity.",
      researchAreas: [
        'Operations Research',
        'Energy Systems',
        'Transportation and Railways',
        'Logistics and Supply Chains',
        'Cybersecurity',
        'Privacy Economics'
      ],
      selectedResearch: [
        'Towards Green Freight Transportation Using Train Design Optimization (2022)',
        'Will Catastrophic Cyber-Risk Aggregation Thrive in the IoT Age? (2021)',
        'Simulation Optimization for Supply Chain Decision Making (2022)',
        'A MIP Model for Scheduling India\'s General Elections and Police Movement (2014)'
      ]
    });
    console.log('✓ research/main');

    await db.collection('books').doc('main').set({
      pageTitle: 'Books',
      intro: 'Books and book chapters authored or co-authored by Professor Bodhibrata Nag.',
      books: [
        'Business Applications of Operations Research (2013)',
        'Optimal Design of Timetables for Large Railways (2010)',
        'Introduction to Operations Research, Special 12th Indian Edition (2025)',
        'Introduction to Operations Research, Special 11th Indian Edition (2021)',
        'Introduction to Operations Research, Special 10th Indian Edition (2017)',
        'Introduction to Operations Research, Special 9th Indian Edition (2012)'
      ],
      bookChapters: [
        'Fundamentals of Simulation Modelling: Concepts and Applications (2027)',
        'Navigating the Ethereal: Ethical Frameworks in AI for Healthcare (2025)',
        'The Evolution of Ethical Standards and Guidelines in AI (2024)',
        'Navigating Ethical Dilemmas in Generative AI: Case Studies and Insights (2024)',
        'Leveraging Machine Learning of Indian Railways Public Procurement Data for Managerial Insights (2023)'
      ]
    });
    console.log('✓ books/main');

    await db.collection('consulting').doc('main').set({
      pageTitle: 'Consulting',
      intro:
        'Professor Nag has advised public institutions, global organizations, and infrastructure-focused initiatives across transportation, procurement, logistics, and governance.',
      consultingInterests: ['Energy', 'Transportation', 'Supply Chain', 'Procurement', 'Logistics'],
      consultingProjects: [
        'World Bank and Deloitte project on rail capacity modeling for Indian Railways (2019-20)',
        'Business Process Reengineering and Change Management for Department of Health and Family Welfare, Government of West Bengal (2019-20)',
        'Designing a Central Public Sector Enterprises Scorecard Index for Comptroller and Auditor General of India (2019-20)',
        'Independent Evaluation of Procurement and Supply Chain of National AIDS Control Program (2007)',
        'Business and Marketing Plan for Dedicated Freight Corridors of Indian Railways (2009)'
      ]
    });
    console.log('✓ consulting/main');

    await db.collection('recognitions').doc('main').set({
      pageTitle: 'Recognitions',
      intro:
        'Professor Nag has received recognition for academic excellence, industry relevance, public systems leadership, and professional contribution.',
      awards: [
        'Fulbright-Nehru Senior Research Fellowship',
        'Ministry of Energy Gold Medal',
        'Winner, Triple Connection Global Educator and Trainer Challenge 2023',
        'Best Professor in Operations Management, DNA B-School Innovative Award (2013)',
        'Best Professor in Operations Management, CMO Asia Award (2011)',
        "General Manager's Best Officer Award and Efficiency Medal (2000)"
      ],
      affiliations: [
        'Senior Member, IEEE',
        'Fellow, Institution of Engineers (India)',
        'Life Member, All India Management Association',
        'Life Senior Member, Operations Research Society of India',
        'Empanelled Independent Director, Ministry of Corporate Affairs'
      ]
    });
    console.log('✓ recognitions/main');

    await db.collection('opinions').doc('main').set({
      pageTitle: 'Opinions',
      intro:
        'Selected opinion and thought-leadership articles on cybersecurity, privacy, AI, data economy, and public systems.',
      articles: [
        'Systemic Cyber Risk: The growing threat to global supply chains (Forbes, 2026)',
        'Synthetic Data: The new backbone of next gen cybersecurity (Forbes, 2026)',
        'Cyber Risk in the Boardroom: Why Judgment Matters More Than Numbers (Forbes, 2026)',
        'Businesses need future-ready LLM supply chains (Forbes, 2025)',
        'Future-proofing your company from quantum cyber risks (Forbes, 2025)',
        'How can companies secure their future with rise in agentic AI adoption (Forbes, 2025)',
        'In defense of a transparent economy for data capitalism (Forbes, 2021)',
        'Only appropriate data (Economic Times, 2019)'
      ]
    });
    console.log('✓ opinions/main');

    await db.collection('courses').doc('main').set({
      pageTitle: 'Courses',
      intro:
        'Professor Nag has taught doctoral, MBA, MBAEX, executive, and sector-specific programs across operations, analytics, supply chains, and project management.',
      coursesTaught: [
        'Operations Research',
        'Operations Research Modeling',
        'Project Management',
        'Decision Models and Software',
        'Sustainable Supply Chain Analytics',
        'Advanced Graph Theory',
        'Quality Management Six Sigma',
        'Simulation Modeling',
        'Business Risk Management',
        'Strategic Game Theory',
        'Business Mathematics',
        'R Programming'
      ],
      executivePrograms: [
        'Executive General Management Program for Accenture',
        'Advanced Supply Chain Management',
        'Training Program on Project Management for Ministry of Ports, Shipping and Waterways',
        'Executive programs for AstraZeneca and Nestle',
        'Program for Delhi Metro Rail Corporation executives',
        'Programs for Indian Railway Service probationers'
      ]
    });
    console.log('✓ courses/main');

    await db.collection('contact').doc('main').set({
      pageTitle: 'Contact',
      institution: 'Indian Institute of Management Calcutta',
      phone: '91-33-24678300 to 06, Ext 752',
      email: 'bnag@iimcal.ac.in',
      address: 'Kolkata, West Bengal, India',
      contactText:
        'For academic collaboration, executive education, invited talks, consulting, and research engagement, please connect through institutional contact channels.'
    });
    console.log('✓ contact/main');

    // Update Firestore security rules to allow reads on new collections
    console.log('\n✅ All sections seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seed();
