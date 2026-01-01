import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../store/authSliice.js';
import apiClient from '../../api/axios.js';
import { User, Mail, Smartphone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpdateAccount = () => {
    const { userData } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // React Hook Form with defaultValues from Redux
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            fullName: userData?.fullName,
            email: userData?.email,
            username: userData?.username,
            mobile: userData?.mobile
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Sending the PATCH request to /users/:userId
            const response = await apiClient.patch(
                `/api/v1/admin/users/${userData._id}`, 
                data
            );

            if (response.data.success) {
                // Update Redux and LocalStorage with the fresh data from backend
                dispatch(login(response.data.data)); 
                alert("Profile updated successfully!");
                navigate('/admin/dashboard'); // Send back to home stats
            }
        } catch (error) {
            alert(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 animate-in fade-in duration-500">
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="bg-red-600 p-6 text-white">
                    <h2 className="text-xl font-bold">Update Your Account</h2>
                    <p className="text-red-100 text-sm italic">Keep your administrative details up to date</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <User size={16} /> Full Name
                        </label>
                        <input 
                            {...register("fullName", { required: "Full name is required" })}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-red-500 transition-all dark:text-white"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                @ Username
                            </label>
                            <input 
                                {...register("username", { required: "Username is required" })}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-red-500 transition-all dark:text-white"
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <Smartphone size={16} /> Mobile
                            </label>
                            <input 
                                {...register("mobile", { pattern: { value: /^[0-9]{10}$/, message: "Invalid mobile number" } })}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-red-500 transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <Mail size={16} /> Email Address
                        </label>
                        <input 
                            {...register("email", { required: "Email is required" })}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-red-500 transition-all dark:text-white"
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 disabled:bg-gray-400"
                        >
                            {loading ? "Processing..." : "Save Updated Details"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateAccount;