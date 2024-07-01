// src/components/ExampleComponent.js
import React, { useEffect } from 'react';
// import { auth, firestore } from '../firebase';

function ExampleComponent() {
  useEffect(() => {
    // Example: Auth state change
    // const unsubscribe = auth.onAuthStateChanged(user => {
    //   console.log('User state change:', user);
    // });

    // // Example: Firestore query
    // firestore.collection('test').get().then(snapshot => {
    //   snapshot.forEach(doc => {
    //     console.log(doc.id, '=>', doc.data());
    //   });
    // });

    // return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Example Component</h1>
    </div>
  );
}

export default ExampleComponent;