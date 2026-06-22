import React, { useEffect, useState } from 'react';
import apiClient from '../api/axios.js';
import StatsCard from './StatsCard';
import AnimatedCounter from './AnimatedCounter';
import { AlertTriangle, CheckCircle2, Building2, Users } from 'lucide-react';

const StatsSection = () => {
  const [hostelCount, setHostelCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const hostelnumber = await apiClient.get('/api/v1/hostel/hostel-count');
        const studentnumber = await apiClient.get('/api/v1/student/student-count');
        
        if (hostelnumber.data?.success) {
            setHostelCount(hostelnumber.data.data.count);
        }
        if(studentnumber.data?.success){
          setStudentCount(studentnumber.data.data.count);
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
      value: <AnimatedCounter target="5"/>, 
      icon: <AlertTriangle className="text-orange-500" size={26} />,
      iconBg: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      title: "Resolved Complaints",
      value: <AnimatedCounter target="10"/>, 
      icon: <CheckCircle2 className="text-emerald-500" size={26} />,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Number of Hostels",
      value: <AnimatedCounter target={hostelCount}/>, 
      icon: <Building2 className="text-blue-500" size={26} />,
      iconBg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Number of Students",
      value: <AnimatedCounter target={studentCount}/>, 
      icon: <Users className="text-purple-500" size={26} />,
      iconBg: "bg-purple-50 dark:bg-purple-950/20",
    }
  ];

  return (
    <div className="w-full px-6 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconBg={stat.iconBg}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;