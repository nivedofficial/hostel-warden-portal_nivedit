import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import './signin.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signInError, setSignInError] = useState('');
  const history = useHistory();
  const auth = getAuth();

  useEffect(() => {
    // Check if user is already authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to desired page
        history.push('/Services');
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [auth, history]);

  useEffect(() => {
    // Set a timeout to automatically log out the user after a certain period of time
    const logoutTimer = setTimeout(async () => {
      try {
        await signOut(auth);
        console.log("User logged out due to inactivity");
      } catch (error) {
        console.error("Error logging out user:", error);
      }
    }, 600000); // 10 minutes in milliseconds

    // Clear the timeout when the component unmounts or the user interacts with the page
    const clearTimer = () => clearTimeout(logoutTimer);
    window.addEventListener("mousemove", clearTimer);
    window.addEventListener("keypress", clearTimer);

    return () => {
      window.removeEventListener("mousemove", clearTimer);
      window.removeEventListener("keypress", clearTimer);
    };
  }, [auth]);

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
      setSignInError("Invalid email or password. Please try again.");
    }
  };

  return (
<div className='body'>
  <div className="signin-container">
    <div className="signin-form-container signin-sign-in-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <h1 className="signin-h1">Sign in</h1>
        <div style={{ marginBottom: '10px' }}>
          
        </div>
        <span className="signin-span">or use your account</span>
        <div style={{ marginBottom: '20px' }}>
          
          </div>
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
       {signInError && <div className="error" style={{ color: 'red' }}>{signInError}</div>}
            {passwordError && <div className="error"  style={{ color: 'red' }}>{passwordError}</div>}
        
        <button type="submit" className="signin-button">Sign In</button>
        
        <div className="signup-link-container">
          <Link to="/signup" className="create-button">Create User</Link>
          </div>
          </form>
        </div>
        <div className="image-container">
          <div className='rightside'>Hostel</div>
          <div className='rightside1'>Management</div>
          <div className='rightside2'>Made easy</div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
