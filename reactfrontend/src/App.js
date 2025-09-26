import React, { useState } from "react";

function App() {
  const [ingredient, setIngredient] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You entered: ${ingredient}`);
    setIngredient("");
  };

  return (
    <div
      style={{
        backgroundImage: "url('/ZeroWaste.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 48, 19, 0.5)",
          zIndex: 1,
        }}
      ></div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "white",
          padding: "20px",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "30px" }}>
          Zero Food Waste Recipes
        </h1>
        <p>Tell us what ingredients you have in your kitchen and we’ll suggest creative recipes to use them up!</p>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="text"
            placeholder="Enter ingredient..."
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            style={{
              padding: "12px 15px",
              borderRadius: "8px",
              border: "none",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 15px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#ff9900",
              color: "white",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e68a00")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ff9900")}
          >
            Search Recipes
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
