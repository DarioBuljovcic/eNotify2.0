// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApd5LMDAX_GrmRbr7PFdjepcHdxhdTTrE",
  authDomain: "enotify-c579a.firebaseapp.com",
  projectId: "enotify-c579a",
  storageBucket: "enotify-c579a.appspot.com",
  messagingSenderId: "441876563435",
  appId: "1:441876563435:web:b559d5b6a51e9cee6205ae",
  measurementId: "G-YD0VKVZPNE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
