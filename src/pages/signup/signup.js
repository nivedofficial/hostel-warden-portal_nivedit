import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import './signup.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [passwordConditions, setPasswordConditions] = useState([]);

  const history = useHistory();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous error messages
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setSignupError('');

    // Email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(firestore, 'Warden'), {
        uid: user.uid,
        email: user.email,
      });

      setEmail('');
      setPassword('');
      setConfirmPassword('');

      history.push('/signin');
    } catch (error) {
      setSignupError("User already exists. Please choose another email.");
    }
  };

  const handlePasswordChange = (e) => {
    const enteredPassword = e.target.value;
    setPassword(enteredPassword);

    // Password conditions validation using regular expressions
    const conditions = [];
    if (enteredPassword.length < 8) {
      conditions.push('Password must be at least 8 characters long.');
    }
    if (!/\d/.test(enteredPassword)) {
      conditions.push('Password must contain at least one digit.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(enteredPassword)) {
      conditions.push('Password must contain at least one symbol.');
    }

    setPasswordConditions(conditions);
  };

  return (
    <div className='upbody1'>
      <div className="sign-up-form">
        <h1 className="sign-up-form__title">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="sign-up-form__group">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {emailError && <p className="sign-up-form__error">{emailError}</p>}
          </div>
          <div className="sign-up-form__group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} />
            {passwordConditions.length > 0 && (
              <ul>
                {passwordConditions.map((condition, index) => (
                  <li key={index} style={{ color: 'red' }} className="password-condition">{condition}</li>
                ))}
              </ul>
            )}
            {passwordError && <p className="sign-up-form__error">{passwordError}</p>}
          </div>
          <div className="sign-up-form__group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {confirmPasswordError && <p className="sign-up-form__error">{confirmPasswordError}</p>}
          </div>
          <button type="submit" className="sign-up-form__button">Sign Up</button>
        </form>
        <Link to="/signin" className="sign-up-form__link">Already have an account? Sign in</Link>
        {signupError && <p className="sign-up-form__error">{signupError}</p>}
      </div>
    </div>
  );
};

export default SignUp;
