import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios.js';
import { Lock, ShieldAlert, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    // Watch the "newPassword" field to compare it with "confirmPassword"
    const newPassword = watch("newPassword");

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await apiClient.post('/api/v1/admin/change-password', {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            });

            if (response.data.success) {
                alert("Password updated successfully! Please log in again if required.");
                reset();
                navigate('/admin/dashboard');
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 animate-in slide-in-from-bottom-4 duration-500">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="bg-yellow-500 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Security Update</h2>
                        <p className="text-yellow-900 text-sm opacity-80">Update your login credentials</p>
                    </div>
                    <ShieldAlert size={32} className="text-yellow-900 opacity-50" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
                    {/* Old Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                        <input 
                            type={showPasswords ? "text" : "password"}
                            {...register("oldPassword", { required: "Old password is required" })}
                            placeholder="••••••••"
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
                        />
                        {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>}
                    </div>

                    <hr className="border-gray-100 dark:border-gray-700" />

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                        <input 
                            type={showPasswords ? "text" : "password"}
                            {...register("newPassword", { 
                                required: "New password is required",
                                minLength: { value: 6, message: "Minimum 6 characters" }
                            })}
                            placeholder="••••••••"
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
                        />
                        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                        <input 
                            type={showPasswords ? "text" : "password"}
                            {...register("confirmPassword", { 
                                required: "Please confirm your password",
                                validate: (value) => value === newPassword || "Passwords do not match"
                            })}
                            placeholder="••••••••"
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 dark:text-white"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Toggle Show Password */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowPasswords(!showPasswords)}>
                        {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                        <span className="text-xs text-gray-500 select-none">Show passwords</span>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-xl transition-all active:scale-95 disabled:bg-gray-300 mt-4 shadow-lg shadow-yellow-100 dark:shadow-none"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;