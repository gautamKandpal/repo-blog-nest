// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "mern-blognest.appspot.com",
  messagingSenderId: "208049405533",
  appId: "1:208049405533:web:1115d8e1c5d1012aafd7b4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
