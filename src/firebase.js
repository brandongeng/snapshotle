// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBc39LZrtToBRsq3zhqEzt5aX9svpwttJQ",
  authDomain: "snapshotle-6d1d2.firebaseapp.com",
  projectId: "snapshotle-6d1d2",
  storageBucket: "snapshotle-6d1d2.appspot.com",
  messagingSenderId: "445324107123",
  appId: "1:445324107123:web:59f0f938eb07718113f906",
  measurementId: "G-GC8RTVDLKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export {app}