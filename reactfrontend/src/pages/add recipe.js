// import { useState } from 'react';
// import axios from 'axios';

// function AddRecipe() {
//   const [title, setTitle] = useState('');
//   const [ingredients, setIngredients] = useState('');
//   const [instructions, setInstructions] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/recipes', {
//         title,
//         ingredients: ingredients.split(','), // comma-separated
//         instructions
//       });
//       console.log('Recipe added:', response.data);
//       setTitle('');
//       setIngredients('');
//       setInstructions('');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         required
//       />
//       <input
//         type="text"
//         placeholder="Ingredients (comma separated)"
//         value={ingredients}
//         onChange={(e) => setIngredients(e.target.value)}
//         required
//       />
//       <textarea
//         placeholder="Instructions"
//         value={instructions}
//         onChange={(e) => setInstructions(e.target.value)}
//         required
//       />
//       <button type="submit">Add Recipe</button>
//     </form>
//   );
// }

// export default AddRecipe;
