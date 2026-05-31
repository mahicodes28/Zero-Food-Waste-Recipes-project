const express = require("express");
const router = express.Router();
const ImpactLog = require("../models/ImpactLog");

// =========================================
// GET /api/analytics/dashboard → Aggregate lifetime stats
// =========================================
router.get("/dashboard", async (req, res) => {
  try {
    const stats = await ImpactLog.aggregate([
      {
        $group: {
          _id: null,
          totalWeightSaved: {
            $sum: {
              $cond: [{ $eq: ["$action", "consume_saved"] }, "$estimatedWeightKg", 0],
            },
          },
          totalMoneySaved: { $sum: "$moneySavedINR" },
          totalCo2Reduced: { $sum: "$co2ReducedKg" },
          recipesGeneratedCount: {
            $sum: { $cond: [{ $eq: ["$recipeGenerated", true] }, 1, 0] },
          },
          expiringRescuedCount: {
            $sum: { $cond: [{ $eq: ["$action", "consume_saved"] }, 1, 0] },
          },
        },
      },
    ]);

    // Handle empty database case gracefully
    const defaultStats = {
      foodSavedKg: 0,
      moneySavedINR: 0,
      co2ReducedKg: 0,
      recipesGenerated: 0,
      itemsRescued: 0,
    };

    if (stats.length > 0) {
      defaultStats.foodSavedKg = parseFloat(stats[0].totalWeightSaved.toFixed(2));
      defaultStats.moneySavedINR = Math.round(stats[0].totalMoneySaved);
      defaultStats.co2ReducedKg = parseFloat(stats[0].totalCo2Reduced.toFixed(2));
      defaultStats.recipesGenerated = stats[0].recipesGeneratedCount;
      defaultStats.itemsRescued = stats[0].expiringRescuedCount;
    }

    res.status(200).json(defaultStats);
  } catch (error) {
    console.error("❌ Error fetching dashboard analytics:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// =========================================
// GET /api/analytics/charts → Daily, Monthly, and Category allocations
// =========================================
router.get("/charts", async (req, res) => {
  try {
    // 1. Group by category for Pie Chart (only including saved actions)
    const categoryAllocation = await ImpactLog.aggregate([
      { $match: { action: "consume_saved" } },
      {
        $group: {
          _id: "$category",
          weight: { $sum: "$estimatedWeightKg" },
        },
      },
      { $sort: { weight: -1 } },
    ]);

    // Format category distribution
    const formattedCategories = categoryAllocation.map((item) => ({
      name: item._id,
      value: parseFloat(item.weight.toFixed(2)),
    }));

    // 2. Fetch Weekly Trend (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyTrend = await ImpactLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          saved: {
            $sum: {
              $cond: [{ $eq: ["$action", "consume_saved"] }, "$estimatedWeightKg", 0],
            },
          },
          wasted: {
            $sum: {
              $cond: [{ $eq: ["$action", "waste"] }, "$estimatedWeightKg", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in last 7 days gaps so chart is continuous and beautiful
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0];
      const match = weeklyTrend.find((item) => item._id === dateString);

      // Get short day label (e.g. Mon, Tue)
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });

      weeklyData.push({
        label: dayLabel,
        date: dateString,
        saved: match ? parseFloat(match.saved.toFixed(2)) : 0,
        wasted: match ? parseFloat(match.wasted.toFixed(2)) : 0,
      });
    }

    // 3. Fetch Monthly Trend (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of month

    const monthlyTrend = await ImpactLog.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          saved: {
            $sum: {
              $cond: [{ $eq: ["$action", "consume_saved"] }, "$estimatedWeightKg", 0],
            },
          },
          wasted: {
            $sum: {
              $cond: [{ $eq: ["$action", "waste"] }, "$estimatedWeightKg", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const yearMonth = d.toISOString().substring(0, 7); // YYYY-MM
      const match = monthlyTrend.find((item) => item._id === yearMonth);
      const monthLabel = d.toLocaleDateString("en-US", { month: "short" });

      monthlyData.push({
        label: monthLabel,
        yearMonth: yearMonth,
        saved: match ? parseFloat(match.saved.toFixed(2)) : 0,
        wasted: match ? parseFloat(match.wasted.toFixed(2)) : 0,
      });
    }

    // Calculate overall waste reduction percentage: saved / (saved + wasted)
    const lifetimeAgg = await ImpactLog.aggregate([
      {
        $group: {
          _id: null,
          totalSaved: {
            $sum: {
              $cond: [{ $eq: ["$action", "consume_saved"] }, "$estimatedWeightKg", 0],
            },
          },
          totalWasted: {
            $sum: {
              $cond: [{ $eq: ["$action", "waste"] }, "$estimatedWeightKg", 0],
            },
          },
        },
      },
    ]);

    let wasteReductionPercentage = 100; // Perfect if zero records
    if (lifetimeAgg.length > 0) {
      const saved = lifetimeAgg[0].totalSaved;
      const wasted = lifetimeAgg[0].totalWasted;
      const total = saved + wasted;
      if (total > 0) {
        wasteReductionPercentage = Math.round((saved / total) * 100);
      }
    }

    // If there is absolutely no category data, provide default demo categories so the visual pie chart shows nicely initially
    const finalCategories =
      formattedCategories.length > 0
        ? formattedCategories
        : [
            { name: "Vegetables", value: 0 },
            { name: "Fruits", value: 0 },
            { name: "Dairy", value: 0 },
            { name: "Meat/Protein", value: 0 },
            { name: "Grains/Pantry", value: 0 },
          ];

    res.status(200).json({
      categories: finalCategories,
      weekly: weeklyData,
      monthly: monthlyData,
      wasteReductionPercentage,
    });
  } catch (error) {
    console.error("❌ Error fetching chart analytics:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
