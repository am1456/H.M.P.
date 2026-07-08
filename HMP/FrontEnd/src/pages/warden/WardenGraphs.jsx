import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LineChart } from "lucide-react";
import Chart from "chart.js/auto";
import apiClient from "@/api/axios";
import useTheme from "@/context/ThemeContext";

const WardenGraphs = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch 12-month stats on mount
  useEffect(() => {
    let active = true;
    const fetchCategoryStats = async () => {
      try {
        const response = await apiClient.get("/api/v1/complaints/category-stats");
        if (active) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching category stats", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchCategoryStats();
    return () => {
      active = false;
    };
  }, []);

  // Update or build the chart when data or themeMode changes
  useEffect(() => {
    if (loading || !chartRef.current || data.length === 0) return;

    // Destroy any existing chart instance to prevent canvas overlap/glitches
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const isDark = themeMode === "dark";

    // Setup visual parameters based on current theme
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)";
    const textColor = isDark ? "#9ca3af" : "#4b5563"; // gray-400 vs gray-600

    // 1. Generate the timeline of the last 12 months dynamically
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed for key mapping
      const monthStr = String(month).padStart(2, "0");
      const key = `${year}-${monthStr}`;
      
      const label = d.toLocaleString("default", { month: "short", year: "numeric" });
      months.push({ key, label });
    }

    // 2. Put raw API data inside a map for fast $O(1)$ lookups
    const statsMap = {};
    data.forEach((item) => {
      const year = item._id.year;
      const month = String(item._id.month).padStart(2, "0");
      const category = item._id.category;
      const key = `${year}-${month}_${category}`;
      statsMap[key] = item.count;
    });

    // 3. Define the list of categories and color configs
    const categories = ["electrician", "plumber", "cleaner", "network", "carpenter"];
    
    // Cohesive colors optimized to look premium on both light & dark backgrounds
    const colors = {
      electrician: { stroke: "#a855f7", fill: "rgba(168, 85, 247, 0.05)" }, // Purple
      plumber: { stroke: "#3b82f6", fill: "rgba(59, 130, 246, 0.05)" },     // Blue
      cleaner: { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.05)" },     // Green
      network: { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.05)" },     // Orange
      carpenter: { stroke: "#ef4444", fill: "rgba(239, 68, 68, 0.05)" },     // Red
    };

    // 4. Generate datasets
    const datasets = categories.map((cat) => {
      const counts = months.map((m) => {
        const key = `${m.key}_${cat}`;
        return statsMap[key] || 0;
      });

      const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);

      return {
        label: catLabel,
        data: counts,
        borderColor: colors[cat]?.stroke || "#6b7280",
        backgroundColor: colors[cat]?.fill || "transparent",
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2.5,
        fill: false, // Pure line chart
      };
    });

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: months.map((m) => m.label),
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: textColor,
              padding: 20,
              font: {
                size: 12,
                family: "Inter, sans-serif",
                weight: "500",
              },
            },
          },
          tooltip: {
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            titleColor: isDark ? "#ffffff" : "#1f2937",
            bodyColor: isDark ? "#e5e7eb" : "#4b5563",
            borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
            borderWidth: 1,
            padding: 12,
            usePointStyle: true,
          },
        },
        scales: {
          x: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              font: {
                size: 11,
                family: "Inter, sans-serif",
              },
            },
          },
          y: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              stepSize: 1,
              font: {
                size: 11,
                family: "Inter, sans-serif",
              },
            },
            min: 0,
          },
        },
      },
    });

    // Cleanup chart on unmount or re-render
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, themeMode, loading]);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      
      {/* 1. Header with back button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/warden/dashboard")}
          className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <LineChart size={24} className="text-purple-600 dark:text-purple-400" />
            Complaint Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monthly distribution and category trends of your hostel
          </p>
        </div>
      </div>

      {/* 2. Main Graph Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm flex flex-col h-[500px]">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Category Breakdown (Last 12 Months)
          </h2>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 dark:border-purple-400 mr-3"></div>
            <span className="text-sm font-medium">Loading history statistics...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <span className="text-sm">No historical data available yet.</span>
          </div>
        ) : (
          <div className="flex-1 relative w-full h-full">
            <canvas ref={chartRef}></canvas>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default WardenGraphs;
