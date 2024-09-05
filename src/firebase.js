// src/firebase.js
import {initializeApp}  from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB3DTe_zH3TdDTdHZuXrLzAsjcrodMYSps",
  authDomain: "puzzlefuzz-5ce03.firebaseapp.com",
  projectId: "puzzlefuzz-5ce03",
  appId: "1:1034476288735:web:f99b413a7543117668c76a",
  measurementId: "G-LVLMQXDXTH"
};


export async function testFirebaseConnection() {
  try {
    const testCollection = collection(firestore, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('Successfully connected to Firestore');
    console.log('Number of documents in test collection:', snapshot.size);
    snapshot.forEach(doc => {
      console.log('Document data:', doc.data());
    });
    return true;
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
    return false;
  }
}
const fb_app = initializeApp(firebaseConfig);
export const firestore = getFirestore(fb_app);
export const auth = getAuth(fb_app);

async function get_collection(db) {
    const c = collection(db, 'test');
    const snapshot = await getDocs(c);
    const list = snapshot.docs.map(doc => doc.data());
    return list;
}


// console.log('Firebase init ', auth, firestore, functions, storage, analytics, performance);