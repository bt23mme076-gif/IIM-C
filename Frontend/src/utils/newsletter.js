import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Subscribe user to newsletter
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function subscribeToNewsletter(email) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address'
      };
    }

    // Check if email already exists
    const newsletterRef = collection(db, 'newsletter_subscribers');
    const q = query(newsletterRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: 'This email is already subscribed!'
      };
    }

    // Add new subscriber
    await addDoc(newsletterRef, {
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      status: 'active',
      source: 'website'
    });

    return {
      success: true,
      message: 'Thank you for subscribing! Check your inbox for confirmation.'
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.'
    };
  }
}

/**
 * Get total subscriber count (admin only)
 * @returns {Promise<number>}
 */
export async function getSubscriberCount() {
  try {
    const newsletterRef = collection(db, 'newsletter_subscribers');
    const querySnapshot = await getDocs(newsletterRef);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    return 0;
  }
}
