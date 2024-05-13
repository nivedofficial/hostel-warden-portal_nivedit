import React from "react";
import { Link,View, Image  } from "react-router-dom/cjs/react-router-dom.min";
import "./Welcome.css"; // Import CSS file for styling


export const Welcome = () => {
  return (
    <div className="homebox">
      
        <div className="contentw">
          <div className="hostel">Hostel Management</div>
          {/* <View>
      <Image
        source={require('/home/nived/Documents/GitHub/hostel-warden-portal_nivedit/src/A1.png')} // Adjust the path accordingly
        style={{ width: 100, height: 100 }} // Adjust width and height as needed
      />
    </View> */}
          <div className="made">made easy.</div>
          <div className="buttonsw">
            <Link to="/signin" className="btnw btn-primaryw">
              Sign in
            </Link>
            <Link to="/signup" className="btnwup btn-primarywup">
              Sign up
            </Link>

          </div>
          
        
          
        </div>
      </div>
    
  );
};