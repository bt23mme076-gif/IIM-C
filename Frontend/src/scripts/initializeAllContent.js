import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAboutContent } from './initializeAboutContent.js';
import { initializeResearchContent } from './initializeResearchContent.js';
import { initializeTrainingsContent } from './initializeTrainingsContent.js';
import { initializeBooksContent } from './initializeBooksContent.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkH9bQTZoH10t_r7N_ewDUYMkQNJN3K0I",
  authDomain: "gupta-d4ef3.firebaseapp.com",
  projectId: "gupta-d4ef3",
  storageBucket: "gupta-d4ef3.firebasestorage.app",
  messagingSenderId: "334869341826",
  appId: "1:334869341826:web:cde25c5bda917d7c83eb4f",
  measurementId: "G-DCEY6PWQEE"
};

// Initialize Firebase только если еще не инициализирован
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    console.log('Firebase already initialized');
  } else {
    throw error;
  }
}

const db = getFirestore(app);

async function initializeAllContent() {
  console.log('====================================');
  console.log('Initializing All Page Content');
  console.log('====================================\n');
  
  try {
    // Initialize About content
    console.log('1. About Page');
    console.log('-------------');
    const aboutResult = await initializeAboutContent();
    console.log(aboutResult.success ? '✓ Success' : '✗ Failed:', aboutResult.message || aboutResult.error);
    console.log('');
    
    // Initialize Research content
    console.log('2. Research Page');
    console.log('----------------');
    const researchResult = await initializeResearchContent();
    console.log(researchResult.success ? '✓ Success' : '✗ Failed:', researchResult.message || researchResult.error);
    console.log('');
    
    // Initialize Trainings content
    console.log('3. Trainings Page');
    console.log('-----------------');
    const trainingsResult = await initializeTrainingsContent();
    console.log(trainingsResult.success ? '✓ Success' : '✗ Failed:', trainingsResult.message || trainingsResult.error);
    console.log('');
    
    // Initialize Books content
    console.log('4. Books Page');
    console.log('-------------');
    const booksResult = await initializeBooksContent();
    console.log(booksResult.success ? '✓ Success' : '✗ Failed:', booksResult.message || booksResult.error);
    console.log('');
    
    console.log('====================================');
    console.log('Initialization Complete!');
    console.log('====================================');
    console.log('\nAll page content has been initialized in Firestore.');
    console.log('You can now use the Admin Dashboard to manage this content.');
    
    return {
      success: true,
      message: 'All content initialized successfully'
    };
  } catch (error) {
    console.error('\n✗ Error during initialization:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeAllContent().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });
}

export { initializeAllContent };
