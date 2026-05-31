import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    foodSavedKg: 0,
    moneySavedINR: 0,
    co2ReducedKg: 0,
    recipesGenerated: 0,
    itemsRescued: 0,
  });

  const [charts, setCharts] = useState({
    categories: [],
    weekly: [],
    monthly: [],
    wasteReductionPercentage: 100,
  });

  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, chartsRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/dashboard`),
        axios.get(`${API_URL}/api/analytics/charts`),
      ]);
      setStats(statsRes.data);
      setCharts(chartsRes.data);
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Helper: Get random colors for category allocations
  const colors = ["#2E7D32", "#4CAF50", "#8BC34A", "#CDDC39", "#FFC107", "#FF9800", "#795548", "#9E9E9E"];

  // Render a responsive custom SVG Bar Chart for Trends (Weekly or Monthly)
  const renderTrendChart = (data, title, type = "weekly") => {
    if (data.length === 0) return <p style={styles.chartEmpty}>No trend data available yet.</p>;

    const chartHeight = 160;
    const chartWidth = 450;
    const padding = { top: 15, right: 15, bottom: 25, left: 30 };
    const graphWidth = chartWidth - padding.left - padding.right;
    const graphHeight = chartHeight - padding.top - padding.bottom;

    // Find max value to scale graph
    const maxVal = Math.max(
      ...data.map((d) => Math.max(d.saved, d.wasted)),
      2 // Default minimum scale
    );

    const getX = (index) => padding.left + (index * graphWidth) / (data.length - 0.5);
    const getY = (val) => padding.top + graphHeight - (val * graphHeight) / maxVal;

    return (
      <div style={styles.chartWrapper}>
        <h4 style={styles.chartTitle}>{title}</h4>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={styles.svg}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
            const y = padding.top + graphHeight * p;
            const labelVal = (maxVal * (1 - p)).toFixed(1);
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#F0F0F0"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 5}
                  y={y + 4}
                  fill="#7F8C8D"
                  fontSize="9"
                  textAnchor="end"
                  fontWeight="600"
                >
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Bar rendering for each data point */}
          {data.map((d, index) => {
            const x = getX(index);
            const barWidth = type === "weekly" ? 14 : 20;

            const ySaved = getY(d.saved);
            const heightSaved = padding.top + graphHeight - ySaved;

            const yWasted = getY(d.wasted);
            const heightWasted = padding.top + graphHeight - yWasted;

            return (
              <g key={index}>
                {/* Saved food (Green) */}
                <rect
                  x={x - barWidth}
                  y={ySaved}
                  width={barWidth}
                  height={Math.max(heightSaved, 1)}
                  fill="#2E7D32"
                  rx="3"
                  opacity="0.95"
                />
                {/* Wasted food (Red) */}
                <rect
                  x={x + 2}
                  y={yWasted}
                  width={barWidth}
                  height={Math.max(heightWasted, 1)}
                  fill="#C0392B"
                  rx="3"
                  opacity="0.95"
                />
                {/* Date Label */}
                <text
                  x={x}
                  y={chartHeight - 8}
                  fill="#5D4037"
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: "#2E7D32" }}></span>
            <span>Food Rescued (kg)</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, backgroundColor: "#C0392B" }}></span>
            <span>Food Wasted (kg)</span>
          </div>
        </div>
      </div>
    );
  };

  // Render a clean Donut / Stacked Bar for category allocations
  const renderCategoryAllocation = (categories) => {
    const totalRescued = categories.reduce((sum, c) => sum + c.value, 0);

    if (totalRescued === 0) {
      return (
        <div style={styles.chartWrapper}>
          <h4 style={styles.chartTitle}>Saved Category Breakdown</h4>
          <p style={styles.chartEmpty}>Start cooking expiring items to unlock category breakdowns!</p>
        </div>
      );
    }

    return (
      <div style={styles.chartWrapper}>
        <h4 style={styles.chartTitle}>Saved Category Breakdown</h4>
        <div style={styles.categoryLayout}>
          {/* Premium Stacked Bar representation showing percentages */}
          <div style={styles.stackedBarContainer}>
            {categories.map((c, idx) => {
              const pct = ((c.value / totalRescued) * 100).toFixed(1);
              if (c.value === 0) return null;
              return (
                <div
                  key={c.name}
                  style={{
                    backgroundColor: colors[idx % colors.length],
                    width: `${pct}%`,
                    height: "100%",
                    transition: "width 0.5s ease",
                  }}
                  title={`${c.name}: ${c.value}kg (${pct}%)`}
                ></div>
              );
            })}
          </div>

          <div style={styles.categoryList}>
            {categories.map((c, idx) => {
              const pct = ((c.value / totalRescued) * 100).toFixed(1);
              if (c.value === 0) return null;
              return (
                <div key={c.name} style={styles.catRow}>
                  <div style={styles.catNameBox}>
                    <span
                      style={{
                        ...styles.legendDot,
                        backgroundColor: colors[idx % colors.length],
                      }}
                    ></span>
                    <span style={styles.catLabel}>{c.name}</span>
                  </div>
                  <span style={styles.catVal}>
                    {c.value} kg ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🍃 Eco-Impact Dashboard</h1>
        <p style={styles.subtitle}>
          Visualizing your carbon footprint reduction, money saved, and food waste prevented.
        </p>
      </div>

      {loading ? (
        <div style={styles.loader}>Fetching your sustainability matrix...</div>
      ) : (
        <div style={styles.content}>
          {/* STATS METRIC GRID */}
          <div style={styles.grid}>
            <div style={styles.card}>
              <div style={styles.cardIcon}>🥬</div>
              <h3 style={styles.cardVal}>{stats.foodSavedKg} kg</h3>
              <p style={styles.cardLabel}>Food Rescued</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>💰</div>
              <h3 style={styles.cardVal}>₹{stats.moneySavedINR}</h3>
              <p style={styles.cardLabel}>Money Rescued</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>☁️</div>
              <h3 style={styles.cardVal}>{stats.co2ReducedKg} kg</h3>
              <p style={styles.cardLabel}>CO₂ Emissions Saved</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>🍳</div>
              <h3 style={styles.cardVal}>{stats.recipesGenerated}</h3>
              <p style={styles.cardLabel}>AI Recipes Cooked</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>🏆</div>
              <h3 style={styles.cardVal}>{stats.itemsRescued}</h3>
              <p style={styles.cardLabel}>Expiring Items Rescued</p>
            </div>
          </div>

          {/* DYNAMIC ANALYTICS AREA */}
          <div style={styles.analyticsLayout}>
            {/* LEFT AREA: TREND CHARTS */}
            <div style={styles.trendsColumn}>
              {renderTrendChart(charts.weekly, "Weekly Waste Rescued vs. Wasted Trend", "weekly")}
              {renderTrendChart(charts.monthly, "Monthly Waste Rescued vs. Wasted Trend", "monthly")}
            </div>

            {/* RIGHT AREA: UTILIZATION PIE CHART & WASTE REDUCTION PERCENT */}
            <div style={styles.allocationColumn}>
              {renderCategoryAllocation(charts.categories)}

              {/* WASTE REDUCTION PROGRESS RING */}
              <div style={styles.chartWrapper}>
                <h4 style={styles.chartTitle}>Rescued Efficiency Ratio</h4>
                <div style={styles.gaugeContainer}>
                  {/* Clean SVG Progress Ring */}
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#F0F0F0"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#2E7D32"
                      strokeWidth="10"
                      strokeDasharray="314.16"
                      strokeDashoffset={314.16 - (314.16 * charts.wasteReductionPercentage) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                    <text
                      x="60"
                      y="66"
                      textAnchor="middle"
                      fontSize="18"
                      fontWeight="bold"
                      fill="#2E7D32"
                    >
                      {charts.wasteReductionPercentage}%
                    </text>
                  </svg>
                  <div style={styles.gaugeText}>
                    <h5 style={styles.gaugeTitle}>Rescue Efficiency</h5>
                    <p style={styles.gaugeSub}>
                      Percentage of near-expiry ingredients saved from being wasted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// ECO-IMPACT VIEW PREMIUM STYLES
// ----------------------------------------------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#F9F6EE",
    padding: "35px 20px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    color: "#2E7D32",
    fontSize: "36px",
    fontWeight: "800",
    margin: 0,
  },
  subtitle: {
    color: "#5d4037",
    fontSize: "16px",
    marginTop: "5px",
    maxWidth: "800px",
    margin: "5px auto 0 auto",
  },
  loader: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#2E7D32",
    fontSize: "18px",
    fontWeight: "600",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "35px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "25px 20px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
    border: "1px solid #ECEBE4",
    transition: "transform 0.2s ease",
  },
  cardIcon: {
    fontSize: "36px",
    marginBottom: "10px",
  },
  cardVal: {
    color: "#2E7D32",
    fontSize: "26px",
    fontWeight: "800",
    margin: "5px 0",
  },
  cardLabel: {
    color: "#7F8C8D",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase",
    margin: 0,
  },
  analyticsLayout: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
  },
  trendsColumn: {
    flex: "1 1 500px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  allocationColumn: {
    flex: "1 1 450px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  chartWrapper: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
    border: "1px solid #ECEBE4",
  },
  chartTitle: {
    color: "#2E7D32",
    fontSize: "16px",
    fontWeight: "700",
    marginTop: 0,
    marginBottom: "20px",
  },
  chartEmpty: {
    color: "#7F8C8D",
    textAlign: "center",
    padding: "40px 10px",
    fontSize: "14px",
  },
  svg: {
    width: "100%",
    height: "auto",
    overflow: "visible",
  },
  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "15px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#5D4037",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
  },
  categoryLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  stackedBarContainer: {
    height: "20px",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    backgroundColor: "#F0F0F0",
  },
  categoryList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  catRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },
  catNameBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  catLabel: {
    color: "#5D4037",
    fontWeight: "600",
  },
  catVal: {
    color: "#7F8C8D",
    fontWeight: "600",
  },
  gaugeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    flexWrap: "wrap",
  },
  gaugeText: {
    flex: 1,
    minWidth: "200px",
  },
  gaugeTitle: {
    color: "#2E7D32",
    fontSize: "15px",
    fontWeight: "700",
    margin: "0 0 5px 0",
  },
  gaugeSub: {
    color: "#7F8C8D",
    fontSize: "13px",
    lineHeight: "1.4",
    margin: 0,
  },
};
