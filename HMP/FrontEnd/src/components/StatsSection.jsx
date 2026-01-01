import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import StatsCard from './StatsCard';
import AnimatedCounter from './AnimatedCounter'; // Import the counter

const StatsSection = () => {
  // 1. State to store the real count from Database
  const [hostelCount, setHostelCount] = useState(0);

  // 2. Fetch data on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Assuming your app.js maps hostelRouter to /api/v1/hostel
        const response = await axios.get('/api/v1/hostel/hostel-count');
        
        // Ensure we get the correct data path from your ApiResponse
        if (response.data?.success) {
            setHostelCount(response.data.data.count);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: "Active Complaints",
      value: <AnimatedCounter target="5"/>, // Static for now
      icon: "⚠️",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: " Resolved Complaints",
      value: <AnimatedCounter target="10"/>, // Static for now
      icon: "✅",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Number of Hostels",
      // 3. HERE IS THE CHANGE: Pass the Component instead of a string
      value: <AnimatedCounter target={hostelCount}/>, 
      icon: "🏢",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Number of Students",
      value: <AnimatedCounter target="99"/>, // You can replicate the logic for students later
      icon: "👥",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:texst-purple-400"
    }
  ];

  return (
    <div className="w-full px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value} // React renders the <AnimatedCounter /> here perfectly
              icon={stat.icon}
              iconBg={stat.iconBg}
              iconColor={stat.iconColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;