import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const heroStyle = {
    backgroundImage: "url('/food-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    color: "white",
    textAlign: "center",
    paddingTop: "100px",
    backgroundColor: "#7B4F2A",
    backgroundBlendMode: "multiply",
  };

  const buttonStyle = {
    display: "inline-block",
    margin: "20px",
    padding: "20px 40px",
    backgroundColor: "white",
    color: "#7B4F2A",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
  };

  return (
    <div style={heroStyle}>
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        Zero Food Waste Recipes
      </h1>
      <p style={{ fontSize: "20px" }}>Cook meals from what you already have</p>

      <div>
        <Link to="/find" style={buttonStyle}>Find Recipes</Link>
        <Link to="/saved" style={buttonStyle}>Saved Recipes</Link>
      </div>
    </div>
  );
};

export default HomePage;
