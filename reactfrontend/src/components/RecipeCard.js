 // src/components/RecipeCard.js
import React from "react";

function RecipeCard({ recipe }) {
  return (
    <div className="card" style={{
      margin: "10px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      width: "250px",
      textAlign: "center",
      background: "white"
    }}>
      <img
        src={recipe.image}
        alt={recipe.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "6px"
        }}
      />
      <h3>{recipe.name}</h3>
    </div>
  );
}

export default RecipeCard;
