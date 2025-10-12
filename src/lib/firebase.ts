// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyXln1sSTN1BqavViOI0w-8s8V8EDAgoo",
  authDomain: "bd-edu-result.firebaseapp.com",
  projectId: "bd-edu-result",
  storageBucket: "bd-edu-result.appspot.com",
  messagingSenderId: "931880327453",
  appId: "1:931880327453:web:4feadc9f3c8df3aee1a9f4",
  measurementId: "G-KDX1R5MG0X"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
