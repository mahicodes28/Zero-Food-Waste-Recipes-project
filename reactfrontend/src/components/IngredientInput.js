import React, { useState } from "react";

export default function IngredientInput() {
  const [ingredient, setIngredient] = useState("");  // input box
  const [ingredients, setIngredients] = useState([]); // list of ingredients

  // Add new ingredient
  const addIngredient = () => {
    if (ingredient.trim() === "") return;
    setIngredients([...ingredients, ingredient]);
    setIngredient(""); // reset input
  };

  // Remove ingredient
  const removeIngredient = (index) => {
    const newList = ingredients.filter((_, i) => i !== index);
    setIngredients(newList);
  };

  return (
    <div>
      <h2>What ingredients do you have?</h2>

      {/* Input + Button */}
      <input
        type="text"
        value={ingredient}
        onChange={(e) => setIngredient(e.target.value)}
        placeholder="Enter an ingredient"
      />
      <button onClick={addIngredient}>Add</button>

      {/* List */}
      <ul>
        {ingredients.map((item, index) => (
          <li key={index}>
            {item} <button onClick={() => removeIngredient(index)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
