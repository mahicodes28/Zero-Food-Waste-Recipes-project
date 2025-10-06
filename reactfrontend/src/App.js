import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FindRecipes from "./pages/FindRecipes";
import SavedRecipes from "./pages/SavedRecipes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/find" element={<FindRecipes />} />
        <Route path="/saved" element={<SavedRecipes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
