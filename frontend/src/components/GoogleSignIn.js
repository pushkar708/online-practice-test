// frontend/src/components/GoogleSignIn.js

import React from 'react';
import axios from 'axios';

const GoogleSignIn = () => {
  const handleGoogleSignIn = async () => {
    try {
        const { data } = await axios.get('http://localhost:5000/auth/google');
      window.location.href = data.redirectUrl; // Redirect to Google sign-in page
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>Sign in with Google</button>
  );
};

export default GoogleSignIn;
