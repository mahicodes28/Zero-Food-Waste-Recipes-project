import React, { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hello! I am Your Chat-Cook. Ask me for substitution ideas, zero-waste cooking advice, or how to rescue expiring ingredients!",
    },
  ]);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message
    setMessages((prev) => [...prev, { from: "user", text: input }]);

    try {
      const res = await fetch(`${API_URL}/api/chatbot`, {
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
        { from: "bot", text: "⚠️ Error: Unable to connect to Chef API." },
      ]);
    }

    setInput(""); // Clear input
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heading}>👨‍🍳 Chat-Cook Assistant</h1>
        <p style={styles.subtitle}>
          Your interactive, sustainability-focused AI chef. Get instant swaps, eco tips, and kitchen guidance.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.chefAvatar}>🍳</span>
          <div>
            <h3 style={styles.chefName}>Your Chat-Cook</h3>
            <span style={styles.chefStatus}>🟢 Active Chef AI</span>
          </div>
        </div>

        <div style={styles.chatBox}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageWrapper,
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.from === "bot" && <span style={styles.msgAvatar}>👨‍🍳</span>}
              <div
                style={{
                  ...styles.message,
                  backgroundColor: msg.from === "user" ? "#3A6351" : "#FCFAF6",
                  color: msg.from === "user" ? "white" : "#1C2D24",
                  border: msg.from === "user" ? "none" : "1px solid #ECEAE3",
                  borderRadius:
                    msg.from === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder="e.g. Can I swap butter for olive oil? What can I make with old milk?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
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

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#FCFAF6",
    padding: "45px 20px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  hero: {
    textAlign: "center",
    marginBottom: "35px",
  },

  heading: {
    fontSize: "34px",
    fontWeight: "800",
    color: "#0E291C",
    margin: 0,
    letterSpacing: "-0.8px",
  },

  subtitle: {
    fontSize: "15px",
    color: "#5C6B61",
    marginTop: "5px",
    maxWidth: "600px",
    margin: "5px auto 0 auto",
  },

  card: {
    width: "100%",
    maxWidth: "520px",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(14, 41, 28, 0.03)",
    border: "1px solid #ECEAE3",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  cardHeader: {
    backgroundColor: "#FCFAF6",
    borderBottom: "1px solid #ECEAE3",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  chefAvatar: {
    fontSize: "24px",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "white",
    border: "1px solid #ECEAE3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  chefName: {
    color: "#0E291C",
    fontSize: "15px",
    fontWeight: "800",
    margin: 0,
  },

  chefStatus: {
    color: "#117A65",
    fontSize: "11px",
    fontWeight: "700",
  },

  chatBox: {
    height: "360px",
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  messageWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    maxWidth: "85%",
  },

  msgAvatar: {
    fontSize: "14px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#F1EBD9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginBottom: "2px",
  },

  message: {
    padding: "11px 15px",
    fontSize: "14px",
    lineHeight: "1.5",
    fontWeight: "500",
  },

  inputRow: {
    display: "flex",
    gap: "10px",
    padding: "16px 20px",
    borderTop: "1px solid #ECEAE3",
    backgroundColor: "white",
  },

  input: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #ECEAE3",
    fontSize: "14px",
    outlineColor: "#3A6351",
    fontFamily: "inherit",
  },

  button: {
    padding: "12px 20px",
    backgroundColor: "#3A6351",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    transition: "background-color 0.2s ease",
  },
};
