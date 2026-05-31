import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Pantry() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState("");
  const [category, setCategory] = useState("Vegetables");

  // Filtering & Sorting
  const [filter, setFilter] = useState("All"); // All, Fresh, Expiring Soon, Expired
  const [sortBy, setSortBy] = useState("expiryDate"); // expiryDate, name, category

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch all ingredients
  const fetchPantry = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/pantry`);
      setItems(res.data);
    } catch (error) {
      console.error("❌ Error fetching pantry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPantry();
  }, []);

  // Handle new item submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !quantity || !expiryDate) return;

    try {
      const payload = {
        name,
        quantity: parseFloat(quantity),
        unit,
        purchaseDate,
        expiryDate,
        category,
      };

      const res = await axios.post(`${API_URL}/api/pantry`, payload);
      setItems((prev) => [...prev, res.data].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)));

      // Reset form
      setName("");
      setQuantity("");
      setExpiryDate("");
    } catch (error) {
      console.error("❌ Error adding pantry item:", error);
    }
  };

  // Handle action (cook/waste)
  const handleAction = async (id, action) => {
    try {
      await axios.post(`${API_URL}/api/pantry/${id}/action`, { action });
      // Remove from view since it is archived/logged
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(`❌ Error logging action (${action}):`, error);
    }
  };

  // Helper: Calculate remaining days
  const getRemainingDays = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(dateStr);
    expDate.setHours(0, 0, 0, 0);
    const diffTime = expDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper: Determine badge color and label
  const getExpiryDetails = (dateStr) => {
    const days = getRemainingDays(dateStr);
    if (days < 0) return { label: "Expired", bg: "#FADBD8", color: "#C0392B", border: "#E6B0AA" };
    if (days === 0) return { label: "Expires Today", bg: "#FDEDEC", color: "#C0392B", border: "#F5C6CB" };
    if (days === 1) return { label: "Expires Tomorrow", bg: "#FEF9E7", color: "#D35400", border: "#FFE8A1" };
    if (days <= 3) return { label: `Expiring in ${days} days`, bg: "#FCF3CF", color: "#B7950B", border: "#F9E79F" };
    return { label: `Fresh (${days} days left)`, bg: "#E8F8F5", color: "#117A65", border: "#A3E4D7" };
  };

  // Filter & Sort Items
  const filteredItems = items.filter((item) => {
    const days = getRemainingDays(item.expiryDate);
    if (filter === "Fresh") return days > 3;
    if (filter === "Expiring Soon") return days >= 0 && days <= 3;
    if (filter === "Expired") return days < 0;
    return true; // All
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "expiryDate") {
      return new Date(a.expiryDate) - new Date(b.expiryDate);
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={styles.mainTitle}>🍂 Smart Pantry Manager</h1>
        <p style={styles.subtitle}>
          Keep track of your ingredients, minimize waste, and cook sustainably.
        </p>
      </div>

      <div style={styles.layout}>
        {/* ADD INGREDIENT SIDEBAR FORM */}
        <div style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Add Ingredient</h2>
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                placeholder="e.g. Spinach, Milk, Tomato"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.formGroup, flex: 2 }}>
                <label style={styles.label}>Qty</label>
                <input
                  type="number"
                  step="any"
                  placeholder="2.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ ...styles.formGroup, flex: 1.5 }}>
                <label style={styles.label}>Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={styles.select}
                >
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="liters">liters</option>
                  <option value="ml">ml</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.select}
              >
                <option value="Vegetables">Vegetables 🥦</option>
                <option value="Fruits">Fruits 🍎</option>
                <option value="Dairy">Dairy 🥛</option>
                <option value="Meat/Protein">Meat/Protein 🍗</option>
                <option value="Grains/Pantry">Grains/Pantry 🌾</option>
                <option value="Bakery">Bakery 🍞</option>
                <option value="Beverages">Beverages 🥤</option>
                <option value="Others">Others 📦</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Purchase Date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.addBtn}>
              + Add to Pantry
            </button>
          </form>
        </div>

        {/* INVENTORY LIST */}
        <div style={styles.inventoryArea}>
          <div style={styles.filterBar}>
            <div style={styles.filterGroup}>
              <span style={styles.filterLabel}>Filters:</span>
              {["All", "Fresh", "Expiring Soon", "Expired"].map((lbl) => (
                <button
                  key={lbl}
                  style={{
                    ...styles.filterBtn,
                    backgroundColor: filter === lbl ? "#2E7D32" : "#f1ebd9",
                    color: filter === lbl ? "white" : "#5d4037",
                  }}
                  onClick={() => setFilter(lbl)}
                >
                  {lbl}
                </button>
              ))}
            </div>

            <div style={styles.sortGroup}>
              <span style={styles.filterLabel}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.sortSelect}
              >
                <option value="expiryDate">Expiry Date</option>
                <option value="name">Alphabetical</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={styles.loader}>Loading items...</div>
          ) : sortedItems.length === 0 ? (
            <div style={styles.emptyCard}>
              <h3>No items found</h3>
              <p>Add some ingredients or change your filters to see results.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {sortedItems.map((item) => {
                const expiry = getExpiryDetails(item.expiryDate);
                const remainingDays = getRemainingDays(item.expiryDate);

                return (
                  <div key={item._id} style={styles.itemCard}>
                    <div style={styles.itemHeader}>
                      <span style={styles.categoryBadge}>{item.category}</span>
                      <span
                        style={{
                          ...styles.expiryTag,
                          backgroundColor: expiry.bg,
                          color: expiry.color,
                          borderColor: expiry.border,
                        }}
                      >
                        {expiry.label}
                      </span>
                    </div>

                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemQty}>
                      Quantity: <strong style={{ color: "#2E7D32" }}>{item.quantity} {item.unit}</strong>
                    </p>

                    <div style={styles.dates}>
                      <div>Purchased: {new Date(item.purchaseDate).toLocaleDateString()}</div>
                      <div>Expires: {new Date(item.expiryDate).toLocaleDateString()}</div>
                    </div>

                    <div style={styles.actions}>
                      <button
                        style={styles.cookBtn}
                        onClick={() => handleAction(item._id, "consume")}
                        title={remainingDays <= 3 ? "Rescues this item and earns Eco Points!" : "Mark as used"}
                      >
                        🍳 {remainingDays <= 3 ? "Cook & Rescue" : "Used"}
                      </button>
                      <button
                        style={styles.wasteBtn}
                        onClick={() => handleAction(item._id, "waste")}
                      >
                        🗑️ Waste
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// PRESET PREMIUM SUSTAINABLE PALETTE STYLES
// ----------------------------------------------------------------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#F9F6EE", // Warm organic bone cream
    padding: "30px 20px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  heroSection: {
    textAlign: "center",
    marginBottom: "35px",
  },
  mainTitle: {
    color: "#2E7D32", // Forest green
    fontSize: "36px",
    fontWeight: "800",
    margin: 0,
  },
  subtitle: {
    color: "#5d4037", // Warm brown
    fontSize: "16px",
    marginTop: "5px",
  },
  layout: {
    display: "flex",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
    flexWrap: "wrap",
  },
  formCard: {
    flex: "1 1 350px",
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
    border: "1px solid #ECEBE4",
  },
  sectionTitle: {
    color: "#2E7D32",
    fontSize: "22px",
    fontWeight: "700",
    marginTop: 0,
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  label: {
    color: "#5d4037",
    fontWeight: "600",
    fontSize: "14px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #dcdbd3",
    fontSize: "15px",
    outlineColor: "#2E7D32",
  },
  select: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #dcdbd3",
    fontSize: "15px",
    outlineColor: "#2E7D32",
    backgroundColor: "white",
  },
  addBtn: {
    padding: "12px",
    backgroundColor: "#2E7D32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    marginTop: "10px",
    transition: "background-color 0.2s ease",
  },
  inventoryArea: {
    flex: "3 1 700px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: "15px 20px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
    flexWrap: "wrap",
    gap: "15px",
  },
  filterGroup: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterLabel: {
    color: "#5d4037",
    fontWeight: "bold",
    fontSize: "14px",
    marginRight: "5px",
  },
  filterBtn: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease",
  },
  sortGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sortSelect: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #dcdbd3",
    fontSize: "13px",
    backgroundColor: "white",
    color: "#5d4037",
    fontWeight: "600",
  },
  loader: {
    textAlign: "center",
    padding: "50px",
    color: "#5d4037",
    fontSize: "18px",
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "50px 20px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)",
    color: "#5d4037",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  itemCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
    border: "1px solid #ECEBE4",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    gap: "8px",
  },
  categoryBadge: {
    backgroundColor: "#F1EBD9",
    color: "#5d4037",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  expiryTag: {
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
    border: "1px solid",
  },
  itemName: {
    color: "#2C3E50",
    fontSize: "18px",
    fontWeight: "700",
    margin: "5px 0",
  },
  itemQty: {
    margin: "5px 0",
    color: "#7F8C8D",
    fontSize: "14px",
  },
  dates: {
    fontSize: "12px",
    color: "#95A5A6",
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    borderTop: "1px solid #F5F5F5",
    paddingTop: "10px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  cookBtn: {
    flex: 2,
    padding: "8px 12px",
    backgroundColor: "#2E7D32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    transition: "background-color 0.2s ease",
  },
  wasteBtn: {
    flex: 1,
    padding: "8px 12px",
    backgroundColor: "#FDEDEC",
    color: "#C0392B",
    border: "1px solid #F5C6CB",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    transition: "background-color 0.2s ease",
  },
};
