import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './signin.css';
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
    <div className='body'>
      <div className="signin-container">
        {/* Image container */}
        <div className="image-container">
          <img src="your_image_path.jpg" alt="Your Image" className="image" />
        </div>

        <div className="signin-form-container signin-sign-in-container">
          <form onSubmit={handleSubmit} className="signin-form">
            <h1 className="signin-h1">Sign in</h1>
            <div className="signin-social-container">
              <a href="#" className="signin-social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="signin-social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="signin-social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span className="signin-span">or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signin-input"
            />
            {emailError && <div className="error">{emailError}</div>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signin-input"
            />
            {passwordError && <div className="error">{passwordError}</div>}
            <a href="#" className="signin-a">Forgot your password?</a>
            <button type="submit" className="signin-button">Sign In</button>
            {signInError && <div className="error">{signInError}</div>}
            <div className="signup-link-container">
          <Link to="/signup" className="create-button">Create User</Link>
        </div>
          </form>
        </div>

        {/* Link to sign up page */}
        
      </div>
    </div>
  );
};

export default SignIn;
