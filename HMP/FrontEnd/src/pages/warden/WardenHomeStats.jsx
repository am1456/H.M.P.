import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  ClipboardList, CheckCircle, AlertCircle, 
  BarChart3, LogOut, Key 
} from "lucide-react";
import apiClient from "@/api/axios";
import { logout } from "@/store/authSlice"; 
import WardenDailyChart from "./WardenDailyChart";

const WardenHomeStats = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  
  const [stats, setStats] = useState({ pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  // 1. Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get("/api/v1/complaints/warden-stats");
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to load warden stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-purple-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mr-3"></div>
        Loading Dashboard Stats...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. WELCOME HEADER */}
      <div className="bg-linear-to-r from-purple-700 to-purple-900 rounded-3xl p-8 text-white shadow-2px shadow-purple-200 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, Warden {userData?.fullName?.split(" ")[0]}! 🛡️
          </h1>
          <p className="text-purple-100 max-w-xl">
            Here is the current status of your hostel. You have <span className="font-bold text-white">{stats.pending} active complaints</span> that need attention.
          </p>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-20 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card: Pending (Active) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Active Complaints</p>
            <h3 className="text-4xl font-bold text-gray-800 mt-2">
              {stats.pending}
            </h3>
            <span className="text-orange-600 text-xs font-medium bg-orange-50 px-2 py-1 rounded-md mt-2 inline-block">
              Needs Action
            </span>
          </div>
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
            <AlertCircle size={28} />
          </div>
        </div>

        {/* Card: Resolved */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Resolved Issues</p>
            <h3 className="text-4xl font-bold text-gray-800 mt-2">
              {stats.resolved}
            </h3>
            <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-md mt-2 inline-block">
              Completed
            </span>
          </div>
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
            <CheckCircle size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. CHART CONTAINER */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg flex items-center gap-2">
              <BarChart3 size={20} className="text-purple-600 dark:text-purple-400"/> Daily Complaints (Present Month)
            </h3>
          </div>
          
          <WardenDailyChart />
        </div>

        {/* 4. QUICK ACTIONS (Security) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 text-lg mb-6">Quick Actions</h3>
          
          <div className="space-y-4">
            {/* Change Password */}
            <button 
              onClick={() => navigate("/warden/dashboard/change-password")}
              className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-purple-50 border border-transparent hover:border-purple-200 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition">
                <Key size={18} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-700 text-sm group-hover:text-purple-700">Change Password</h4>
              </div>
            </button>

            {/* Logout */}
            <button 
              onClick={async () => {
                try {
                  await apiClient.post("/api/v1/warden/logout");
                } catch (error) {
                  console.error("Logout failed", error);
                } finally {
                  dispatch(logout());
                  navigate("/login/warden");
                }
              }}
              className="w-full flex items-center gap-4 p-4 bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-red-600 group-hover:scale-110 transition">
                <LogOut size={18} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-700 text-sm group-hover:text-red-700">Logout</h4>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WardenHomeStats;