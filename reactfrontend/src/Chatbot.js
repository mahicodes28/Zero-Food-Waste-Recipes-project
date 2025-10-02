import { useState } from "react";

function Chatbot() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  const handleSend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setReply(data.reply);
    } catch (err) {
      console.error("Error talking to chatbot:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🍲 Zero Waste Recipe Chatbot</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your ingredients..."
        style={{ padding: "8px", width: "300px" }}
      />
      <button onClick={handleSend} style={{ marginLeft: "10px", padding: "8px" }}>
        Ask
      </button>
      {reply && (
        <div style={{ marginTop: "20px", padding: "10px", background: "#f0f0f0" }}>
          <strong>Chatbot:</strong> {reply}
        </div>
      )}
    </div>
  );
}

export default Chatbot;
