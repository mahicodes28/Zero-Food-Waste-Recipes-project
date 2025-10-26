import { useEffect, useState } from "react";
import axios from "axios";

function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes`);
        setRecipes(res.data);
      } catch (error) {
        console.error(" Error fetching recipes:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;

  return (
    <div className="p-4">
      <h1>Saved Recipes</h1>
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <ul>
          {recipes.map((r) => (
            <li key={r._id}>
              <h3>{r.title}</h3>
              <p><strong>Ingredients:</strong> {r.ingredients.join(", ")}</p>
              <p><strong>Instructions:</strong> {r.instructions}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedRecipes;
