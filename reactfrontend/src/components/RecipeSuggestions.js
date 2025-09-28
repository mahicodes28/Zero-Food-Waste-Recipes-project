import React, { useState } from "react";

function RecipeSuggestions({ ingredients, setIngredients }) {
  const [recipes, setRecipes] = useState([]);

  if (ingredients.length === 0) {
    return (
      <p className="text-gray-600 mt-6 text-lg">
        🍽️ Add some ingredients to see recipe suggestions!
      </p>
    );
  }

  const handleRemove = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleGetRecipes = () => {
    // Fake recipes (later this can be AI or backend)
    const sampleRecipes = [
      {
        title: "Veggie Stir Fry",
        details: "Quick stir fry using onion, tomato, and rice.",
      },
      {
        title: "Zero-Waste Soup",
        details: "Use leftover veggies to make a hearty soup.",
      },
      {
        title: "Stuffed Tomatoes",
        details: "Fill tomatoes with rice & herbs for a tasty snack.",
      },
    ];
    setRecipes(sampleRecipes);
  };

  return (
    <div className="mt-6 w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">
        Your Ingredients 🌿
      </h2>
      <ul className="space-y-3 mb-6">
        {ingredients.map((ingredient, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm text-gray-800"
          >
            <span>🧄 {ingredient}</span>
            <button
              onClick={() => handleRemove(index)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-md"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Get Recipes Button */}
      <button
        onClick={handleGetRecipes}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
      >
        Get Recipes
      </button>

      {/* Display Recipes */}
      {recipes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-green-700 mb-3 text-center">
            Suggested Recipes 🍴
          </h3>
          <div className="space-y-4">
            {recipes.map((recipe, i) => (
              <div
                key={i}
                className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm"
              >
                <h4 className="text-lg font-bold text-green-800">
                  {recipe.title}
                </h4>
                <p className="text-gray-700">{recipe.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeSuggestions;
