import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/header";

// Pages
import HomePage from "./pages/HomePage";
import SavedRecipes from "./pages/SavedRecipes";
import AddRecipes from "./pages/AddRecipes";
import Chatbot from "./pages/Chatbot";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/saved" element={<SavedRecipes />} />
        <Route path="/add" element={<AddRecipes />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
