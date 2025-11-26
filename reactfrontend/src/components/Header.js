import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={styles.navbar}>
      <div style={styles.logoBox}>
        <span style={styles.logo}>ZFW</span>
        <span style={styles.logoText}>Zero Food Waste</span>
      </div>

      <nav style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/add" style={styles.link}>Add Recipe</Link>
        <Link to="/saved" style={styles.link}>Saved Recipes</Link>
        <Link to="/chat" style={styles.link}>Chat-Cook</Link>
        <Link to="/login" style={styles.link}>Login/Sign-In</Link>
      </nav>
    </header>
  );
}

const styles = {
  navbar: {
    width: "100%",
    backgroundColor: "#7B4F2A",
    padding: "12px 25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logo: {
    backgroundColor: "white",
    color: "#7B4F2A",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },

  logoText: {
    color: "white",
    fontSize: "18px",
    fontWeight: "600",
  },

  links: {
    display: "flex",
    gap: "20px",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "16px",
  },
};
