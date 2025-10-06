import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const pageStyle = {
    backgroundImage: "url('/food-bg.jpg')", // put an image in public folder
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    color: "white",
    textAlign: "center",
    paddingTop: "100px",
    backgroundColor: "#7B4F2A", // brown overlay
    backgroundBlendMode: "multiply",
  };

  return (
    <div style={pageStyle}>
      <h1>Zero Food Waste Recipes</h1>
      <p>Cook meals from what you already have</p>

      <div style={{ marginTop: "50px" }}>
        <Link to="/find" style={buttonStyle}>Find Recipes</Link>
        <Link to="/saved" style={buttonStyle}>Saved Recipes</Link>
      </div>
    </div>
  );
}

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

export default HomePage;
