import React, { useState } from "react";
import axios from "axios";

function FindRecipes() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/recipes`, {
        title,
        ingredients: ingredients.split(",").map((item) => item.trim()), // convert to array
        instructions,
      });

      setMessage(res.data.message || "Recipe saved successfully!");
      setTitle("");
      setIngredients("");
      setInstructions("");
    } catch (error) {
      console.error("❌ Error saving recipe:", error.message);
      setMessage("Failed to save recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1>Add a New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Ingredients (comma separated):</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Instructions:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Recipe"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default FindRecipes;
