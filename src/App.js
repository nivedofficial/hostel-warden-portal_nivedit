import { BrowserRouter,Route, Switch,Link } from "react-router-dom";
import SignIn from "./pages/signin/signin";
import SignUp from "./pages/signup/signup";
import Services from "./pages/services/Services";
import { Welcome } from "./pages/welcomePage/welcome";

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