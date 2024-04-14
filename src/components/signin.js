import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firestore } from './firebaseConfig'; // Import your firebaseConfig.js

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signInError, setSignInError] = useState('');
  const history = useHistory();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setEmailError('');
    setPasswordError('');
    setSignInError('');

    // Form validation
    if (!email.trim()) {
      setEmailError('Please enter your email');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Please enter your password');
      return;
    }

    // Attempt sign-in
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // If sign-in successful, redirect to Services
      history.push('/Services');
    } catch (error) {
      setSignInError(error.message);
    }
  };

  return (
    <div className="main-container">
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <div className="error">{emailError}</div>}
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <div className="error">{passwordError}</div>}
        <button type="submit">Sign in</button>
        {signInError && <div className="error">{signInError}</div>}
      </form>
      <Link to="/signup" className="btn btn-primary">
        Sign up
      </Link>
    </div>
  );
};

export default SignIn;
