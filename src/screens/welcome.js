import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export const Welcome = ()=>{
    return(
        <div className="main-container">
            <h1>Welcome to our website!</h1>
            <p>Begin your Journey</p>
            <Link to="/signin" className="btn btn-primary">
              Sign in
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign up
            </Link>
        </div>
    )
}