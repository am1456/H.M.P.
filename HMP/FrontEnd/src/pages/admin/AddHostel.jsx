import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import apiClient from '../../api/axios.js';
import { AlertTriangle, Building, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AddHostel = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await apiClient.post('/api/v1/hostel/add-hostel', data);
            if (response.data.success) {
                alert(response.data.message); // "Hostel created with 50 rooms..."
                reset();
                navigate('/admin/dashboard/add-hostel'); 
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create hostel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <Building className="text-red-600" /> Add New Hostel
            </h2>

            {/* THE WARNING BOX */}
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 mb-8 rounded-r-lg">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-600 mt-1 shrink-0" size={20} />
                    <div>
                        <h4 className="font-bold text-red-800 dark:text-red-400">Warning: Critical Action</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            Please verify details carefully. Once created, changing the Hostel Code or Number of Rooms is restricted to prevent data corruption for linked users.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hostel Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Hostel Name</label>
                        <input {...register("name", { required: "Name is required" })} className="input-field w-full p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 rounded-lg" placeholder="e.g. Boys Hostel A" />
                    </div>
                    {/* Hostel Code */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Unique Code</label>
                        <input {...register("code", { required: "Code is required" })} className="input-field uppercasew-full p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 rounded-lg" placeholder="e.g. H-A" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Start Room */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Starting Room No.</label>
                        <input type="number" {...register("startRoomNumber", { required: true })} className="input-field w-full p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 rounded-lg" defaultValue="101" />
                    </div>
                    {/* Total Rooms */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Total Rooms</label>
                        <input type="number" {...register("totalRooms", { required: true, min: 1 })} className="input-field w-full p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 rounded-lg " placeholder="50" />
                    </div>
                    {/* Capacity */}
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Capacity per Room</label>
                        <input type="number " {...register("capacity")} className="input-field w-full p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 rounded-lg" defaultValue="1" />
                    </div>
                </div>

                <button disabled={loading} className="w-full btn-primary py-3 rounded-lg bg-red-600 text-white hover:bg-red-800 font-bold">
                    {loading ? "Creating Structure..." : "Create Hostel Structure"}
                </button>
            </form>

            {/* THE LINK TO 'ADD ROOMS' */}
            <div className="mt-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Already have a hostel? 
                    <Link to="/admin/dashboard/add-rooms" className="text-blue-600 hover:underline ml-2 font-medium inline-flex items-center gap-1">
                        Add more rooms to existing <ArrowRight size={14} />
                    </Link>
                </p>
            </div>
        </div>
    );
};
export default AddHostel;