// src/firebase.js
import {initializeApp}  from 'firebase/app';
import { collection, getFirestore, getDocs } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

const fb_app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

async function get_collection(db) {
    const c = collection(db, 'test');
    const snapshot = await getDocs(c);
    const list = snapshot.docs.map(doc => doc.data());
    return list;
}


// console.log('Firebase init ', auth, firestore, functions, storage, analytics, performance);