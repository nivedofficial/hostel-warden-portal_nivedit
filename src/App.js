import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import SignIn from './signin'; // Import the SignIn component
import SignUp from './signup'; // Import the SignUp component
import Services from './Services';

const App = () => {
  return (
    <div className="main-container">
      <h1>Welcome to our website!</h1>
      <p>Please sign in or sign up to access our services.</p>
      <Link to="/signin" className="btn btn-primary">
        Sign in
      </Link>
      <Link to="/signup" className="btn btn-primary">
        Sign up
      </Link>
      <Switch>
        <Route path="/signin">
          <SignIn /> {/* Render the SignIn component when the path is /signin */}
        </Route>
        <Route path="/Services">
          <Services/>
        </Route>
        <Route path="/signup">
          <SignUp /> {/* Render the SignUp component when the path is /signup */}
        </Route>
      </Switch>
    </div>
  );
};

export default App;
