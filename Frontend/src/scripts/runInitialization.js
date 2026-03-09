/**
 * Script to initialize Firestore content for all pages
 * Run this in the browser console when logged in as admin
 */

// Import initialization functions
import { initializeAboutContent } from './initializeAboutContent.js';
import { initializeResearchContent } from './initializeResearchContent.js';
import { initializeTrainingsContent } from './initializeTrainingsContent.js';

async function runInitialization() {
  console.log('Starting Firestore initialization...\n');
  
  try {
    // Initialize About page
    const aboutResult = await initializeAboutContent();
    console.log('About:', aboutResult);
    
    // Initialize Research page
    const researchResult = await initializeResearchContent();
    console.log('Research:', researchResult);
    
    // Initialize Trainings page
    const trainingsResult = await initializeTrainingsContent();
    console.log('Trainings:', trainingsResult);
    
    console.log('\n✓ All content initialized successfully!');
  } catch (error) {
    console.error('❌ Error during initialization:', error);
  }
}

// Auto-run
runInitialization();

export { runInitialization };
