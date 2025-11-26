import React, { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const API_URL = "http://localhost:5000/api/chatbot";

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message
    setMessages((prev) => [...prev, { from: "user", text: input }]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // Add bot's reply
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error: Unable to connect to server." },
      ]);
    }

    setInput(""); // Clear input
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>👨‍🍳 Your Chat-Cook</h2>
        <p style={styles.subtitle}>Your personal AI cooking assistant</p>

        <div style={styles.chatBox}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.from === "user" ? "#7B4F2A" : "#f5f5f5",
                color: msg.from === "user" ? "white" : "#333",
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="Ask about cooking, ingredients, tips..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------
//  Styles
// ------------------------------------
const styles = {
  container: {
    minHeight: "100vh",
    background: "#fff5eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },

  card: {
    width: "450px",
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    color: "#7B4F2A",
  },

  subtitle: {
    textAlign: "center",
    marginTop: "5px",
    marginBottom: "20px",
    fontSize: "14px",
    color: "#555",
  },

  chatBox: {
    background: "#fafafa",
    height: "350px",
    borderRadius: "12px",
    padding: "15px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
    border: "1px solid #ddd",
  },

  message: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: "10px",
    marginBottom: "10px",
    fontSize: "14px",
    lineHeight: "1.4",
  },

  inputRow: {
    display: "flex",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },

  button: {
    padding: "12px 20px",
    backgroundColor: "#7B4F2A",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
