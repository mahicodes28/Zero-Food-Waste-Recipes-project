import React, { useState } from "react";
import RecipeCard from "../components/RecipeCard";

const sampleRecipes = [
  { id: 1, name: "Vegetable Soup", image: "https://via.placeholder.com/300x200" },
  { id: 2, name: "Fruit Salad", image: "https://via.placeholder.com/300x200" },
  { id: 3, name: "Bread Pizza", image: "https://via.placeholder.com/300x200" },
];

function Home() {
  const [query, setQuery] = useState("");

  const filteredRecipes = sampleRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1>Find Recipes From Leftover Food</h1>
      <input
        type="text"
        placeholder="Enter ingredients..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="recipe-list">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default Home;
