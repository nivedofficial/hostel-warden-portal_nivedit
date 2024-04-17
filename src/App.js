import { Route, Switch,Link } from "react-router-dom";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import Services from "./components/Services";
import Rooms from "./components/Rooms";

const App = () => {
  return (
    <div className="main-container">
      <Switch>
        <Route exact path="/">
          <h1>Welcome to our website!</h1>
          <p>Begin your Journey</p>
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
        {/* <Route path="/components/Rooms">
          <Rooms/>
        </Route> */}

      </Switch>
    </div>
  );
};

export default App;