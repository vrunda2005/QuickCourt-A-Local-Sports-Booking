import React from "react";
import WeatherAvatar from "../components/weatheravatar"; // adjust path

const Home = () => {
  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <p>This is a sample app using Clerk + Cloudinary + MongoDB.</p>

      {/* Add your interactive avatar with weather here */}
      <WeatherAvatar />
    
    </div>
  );
};

export default Home;





/*
const Home = () => {
    return (
        <div>
            <h2>Welcome to the Home Page</h2>
            <p>This is a sample app using Clerk + Cloudinary + MongoDB.</p>
            
        </div>
    );
};

export default Home;
*/