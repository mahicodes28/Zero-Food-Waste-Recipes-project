import React, { useState } from "react";

function IngredientInput({ setIngredients }) {
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);

  const handleAdd = () => {
    if (input.trim() !== "") {
      const newList = [...list, input];
      setList(newList);
      setIngredients(newList);
      setInput("");
    }
  };

  return (
    <div className="bg-white/90 p-4 rounded-xl shadow-lg max-w-md w-full">
      <h2 className="text-lg font-semibold text-green-800 mb-3">
         Type in your leftover ingredients and discover delicious zero-waste recipes instantly!!🌽🥦
      </h2>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., rice, tomato, onion"
          className="flex-grow border border-green-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Ingredients list */}
      <ul className="mt-4 space-y-1 text-green-900">
        {list.map((item, index) => (
          <li key={index} className="bg-green-100 px-2 py-1 rounded">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientInput;
