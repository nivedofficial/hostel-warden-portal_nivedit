import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom'; // Import useHistory
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig'; // Import your firebaseConfig.js
import './signup.css'

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [capacity, setCapacity] = useState('');
  const [noOfRooms, setNoOfRooms] = useState('');
  const [noOfFloors, setNoOfFloors] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  // const [isSignedUp, setIsSignedUp] = useState(false); // Track if signed up

  const history = useHistory(); // Initialize useHistory
  
  const auth = getAuth();

  // Check if a user has already signed up
  // useEffect(() => {
  //   const checkUserSignedUp = async () => {
  //     const usersQuery = await getDocs(collection(firestore, 'Warden'));
  //     if (usersQuery.docs.length > 0) {
  //       setIsSignedUp(true);
  //     }
  //   };

  //   checkUserSignedUp();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous error messages
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setSignupError('');

    // Check if user has already signed up
    // if (isSignedUp) {
    //   setSignupError('A user has already signed up.');
    //   return;
    // }

    // Form validation
    // (Remaining form validation code...)

    // If all validations pass, create the user
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await addDoc(collection(firestore, 'Warden'), {
        uid: user.uid,
        email: user.email,
        // CapacityOfEachFloor: parseInt(capacity),
        // NoOfRoomsInEachFloor: parseInt(noOfRooms),
        // NoOfFloors: parseInt(noOfFloors),
      });

      // Reset form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // setCapacity('');
      // setNoOfRooms('');
      // setNoOfFloors('');
      
      // Redirect to sign-in page after successful sign-up
      history.push('/signin');
    } catch (error) {
      setSignupError("User already exists. Please choose another email.");
    }
  };

  return (
    <div className='upbody'>
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
        {/* <div className="sign-up-form__group">
          <label htmlFor="capacity">Capacity Of Each Floor</label>
          <input type="number" id="capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        </div> */}
        {/* <div className="sign-up-form__group">
          <label htmlFor="noOfRooms">No Of Rooms In Each Floor</label>
          <input type="number" id="noOfRooms" value={noOfRooms} onChange={(e) => setNoOfRooms(e.target.value)} />
        </div>
        <div className="sign-up-form__group">
          <label htmlFor="noOfFloors">No Of Floors</label>
          <input type="number" id="noOfFloors" value={noOfFloors} onChange={(e) => setNoOfFloors(e.target.value)} />
        </div> */}
        <button type="submit" className="sign-up-form__button">Sign Up</button>
      </form>
      <Link to="/signin" className="sign-up-form__link">Already have an account? Sign in</Link>
      {signupError && <p className="sign-up-form__error">{signupError}</p>}
    </div>
    </div>
  );
};

export default SignUp;