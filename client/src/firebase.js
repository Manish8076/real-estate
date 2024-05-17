// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-32b75.firebaseapp.com",
  projectId: "real-estate-32b75",
  storageBucket: "real-estate-32b75.appspot.com",
  messagingSenderId: "856021144928",
  appId: "1:856021144928:web:fea6e72743d8486a293a05"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);