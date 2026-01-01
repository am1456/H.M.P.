import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios.js';
import { ShieldCheck, Mail, Lock, Phone, UserPlus, Building2, ShieldAlert } from 'lucide-react';

const AddWarden = () => {
    const navigate = useNavigate();
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { role: "warden" }
    });

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const res = await apiClient.get('/api/v1/hostel/get-all-hostels');
                if (res.data.success) setHostels(res.data.data);
            } catch (error) {
                console.error("Failed to fetch hostels", error);
            }
        };
        fetchHostels();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await apiClient.post('/api/v1/admin/create-warden', data);
            if (response.data.success) {
                setMessage({ type: 'success', text: "Warden account has been activated successfully!" });
                reset();
                setTimeout(() => navigate('/admin/dashboard/add-warden'), 2000);
            }
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || "Registration failed" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                
                {/* Header Section - Deep Purple/Violet Gradient */}
                <div className="bg-linear-to-r from-purple-800 via-purple-600 to-violet-500 p-8 text-white relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold flex items-center gap-3">
                            <ShieldCheck size={32} /> Register Warden
                        </h2>
                        <p className="text-purple-100 mt-2 text-sm font-medium opacity-90 uppercase tracking-widest">
                            Staff Credential Management
                        </p>
                    </div>
                    {/* Decorative Background Icon */}
                    <Building2 size={120} className="absolute -right-4 -top-4 text-white opacity-10 rotate-12" />
                </div>

                {/* Status Message */}
                {message.text && (
                    <div className={`mx-8 mt-6 p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
                        message.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-medium text-sm">{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* Full Name */}
                        <div className="md:col-span-2 group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-purple-600 transition-colors">
                                <UserPlus size={14} /> Full Name
                            </label>
                            <input 
                                {...register("fullName", { required: "Full Name is required" })}
                                placeholder="Warden Full Name"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-purple-600'
                                }`}
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1 italic font-medium">{errors.fullName.message}</p>}
                        </div>

                        {/* Username */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-purple-600">
                                @ System Username
                            </label>
                            <input 
                                {...register("username", { required: "Username is required", minLength: { value: 3, message: "Min 3 characters" } })}
                                placeholder="Employee Id"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.username ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-purple-600'
                                }`}
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1 italic">{errors.username.message}</p>}
                        </div>

                        {/* Mobile */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-purple-600">
                                <Phone size={14} /> Secure Mobile
                            </label>
                            <input 
                                {...register("mobile", { 
                                    required: "Mobile is required",
                                    pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" }
                                })}
                                placeholder="Contact Number"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.mobile ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-purple-600'
                                }`}
                            />
                            {errors.mobile && <p className="text-red-500 text-xs mt-1 italic">{errors.mobile.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-purple-600">
                                <Mail size={14} />Email
                            </label>
                            <input 
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                })}
                                placeholder="Enter the email address"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-purple-600'
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 italic">{errors.email.message}</p>}
                        </div>

                        {/* Assigned Hostel */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-purple-600">
                                <Building2 size={14} /> Assigned Building
                            </label>
                            <select 
                                {...register("hostel", { required: "Please assign a hostel" })}
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white appearance-none ${
                                    errors.hostel ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-purple-600'
                                }`}
                            >
                                <option value="">-- Assign Hostel --</option>
                                {hostels.map((h) => (
                                    <option key={h._id} value={h._id}>{h.name} ({h.code})</option>
                                ))}
                            </select>
                            {errors.hostel && <p className="text-red-500 text-xs mt-1 italic">{errors.hostel.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2 group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-purple-600">
                                <Lock size={14} /> Initial Password
                            </label>
                            <input 
                                type="password"
                                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                                placeholder="••••••••"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.password ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-purple-600'
                                }`}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 italic">{errors.password.message}</p>}
                        </div>
                    </div>

                    <input type="hidden" {...register("role")} />

                    <div className="pt-6">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-linear-to-r from-purple-800 to-violet-600 text-white font-black py-4 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 active:scale-[0.98] disabled:from-gray-400 disabled:to-gray-500 uppercase tracking-widest flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Finalizing...
                                </>
                            ) : (
                                "Confirm Warden Authority"
                            )}
                        </button>
                    </div>
                </form>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em]">
                        Administrative Record: Warden Authorization Protocol
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddWarden;