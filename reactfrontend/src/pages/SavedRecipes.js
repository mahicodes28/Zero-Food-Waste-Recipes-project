import React, { useEffect, useState } from "react";
import axiosLib from "axios";

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch saved recipes
  const fetchRecipes = async () => {
    try {
      const res = await axiosLib.get(`${API_URL}/api/recipes`);
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
      await axiosLib.delete(`${API_URL}/api/recipes/${id}`);
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
    } catch (error) {
      console.error("❌ Error deleting recipe:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heading}>📔 Saved Recipes Cookbook</h1>
        <p style={styles.subtitle}>
          Browse your customized, AI-curated and hand-contributed zero-waste recipes.
        </p>
      </div>

      {loading ? (
        <div style={styles.loader}>Accessing database logs...</div>
      ) : recipes.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>🍳</span>
          <h3>Your cookbook is empty</h3>
          <p>Add custom recipes or ask the AI Chef to cook up ideas to save expiring items!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe._id} style={styles.card}>
              <h3 style={styles.cardTitle}>🍛 {recipe.title}</h3>

              <div style={styles.section}>
                <span style={styles.sectionLabel}>Ingredients</span>
                <div style={styles.ingredientBadges}>
                  {recipe.ingredients.map((ing, idx) => (
                    <span key={idx} style={styles.badge}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div style={styles.section}>
                <span style={styles.sectionLabel}>Instructions</span>
                <p style={styles.instructions}>{recipe.instructions}</p>
              </div>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteRecipe(recipe._id)}
              >
                🗑️ Delete Recipe
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
    padding: "45px 20px",
    minHeight: "100vh",
    backgroundColor: "#FCFAF6",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },

  hero: {
    textAlign: "center",
    marginBottom: "40px",
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

  loader: {
    textAlign: "center",
    padding: "80px",
    color: "#5C6B61",
    fontWeight: "600",
    fontSize: "16px",
  },

  empty: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "60px 20px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(14, 41, 28, 0.02)",
    border: "1px solid #ECEAE3",
    maxWidth: "500px",
    margin: "40px auto 0 auto",
    color: "#5C6B61",
  },

  emptyIcon: {
    fontSize: "44px",
    display: "block",
    marginBottom: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(14, 41, 28, 0.03)",
    border: "1px solid #ECEAE3",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    transition: "transform 0.2s ease",
  },

  cardTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0E291C",
    margin: 0,
    letterSpacing: "-0.4px",
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  sectionLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    fontWeight: "800",
    letterSpacing: "0.8px",
    color: "#3A6351",
  },

  ingredientBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "4px",
  },

  badge: {
    backgroundColor: "#FCFAF6",
    color: "#5C6B61",
    border: "1px solid #ECEAE3",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
  },

  instructions: {
    fontSize: "14px",
    color: "#5C6B61",
    lineHeight: "1.5",
    margin: 0,
    maxHeight: "150px",
    overflowY: "auto",
    paddingRight: "4px",
  },

  deleteBtn: {
    marginTop: "auto",
    backgroundColor: "#FDF2F0",
    color: "#E05A47",
    border: "1px solid #FADBD8",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    transition: "all 0.2s ease",
    textAlign: "center",
  },
};
