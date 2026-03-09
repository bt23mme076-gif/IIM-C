import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAm5OW08cPCt-pPNioqQOOhbvumy0wATVY",
  authDomain: "iim-c-a4d73.firebaseapp.com",
  projectId: "iim-c-a4d73",
  storageBucket: "iim-c-a4d73.firebasestorage.app",
  messagingSenderId: "463874064270",
  appId: "1:463874064270:web:b01d62e07a959745326edf",
  measurementId: "G-KGG0MJ7B98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
