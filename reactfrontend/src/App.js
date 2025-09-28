import React, { useState } from "react";
import IngredientInput from "./components/IngredientInput";
import RecipeSuggestions from "./components/RecipeSuggestions";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [showRecipe, setShowRecipe] = useState(false);

  const handleGenerateRecipe = () => {
    if (ingredients.length > 0) {
      setShowRecipe(true);
    } else {
      alert("Please add at least one ingredient first!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(to bottom right, #a8e6cf, #dcedc1)", // 🌱 eco gradient
      }}
    >
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-green-900 text-center">
          Zero Waste Recipe Generator 🌱
        </h1>
        <p className="mb-6 text-green-800 text-lg text-center">
          Enter the ingredients you already have at home and we’ll help you turn
          them into delicious, zero-waste recipes!
        </p>

        {/* Ingredient Input Form */}
        <div className="flex justify-center mb-4">
          <IngredientInput setIngredients={setIngredients} />
        </div>

        {/* Generate Recipe Button */}
        <button
          onClick={handleGenerateRecipe}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Generate Recipe
        </button>

        {/* Recipe Suggestions */}
        {showRecipe && <RecipeSuggestions ingredients={ingredients} />}
      </div>
    </div>
  );
}

export default App;
