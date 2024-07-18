// src/firebase.js
import {initializeApp}  from 'firebase/app';
import { collection, getFirestore, getDocs } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
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

async function get_collection(db) {
    const c = collection(db, 'test');
    const snapshot = await getDocs(c);
    const list = snapshot.docs.map(doc => doc.data());
    return list;
}


// console.log('Firebase init ', auth, firestore, functions, storage, analytics, performance);