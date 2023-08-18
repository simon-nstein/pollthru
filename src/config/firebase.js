import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGbtfsJcxlm7cqfd8y3yjBMvihNPDk2dM",
  authDomain: "pollthru.firebaseapp.com",
  projectId: "pollthru",
  storageBucket: "pollthru.appspot.com",
  messagingSenderId: "502995418149",
  appId: "1:502995418149:web:19ec9d8ea40b31c33a13cc",
  measurementId: "G-HMMR30W3BW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);