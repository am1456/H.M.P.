import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import apiClient from "@/api/axios";
import useTheme from "@/context/ThemeContext";

const WardenDailyChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch present month's daily stats on mount
  useEffect(() => {
    let active = true;
    const fetchDailyStats = async () => {
      try {
        const response = await apiClient.get("/api/v1/complaints/daily-stats");
        if (active) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching daily stats", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchDailyStats();
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

    // Setup colors based on active theme
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)";
    const textColor = isDark ? "#9ca3af" : "#4b5563"; // gray-400 vs gray-600
    const barColor = isDark ? "rgba(168, 85, 247, 0.8)" : "rgba(126, 34, 206, 0.85)"; // purple-500 vs purple-700
    const barHoverColor = isDark ? "rgba(168, 85, 247, 1)" : "rgba(126, 34, 206, 1)";

    const labels = data.map((item) => item.day); // Days 1 to 31
    const counts = data.map((item) => item.count);

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Complaints",
            data: counts,
            backgroundColor: barColor,
            hoverBackgroundColor: barHoverColor,
            borderRadius: 6,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Single dataset, no legend needed
          },
          tooltip: {
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            titleColor: isDark ? "#ffffff" : "#1f2937",
            bodyColor: isDark ? "#e5e7eb" : "#4b5563",
            borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              title: (context) => `Day ${context[0].label}`,
              label: (context) => `Complaints: ${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
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
              stepSize: 1, // Since complaints are whole numbers
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

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-purple-600 dark:text-purple-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 dark:border-purple-400 mr-3"></div>
        <span className="text-sm font-medium">Loading daily stats...</span>
      </div>
    );
  }

  return (
    <div 
      onClick={() => navigate("/warden/dashboard/graphs")}
      className="w-full flex-1 min-h-[250px] relative cursor-pointer group"
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default WardenDailyChart;
