import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="homepage-container">

      {/* HERO SECTION */}
      <header className="homepage-hero">
        <h1 className="homepage-title">Zero Food Waste Recipes</h1>
        <p className="homepage-subtitle">
          Cook delicious meals using what you already have.
        </p>

        <div className="homepage-buttons">
          <Link to="/add" className="hero-btn">Add Recipes</Link>
          <Link to="/saved" className="hero-btn">Saved Recipes</Link>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="feature-wrapper">

        <h2 className="feature-heading">"Our Key Features" </h2>
        <p className="feature-subheading">
          Make your cooking smart, easy, and sustainable.
        </p>

        <div className="features-section">
          <div className="feature-card">
            <h3>Share Your recipe</h3>
            <p>Add you favourite recipe to use them later.</p>
          </div>

          <div className="feature-card">
            <h3>Save Your Recipes</h3>
            <p>Bookmark your favorite dishes and revisit them anytime.</p>
          </div>

          <div className="feature-card">
            <h3>AI Chatbot Guidance</h3>
            <p>Ask for cooking help, ingredient swaps, or nutrition tips.</p>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="homepage-footer">
        © 2025 Zero Food Waste Recipes
      </footer>
    </div>
  );
}
