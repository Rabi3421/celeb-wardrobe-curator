// firebase.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhFV99f17Y5yXjgbWlUkPJRmoMOpUud1o",
  authDomain: "celebritypersona-918fc.firebaseapp.com",
  projectId: "celebritypersona-918fc",
  storageBucket: "celebritypersona-918fc.firebasestorage.app",
  messagingSenderId: "521975390161",
  appId: "1:521975390161:web:89daa565178b00cd82caf0",
  measurementId: "G-3K6RTJ045E"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
