import React, { useState } from "react";
import axios from "axios";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        title,
        ingredients: ingredients.split(",").map((i) => i.trim()),
        instructions,
      };

      await axios.post(`${API_URL}/api/recipes`, payload);
      setMessage("✨ Recipe saved successfully to your Cookbook!");

      // Clear form
      setTitle("");
      setIngredients("");
      setInstructions("");
    } catch (error) {
      console.error("❌ Error adding recipe:", error);
      setMessage("⚠️ Failed to add recipe. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heading}>📔 Share Your Recipe</h1>
        <p style={styles.subtitle}>
          Contribute your custom zero-waste culinary blueprints to the global sustainable kitchen network.
        </p>
      </div>

      <div style={styles.card}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Recipe Title</label>
            <input
              type="text"
              placeholder="e.g. Crispy Potato Skin Crisps"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Ingredients Used</label>
            <input
              type="text"
              placeholder="Comma separated (e.g. potato skins, olive oil, sea salt, rosemary)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              style={styles.input}
              required
            />
            <small style={styles.hint}>Separate ingredients with commas so our system can track rescues correctly.</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Instructions & Cooking Steps</label>
            <textarea
              placeholder="Describe the step-by-step prep and baking instructions..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              style={styles.textarea}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Save to Cookbook
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.startsWith("✨") ? "#117A65" : "#C0392B",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    minHeight: "100vh",
    backgroundColor: "#FCFAF6",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  hero: {
    textAlign: "center",
    marginBottom: "35px",
  },
  heading: {
    fontSize: "34px",
    fontWeight: "800",
    color: "#0E291C",
    margin: 0,
    letterSpacing: "-0.8px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#5C6B61",
    marginTop: "5px",
    maxWidth: "600px",
    margin: "5px auto 0 auto",
  },
  card: {
    maxWidth: "680px",
    backgroundColor: "white",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(14, 41, 28, 0.03)",
    border: "1px solid #ECEAE3",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0E291C",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #ECEAE3",
    fontSize: "15px",
    outlineColor: "#3A6351",
    fontFamily: "inherit",
  },
  textarea: {
    minHeight: "160px",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ECEAE3",
    fontSize: "15px",
    outlineColor: "#3A6351",
    fontFamily: "inherit",
    lineHeight: "1.5",
    resize: "vertical",
  },
  hint: {
    fontSize: "12px",
    color: "#7F8C8D",
    marginTop: "2px",
  },
  button: {
    padding: "14px 25px",
    backgroundColor: "#3A6351",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(58, 99, 81, 0.15)",
    marginTop: "10px",
  },
  message: {
    marginTop: "20px",
    textAlign: "center",
    fontWeight: "700",
    fontSize: "14px",
  },
};
