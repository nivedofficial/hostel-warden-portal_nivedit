import { Route, Switch,Link } from "react-router-dom";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import Services from "./components/Services";

const App = () => {
  return (
    <div className="main-container">
      <Switch>
        <Route exact path="/">
          <h1>Welcome to our website!</h1>
          <p>Please sign in or sign up to access our services.</p>
          <Link to="/signin" className="btn btn-primary">
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Sign up
          </Link>
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/Services">
          <Services />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
      </Switch>
    </div>
  );
};

export default App;