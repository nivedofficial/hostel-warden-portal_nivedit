import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Services from './Services'

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Your authentication logic here...

    // Assuming authentication is successful
    history.push('/Services');
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
      </form>
      <Link to="/signup" className="btn btn-primary">
        Sign up
      </Link>
    </div>
  );
};

export default SignIn;
