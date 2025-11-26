import React, { useState } from "react";
import axios from "axios";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [message, setMessage] = useState("");

  // Your backend URL (use .env later)
  const API_URL = "http://localhost:5000/api/recipes";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        title,
        ingredients: ingredients.split(",").map((i) => i.trim()),
        instructions,
      };

      const res = await axios.post(API_URL, payload);

      setMessage("Recipe added successfully!");

      // Clear form
      setTitle("");
      setIngredients("");
      setInstructions("");
    } catch (error) {
      console.error("❌ Error adding recipe:", error);
      setMessage("Failed to add recipe. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add a New Recipe</h2>

      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>Title</label>
        <input
          type="text"
          placeholder="Enter recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />

        <label style={styles.label}>Ingredients</label>
        <input
          type="text"
          placeholder="Comma separated (e.g., tomato, cheese, basil)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          style={styles.input}
          required
        />

        <label style={styles.label}>Instructions</label>
        <textarea
          placeholder="Write the cooking steps..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          style={styles.textarea}
          required
        />

        <button type="submit" style={styles.button}>
          Add Recipe
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "bold",
    color: "#7B4F2A",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#7B4F2A",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    minHeight: "150px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "12px 25px",
    backgroundColor: "#7B4F2A",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  message: {
    marginTop: "20px",
    textAlign: "center",
    color: "#7B4F2A",
    fontWeight: "bold",
  },
};
