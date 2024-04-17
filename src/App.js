import { BrowserRouter,Route, Switch,Link } from "react-router-dom";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import Services from "./components/Services";
import { Welcome } from "./screens/welcome";

const App = () => {
  return (

    <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/services" component={Services} />
        </Switch>
    </BrowserRouter>

    // </div>
  );
};

export default App;