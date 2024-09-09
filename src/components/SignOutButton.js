import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './SignOutButton.css';

const SignOutButton = ({ history }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button onClick={handleSignOut} className="sign-out-button">
      Sign Out
    </button>
  );
};

export default SignOutButton;