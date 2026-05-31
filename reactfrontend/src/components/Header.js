import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.navWrapper}>
      <header style={styles.navbar}>
        <div style={styles.logoBox}>
          <span style={styles.logo}>🍃</span>
          <span style={styles.logoText}>Zero Food Waste</span>
        </div>

        <nav style={styles.links}>
          {[
            { path: "/", label: "Home" },
            { path: "/pantry", label: "My Pantry" },
            { path: "/ai-recipes", label: "AI Recipe Chef" },
            { path: "/dashboard", label: "Eco Impact" },
            { path: "/add", label: "Add Recipe" },
            { path: "/saved", label: "Saved Recipes" },
            { path: "/chat", label: "Chat-Cook" },
          ].map((lnk) => (
            <Link
              key={lnk.path}
              to={lnk.path}
              style={{
                ...styles.link,
                color: isActive(lnk.path) ? "#0E291C" : "#5C6B61",
                fontWeight: isActive(lnk.path) ? "700" : "500",
              }}
            >
              {lnk.label}
              {isActive(lnk.path) && <span style={styles.activeDot}></span>}
            </Link>
          ))}
        </nav>
      </header>
    </div>
  );
}

const styles = {
  navWrapper: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 20px 0 20px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  navbar: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(236, 234, 227, 0.7)",
    padding: "14px 24px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 10px 30px rgba(14, 41, 28, 0.03)",
    flexWrap: "wrap",
    gap: "12px",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  logo: {
    fontSize: "20px",
  },

  logoText: {
    color: "#0E291C",
    fontSize: "17px",
    fontWeight: "800",
    letterSpacing: "-0.4px",
  },

  links: {
    display: "flex",
    gap: "10px 22px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  link: {
    textDecoration: "none",
    fontSize: "14px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "color 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    padding: "4px 0",
  },

  activeDot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: "#3A6351",
    position: "absolute",
    bottom: "-4px",
  },
};
