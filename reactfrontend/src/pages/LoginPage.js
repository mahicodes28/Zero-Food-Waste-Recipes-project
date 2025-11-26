import React, { useState } from "react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);

  const toggleMode = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isSignup ? "Create Account" : "Login to Zero Food Waste"}
        </h2>

        <p style={styles.subtitle}>
          {isSignup
            ? "Join us to reduce food waste effortlessly!"
            : "Welcome back! Let's cook something amazing."}
        </p>

        <form style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            required
          />

          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
              required
            />
          )}

          <button type="submit" style={styles.button}>
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p onClick={toggleMode} style={styles.toggleText}>
          {isSignup
            ? "Already have an account? Login"
            : "Don’t have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}

// -------------------------------------------------------
// STYLES
// -------------------------------------------------------

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fff5eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    width: "380px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
    color: "#7B4F2A",
  },

  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginTop: "5px",
    marginBottom: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },

  button: {
    padding: "12px",
    backgroundColor: "#7B4F2A",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },

  toggleText: {
    marginTop: "15px",
    color: "#7B4F2A",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
