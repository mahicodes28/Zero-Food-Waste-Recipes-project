import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/recipes";

  // Fetch saved recipes from MongoDB
  const fetchRecipes = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecipes(res.data);
    } catch (error) {
      console.error("❌ Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
    } catch (error) {
      console.error("❌ Error deleting recipe:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Saved Recipes</h2>

      {loading ? (
        <p style={styles.loading}>Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p style={styles.empty}>No saved recipes found.</p>
      ) : (
        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe._id} style={styles.card}>
              <h3 style={styles.title}>{recipe.title}</h3>

              <p style={styles.label}>Ingredients:</p>
              <ul style={styles.list}>
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} style={styles.listItem}>
                    {ing}
                  </li>
                ))}
              </ul>

              <p style={styles.label}>Instructions:</p>
              <p style={styles.instructions}>{recipe.instructions}</p>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteRecipe(recipe._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
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
    fontSize: "36px",
    fontWeight: "bold",
    color: "#7B4F2A",
    textAlign: "center",
  },

  loading: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "18px",
  },

  empty: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "18px",
    color: "#777",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#7B4F2A",
  },

  label: {
    fontWeight: "bold",
    marginTop: "10px",
  },

  list: {
    paddingLeft: "18px",
  },

  listItem: {
    fontSize: "15px",
  },

  instructions: {
    fontSize: "15px",
    marginTop: "5px",
  },

  deleteBtn: {
    marginTop: "15px",
    backgroundColor: "#c0392b",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
