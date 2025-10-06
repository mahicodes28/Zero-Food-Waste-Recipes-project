import React from "react";

function DashboardCard({ title, value }) {
  return (
    <div style={{ flex: "1", margin: "10px", padding: "15px", background: "#f1f1f1", borderRadius: "8px", textAlign: "center" }}>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}

export default DashboardCard;
