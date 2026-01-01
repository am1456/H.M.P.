import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSliice.js';
import apiClient from '../../api/axios.js';
import { User, Lock, LogOut, ShieldCheck } from 'lucide-react';

const AdminHomeStats = () => {
    const { userData } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 1. Dynamic Greeting Logic
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    // 2. Logout Handler
    const handleLogout = async () => {
        try {
            await apiClient.post('/api/v1/admin/logout');
            dispatch(logout());
            navigate('/login/admin');
        } catch (error) {
            console.error("Logout failed", error);
            // Even if backend fails, clear frontend state for security
            dispatch(logout());
            navigate('/login/admin');
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="bg-linear-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white shadow-xl mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    {getGreeting()}, {userData?.fullName}!
                </h1>
                <div className="flex items-center gap-2 opacity-90">
                    <ShieldCheck size={20} />
                    <p className="text-lg font-medium tracking-wide uppercase">
                        {userData?.role === 'superAdmin' ? 'Super Administrator' : 'Administrator'}
                    </p>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Update Account */}
                <button 
                    onClick={() => navigate('update-account')}
                    className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 border-b-4 border-blue-500 rounded-xl shadow-md hover:shadow-lg transition-all group"
                >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                        <User size={28} />
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200 text-center text-sm uppercase tracking-tighter">Update Account</span>
                </button>

                {/* Change Password */}
                <button 
                    onClick={() => navigate('change-password')}
                    className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 border-b-4 border-yellow-500 rounded-xl shadow-md hover:shadow-lg transition-all group"
                >
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4 text-yellow-600 group-hover:scale-110 transition-transform">
                        <Lock size={28} />
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200 text-center text-sm uppercase tracking-tighter">Change Password</span>
                </button>

                {/* Logout */}
                <button 
                    onClick={handleLogout}
                    className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 border-b-4 border-red-500 rounded-xl shadow-md hover:shadow-lg transition-all group"
                >
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4 text-red-600 group-hover:scale-110 transition-transform">
                        <LogOut size={28} />
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200 text-center text-sm uppercase tracking-tighter">Log Out</span>
                </button>
            </div>

            {/* Account Details Preview */}
            <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Account Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between p-3 bg-white dark:bg-gray-800 rounded shadow-sm">
                        <span className="text-gray-400">Username</span>
                        <span className="font-semibold dark:text-white">{userData?.username}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white dark:bg-gray-800 rounded shadow-sm">
                        <span className="text-gray-400">Mobile</span>
                        <span className="font-semibold dark:text-white">{userData?.mobile || "Not set"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHomeStats;