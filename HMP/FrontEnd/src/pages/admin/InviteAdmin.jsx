import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import apiClient from '../../api/axios.js';
import { ShieldCheck, Mail, Lock, Phone, UserPlus, ShieldAlert } from 'lucide-react';

const InviteAdmin = () => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const response = await apiClient.post("/api/v1/admin/create-admin", data);

            if (response.data.success) {
                window.alert("Admin has created successfully");
                reset();
            } else {
                window.alert("Something went wrong!");
            }

        } catch (err) {
            window.alert(err.response?.data?.message || "Failed to authorize new admin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                
                {/* Header Section */}
                <div className="bg-linear-to-r from-red-700 via-red-600 to-rose-600 p-8 text-white relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold flex items-center gap-3">
                            <ShieldCheck size={32} /> Invite Administrator
                        </h2>
                        <p className="text-red-100 mt-2 text-sm font-medium opacity-90 uppercase tracking-widest">
                            Authorized Personnel Only
                        </p>
                    </div>
                    {/* Decorative Background Icon */}
                    <ShieldAlert size={120} className="absolute -right-4 -top-4 text-white opacity-10 rotate-12" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* Full Name - Full Width */}
                        <div className="md:col-span-2 group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-red-600 transition-colors">
                                <UserPlus size={14} /> Full Name
                            </label>
                            <input 
                                {...register("fullName", { required: "Full Name is required" })}
                                placeholder="Admin Full Name"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-red-600'
                                }`}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-red-600">
                                @ System Username
                            </label>
                            <input 
                                {...register("username", { required: "Username is required", minLength: { value: 3, message: "Min 3 characters" } })}
                                placeholder="Employee Id"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.username ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-red-600'
                                }`}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Mobile */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-red-600">
                                <Phone size={14} /> Secure Mobile
                            </label>
                            <input 
                                {...register("mobile", { 
                                    required: "Mobile is required",
                                    pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" }
                                })}
                                placeholder="Contact Number"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.mobile ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-red-600'
                                }`}
                            />
                            {errors.mobile && (
                                <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-red-600">
                                <Mail size={14} /> Email
                            </label>
                            <input 
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                })}
                                placeholder="Enter the email address"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-red-600'
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-red-600">
                                <Lock size={14} /> Temporary Password
                            </label>
                            <input 
                                type="password"
                                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                                placeholder="••••••••"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.password ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-red-600'
                                }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-linear-to-r from-red-700 to-rose-600 text-white font-black py-4 rounded-2xl hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 active:scale-[0.98] disabled:from-gray-400 disabled:to-gray-500 uppercase tracking-widest flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Encrypting...
                                </>
                            ) : (
                                "Add Admin"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteAdmin;