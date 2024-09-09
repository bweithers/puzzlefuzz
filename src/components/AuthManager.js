// src/components/AuthManager.js
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; 
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import './AuthManager.css';

const AuthManager = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Handle Sign Up
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const navigate = useNavigate();
  // Handle Sign In
  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log(userCredential);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigate('/welcome');
      } else {
        setUser(null);
      }
      console.log('AuthStateChange');
    });
  
    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Firebase Auth</h2>

      {user ? (
        <div>
          <p className="auth-welcome">Welcome, {user.email}</p>
          <button className="auth-button" onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSignIn();
              }
            }}
          />
          <button className="auth-button" onClick={handleSignUp}>Sign Up</button>
          <button className="auth-button" onClick={handleSignIn}>Sign In</button>
        </div>
      )}

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default AuthManager;