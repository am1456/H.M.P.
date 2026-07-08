import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Home, AlertCircle, Phone,
  Bell, ArrowRight, Calendar
} from "lucide-react";
import apiClient from "../../api/axios.js";

const StudentHomeStats = () => {
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeComplaints: 0,
    wardenName: "Not Assigned",
    wardenPhone: "",
    roomNumber: "N/A",
    hostelName: "",
    unReadNotice: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const statsRes = await apiClient.get("/api/v1/student/dashboard-stats");
        setStats(statsRes.data.data);
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/v1/student/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      dispatch(logout());
      navigate('/login/student');
    }
  };

  const handleNoticeClick = () => {
    navigate("/student/dashboard/notices");
  };

    if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-emerald-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mr-3"></div>
        Loading Dashboard...
      </div>
    );
  }

  const hasUnread = stats.unReadNotice > 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* 1. WELCOME BANNER */}
      <div className="bg-linear-to-r from-emerald-600 to-emerald-800 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userData?.fullName?.split(" ")[0]}! 👋
          </h1>
          <p className="text-emerald-100 max-w-xl">
            You have{" "}
            <span className="font-bold text-white">
              {stats.activeComplaints} active complaint{stats.activeComplaints !== 1 ? "s" : ""}
            </span>
            {hasUnread ? (
              <>
                {" "}and{" "}
                <span className="font-bold text-orange-300">
                  {stats.unReadNotice} unread notice{stats.unReadNotice !== 1 ? "s" : ""}
                </span>{" "}
                from your warden.
              </>
            ) : (
              " and no pending notices."
            )}
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/student/dashboard/complaints")}
              className="bg-white text-emerald-700 px-5 py-2 rounded-full font-semibold text-sm hover:bg-emerald-50 transition shadow-md"
            >
              + File Complaint
            </button>
            <button
              onClick={() => navigate("/student/dashboard/profile")}
              className="bg-emerald-700/50 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-emerald-700 transition backdrop-blur-sm"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card: Room Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">My Room</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {stats?.roomNumber || "Not Assigned"}
            </h3>
            <span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-1 rounded-md mt-2 inline-block">
              {stats?.hostelName || "No Hostel"}
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
            <Home size={24} />
          </div>
        </div>

        {/* Card: Complaint Status */}
        <div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition cursor-pointer"
          onClick={() => navigate("/student/dashboard/complaints")}
        >
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Complaints</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {stats.activeComplaints}{" "}
              <span className="text-sm font-normal text-gray-400">Active</span>
            </h3>
            <span className="text-orange-600 text-xs font-medium bg-orange-50 px-2 py-1 rounded-md mt-2 inline-block">
              Action Required
            </span>
          </div>
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
            <AlertCircle size={24} />
          </div>
        </div>

        {/* Card: Emergency Contact */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Warden</p>
            <h3 className="text-lg font-bold text-gray-800 mt-1 truncate max-w-30">
              {stats.wardenName}
            </h3>
            <a
              href={`tel:${stats.wardenPhone}`}
              className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-1 rounded-md mt-2 inline-block hover:bg-blue-100"
            >
              Call Now
            </a>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
            <Phone size={24} />
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 text-lg mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Change Password */}
            <button
              onClick={() => navigate("/student/dashboard/change-password")}
              className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded-xl transition-all group"
            >
              <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition">
                <span className="text-xl">🔐</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-700 group-hover:text-emerald-700">Change Password</h4>
                <p className="text-xs text-gray-400 group-hover:text-emerald-600/70">Update your login credentials</p>
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-all group"
            >
              <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center text-red-600 group-hover:scale-110 transition">
                <span className="text-xl">🚪</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-700 group-hover:text-red-700">Logout</h4>
                <p className="text-xs text-gray-400 group-hover:text-red-600/70">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Notice Board — FULLY FUNCTIONAL */}
        <div
          onClick={handleNoticeClick}
          className="relative bg-emerald-50 rounded-2xl border border-emerald-100 p-6 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group"
        >
          {/* Unread Badge */}
          {hasUnread && (
            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold shadow-md ring-2 ring-white animate-bounce">
              {stats.unReadNotice > 9 ? "9+" : stats.unReadNotice}
            </span>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-emerald-800 text-lg flex items-center gap-2">
              <Bell size={18} />
              Notice Board
            </h3>
            <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">
              <ArrowRight size={16} />
            </span>
          </div>

          {/* Top Notice Preview */}
          {stats.latestNotice ? (
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100/50">
                {/* Unread pill on the notice itself */}
                {hasUnread && (
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mb-2 inline-block">
                    UNREAD
                  </span>
                )}
                <p className="text-gray-700 text-xs font-semibold leading-relaxed line-clamp-2">
                  {stats.latestNotice.title}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2">
                  <Calendar size={10} />
                  {new Date(stats.latestNotice.createdAt).toLocaleDateString("en-GB")}
                </div>
              </div>

              {/* Tap hint */}
              <p className="text-[11px] text-emerald-600/70 text-center font-medium">
                Tap to view all notices →
              </p>
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <Bell size={20} />
              </div>
              <p className="text-emerald-700/60 text-xs font-medium">No notices yet</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentHomeStats;