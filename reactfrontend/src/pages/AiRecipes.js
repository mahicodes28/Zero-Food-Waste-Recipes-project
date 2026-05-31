import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AiRecipes() {
  const [pantryItems, setPantryItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loadingPantry, setLoadingPantry] = useState(true);
  
  // Generation State
  const [generating, setGenerating] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch ingredients
  const fetchPantry = async () => {
    try {
      setLoadingPantry(true);
      const res = await axios.get(`${API_URL}/api/pantry`);
      setPantryItems(res.data);
      
      // Auto pre-check items expiring in 3 days or less!
      const expiringIds = res.data
        .filter((item) => {
          const days = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return days <= 3;
        })
        .map((item) => item._id);
      setSelectedIds(expiringIds);
    } catch (error) {
      console.error("❌ Error fetching pantry:", error);
    } finally {
      setLoadingPantry(false);
    }
  };

  useEffect(() => {
    fetchPantry();
  }, []);

  // Handle Checkbox Selection
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Generate Recipe
  const handleGenerate = async () => {
    setGenerating(true);
    setRecipe(null);
    setSaveMessage("");

    try {
      const res = await axios.post(`${API_URL}/api/ai-recipes/generate`, {
        ingredientIds: selectedIds,
      });
      setRecipe(res.data.recipe);
    } catch (error) {
      console.error("❌ Error generating recipe:", error);
      alert(error.response?.data?.message || "Failed to generate recipe. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Save generated recipe to user cookbook
  const handleSaveRecipe = async () => {
    if (!recipe) return;
    setSaveMessage("");

    try {
      const payload = {
        title: recipe.recipe_name,
        ingredients: recipe.ingredients,
        instructions: recipe.steps.join("\n\n"),
      };

      await axios.post(`${API_URL}/api/recipes`, payload);
      setSaveMessage("✨ Saved successfully to your Recipes collection!");
    } catch (error) {
      console.error("❌ Error saving recipe:", error);
      setSaveMessage("⚠️ Failed to save recipe. Please try again.");
    }
  };

  // Helper: Days remaining count
  const getRemainingDays = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(dateStr);
    expDate.setHours(0, 0, 0, 0);
    return Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>👨‍🍳 Expiry-Aware AI Chef</h1>
        <p style={styles.subtitle}>
          Select ingredients from your pantry, and let our zero-waste AI curate a gourmet rescue recipe!
        </p>
      </div>

      <div style={styles.layout}>
        {/* INGREDIENT SELECT PANEL */}
        <div style={styles.pantryPanel}>
          <h2 style={styles.panelTitle}>1. Choose Ingredients</h2>
          <p style={styles.instructions}>
            Pre-selected items are expiring soon. Check/uncheck to customize your meal.
          </p>

          {loadingPantry ? (
            <p style={styles.loader}>Loading your pantry inventory...</p>
          ) : pantryItems.length === 0 ? (
            <div style={styles.emptyPantry}>
              <p>Your pantry is empty! Add ingredients first.</p>
              <a href="/pantry" style={styles.linkButton}>Go to Pantry</a>
            </div>
          ) : (
            <div style={styles.checklist}>
              {pantryItems.map((item) => {
                const daysLeft = getRemainingDays(item.expiryDate);
                const isUrgent = daysLeft <= 3;
                const isSelected = selectedIds.includes(item._id);

                return (
                  <label
                    key={item._id}
                    style={{
                      ...styles.checkItem,
                      backgroundColor: isSelected ? "#F1F9F6" : "white",
                      borderColor: isSelected ? "#2E7D32" : "#ECEBE4",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(item._id)}
                      style={styles.checkbox}
                    />
                    <div style={styles.itemMeta}>
                      <span style={styles.itemName}>
                        {item.name} <span style={styles.itemQty}>({item.quantity} {item.unit})</span>
                      </span>
                      <span style={styles.itemCategory}>{item.category}</span>
                    </div>

                    {isUrgent && (
                      <span
                        style={{
                          ...styles.rescueBadge,
                          backgroundColor: daysLeft < 0 ? "#FADBD8" : "#FCF3CF",
                          color: daysLeft < 0 ? "#C0392B" : "#B7950B",
                        }}
                      >
                        ⚠️ {daysLeft < 0 ? "Expired" : daysLeft === 0 ? "Expires Today" : `Expires in ${daysLeft}d`}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating || selectedIds.length === 0}
            style={{
              ...styles.generateButton,
              backgroundColor: selectedIds.length === 0 ? "#BDC3C7" : "#2E7D32",
              cursor: selectedIds.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {generating ? "🍳 Chef is cooking up ideas..." : `Generate Rescue Recipe (${selectedIds.length})`}
          </button>
        </div>

        {/* RECIPE CARD VIEW */}
        <div style={styles.recipePanel}>
          {generating && (
            <div style={styles.aiWorking}>
              <div style={styles.spinner}></div>
              <h3 style={styles.loaderText}>Formulating Zero-Waste Meal Plan...</h3>
              <p style={styles.loaderSub}>Analyzing nutritional pairings and maximizing rescues...</p>
            </div>
          )}

          {!generating && !recipe && (
            <div style={styles.placeholderCard}>
              <div style={styles.chefHatIcon}>🍳</div>
              <h3>Ready to cook?</h3>
              <p>Select your pantry items on the left and hit generate to get customized culinary guidance.</p>
            </div>
          )}

          {!generating && recipe && (
            <div style={styles.recipeCard}>
              <div style={styles.recipeHeader}>
                <h2 style={styles.recipeName}>🍛 {recipe.recipe_name}</h2>
                <div style={styles.metaRow}>
                  <span style={styles.metaBadge}>⏰ {recipe.cooking_time}</span>
                  <span style={styles.metaBadge}>🔥 {recipe.difficulty}</span>
                </div>
              </div>

              <p style={styles.recipeDescription}>{recipe.description}</p>

              {/* WASTED SAVED NOTATION */}
              <div style={styles.ecoBox}>
                <h4 style={styles.ecoBoxTitle}>🍃 Waste Rescued Impact</h4>
                <p style={styles.ecoBoxText}>{recipe.waste_prevention_reason}</p>
              </div>

              {/* INGREDIENTS LIST */}
              <div style={styles.section}>
                <h3 style={styles.sectionHeader}>Ingredients Required</h3>
                <ul style={styles.list}>
                  {recipe.ingredients.map((ing, index) => (
                    <li key={index} style={styles.listItem}>
                      ✔ {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* STEPS LIST */}
              <div style={styles.section}>
                <h3 style={styles.sectionHeader}>Cooking Steps</h3>
                <ol style={styles.orderedList}>
                  {recipe.steps.map((step, index) => (
                    <li key={index} style={styles.orderedItem}>
                      <span style={styles.stepNum}>{index + 1}</span>
                      <p style={styles.stepText}>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* RECIPE CONTROLS */}
              <div style={styles.controls}>
                <button onClick={handleSaveRecipe} style={styles.saveBtn}>
                  ⭐ Save Recipe
                </button>
                <button onClick={handleGenerate} style={styles.regenBtn}>
                  🔄 Regenerate
                </button>
              </div>

              {saveMessage && <p style={styles.saveMsg}>{saveMessage}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// AI RECIPE VIEW PREMIUM STYLES
// ----------------------------------------------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#F9F6EE",
    padding: "35px 20px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  hero: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    color: "#2E7D32",
    fontSize: "36px",
    fontWeight: "800",
    margin: 0,
  },
  subtitle: {
    color: "#5d4037",
    fontSize: "16px",
    marginTop: "5px",
    maxWidth: "800px",
    margin: "5px auto 0 auto",
  },
  layout: {
    display: "flex",
    gap: "35px",
    maxWidth: "1200px",
    margin: "0 auto",
    flexWrap: "wrap",
  },
  pantryPanel: {
    flex: "1 1 400px",
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
    border: "1px solid #ECEBE4",
    display: "flex",
    flexDirection: "column",
    maxHeight: "750px",
  },
  panelTitle: {
    color: "#2E7D32",
    fontSize: "22px",
    fontWeight: "700",
    marginTop: 0,
    marginBottom: "5px",
  },
  instructions: {
    fontSize: "14px",
    color: "#7F8C8D",
    marginBottom: "20px",
  },
  loader: {
    textAlign: "center",
    padding: "30px",
    color: "#7F8C8D",
  },
  emptyPantry: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#5d4037",
  },
  linkButton: {
    display: "inline-block",
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: "#2E7D32",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  checklist: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    flex: 1,
    paddingRight: "5px",
    marginBottom: "20px",
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  checkbox: {
    marginRight: "15px",
    width: "18px",
    height: "18px",
    accentColor: "#2E7D32",
  },
  itemMeta: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  itemName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#2C3E50",
  },
  itemQty: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#7F8C8D",
  },
  itemCategory: {
    fontSize: "11px",
    color: "#95A5A6",
    textTransform: "uppercase",
    fontWeight: "600",
    marginTop: "2px",
  },
  rescueBadge: {
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
  },
  generateButton: {
    padding: "14px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  },
  recipePanel: {
    flex: "2 1 600px",
    display: "flex",
    flexDirection: "column",
  },
  aiWorking: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "60px 20px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
    border: "1px solid #ECEBE4",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #F3F3F3",
    borderTop: "5px solid #2E7D32",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px auto",
  },
  loaderText: {
    color: "#2E7D32",
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 5px 0",
  },
  loaderSub: {
    color: "#7F8C8D",
    fontSize: "14px",
    margin: 0,
  },
  placeholderCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "80px 20px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
    border: "1px solid #ECEBE4",
    color: "#7F8C8D",
  },
  chefHatIcon: {
    fontSize: "50px",
    marginBottom: "15px",
  },
  recipeCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)",
    border: "1px solid #ECEBE4",
  },
  recipeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "15px",
    borderBottom: "1px solid #F5F5F5",
    paddingBottom: "15px",
    marginBottom: "15px",
  },
  recipeName: {
    color: "#2E7D32",
    fontSize: "26px",
    fontWeight: "800",
    margin: 0,
  },
  metaRow: {
    display: "flex",
    gap: "10px",
  },
  metaBadge: {
    backgroundColor: "#F1EBD9",
    color: "#5d4037",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },
  recipeDescription: {
    color: "#555",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 20px 0",
  },
  ecoBox: {
    backgroundColor: "#E8F8F5",
    borderLeft: "5px solid #117A65",
    padding: "15px",
    borderRadius: "0 12px 12px 0",
    marginBottom: "25px",
  },
  ecoBoxTitle: {
    color: "#117A65",
    margin: "0 0 5px 0",
    fontSize: "14px",
    fontWeight: "700",
  },
  ecoBoxText: {
    color: "#16A085",
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.5",
  },
  section: {
    marginBottom: "25px",
  },
  sectionHeader: {
    color: "#2E7D32",
    fontSize: "18px",
    fontWeight: "700",
    borderBottom: "1px solid #ECEBE4",
    paddingBottom: "8px",
    marginBottom: "12px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  listItem: {
    color: "#555",
    fontSize: "14px",
  },
  orderedList: {
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    listStyleType: "none",
  },
  orderedItem: {
    display: "flex",
    gap: "15px",
    alignItems: "flex-start",
  },
  stepNum: {
    backgroundColor: "#2E7D32",
    color: "white",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "700",
    flexShrink: 0,
  },
  stepText: {
    margin: 0,
    color: "#555",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  controls: {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
  },
  saveBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#2E7D32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    transition: "background-color 0.2s ease",
  },
  regenBtn: {
    padding: "12px 20px",
    backgroundColor: "#F1EBD9",
    color: "#5d4037",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    transition: "background-color 0.2s ease",
  },
  saveMsg: {
    marginTop: "15px",
    textAlign: "center",
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: "14px",
  },
};
