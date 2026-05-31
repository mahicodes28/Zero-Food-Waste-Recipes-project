import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="homepage-container">
      {/* HERO SECTION */}
      <header className="homepage-hero">
        <h1 className="homepage-title">Smarter Kitchens,<br />Zero Food Waste.</h1>
        <p className="homepage-subtitle">
          Track ingredients, minimize waste, and instantly generate gourmet recipes powered by sustainability-focused AI.
        </p>

        <div className="homepage-buttons">
          <Link to="/pantry" className="hero-btn">Manage My Pantry 🥬</Link>
          <Link to="/ai-recipes" className="hero-btn-outline">Launch AI Recipe Chef 👨‍🍳</Link>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="feature-wrapper">
        <h2 className="feature-heading">A Complete Sustainability Operating System</h2>
        <p className="feature-subheading">
          Make your cooking smart, cost-effective, and highly eco-friendly.
        </p>

        <div className="features-section">
          <div className="feature-card">
            <span className="feature-card-icon">🥬</span>
            <h3>Smart Pantry Manager</h3>
            <p>Track your ingredients, categorize entries, and receive dynamic color-coded visual expiry warnings automatically.</p>
          </div>

          <div className="feature-card">
            <span className="feature-card-icon">👨‍🍳</span>
            <h3>AI Expiry-Aware Chef</h3>
            <p>Instantly generate structured zero-waste recipes prioritizing near-expiration food to maximize utility.</p>
          </div>

          <div className="feature-card">
            <span className="feature-card-icon">📈</span>
            <h3>Eco-Impact Analytics</h3>
            <p>Calculate and display dynamic carbon offset, financial rescues, and lifetime sustainable metrics in neat SVG grids.</p>
          </div>

          <div className="feature-card">
            <span className="feature-card-icon">📔</span>
            <h3>Smart Saved Cookbook</h3>
            <p>Contribute custom recipes, save generated AI cook plans, and construct your personalized zero-waste library.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="homepage-footer">
        © 2026 Zero Food Waste SaaS Platform. Engineered for Climate Impact.
      </footer>
    </div>
  );
}
