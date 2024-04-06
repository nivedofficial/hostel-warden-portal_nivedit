import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email and password
    if (!email) {
      setEmailError('Please enter your email');
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (!password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 8) {
      setPasswordError('The password must be at least 8 characters long');
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return;
    }

    if (password!== confirmPassword) {
      setConfirmPasswordError('The passwords do not match');
      return;
    }

    // Authentication calls will be made here...

    // Clear error messages
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  }

  return (
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
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {passwordError && <p className="sign-up-form__error">{passwordError}</p>}
        </div>
        <div className="sign-up-form__group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {confirmPasswordError && <p className="sign-up-form__error">{confirmPasswordError}</p>}
        </div>
        <button type="submit" className="sign-up-form__button">Sign Up</button>
      </form>
      <Link to="/sign-in" className="sign-up-form__link">Already have an account? Sign in</Link>
    </div>
  );
};

export default SignUp;