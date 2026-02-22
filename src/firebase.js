// src/firebase.js
import {initializeApp}  from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB3DTe_zH3TdDTdHZuXrLzAsjcrodMYSps",
  authDomain: "puzzlefuzz-5ce03.firebaseapp.com",
  projectId: "puzzlefuzz-5ce03",
  appId: "1:1034476288735:web:f99b413a7543117668c76a",
  measurementId: "G-LVLMQXDXTH"
};


const fb_app = initializeApp(firebaseConfig);

export const firestore = getFirestore(fb_app);
export const auth = getAuth(fb_app);